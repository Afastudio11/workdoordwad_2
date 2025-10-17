import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import { insertUserSchema, type User } from "@shared/schema";

// Extend session type
declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user
  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Authentication API
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username sudah digunakan" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      console.error("Error registering user:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Data tidak valid", details: error.errors });
      }
      res.status(500).json({ error: "Gagal mendaftar" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username dan password wajib diisi" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Username atau password salah" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Username atau password salah" });
      }

      // Store user ID in session
      req.session.userId = user.id;

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ error: "Gagal login" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Gagal logout" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Berhasil logout" });
    });
  });

  // Jobs API
  app.get("/api/jobs", async (req, res) => {
    try {
      const { keyword, location, industry, jobType, page = "1", limit = "20" } = req.query;
      
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;
      
      const result = await storage.getJobs({
        keyword: keyword as string,
        location: location as string,
        industry: industry as string,
        jobType: jobType as string,
        limit: limitNum,
        offset,
      });
      
      res.json({
        jobs: result.jobs,
        total: result.total,
        page: pageNum,
        totalPages: Math.ceil(result.total / limitNum),
      });
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJobById(req.params.id);
      
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      
      res.json(job);
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ error: "Failed to fetch job" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
