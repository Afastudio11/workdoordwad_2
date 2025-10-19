import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
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
      
      // Send notification to applicant (simple console log for now, can be extended to email/push)
      const application = await storage.getUserApplications(updatedApplication?.applicantId || '');
      if (application.length > 0) {
        console.log(`[NOTIFICATION] Status lamaran untuk ${application[0].job.title} diubah menjadi: ${status}`);
        // Future: Send email notification here
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
      await storage.deleteJobTemplate(req.params.id, req.session.userId);
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

  const httpServer = createServer(app);

  return httpServer;
}
