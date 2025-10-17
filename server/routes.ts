import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
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
