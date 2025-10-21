import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupWebSocket, broadcastNotification } from "./websocket";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import { 
  registerPekerjaSchema, 
  registerPemberiKerjaSchema, 
  loginSchema,
  updateProfileSchema,
  updateEducationSchema,
  updateExperienceSchema,
  updateSkillsSchema,
  updatePreferencesSchema,
  quickApplySchema,
  insertJobSchema,
  type User 
} from "@shared/schema";

// Extend session type
declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

// Configure multer for CV uploads with enhanced security
const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/cv");
  },
  filename: (req, file, cb) => {
    // Sanitize extension by removing any path traversal attempts
    let ext = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '');
    
    // Ensure extension is one of the allowed types
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    if (!allowedExtensions.includes(ext)) {
      ext = '.pdf'; // Default to .pdf if extension is invalid
    }
    
    // Generate secure filename with sanitized extension
    const uniqueName = `${randomUUID()}${ext}`;
    cb(null, uniqueName);
  },
});

const uploadCV = multer({
  storage: cvStorage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only allow one file per upload
  },
  fileFilter: (req, file, cb) => {
    // Strict MIME type validation
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    // Validate both extension and MIME type
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    
    if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file PDF, DOC, dan DOCX yang diperbolehkan"));
    }
  },
});

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

  app.post("/api/auth/change-password", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current and new password are required" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Password minimal 6 karakter" });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Password saat ini salah" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await storage.updateUserProfile(req.session.userId, { password: hashedPassword });

      res.json({ message: "Password berhasil diubah" });
    } catch (error: any) {
      console.error("Error changing password:", error);
      res.status(500).json({ error: "Gagal mengubah password" });
    }
  });

  // Jobs API
  app.get("/api/jobs", async (req, res) => {
    try {
      const { keyword, location, industry, jobType, experience, salaryMin, salaryMax, sortBy, page = "1", limit = "20" } = req.query;
      
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;
      
      const result = await storage.getJobs({
        keyword: keyword as string,
        location: location as string,
        industry: industry as string,
        jobType: jobType as string,
        experience: experience as string,
        salaryMin: salaryMin ? parseInt(salaryMin as string) : undefined,
        salaryMax: salaryMax ? parseInt(salaryMax as string) : undefined,
        isActive: true,
        sortBy: sortBy as string,
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

  app.get("/api/jobs/trending", async (req, res) => {
    try {
      const { limit = "6" } = req.query;
      const limitNum = parseInt(limit as string);
      
      const recentJobs = await storage.getJobs({ limit: 30, offset: 0 });
      
      const applicationCountPromises = recentJobs.jobs.map(async (job) => ({
        jobId: job.id,
        count: (await storage.getJobApplications(job.id)).length
      }));
      
      const applicationCounts = await Promise.all(applicationCountPromises);
      const applicationCountsMap = new Map(
        applicationCounts.map(({ jobId, count }) => [jobId, count])
      );
      
      const jobsWithScore = recentJobs.jobs.map((job) => {
        const applicationCount = applicationCountsMap.get(job.id) || 0;
        
        const daysOld = Math.floor(
          (Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        const recencyMultiplier = Math.max(0, 30 - daysOld);
        const featuredBonus = job.isFeatured ? 50 : 0;
        const viewCount = job.viewCount || 0;
        
        const popularityScore =
          applicationCount * 5 +
          viewCount * 0.3 +
          recencyMultiplier +
          featuredBonus;
        
        return {
          ...job,
          popularityScore,
          stats: {
            applicationCount,
            viewCount,
            daysOld,
          },
        };
      });
      
      jobsWithScore.sort((a, b) => b.popularityScore - a.popularityScore);
      
      const trendingJobs = jobsWithScore.slice(0, limitNum);
      
      res.json({
        jobs: trendingJobs,
        total: trendingJobs.length,
      });
    } catch (error) {
      console.error("Error fetching trending jobs:", error);
      res.status(500).json({ error: "Failed to fetch trending jobs" });
    }
  });

  app.post("/api/jobs/:id/view", async (req, res) => {
    try {
      const job = await storage.getJobById(req.params.id);
      
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      
      const newViewCount = (job.viewCount || 0) + 1;
      await storage.updateJob(job.id, { viewCount: newViewCount });
      
      res.json({ viewCount: newViewCount });
    } catch (error) {
      console.error("Error updating view count:", error);
      res.status(500).json({ error: "Failed to update view count" });
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

  // Employer job management API
  app.get("/api/employer/jobs", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "pemberi_kerja") {
        return res.status(403).json({ error: "Access denied" });
      }

      const jobs = await storage.getJobsByEmployer(req.session.userId);
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching employer jobs:", error);
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  app.post("/api/jobs", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "pemberi_kerja") {
        return res.status(403).json({ error: "Access denied" });
      }

      const validatedData = insertJobSchema.parse(req.body);
      const job = await storage.createJob({
        ...validatedData,
        postedBy: req.session.userId,
      });

      res.status(201).json(job);
    } catch (error: any) {
      console.error("Error creating job:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create job" });
    }
  });

  app.put("/api/jobs/:id", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "pemberi_kerja") {
        return res.status(403).json({ error: "Access denied" });
      }

      const job = await storage.getJobById(req.params.id);
      if (!job || job.postedBy !== req.session.userId) {
        return res.status(404).json({ error: "Job not found or access denied" });
      }

      const updatedJob = await storage.updateJob(req.params.id, req.body);
      res.json(updatedJob);
    } catch (error) {
      console.error("Error updating job:", error);
      res.status(500).json({ error: "Failed to update job" });
    }
  });

  app.delete("/api/jobs/:id", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "pemberi_kerja") {
        return res.status(403).json({ error: "Access denied" });
      }

      const job = await storage.getJobById(req.params.id);
      if (!job || job.postedBy !== req.session.userId) {
        return res.status(404).json({ error: "Job not found or access denied" });
      }

      await storage.deleteJob(req.params.id);
      res.json({ message: "Job deleted successfully" });
    } catch (error) {
      console.error("Error deleting job:", error);
      res.status(500).json({ error: "Failed to delete job" });
    }
  });

  app.post("/api/jobs/bulk-delete", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "pemberi_kerja") {
        return res.status(403).json({ error: "Access denied" });
      }

      const { jobIds } = req.body;
      if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
        return res.status(400).json({ error: "jobIds array is required and must not be empty" });
      }

      // Verify all jobs belong to the employer
      const employerJobs = await storage.getJobsByEmployer(req.session.userId);
      const employerJobIds = employerJobs.map(job => job.id);
      const invalidJobs = jobIds.filter(id => !employerJobIds.includes(id));

      if (invalidJobs.length > 0) {
        return res.status(403).json({ 
          error: "Some jobs do not belong to you or do not exist",
          invalidJobIds: invalidJobs 
        });
      }

      await storage.bulkDeleteJobs(jobIds);
      res.json({ 
        message: `Successfully deleted ${jobIds.length} job(s)`,
        deletedCount: jobIds.length 
      });
    } catch (error) {
      console.error("Error bulk deleting jobs:", error);
      res.status(500).json({ error: "Failed to delete jobs" });
    }
  });

  app.post("/api/jobs/bulk-update", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "pemberi_kerja") {
        return res.status(403).json({ error: "Access denied" });
      }

      const { jobIds, updates } = req.body;
      if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
        return res.status(400).json({ error: "jobIds array is required and must not be empty" });
      }

      if (!updates || typeof updates !== 'object') {
        return res.status(400).json({ error: "updates object is required" });
      }

      // Verify all jobs belong to the employer
      const employerJobs = await storage.getJobsByEmployer(req.session.userId);
      const employerJobIds = employerJobs.map(job => job.id);
      const invalidJobs = jobIds.filter(id => !employerJobIds.includes(id));

      if (invalidJobs.length > 0) {
        return res.status(403).json({ 
          error: "Some jobs do not belong to you or do not exist",
          invalidJobIds: invalidJobs 
        });
      }

      // Prevent updating protected fields
      const allowedUpdates: Partial<typeof updates> = {};
      const allowedFields = ['title', 'description', 'requirements', 'location', 'jobType', 
                             'industry', 'salaryMin', 'salaryMax', 'education', 'experience', 
                             'isFeatured', 'isActive'];
      
      for (const key of Object.keys(updates)) {
        if (allowedFields.includes(key)) {
          allowedUpdates[key] = updates[key];
        }
      }

      if (Object.keys(allowedUpdates).length === 0) {
        return res.status(400).json({ error: "No valid fields to update" });
      }

      await storage.bulkUpdateJobs(jobIds, allowedUpdates);
      res.json({ 
        message: `Successfully updated ${jobIds.length} job(s)`,
        updatedCount: jobIds.length,
        updatedFields: Object.keys(allowedUpdates)
      });
    } catch (error) {
      console.error("Error bulk updating jobs:", error);
      res.status(500).json({ error: "Failed to update jobs" });
    }
  });

  app.get("/api/jobs/:id/applications", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "pemberi_kerja") {
        return res.status(403).json({ error: "Access denied" });
      }

      const job = await storage.getJobById(req.params.id);
      if (!job || job.postedBy !== req.session.userId) {
        return res.status(404).json({ error: "Job not found or access denied" });
      }

      const applications = await storage.getJobApplications(req.params.id);
      res.json(applications);
    } catch (error) {
      console.error("Error fetching job applications:", error);
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  // Employer Analytics & Management
  app.get("/api/employer/stats", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "pemberi_kerja") {
        return res.status(403).json({ error: "Access denied" });
      }

      const stats = await storage.getEmployerStats(req.session.userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching employer stats:", error);
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  app.get("/api/employer/analytics", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "pemberi_kerja") {
        return res.status(403).json({ error: "Access denied" });
      }

      const analytics = await storage.getEmployerAnalytics(req.session.userId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching employer analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.get("/api/employer/activities", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "pemberi_kerja") {
        return res.status(403).json({ error: "Access denied" });
      }

      const activities = await storage.getEmployerActivities(req.session.userId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching employer activities:", error);
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  // Candidate Analytics
  app.get("/api/candidate/stats", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "pekerja") {
        return res.status(403).json({ error: "Access denied" });
      }

      const stats = await storage.getCandidateStats(req.session.userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching candidate stats:", error);
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  app.get("/api/candidate/activities", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "pekerja") {
        return res.status(403).json({ error: "Access denied" });
      }

      const activities = await storage.getCandidateActivities(req.session.userId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching candidate activities:", error);
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  app.get("/api/employer/applications", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "pemberi_kerja") {
        return res.status(403).json({ error: "Access denied" });
      }

      let applications = await storage.getEmployerApplications(req.session.userId);
      
      // Apply advanced filtering
      const { status, jobId, dateFrom, dateTo, skills } = req.query;
      
      if (status && status !== 'all') {
        applications = applications.filter(app => app.status === status);
      }
      
      if (jobId && jobId !== 'all') {
        applications = applications.filter(app => app.jobId === jobId);
      }
      
      if (dateFrom) {
        const fromDate = new Date(dateFrom as string);
        applications = applications.filter(app => new Date(app.createdAt) >= fromDate);
      }
      
      if (dateTo) {
        const toDate = new Date(dateTo as string);
        toDate.setHours(23, 59, 59, 999); // End of day
        applications = applications.filter(app => new Date(app.createdAt) <= toDate);
      }
      
      if (skills && typeof skills === 'string') {
        const skillsArray = skills.split(',').map(s => s.trim().toLowerCase());
        applications = applications.filter(app => {
          const userSkills = app.user.skills?.map(s => s.toLowerCase()) || [];
          return skillsArray.some(skill => userSkills.includes(skill));
        });
      }
      
      res.json(applications);
    } catch (error) {
      console.error("Error fetching employer applications:", error);
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  app.get("/api/employer/applications/export", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "pemberi_kerja") {
        return res.status(403).json({ error: "Access denied" });
      }

      const applications = await storage.getEmployerApplications(req.session.userId);
      
      const csvHeader = "Nama,Email,Telepon,Lowongan,Perusahaan,Status,Tanggal Melamar,Kota,Provinsi\n";
      const csvRows = applications.map(app => {
        const name = app.user.fullName || "";
        const email = app.user.email || "";
        const phone = app.user.phone || "";
        const jobTitle = app.job.title || "";
        const company = app.job.company.name || "";
        const status = app.status || "";
        const appliedDate = new Date(app.createdAt).toLocaleDateString('id-ID');
        const city = app.user.city || "";
        const province = app.user.province || "";
        
        return `"${name}","${email}","${phone}","${jobTitle}","${company}","${status}","${appliedDate}","${city}","${province}"`;
      }).join("\n");

      const csv = csvHeader + csvRows;
      
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="applicants-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send('\ufeff' + csv);
    } catch (error) {
      console.error("Error exporting applications:", error);
      res.status(500).json({ error: "Failed to export applications" });
    }
  });

  app.put("/api/applications/:id/status", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "pemberi_kerja") {
        return res.status(403).json({ error: "Access denied" });
      }

      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status wajib diisi" });
      }

      const validStatuses = ['submitted', 'reviewed', 'shortlisted', 'rejected', 'accepted'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Status tidak valid. Gunakan: submitted, reviewed, shortlisted, rejected, atau accepted" });
      }

      const updatedApplication = await storage.updateApplicationStatus(req.params.id, status);
      
      // Create notification for applicant
      if (updatedApplication) {
        const applications = await storage.getUserApplications(updatedApplication.applicantId);
        const application = applications.find(app => app.id === req.params.id);
        
        if (application) {
          const statusMessages: Record<string, string> = {
            submitted: "Lamaran Anda telah diterima",
            reviewed: "Lamaran Anda sedang ditinjau",
            shortlisted: "Selamat! Anda masuk shortlist",
            rejected: "Mohon maaf, lamaran Anda belum dapat kami terima",
            accepted: "Selamat! Lamaran Anda diterima",
          };

          const notification = await storage.createNotification(
            updatedApplication.applicantId,
            "application_status",
            "Status Lamaran Diperbarui",
            `${statusMessages[status]} untuk posisi ${application.job.title}`,
            `/user/dashboard#applications`
          );
          
          // Broadcast notification via WebSocket
          broadcastNotification(updatedApplication.applicantId, notification);
        }
      }
      
      res.json(updatedApplication);
    } catch (error) {
      console.error("Error updating application status:", error);
      res.status(500).json({ error: "Gagal memperbarui status lamaran. Silakan coba lagi." });
    }
  });

  app.get("/api/applications/:id/notes", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "pemberi_kerja") {
        return res.status(403).json({ error: "Access denied" });
      }

      const applications = await storage.getEmployerApplications(req.session.userId);
      const application = applications.find(app => app.id === req.params.id);
      
      if (!application) {
        return res.status(404).json({ error: "Application not found or access denied" });
      }

      const notes = await storage.getApplicationNotes(req.params.id);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching application notes:", error);
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  app.post("/api/applications/:id/notes", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "pemberi_kerja") {
        return res.status(403).json({ error: "Access denied" });
      }

      const applications = await storage.getEmployerApplications(req.session.userId);
      const application = applications.find(app => app.id === req.params.id);
      
      if (!application) {
        return res.status(404).json({ error: "Application not found or access denied" });
      }

      const { note } = req.body;
      if (!note || note.trim().length === 0) {
        return res.status(400).json({ error: "Note cannot be empty" });
      }

      const newNote = await storage.createApplicationNote({
        applicationId: req.params.id,
        note: note.trim(),
        createdBy: req.session.userId,
      });

      res.status(201).json(newNote);
    } catch (error) {
      console.error("Error creating application note:", error);
      res.status(500).json({ error: "Failed to create note" });
    }
  });

  app.put("/api/notes/:id", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "pemberi_kerja") {
        return res.status(403).json({ error: "Access denied" });
      }

      const applications = await storage.getEmployerApplications(req.session.userId);
      const allNotes = await Promise.all(applications.map(app => storage.getApplicationNotes(app.id)));
      const flatNotes = allNotes.flat();
      const noteToUpdate = flatNotes.find(n => n.id === req.params.id);

      if (!noteToUpdate) {
        return res.status(404).json({ error: "Note not found or access denied" });
      }

      const { note } = req.body;
      if (!note || note.trim().length === 0) {
        return res.status(400).json({ error: "Note cannot be empty" });
      }

      const updatedNote = await storage.updateApplicationNote(req.params.id, note.trim());
      res.json(updatedNote);
    } catch (error) {
      console.error("Error updating note:", error);
      res.status(500).json({ error: "Failed to update note" });
    }
  });

  app.delete("/api/notes/:id", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "pemberi_kerja") {
        return res.status(403).json({ error: "Access denied" });
      }

      const applications = await storage.getEmployerApplications(req.session.userId);
      const allNotes = await Promise.all(applications.map(app => storage.getApplicationNotes(app.id)));
      const flatNotes = allNotes.flat();
      const noteToDelete = flatNotes.find(n => n.id === req.params.id);

      if (!noteToDelete) {
        return res.status(404).json({ error: "Note not found or access denied" });
      }

      await storage.deleteApplicationNote(req.params.id);
      res.json({ message: "Note deleted successfully" });
    } catch (error) {
      console.error("Error deleting note:", error);
      res.status(500).json({ error: "Failed to delete note" });
    }
  });

  app.get("/api/employer/company", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "pemberi_kerja") {
        return res.status(403).json({ error: "Access denied" });
      }

      const company = await storage.getCompanyByUserId(req.session.userId);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      res.json(company);
    } catch (error) {
      console.error("Error fetching company:", error);
      res.status(500).json({ error: "Failed to fetch company" });
    }
  });

  app.put("/api/employer/company", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "pemberi_kerja") {
        return res.status(403).json({ error: "Access denied" });
      }

      const company = await storage.getCompanyByUserId(req.session.userId);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      const updatedCompany = await storage.updateCompany(company.id, req.body);
      res.json(updatedCompany);
    } catch (error) {
      console.error("Error updating company:", error);
      res.status(500).json({ error: "Failed to update company" });
    }
  });

  // Profile API
  app.get("/api/profile", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.put("/api/profile", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const validatedData = updateProfileSchema.parse(req.body);
      const updatedUser = await storage.updateUserProfile(req.session.userId, validatedData);
      
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Data tidak valid", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  app.put("/api/profile/education", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const validatedData = updateEducationSchema.parse(req.body);
      const updatedUser = await storage.updateUserProfile(req.session.userId, validatedData);
      
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error: any) {
      console.error("Error updating education:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Data tidak valid", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update education" });
    }
  });

  app.put("/api/profile/experience", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const validatedData = updateExperienceSchema.parse(req.body);
      const updatedUser = await storage.updateUserProfile(req.session.userId, validatedData);
      
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error: any) {
      console.error("Error updating experience:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Data tidak valid", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update experience" });
    }
  });

  app.put("/api/profile/skills", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const validatedData = updateSkillsSchema.parse(req.body);
      const updatedUser = await storage.updateUserProfile(req.session.userId, validatedData);
      
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error: any) {
      console.error("Error updating skills:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Data tidak valid", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update skills" });
    }
  });

  app.put("/api/profile/preferences", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const validatedData = updatePreferencesSchema.parse(req.body);
      const updatedUser = await storage.updateUserProfile(req.session.userId, validatedData);
      
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error: any) {
      console.error("Error updating preferences:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Data tidak valid", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update preferences" });
    }
  });

  // CV Upload API
  app.post("/api/profile/upload-cv", uploadCV.single("cv"), async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const cvUrl = `/uploads/cv/${req.file.filename}`;
      const cvFileName = req.file.originalname;

      const updatedUser = await storage.updateUserProfile(req.session.userId, {
        cvUrl,
        cvFileName,
      });

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error: any) {
      console.error("Error uploading CV:", error);
      res.status(500).json({ error: error.message || "Failed to upload CV" });
    }
  });

  // Applications API (Quick Apply)
  app.post("/api/applications", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const validatedData = quickApplySchema.parse(req.body);
      
      // Check if user already applied
      const alreadyApplied = await storage.checkApplicationExists(req.session.userId, validatedData.jobId);
      if (alreadyApplied) {
        return res.status(400).json({ error: "Anda sudah melamar ke lowongan ini" });
      }

      // Get user's CV
      const user = await storage.getUser(req.session.userId);
      if (!user?.cvUrl) {
        return res.status(400).json({ error: "Silakan upload CV terlebih dahulu" });
      }

      const application = await storage.createApplication({
        jobId: validatedData.jobId,
        applicantId: req.session.userId,
        cvUrl: user.cvUrl,
        coverLetter: validatedData.coverLetter,
      });

      res.status(201).json(application);
    } catch (error: any) {
      console.error("Error creating application:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Data tidak valid", details: error.errors });
      }
      res.status(500).json({ error: "Failed to submit application" });
    }
  });

  app.get("/api/applications", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const applications = await storage.getUserApplications(req.session.userId);
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  // Recommendations API
  app.get("/api/recommendations", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const recommendations = await storage.getRecommendedJobs(req.session.userId, limit);
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  });

  // Wishlist API
  app.get("/api/wishlists", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const wishlists = await storage.getUserWishlists(req.session.userId);
      res.json(wishlists);
    } catch (error) {
      console.error("Error fetching wishlists:", error);
      res.status(500).json({ error: "Failed to fetch wishlists" });
    }
  });

  app.post("/api/wishlists", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const { jobId } = req.body;
      
      if (!jobId) {
        return res.status(400).json({ error: "Job ID is required" });
      }

      // Check if already in wishlist
      const exists = await storage.checkWishlistExists(req.session.userId, jobId);
      if (exists) {
        return res.status(400).json({ error: "Lowongan sudah ada di wishlist" });
      }

      const wishlist = await storage.addToWishlist(req.session.userId, jobId);
      res.status(201).json(wishlist);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      res.status(500).json({ error: "Failed to add to wishlist" });
    }
  });

  app.delete("/api/wishlists/:jobId", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      await storage.removeFromWishlist(req.session.userId, req.params.jobId);
      res.json({ message: "Removed from wishlist" });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      res.status(500).json({ error: "Failed to remove from wishlist" });
    }
  });

  // Job Templates API
  app.get("/api/job-templates", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const templates = await storage.getJobTemplatesByUser(req.session.userId);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching job templates:", error);
      res.status(500).json({ error: "Gagal mengambil template lowongan" });
    }
  });

  app.post("/api/job-templates", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "pemberi_kerja") {
        return res.status(403).json({ error: "Access denied" });
      }

      const template = await storage.createJobTemplate({
        ...req.body,
        userId: req.session.userId,
      });
      res.status(201).json(template);
    } catch (error) {
      console.error("Error creating job template:", error);
      res.status(500).json({ error: "Gagal membuat template lowongan" });
    }
  });

  app.delete("/api/job-templates/:id", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      await storage.deleteJobTemplate(req.params.id);
      res.json({ message: "Template dihapus" });
    } catch (error) {
      console.error("Error deleting job template:", error);
      res.status(500).json({ error: "Gagal menghapus template" });
    }
  });

  // Enhanced Analytics API
  app.get("/api/employer/analytics/advanced", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "pemberi_kerja") {
        return res.status(403).json({ error: "Access denied" });
      }

      const jobs = await storage.getJobsByEmployer(req.session.userId);
      const applications = await storage.getEmployerApplications(req.session.userId);

      // Calculate conversion rates
      const totalApplications = applications.length;
      const shortlistedCount = applications.filter(app => app.status === 'shortlisted').length;
      const acceptedCount = applications.filter(app => app.status === 'accepted').length;
      const rejectedCount = applications.filter(app => app.status === 'rejected').length;

      const conversionRate = totalApplications > 0 ? (acceptedCount / totalApplications * 100).toFixed(2) : "0";
      const shortlistRate = totalApplications > 0 ? (shortlistedCount / totalApplications * 100).toFixed(2) : "0";

      // Calculate average time-to-hire (simplified: from submission to accepted)
      const acceptedApplications = applications.filter(app => app.status === 'accepted');
      let avgTimeToHire = 0;
      if (acceptedApplications.length > 0) {
        const totalDays = acceptedApplications.reduce((sum, app) => {
          const days = Math.floor((new Date().getTime() - new Date(app.createdAt).getTime()) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0);
        avgTimeToHire = Math.round(totalDays / acceptedApplications.length);
      }

      // Top performing jobs
      const jobStats = jobs.map(job => {
        const jobApps = applications.filter(app => app.jobId === job.id);
        return {
          jobId: job.id,
          title: job.title,
          totalApplications: jobApps.length,
          acceptedCount: jobApps.filter(app => app.status === 'accepted').length,
          conversionRate: jobApps.length > 0 ? ((jobApps.filter(app => app.status === 'accepted').length / jobApps.length) * 100).toFixed(2) : "0"
        };
      }).sort((a, b) => b.totalApplications - a.totalApplications).slice(0, 5);

      res.json({
        conversionRate,
        shortlistRate,
        avgTimeToHire,
        totalApplications,
        shortlistedCount,
        acceptedCount,
        rejectedCount,
        topPerformingJobs: jobStats
      });
    } catch (error) {
      console.error("Error fetching advanced analytics:", error);
      res.status(500).json({ error: "Failed to fetch advanced analytics" });
    }
  });

  // Messages API
  app.get("/api/messages", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const conversations = await storage.getUserConversations(req.session.userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Gagal mengambil percakapan" });
    }
  });

  app.get("/api/messages/:userId", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const messages = await storage.getMessageThread(req.session.userId, req.params.userId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching message thread:", error);
      res.status(500).json({ error: "Gagal mengambil pesan" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const { receiverId, content, applicationId, jobId } = req.body;

      if (!receiverId || !content) {
        return res.status(400).json({ error: "Data tidak lengkap" });
      }

      const message = await storage.sendMessage(
        req.session.userId,
        receiverId,
        content,
        applicationId,
        jobId
      );

      // Create notification for receiver
      const notification = await storage.createNotification(
        receiverId,
        "new_message",
        "Pesan Baru",
        "Anda mendapat pesan baru",
        "/messages"
      );
      
      // Broadcast notification via WebSocket
      broadcastNotification(receiverId, notification);

      res.status(201).json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Gagal mengirim pesan" });
    }
  });

  app.patch("/api/messages/:userId/read", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      await storage.markMessagesAsRead(req.session.userId, req.params.userId);
      res.json({ message: "Pesan ditandai sebagai dibaca" });
    } catch (error) {
      console.error("Error marking messages as read:", error);
      res.status(500).json({ error: "Gagal menandai pesan" });
    }
  });

  // Notifications API
  app.get("/api/notifications", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const notifications = await storage.getUserNotifications(req.session.userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Gagal mengambil notifikasi" });
    }
  });

  app.get("/api/notifications/unread-count", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const count = await storage.getUnreadNotificationCount(req.session.userId);
      res.json({ count });
    } catch (error) {
      console.error("Error fetching unread count:", error);
      res.status(500).json({ error: "Gagal mengambil jumlah notifikasi" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ message: "Notifikasi ditandai sebagai dibaca" });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ error: "Gagal menandai notifikasi" });
    }
  });

  app.patch("/api/notifications/read-all", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      await storage.markAllNotificationsAsRead(req.session.userId);
      res.json({ message: "Semua notifikasi ditandai sebagai dibaca" });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ error: "Gagal menandai semua notifikasi" });
    }
  });

  // Premium Transactions API
  app.get("/api/premium/balance", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "pemberi_kerja") {
        return res.status(403).json({ error: "Access denied" });
      }

      const balance = await storage.getUserPremiumBalance(req.session.userId);
      res.json(balance);
    } catch (error) {
      console.error("Error fetching premium balance:", error);
      res.status(500).json({ error: "Gagal mengambil saldo premium" });
    }
  });

  app.get("/api/premium/transactions", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "pemberi_kerja") {
        return res.status(403).json({ error: "Access denied" });
      }

      const transactions = await storage.getPremiumTransactions(req.session.userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching premium transactions:", error);
      res.status(500).json({ error: "Gagal mengambil riwayat transaksi" });
    }
  });

  app.post("/api/premium/purchase", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "pemberi_kerja") {
        return res.status(403).json({ error: "Access denied" });
      }

      const { type, amount } = req.body;
      
      if (!type || !amount) {
        return res.status(400).json({ error: "Type dan amount harus diisi" });
      }

      if (!["job_booster", "slot_package"].includes(type)) {
        return res.status(400).json({ error: "Tipe tidak valid" });
      }

      // Create transaction
      const transaction = await storage.createPremiumTransaction(
        req.session.userId,
        null,
        type,
        amount
      );

      // In production, integrate with payment gateway here
      // For now, automatically mark as completed (demo mode)
      const completedTransaction = await storage.updateTransactionStatus(
        transaction.id,
        "completed"
      );

      // Create notification
      await storage.createNotification(
        req.session.userId,
        "system",
        "Pembelian Berhasil",
        `Anda telah membeli ${type === "job_booster" ? "Job Booster" : "Paket Slot"}`,
        "/employer/dashboard#jobs"
      );

      res.status(201).json(completedTransaction);
    } catch (error) {
      console.error("Error creating premium transaction:", error);
      res.status(500).json({ error: "Gagal membuat transaksi" });
    }
  });

  app.post("/api/jobs/:id/boost", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== "pemberi_kerja") {
        return res.status(403).json({ error: "Access denied" });
      }

      const job = await storage.getJobById(req.params.id);
      if (!job || job.postedBy !== req.session.userId) {
        return res.status(404).json({ error: "Job not found or access denied" });
      }

      // Check if already featured
      if (job.isFeatured) {
        return res.status(400).json({ error: "Lowongan sudah dipromosikan" });
      }

      // Check balance
      const balance = await storage.getUserPremiumBalance(req.session.userId);
      if (balance.jobBoosts === 0) {
        return res.status(400).json({ error: "Saldo boost tidak cukup. Silakan beli paket terlebih dahulu" });
      }

      // Feature the job
      await storage.updateJob(req.params.id, { isFeatured: true });

      // Create notification
      await storage.createNotification(
        req.session.userId,
        "system",
        "Lowongan Dipromosikan",
        `Lowongan "${job.title}" berhasil dipromosikan`,
        `/employer/dashboard#jobs`
      );

      res.json({ message: "Lowongan berhasil dipromosikan" });
    } catch (error) {
      console.error("Error boosting job:", error);
      res.status(500).json({ error: "Gagal mempromosikan lowongan" });
    }
  });

  // Saved Candidates Routes
  app.get("/api/saved-candidates", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const savedCandidates = await storage.getSavedCandidates(req.session.userId);
      res.json(savedCandidates);
    } catch (error) {
      console.error("Error fetching saved candidates:", error);
      res.status(500).json({ error: "Failed to fetch saved candidates" });
    }
  });

  app.post("/api/saved-candidates", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { candidateId, notes } = req.body;
      
      if (!candidateId) {
        return res.status(400).json({ error: "Candidate ID is required" });
      }

      const saved = await storage.saveCandidate(req.session.userId, candidateId, notes);
      res.status(201).json(saved);
    } catch (error) {
      console.error("Error saving candidate:", error);
      res.status(500).json({ error: "Failed to save candidate" });
    }
  });

  app.delete("/api/saved-candidates/:candidateId", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      await storage.removeSavedCandidate(req.session.userId, req.params.candidateId);
      res.json({ message: "Candidate removed from saved list" });
    } catch (error) {
      console.error("Error removing saved candidate:", error);
      res.status(500).json({ error: "Failed to remove saved candidate" });
    }
  });

  // Companies Routes
  app.get("/api/companies", async (req, res) => {
    try {
      const companies = await storage.getAllCompanies();
      res.json(companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  });

  app.get("/api/companies/my-companies", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const companies = await storage.getMyCompanies(req.session.userId);
      res.json(companies);
    } catch (error) {
      console.error("Error fetching my companies:", error);
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  });

  // Candidates Routes (for employers to browse)
  app.get("/api/candidates", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const candidates = await storage.getUsersByRole("pekerja");
      
      const candidatesWithoutPasswords = candidates.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      res.json(candidatesWithoutPasswords);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      res.status(500).json({ error: "Failed to fetch candidates" });
    }
  });

  // My Jobs Route (dedicated employer jobs endpoint)
  app.get("/api/jobs/my-jobs", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const jobs = await storage.getJobsByEmployer(req.session.userId);
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching my jobs:", error);
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  // Update Application Status
  app.patch("/api/applications/:id/status", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }

      const application = await storage.updateApplicationStatus(req.params.id, status);
      
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      res.json(application);
    } catch (error) {
      console.error("Error updating application status:", error);
      res.status(500).json({ error: "Failed to update application status" });
    }
  });

  // Update Job
  app.patch("/api/jobs/:id", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const job = await storage.updateJob(req.params.id, req.body);
      
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      res.json(job);
    } catch (error) {
      console.error("Error updating job:", error);
      res.status(500).json({ error: "Failed to update job" });
    }
  });

  // Employer Applications Route
  app.get("/api/applications/employer", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const applications = await storage.getEmployerApplications(req.session.userId);
      
      const applicationsWithDetails = applications.map(app => ({
        ...app,
        applicant: app.user,
      }));

      res.json(applicationsWithDetails);
    } catch (error) {
      console.error("Error fetching employer applications:", error);
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  // ADMIN ROUTES
  // Middleware untuk check admin role
  const requireAdmin = async (req: Request, res: Response, next: any) => {
    const DEV_MODE = process.env.NODE_ENV === 'development';
    
    if (DEV_MODE) {
      next();
      return;
    }
    
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: "Akses ditolak. Hanya admin yang dapat mengakses" });
    }

    next();
  };

  // Admin Dashboard Stats
  app.get("/api/admin/dashboard/stats", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getAdminDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Admin Activity Logs
  app.get("/api/admin/activity-logs", requireAdmin, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const logs = await storage.getAdminActivityLogs(limit);
      res.json({ logs, total: logs.length });
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      res.status(500).json({ error: "Failed to fetch activity logs" });
    }
  });

  // Health Check
  app.get("/api/admin/health-check", requireAdmin, async (req, res) => {
    try {
      const dbStatus = await storage.checkDatabaseHealth();
      res.json({
        database: dbStatus,
        server: true,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error checking health:", error);
      res.status(500).json({ 
        database: false, 
        server: true,
        error: "Health check failed" 
      });
    }
  });

  // Aggregated Jobs (AI Review Queue)
  app.get("/api/admin/aggregated-jobs", requireAdmin, async (req, res) => {
    try {
      const { status, limit, offset } = req.query;
      const result = await storage.getAggregatedJobs({
        status: status as string,
        limit: limit ? parseInt(limit as string) : 50,
        offset: offset ? parseInt(offset as string) : 0,
      });
      res.json(result);
    } catch (error) {
      console.error("Error fetching aggregated jobs:", error);
      res.status(500).json({ error: "Failed to fetch aggregated jobs" });
    }
  });

  app.get("/api/admin/aggregated-jobs/:id", requireAdmin, async (req, res) => {
    try {
      const job = await storage.getAggregatedJobById(req.params.id);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      console.error("Error fetching aggregated job:", error);
      res.status(500).json({ error: "Failed to fetch job" });
    }
  });

  app.patch("/api/admin/aggregated-jobs/:id", requireAdmin, async (req, res) => {
    try {
      const job = await storage.updateAggregatedJob(req.params.id, req.body);
      res.json(job);
    } catch (error) {
      console.error("Error updating aggregated job:", error);
      res.status(500).json({ error: "Failed to update job" });
    }
  });

  app.post("/api/admin/aggregated-jobs/:id/approve", requireAdmin, async (req, res) => {
    try {
      const job = await storage.approveAggregatedJob(req.params.id, req.session.userId!);
      res.json(job);
    } catch (error) {
      console.error("Error approving job:", error);
      res.status(500).json({ error: "Failed to approve job" });
    }
  });

  app.post("/api/admin/aggregated-jobs/:id/reject", requireAdmin, async (req, res) => {
    try {
      const job = await storage.rejectAggregatedJob(req.params.id, req.session.userId!);
      res.json(job);
    } catch (error) {
      console.error("Error rejecting job:", error);
      res.status(500).json({ error: "Failed to reject job" });
    }
  });

  app.delete("/api/admin/aggregated-jobs/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteAggregatedJob(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting aggregated job:", error);
      res.status(500).json({ error: "Failed to delete job" });
    }
  });

  // Admin Job Management
  app.get("/api/admin/jobs", requireAdmin, async (req, res) => {
    try {
      const { 
        source, 
        isActive, 
        isFeatured,
        keyword, 
        location, 
        page = "1", 
        limit = "50" 
      } = req.query;
      
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      const result = await storage.getJobs({
        keyword: keyword as string,
        location: location as string,
        source: source as string,
        isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
        isFeatured: isFeatured === "true" ? true : isFeatured === "false" ? false : undefined,
        sortBy: "createdAt",
        limit: limitNum,
        offset,
      });

      // Get stats by counting from separate queries
      const aiResult = await storage.getJobs({ source: "ai" });
      const directResult = await storage.getJobs({ source: "direct" });
      const activeResult = await storage.getJobs({ isActive: true });

      res.json({
        jobs: result.jobs,
        total: result.total,
        page: pageNum,
        totalPages: Math.ceil(result.total / limitNum),
        stats: {
          aiJobs: aiResult.total,
          directJobs: directResult.total,
          activeJobs: activeResult.total,
        },
      });
    } catch (error) {
      console.error("Error fetching admin jobs:", error);
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  app.patch("/api/admin/jobs/:id", requireAdmin, async (req, res) => {
    try {
      const job = await storage.updateJob(req.params.id, req.body);
      res.json(job);
    } catch (error) {
      console.error("Error updating job:", error);
      res.status(500).json({ error: "Failed to update job" });
    }
  });

  app.delete("/api/admin/jobs/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteJob(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting job:", error);
      res.status(500).json({ error: "Failed to delete job" });
    }
  });

  // User Management
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const { role, isVerified, limit, offset } = req.query;
      const result = await storage.getAllUsers({
        role: role as string,
        isVerified: isVerified ? isVerified === 'true' : undefined,
        limit: limit ? parseInt(limit as string) : 50,
        offset: offset ? parseInt(offset as string) : 0,
      });
      res.json(result);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/admin/users/:id/block", requireAdmin, async (req, res) => {
    try {
      const user = await storage.blockUser(req.params.id, req.session.userId!);
      res.json(user);
    } catch (error) {
      console.error("Error blocking user:", error);
      res.status(500).json({ error: "Failed to block user" });
    }
  });

  app.post("/api/admin/users/:id/unblock", requireAdmin, async (req, res) => {
    try {
      const user = await storage.unblockUser(req.params.id, req.session.userId!);
      res.json(user);
    } catch (error) {
      console.error("Error unblocking user:", error);
      res.status(500).json({ error: "Failed to unblock user" });
    }
  });

  app.post("/api/admin/users/:id/verify", requireAdmin, async (req, res) => {
    try {
      const user = await storage.verifyRecruiter(req.params.id, req.session.userId!);
      res.json(user);
    } catch (error) {
      console.error("Error verifying user:", error);
      res.status(500).json({ error: "Failed to verify user" });
    }
  });

  // Financial Management
  app.get("/api/admin/transactions", requireAdmin, async (req, res) => {
    try {
      const { status, type, limit, offset } = req.query;
      const result = await storage.getAllTransactions({
        status: status as string,
        type: type as string,
        limit: limit ? parseInt(limit as string) : 50,
        offset: offset ? parseInt(offset as string) : 0,
      });
      res.json(result);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/admin/revenue-stats", requireAdmin, async (req, res) => {
    try {
      const { period, startDate, endDate } = req.query;
      const stats = await storage.getRevenueStats(
        period as 'daily' | 'monthly' | 'custom',
        startDate as string,
        endDate as string
      );
      res.json(stats);
    } catch (error) {
      console.error("Error fetching revenue stats:", error);
      res.status(500).json({ error: "Failed to fetch revenue stats" });
    }
  });

  app.post("/api/admin/transactions/:id/refund", requireAdmin, async (req, res) => {
    try {
      const { reason } = req.body;
      if (!reason) {
        return res.status(400).json({ error: "Refund reason is required" });
      }
      const transaction = await storage.processRefund(req.params.id, req.session.userId!, reason);
      res.json(transaction);
    } catch (error) {
      console.error("Error processing refund:", error);
      res.status(500).json({ error: "Failed to process refund" });
    }
  });

  // System Settings
  app.get("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      const settings = await storage.getSystemSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.get("/api/admin/settings/:key", requireAdmin, async (req, res) => {
    try {
      const setting = await storage.getSystemSetting(req.params.key);
      if (!setting) {
        return res.status(404).json({ error: "Setting not found" });
      }
      res.json(setting);
    } catch (error) {
      console.error("Error fetching setting:", error);
      res.status(500).json({ error: "Failed to fetch setting" });
    }
  });

  app.put("/api/admin/settings/:key", requireAdmin, async (req, res) => {
    try {
      const { value } = req.body;
      if (!value) {
        return res.status(400).json({ error: "Value is required" });
      }
      const setting = await storage.updateSystemSetting(req.params.key, value, req.session.userId!);
      res.json(setting);
    } catch (error) {
      console.error("Error updating setting:", error);
      res.status(500).json({ error: "Failed to update setting" });
    }
  });

  app.post("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      const { key, value, description } = req.body;
      if (!key || !value) {
        return res.status(400).json({ error: "Key and value are required" });
      }
      const setting = await storage.createSystemSetting(key, value, description || '', req.session.userId!);
      res.json(setting);
    } catch (error) {
      console.error("Error creating setting:", error);
      res.status(500).json({ error: "Failed to create setting" });
    }
  });

  // BLOG MANAGEMENT ROUTES
  // Public blog routes
  app.get("/api/blog", async (req, res) => {
    try {
      const { category, limit, offset } = req.query;
      const result = await storage.getAllBlogPosts({
        isPublished: true,
        category: category as string,
        limit: limit ? parseInt(limit as string) : 20,
        offset: offset ? parseInt(offset as string) : 0,
      });
      res.json(result);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      if (!post.isPublished) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  // Admin blog routes
  app.get("/api/admin/blog", requireAdmin, async (req, res) => {
    try {
      const { category, isPublished, limit, offset } = req.query;
      const result = await storage.getAllBlogPosts({
        isPublished: isPublished !== undefined ? isPublished === 'true' : undefined,
        category: category as string,
        limit: limit ? parseInt(limit as string) : 50,
        offset: offset ? parseInt(offset as string) : 0,
      });
      res.json(result);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/admin/blog/:id", requireAdmin, async (req, res) => {
    try {
      const post = await storage.getBlogPostById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.post("/api/admin/blog", requireAdmin, async (req, res) => {
    try {
      const { slug, title, excerpt, content, heroImage, category, tags, readTime } = req.body;
      
      if (!slug || !title || !excerpt || !content || !category) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const post = await storage.createBlogPost({
        slug,
        title,
        excerpt,
        content,
        heroImage,
        category,
        tags: tags || [],
        readTime,
        authorId: req.session.userId!,
      });

      await storage.createAdminActivityLog(
        req.session.userId!,
        "blog_created",
        "blog_post",
        post.id,
        `Created blog post: ${title}`
      );

      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });

  app.patch("/api/admin/blog/:id", requireAdmin, async (req, res) => {
    try {
      const post = await storage.updateBlogPost(req.params.id, req.body);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }

      await storage.createAdminActivityLog(
        req.session.userId!,
        "blog_updated",
        "blog_post",
        post.id,
        `Updated blog post: ${post.title}`
      );

      res.json(post);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ error: "Failed to update blog post" });
    }
  });

  app.post("/api/admin/blog/:id/publish", requireAdmin, async (req, res) => {
    try {
      const post = await storage.publishBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }

      await storage.createAdminActivityLog(
        req.session.userId!,
        "blog_published",
        "blog_post",
        post.id,
        `Published blog post: ${post.title}`
      );

      res.json(post);
    } catch (error) {
      console.error("Error publishing blog post:", error);
      res.status(500).json({ error: "Failed to publish blog post" });
    }
  });

  app.post("/api/admin/blog/:id/unpublish", requireAdmin, async (req, res) => {
    try {
      const post = await storage.unpublishBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }

      await storage.createAdminActivityLog(
        req.session.userId!,
        "blog_unpublished",
        "blog_post",
        post.id,
        `Unpublished blog post: ${post.title}`
      );

      res.json(post);
    } catch (error) {
      console.error("Error unpublishing blog post:", error);
      res.status(500).json({ error: "Failed to unpublish blog post" });
    }
  });

  app.delete("/api/admin/blog/:id", requireAdmin, async (req, res) => {
    try {
      const post = await storage.getBlogPostById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }

      await storage.deleteBlogPost(req.params.id);

      await storage.createAdminActivityLog(
        req.session.userId!,
        "blog_deleted",
        "blog_post",
        req.params.id,
        `Deleted blog post: ${post.title}`
      );

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  // CONTENT PAGES MANAGEMENT ROUTES
  // Public content pages routes
  app.get("/api/content/:slug", async (req, res) => {
    try {
      const page = await storage.getContentPageBySlug(req.params.slug);
      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }
      if (!page.isPublished) {
        return res.status(404).json({ error: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      console.error("Error fetching content page:", error);
      res.status(500).json({ error: "Failed to fetch page" });
    }
  });

  // Admin content pages routes
  app.get("/api/admin/content", requireAdmin, async (req, res) => {
    try {
      const pages = await storage.getAllContentPages();
      res.json(pages);
    } catch (error) {
      console.error("Error fetching content pages:", error);
      res.status(500).json({ error: "Failed to fetch content pages" });
    }
  });

  app.post("/api/admin/content", requireAdmin, async (req, res) => {
    try {
      const { slug, title, content, metaDescription } = req.body;
      
      if (!slug || !title || !content) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const page = await storage.createContentPage({
        slug,
        title,
        content,
        metaDescription,
        updatedBy: req.session.userId!,
      });

      await storage.createAdminActivityLog(
        req.session.userId!,
        "content_page_created",
        "content_page",
        page.id,
        `Created content page: ${title}`
      );

      res.status(201).json(page);
    } catch (error) {
      console.error("Error creating content page:", error);
      res.status(500).json({ error: "Failed to create content page" });
    }
  });

  app.patch("/api/admin/content/:id", requireAdmin, async (req, res) => {
    try {
      const page = await storage.updateContentPage(req.params.id, {
        ...req.body,
        updatedBy: req.session.userId!,
      });
      
      if (!page) {
        return res.status(404).json({ error: "Content page not found" });
      }

      await storage.createAdminActivityLog(
        req.session.userId!,
        "content_page_updated",
        "content_page",
        page.id,
        `Updated content page: ${page.title}`
      );

      res.json(page);
    } catch (error) {
      console.error("Error updating content page:", error);
      res.status(500).json({ error: "Failed to update content page" });
    }
  });

  // ANALYTICS ROUTES
  // Public analytics (track events)
  app.post("/api/analytics/track", async (req, res) => {
    try {
      const { jobId, eventType } = req.body;
      
      if (!jobId || !eventType) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const userId = req.session.userId || null;
      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || '';
      const userAgent = req.headers['user-agent'] || '';
      const referer = req.headers.referer || req.headers.referrer as string || '';

      await storage.trackJobEvent(jobId, userId, eventType, {
        ipAddress,
        userAgent,
        referer,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking event:", error);
      res.status(500).json({ error: "Failed to track event" });
    }
  });

  // Admin analytics routes
  app.get("/api/admin/analytics/overview", requireAdmin, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const overview = await storage.getAnalyticsOverview(
        startDate as string,
        endDate as string
      );
      res.json(overview);
    } catch (error) {
      console.error("Error fetching analytics overview:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.get("/api/admin/analytics/top-jobs", requireAdmin, async (req, res) => {
    try {
      const { limit } = req.query;
      const topJobs = await storage.getTopJobs(
        limit ? parseInt(limit as string) : 10
      );
      res.json(topJobs);
    } catch (error) {
      console.error("Error fetching top jobs:", error);
      res.status(500).json({ error: "Failed to fetch top jobs" });
    }
  });

  app.get("/api/admin/analytics/job/:id", requireAdmin, async (req, res) => {
    try {
      const analytics = await storage.getJobAnalytics(req.params.id);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching job analytics:", error);
      res.status(500).json({ error: "Failed to fetch job analytics" });
    }
  });

  // ERROR LOGS MANAGEMENT ROUTES
  app.get("/api/admin/error-logs", requireAdmin, async (req, res) => {
    try {
      const { level, resolved, limit, offset } = req.query;
      const result = await storage.getErrorLogs({
        level: level as string,
        resolved: resolved === 'true' ? true : resolved === 'false' ? false : undefined,
        limit: limit ? parseInt(limit as string) : 50,
        offset: offset ? parseInt(offset as string) : 0,
      });
      res.json(result);
    } catch (error) {
      console.error("Error fetching error logs:", error);
      res.status(500).json({ error: "Failed to fetch error logs" });
    }
  });

  app.post("/api/admin/error-logs/:id/resolve", requireAdmin, async (req, res) => {
    try {
      const log = await storage.resolveErrorLog(req.params.id, req.session.userId!);
      
      await storage.createAdminActivityLog(
        req.session.userId!,
        "error_resolved",
        "error_log",
        req.params.id,
        `Resolved error log`
      );

      res.json(log);
    } catch (error) {
      console.error("Error resolving error log:", error);
      res.status(500).json({ error: "Failed to resolve error log" });
    }
  });

  // VERIFICATION REQUESTS MANAGEMENT ROUTES
  app.get("/api/admin/verification-requests", requireAdmin, async (req, res) => {
    try {
      const { subjectType, status, limit, offset } = req.query;
      const result = await storage.getVerificationRequests({
        subjectType: subjectType as string,
        status: status as string,
        limit: limit ? parseInt(limit as string) : 50,
        offset: offset ? parseInt(offset as string) : 0,
      });
      res.json(result);
    } catch (error) {
      console.error("Error fetching verification requests:", error);
      res.status(500).json({ error: "Failed to fetch verification requests" });
    }
  });

  app.post("/api/admin/verification-requests", requireAdmin, async (req, res) => {
    try {
      const { subjectType, subjectId, documents, notes } = req.body;
      
      if (!subjectType || !subjectId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const request = await storage.createVerificationRequest({
        subjectType,
        subjectId,
        submittedBy: req.session.userId!,
        documents: documents ? JSON.stringify(documents) : null,
        notes,
      });

      res.status(201).json(request);
    } catch (error) {
      console.error("Error creating verification request:", error);
      res.status(500).json({ error: "Failed to create verification request" });
    }
  });

  app.patch("/api/admin/verification-requests/:id", requireAdmin, async (req, res) => {
    try {
      const { status, reviewNotes } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }

      const request = await storage.updateVerificationRequest(
        req.params.id,
        req.session.userId!,
        status,
        reviewNotes
      );

      await storage.createAdminActivityLog(
        req.session.userId!,
        `verification_${status}`,
        "verification_request",
        req.params.id,
        `${status === 'approved' ? 'Approved' : 'Rejected'} verification request`
      );

      res.json(request);
    } catch (error) {
      console.error("Error updating verification request:", error);
      res.status(500).json({ error: "Failed to update verification request" });
    }
  });

  // FRAUD REPORTS MANAGEMENT ROUTES
  app.get("/api/admin/fraud-reports", requireAdmin, async (req, res) => {
    try {
      const { status, targetType, limit, offset } = req.query;
      const result = await storage.getFraudReports({
        status: status as string,
        targetType: targetType as string,
        limit: limit ? parseInt(limit as string) : 50,
        offset: offset ? parseInt(offset as string) : 0,
      });
      res.json(result);
    } catch (error) {
      console.error("Error fetching fraud reports:", error);
      res.status(500).json({ error: "Failed to fetch fraud reports" });
    }
  });

  app.post("/api/admin/fraud-reports", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const { targetType, targetId, reason, description, evidenceUrls } = req.body;
      
      if (!targetType || !targetId || !reason || !description) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const report = await storage.createFraudReport({
        reporterId: req.session.userId,
        targetType,
        targetId,
        reason,
        description,
        evidenceUrls: evidenceUrls || [],
      });

      res.status(201).json(report);
    } catch (error) {
      console.error("Error creating fraud report:", error);
      res.status(500).json({ error: "Failed to create fraud report" });
    }
  });

  app.patch("/api/admin/fraud-reports/:id", requireAdmin, async (req, res) => {
    try {
      const { status, resolutionNotes } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }

      const report = await storage.updateFraudReport(
        req.params.id,
        req.session.userId!,
        status,
        resolutionNotes
      );

      await storage.createAdminActivityLog(
        req.session.userId!,
        `fraud_report_${status}`,
        "fraud_report",
        req.params.id,
        `Updated fraud report status to ${status}`
      );

      res.json(report);
    } catch (error) {
      console.error("Error updating fraud report:", error);
      res.status(500).json({ error: "Failed to update fraud report" });
    }
  });

  const httpServer = createServer(app);
  
  // Setup WebSocket for real-time features
  setupWebSocket(httpServer);

  return httpServer;
}
