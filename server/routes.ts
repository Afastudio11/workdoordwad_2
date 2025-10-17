import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import { 
  registerPekerjaSchema, 
  registerPemberiKerjaSchema, 
  loginSchema,
  type User 
} from "@shared/schema";

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

  // Authentication API - Register Pekerja
  app.post("/api/auth/register/pekerja", async (req, res) => {
    try {
      const validatedData = registerPekerjaSchema.parse(req.body);
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUsername) {
        return res.status(400).json({ error: "Username sudah digunakan" });
      }

      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ error: "Email sudah digunakan" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
        role: "pekerja",
      });

      // Set session
      req.session.userId = user.id;

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      console.error("Error registering pekerja:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Data tidak valid", details: error.errors });
      }
      res.status(500).json({ error: "Gagal mendaftar" });
    }
  });

  // Authentication API - Register Pemberi Kerja
  app.post("/api/auth/register/pemberi-kerja", async (req, res) => {
    try {
      const validatedData = registerPemberiKerjaSchema.parse(req.body);
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUsername) {
        return res.status(400).json({ error: "Username sudah digunakan" });
      }

      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ error: "Email sudah digunakan" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create user first
      const user = await storage.createUser({
        username: validatedData.username,
        password: hashedPassword,
        email: validatedData.email,
        fullName: validatedData.fullName,
        phone: validatedData.phone,
        role: "pemberi_kerja",
      });

      // Create company with the user as creator
      const company = await storage.createCompany({
        name: validatedData.companyName,
        createdBy: user.id,
      });

      // Set session
      req.session.userId = user.id;

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json({ ...userWithoutPassword, company });
    } catch (error: any) {
      console.error("Error registering pemberi kerja:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Data tidak valid", details: error.errors });
      }
      res.status(500).json({ error: "Gagal mendaftar" });
    }
  });

  // Authentication API - Register Admin (only for first admin or by existing admin)
  app.post("/api/auth/register/admin", async (req, res) => {
    try {
      // Check if this is bootstrap (first admin) or authenticated admin creating new admin
      const isBootstrap = !req.session.userId;
      
      if (!isBootstrap && req.session.userId) {
        // If user is authenticated, must be admin to create new admin
        const currentUser = await storage.getUser(req.session.userId);
        if (!currentUser || currentUser.role !== "admin") {
          return res.status(403).json({ error: "Hanya admin yang dapat membuat akun admin baru" });
        }
      } else {
        // Bootstrap: Check if any admin already exists
        const existingAdmins = await storage.getUsersByRole("admin");
        if (existingAdmins.length > 0) {
          return res.status(403).json({ error: "Admin sudah ada. Silakan login sebagai admin untuk membuat admin baru" });
        }
      }

      const { username, password, email, fullName, phone } = req.body;

      if (!username || !password || !email || !fullName) {
        return res.status(400).json({ error: "Data tidak lengkap" });
      }

      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ error: "Username sudah digunakan" });
      }

      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ error: "Email sudah digunakan" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create admin user
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        email,
        fullName,
        phone,
        role: "admin",
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      console.error("Error registering admin:", error);
      res.status(500).json({ error: "Gagal membuat akun admin" });
    }
  });

  // Login for all roles
  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);

      const user = await storage.getUserByUsername(validatedData.username);
      if (!user) {
        return res.status(401).json({ error: "Username atau password salah" });
      }

      const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Username atau password salah" });
      }

      // Store user ID in session
      req.session.userId = user.id;

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error: any) {
      console.error("Error logging in:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Data tidak valid", details: error.errors });
      }
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
