import { type User, type InsertUser, type Job, type InsertJob, type Company, type InsertCompany, type Application, type InsertApplication, type Wishlist, type ApplicantNote, type InsertApplicantNote, type JobTemplate, type InsertJobTemplate } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Users & Auth
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsersByRole(role: string): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProfile(userId: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Jobs
  getJobs(filters?: {
    keyword?: string;
    location?: string;
    industry?: string;
    jobType?: string;
    experience?: string;
    salaryMin?: number;
    salaryMax?: number;
    sortBy?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ jobs: (Job & { company: Company })[], total: number }>;
  getJobById(id: string): Promise<(Job & { company: Company }) | undefined>;
  getRecommendedJobs(userId: string, limit?: number): Promise<(Job & { company: Company })[]>;
  getJobsByEmployer(userId: string): Promise<(Job & { company: Company })[]>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(jobId: string, updates: Partial<Job>): Promise<Job | undefined>;
  deleteJob(jobId: string): Promise<void>;
  getJobApplications(jobId: string): Promise<(Application & { user: User })[]>;
  
  // Companies
  getCompanyById(id: string): Promise<Company | undefined>;
  getCompanyByUserId(userId: string): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(companyId: string, updates: Partial<Company>): Promise<Company | undefined>;
  
  // Applications
  createApplication(application: InsertApplication): Promise<Application>;
  getUserApplications(userId: string): Promise<(Application & { job: Job & { company: Company } })[]>;
  getEmployerApplications(userId: string): Promise<(Application & { user: User; job: Job & { company: Company } })[]>;
  updateApplicationStatus(applicationId: string, status: string): Promise<Application | undefined>;
  checkApplicationExists(userId: string, jobId: string): Promise<boolean>;
  
  // Employer Analytics
  getEmployerStats(userId: string): Promise<{
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    newApplicationsThisWeek: number;
  }>;
  getEmployerAnalytics(userId: string): Promise<{
    applicationsOverTime: Array<{ date: string; count: number }>;
    jobsByType: Array<{ type: string; count: number }>;
  }>;
  getEmployerActivities(userId: string): Promise<Array<{
    id: string;
    type: "new_application" | "status_change" | "new_job";
    message: string;
    timestamp: string;
    jobTitle?: string;
    applicantName?: string;
  }>>;
  
  // Candidate Analytics
  getCandidateStats(userId: string): Promise<{
    totalApplications: number;
    pendingApplications: number;
    shortlistedApplications: number;
    savedJobs: number;
  }>;
  getCandidateActivities(userId: string): Promise<Array<{
    id: string;
    type: "application" | "shortlist" | "saved";
    message: string;
    timestamp: string;
    jobTitle?: string;
  }>>;
  
  // Wishlists
  getUserWishlists(userId: string): Promise<(Wishlist & { job: Job & { company: Company } })[]>;
  addToWishlist(userId: string, jobId: string): Promise<Wishlist>;
  removeFromWishlist(userId: string, jobId: string): Promise<void>;
  checkWishlistExists(userId: string, jobId: string): Promise<boolean>;
  
  // Applicant Notes
  getApplicationNotes(applicationId: string): Promise<(ApplicantNote & { createdByUser: Pick<User, 'id' | 'fullName'> })[]>;
  createApplicationNote(note: InsertApplicantNote): Promise<ApplicantNote>;
  updateApplicationNote(noteId: string, note: string): Promise<ApplicantNote | undefined>;
  deleteApplicationNote(noteId: string): Promise<void>;
  
  // Messages
  getUserConversations(userId: string): Promise<Array<{
    otherUser: any;
    lastMessage: any;
    unreadCount: number;
  }>>;
  getMessageThread(userId: string, otherUserId: string): Promise<any[]>;
  sendMessage(senderId: string, receiverId: string, content: string, applicationId?: string, jobId?: string): Promise<any>;
  markMessagesAsRead(userId: string, otherUserId: string): Promise<void>;
  
  // Notifications
  getUserNotifications(userId: string): Promise<any[]>;
  getUnreadNotificationCount(userId: string): Promise<number>;
  markNotificationAsRead(notificationId: string): Promise<void>;
  markAllNotificationsAsRead(userId: string): Promise<void>;
  createNotification(userId: string, type: string, title: string, message: string, linkUrl?: string): Promise<any>;
  
  // Premium Transactions
  createPremiumTransaction(userId: string, jobId: string | null, type: string, amount: number): Promise<any>;
  getPremiumTransactions(userId: string): Promise<any[]>;
  updateTransactionStatus(transactionId: string, status: string): Promise<any>;
  getUserPremiumBalance(userId: string): Promise<{ jobBoosts: number; featuredSlots: number }>;
  
  // Saved Candidates
  getSavedCandidates(employerId: string): Promise<any[]>;
  saveCandidate(employerId: string, candidateId: string, notes?: string): Promise<any>;
  removeSavedCandidate(employerId: string, candidateId: string): Promise<void>;
  checkCandidateSaved(employerId: string, candidateId: string): Promise<boolean>;
  
  // Companies
  getAllCompanies(): Promise<Company[]>;
  getMyCompanies(userId: string): Promise<Company[]>;
}

import { db } from "./db";
import { users as usersTable, jobs as jobsTable, companies as companiesTable, applications as applicationsTable, wishlists as wishlistsTable, applicantNotes as applicantNotesTable, jobTemplates as jobTemplatesTable, messages as messagesTable, notifications as notificationsTable, premiumTransactions as premiumTransactionsTable, savedCandidates as savedCandidatesTable } from "@shared/schema";
import { eq, and, or, ilike, desc, sql, gte, lte, inArray } from "drizzle-orm";

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    return user;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(usersTable).where(eq(usersTable.role, role));
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(usersTable).values(insertUser).returning();
    return user;
  }

  async updateUserProfile(userId: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(usersTable)
      .set(updates)
      .where(eq(usersTable.id, userId))
      .returning();
    return user;
  }

  async getJobs(filters?: {
    keyword?: string;
    location?: string;
    industry?: string;
    jobType?: string;
    experience?: string;
    salaryMin?: number;
    salaryMax?: number;
    sortBy?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ jobs: (Job & { company: Company })[], total: number }> {
    let query = db.select().from(jobsTable).where(eq(jobsTable.isActive, true));

    // Apply filters
    const conditions: any[] = [eq(jobsTable.isActive, true)];

    if (filters?.keyword) {
      conditions.push(
        or(
          ilike(jobsTable.title, `%${filters.keyword}%`),
          ilike(jobsTable.description, `%${filters.keyword}%`)
        )
      );
    }

    if (filters?.location) {
      conditions.push(ilike(jobsTable.location, `%${filters.location}%`));
    }

    if (filters?.industry) {
      conditions.push(eq(jobsTable.industry, filters.industry));
    }

    if (filters?.jobType) {
      conditions.push(eq(jobsTable.jobType, filters.jobType));
    }

    if (filters?.experience) {
      conditions.push(eq(jobsTable.experienceLevel, filters.experience));
    }

    if (filters?.salaryMin !== undefined) {
      conditions.push(gte(jobsTable.salaryMin, filters.salaryMin));
    }

    if (filters?.salaryMax !== undefined) {
      conditions.push(lte(jobsTable.salaryMax, filters.salaryMax));
    }

    const jobs = await db
      .select()
      .from(jobsTable)
      .where(and(...conditions))
      .orderBy(desc(jobsTable.createdAt))
      .limit(filters?.limit || 50)
      .offset(filters?.offset || 0);

    const enrichedJobs = await Promise.all(
      jobs.map(async (job) => {
        const company = await this.getCompanyById(job.companyId);
        return {
          ...job,
          company: company!,
        };
      })
    );

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(jobsTable)
      .where(and(...conditions));

    return {
      jobs: enrichedJobs as (Job & { company: Company })[],
      total: Number(countResult?.count || 0),
    };
  }

  async getJobById(id: string): Promise<(Job & { company: Company }) | undefined> {
    const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, id));
    if (!job) return undefined;

    const company = await this.getCompanyById(job.companyId);
    if (!company) return undefined;

    return {
      ...job,
      company,
    };
  }

  async getRecommendedJobs(userId: string, limit: number = 5): Promise<(Job & { company: Company })[]> {
    const user = await this.getUser(userId);
    if (!user) return [];

    let conditions: any[] = [eq(jobsTable.isActive, true)];

    if (user.preferredJobTypes && user.preferredJobTypes.length > 0) {
      conditions.push(inArray(jobsTable.jobType, user.preferredJobTypes));
    }

    if (user.preferredLocations && user.preferredLocations.length > 0) {
      const locationConditions = user.preferredLocations.map(loc => 
        ilike(jobsTable.location, `%${loc}%`)
      );
      conditions.push(or(...locationConditions));
    }

    if (user.preferredIndustries && user.preferredIndustries.length > 0) {
      conditions.push(inArray(jobsTable.industry, user.preferredIndustries));
    }

    const jobs = await db
      .select()
      .from(jobsTable)
      .where(and(...conditions))
      .orderBy(desc(jobsTable.createdAt))
      .limit(limit);

    const enrichedJobs = await Promise.all(
      jobs.map(async (job) => {
        const company = await this.getCompanyById(job.companyId);
        return {
          ...job,
          company: company!,
        };
      })
    );

    return enrichedJobs as (Job & { company: Company })[];
  }

  async getJobsByEmployer(userId: string): Promise<(Job & { company: Company })[]> {
    const jobs = await db
      .select()
      .from(jobsTable)
      .where(eq(jobsTable.postedBy, userId))
      .orderBy(desc(jobsTable.createdAt));

    const enrichedJobs = await Promise.all(
      jobs.map(async (job) => {
        const company = await this.getCompanyById(job.companyId);
        return {
          ...job,
          company: company!,
        };
      })
    );

    return enrichedJobs as (Job & { company: Company })[];
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db.insert(jobsTable).values(insertJob).returning();
    return job;
  }

  async updateJob(jobId: string, updates: Partial<Job>): Promise<Job | undefined> {
    const [job] = await db
      .update(jobsTable)
      .set(updates)
      .where(eq(jobsTable.id, jobId))
      .returning();
    return job;
  }

  async deleteJob(jobId: string): Promise<void> {
    await db.delete(jobsTable).where(eq(jobsTable.id, jobId));
  }

  async getJobApplications(jobId: string): Promise<(Application & { user: User })[]> {
    const applications = await db
      .select()
      .from(applicationsTable)
      .where(eq(applicationsTable.jobId, jobId))
      .orderBy(desc(applicationsTable.createdAt));

    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        const user = await this.getUser(app.applicantId);
        return {
          ...app,
          user: user!,
        };
      })
    );

    return enrichedApplications as (Application & { user: User })[];
  }

  async getCompanyById(id: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companiesTable).where(eq(companiesTable.id, id));
    return company;
  }

  async getCompanyByUserId(userId: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companiesTable).where(eq(companiesTable.createdBy, userId));
    return company;
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const [company] = await db.insert(companiesTable).values(insertCompany).returning();
    return company;
  }

  async updateCompany(companyId: string, updates: Partial<Company>): Promise<Company | undefined> {
    const [company] = await db
      .update(companiesTable)
      .set(updates)
      .where(eq(companiesTable.id, companyId))
      .returning();
    return company;
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const [application] = await db.insert(applicationsTable).values(insertApplication).returning();
    return application;
  }

  async getUserApplications(userId: string): Promise<(Application & { job: Job & { company: Company } })[]> {
    const applications = await db
      .select()
      .from(applicationsTable)
      .where(eq(applicationsTable.applicantId, userId))
      .orderBy(desc(applicationsTable.createdAt));

    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        const job = await this.getJobById(app.jobId);
        return {
          ...app,
          job: job!,
        };
      })
    );

    return enrichedApplications as (Application & { job: Job & { company: Company } })[];
  }

  async getEmployerApplications(userId: string): Promise<(Application & { user: User; job: Job & { company: Company } })[]> {
    const jobs = await this.getJobsByEmployer(userId);
    const jobIds = jobs.map(job => job.id);

    if (jobIds.length === 0) {
      return [];
    }

    const applications = await db
      .select()
      .from(applicationsTable)
      .where(inArray(applicationsTable.jobId, jobIds))
      .orderBy(desc(applicationsTable.createdAt));

    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        const user = await this.getUser(app.applicantId);
        const job = await this.getJobById(app.jobId);
        return {
          ...app,
          user: user!,
          job: job!,
        };
      })
    );

    return enrichedApplications as (Application & { user: User; job: Job & { company: Company } })[];
  }

  async updateApplicationStatus(applicationId: string, status: string): Promise<Application | undefined> {
    const [updatedApplication] = await db
      .update(applicationsTable)
      .set({ status })
      .where(eq(applicationsTable.id, applicationId))
      .returning();
    return updatedApplication;
  }

  async checkApplicationExists(userId: string, jobId: string): Promise<boolean> {
    const [application] = await db
      .select()
      .from(applicationsTable)
      .where(and(eq(applicationsTable.applicantId, userId), eq(applicationsTable.jobId, jobId)));
    return !!application;
  }

  async getEmployerStats(userId: string): Promise<{
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    newApplicationsThisWeek: number;
  }> {
    const jobs = await this.getJobsByEmployer(userId);
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(j => j.isActive).length;

    const jobIds = jobs.map(job => job.id);
    
    if (jobIds.length === 0) {
      return {
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        newApplicationsThisWeek: 0,
      };
    }

    const applications = await db
      .select()
      .from(applicationsTable)
      .where(inArray(applicationsTable.jobId, jobIds));

    const totalApplications = applications.length;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const newApplicationsThisWeek = applications.filter(
      app => new Date(app.createdAt) > oneWeekAgo
    ).length;

    return {
      totalJobs,
      activeJobs,
      totalApplications,
      newApplicationsThisWeek,
    };
  }

  async getEmployerAnalytics(userId: string): Promise<{
    applicationsOverTime: Array<{ date: string; count: number }>;
    jobsByType: Array<{ type: string; count: number }>;
  }> {
    const jobs = await this.getJobsByEmployer(userId);
    const jobIds = jobs.map(job => job.id);

    if (jobIds.length === 0) {
      return {
        applicationsOverTime: [],
        jobsByType: [],
      };
    }

    const applications = await db
      .select()
      .from(applicationsTable)
      .where(inArray(applicationsTable.jobId, jobIds))
      .orderBy(desc(applicationsTable.createdAt));

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const applicationsMap = new Map<string, number>();
    applications
      .filter(app => new Date(app.createdAt) > last30Days)
      .forEach(app => {
        const dateStr = new Date(app.createdAt).toLocaleDateString('id-ID', { 
          day: '2-digit', 
          month: 'short' 
        });
        applicationsMap.set(dateStr, (applicationsMap.get(dateStr) || 0) + 1);
      });

    const applicationsOverTime = Array.from(applicationsMap.entries())
      .map(([date, count]) => ({ date, count }))
      .reverse();

    const jobTypesMap = new Map<string, number>();
    jobs.forEach(job => {
      jobTypesMap.set(job.jobType, (jobTypesMap.get(job.jobType) || 0) + 1);
    });

    const jobsByType = Array.from(jobTypesMap.entries())
      .map(([type, count]) => ({ type, count }));

    return {
      applicationsOverTime,
      jobsByType,
    };
  }

  async getEmployerActivities(userId: string): Promise<Array<{
    id: string;
    type: "new_application" | "status_change" | "new_job";
    message: string;
    timestamp: string;
    jobTitle?: string;
    applicantName?: string;
  }>> {
    const jobs = await this.getJobsByEmployer(userId);
    const jobIds = jobs.map(job => job.id);

    if (jobIds.length === 0) {
      return [];
    }

    const applications = await db
      .select()
      .from(applicationsTable)
      .where(inArray(applicationsTable.jobId, jobIds))
      .orderBy(desc(applicationsTable.createdAt))
      .limit(50);

    const activities: Array<{
      id: string;
      type: "new_application" | "status_change" | "new_job";
      message: string;
      timestamp: string;
      jobTitle?: string;
      applicantName?: string;
    }> = [];

    for (const app of applications.slice(0, 10)) {
      const job = await this.getJobById(app.jobId);
      const user = await this.getUser(app.applicantId);

      activities.push({
        id: app.id,
        type: "new_application",
        message: `Lamaran baru untuk ${job?.title}`,
        timestamp: app.createdAt,
        jobTitle: job?.title,
        applicantName: user?.fullName,
      });
    }

    return activities;
  }

  async getCandidateStats(userId: string): Promise<{
    totalApplications: number;
    pendingApplications: number;
    shortlistedApplications: number;
    savedJobs: number;
  }> {
    const applications = await db
      .select()
      .from(applicationsTable)
      .where(eq(applicationsTable.applicantId, userId));

    const totalApplications = applications.length;
    const pendingApplications = applications.filter(
      app => app.status === 'submitted' || app.status === 'reviewed'
    ).length;
    const shortlistedApplications = applications.filter(
      app => app.status === 'shortlisted'
    ).length;

    const wishlists = await db
      .select()
      .from(wishlistsTable)
      .where(eq(wishlistsTable.userId, userId));

    const savedJobs = wishlists.length;

    return {
      totalApplications,
      pendingApplications,
      shortlistedApplications,
      savedJobs,
    };
  }

  async getCandidateActivities(userId: string): Promise<Array<{
    id: string;
    type: "application" | "shortlist" | "saved";
    message: string;
    timestamp: string;
    jobTitle?: string;
  }>> {
    const activities: Array<{
      id: string;
      type: "application" | "shortlist" | "saved";
      message: string;
      timestamp: string;
      jobTitle?: string;
    }> = [];

    const applications = await db
      .select()
      .from(applicationsTable)
      .where(eq(applicationsTable.applicantId, userId))
      .orderBy(desc(applicationsTable.createdAt))
      .limit(20);

    for (const app of applications.slice(0, 5)) {
      const job = await this.getJobById(app.jobId);
      
      if (app.status === 'shortlisted') {
        activities.push({
          id: app.id,
          type: "shortlist",
          message: `Anda diundang interview untuk posisi ${job?.title}`,
          timestamp: app.createdAt,
          jobTitle: job?.title,
        });
      } else {
        activities.push({
          id: app.id,
          type: "application",
          message: `Melamar pekerjaan ${job?.title}`,
          timestamp: app.createdAt,
          jobTitle: job?.title,
        });
      }
    }

    const wishlists = await db
      .select()
      .from(wishlistsTable)
      .where(eq(wishlistsTable.userId, userId))
      .orderBy(desc(wishlistsTable.createdAt))
      .limit(5);

    for (const wishlist of wishlists.slice(0, 2)) {
      const job = await this.getJobById(wishlist.jobId);
      activities.push({
        id: wishlist.id,
        type: "saved",
        message: `Menyimpan pekerjaan ${job?.title}`,
        timestamp: wishlist.createdAt,
        jobTitle: job?.title,
      });
    }

    return activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async getUserWishlists(userId: string): Promise<(Wishlist & { job: Job & { company: Company } })[]> {
    const wishlists = await db
      .select()
      .from(wishlistsTable)
      .where(eq(wishlistsTable.userId, userId))
      .orderBy(desc(wishlistsTable.createdAt));

    const enrichedWishlists = await Promise.all(
      wishlists.map(async (wishlist) => {
        const job = await this.getJobById(wishlist.jobId);
        return {
          ...wishlist,
          job: job!,
        };
      })
    );

    return enrichedWishlists as (Wishlist & { job: Job & { company: Company } })[];
  }

  async addToWishlist(userId: string, jobId: string): Promise<Wishlist> {
    const [wishlist] = await db
      .insert(wishlistsTable)
      .values({ userId, jobId })
      .returning();
    return wishlist;
  }

  async removeFromWishlist(userId: string, jobId: string): Promise<void> {
    await db
      .delete(wishlistsTable)
      .where(and(eq(wishlistsTable.userId, userId), eq(wishlistsTable.jobId, jobId)));
  }

  async checkWishlistExists(userId: string, jobId: string): Promise<boolean> {
    const [wishlist] = await db
      .select()
      .from(wishlistsTable)
      .where(and(eq(wishlistsTable.userId, userId), eq(wishlistsTable.jobId, jobId)));
    return !!wishlist;
  }

  async getApplicationNotes(applicationId: string): Promise<(ApplicantNote & { createdByUser: Pick<User, 'id' | 'fullName'> })[]> {
    const notes = await db
      .select()
      .from(applicantNotesTable)
      .where(eq(applicantNotesTable.applicationId, applicationId))
      .orderBy(desc(applicantNotesTable.createdAt));

    const enrichedNotes = await Promise.all(
      notes.map(async (note) => {
        const user = await this.getUser(note.createdBy);
        return {
          ...note,
          createdByUser: {
            id: user!.id,
            fullName: user!.fullName,
          },
        };
      })
    );

    return enrichedNotes as (ApplicantNote & { createdByUser: Pick<User, 'id' | 'fullName'> })[];
  }

  async createApplicationNote(insertNote: InsertApplicantNote): Promise<ApplicantNote> {
    const [note] = await db.insert(applicantNotesTable).values(insertNote).returning();
    return note;
  }

  async updateApplicationNote(noteId: string, noteText: string): Promise<ApplicantNote | undefined> {
    const [note] = await db
      .update(applicantNotesTable)
      .set({ note: noteText })
      .where(eq(applicantNotesTable.id, noteId))
      .returning();
    return note;
  }

  async deleteApplicationNote(noteId: string): Promise<void> {
    await db.delete(applicantNotesTable).where(eq(applicantNotesTable.id, noteId));
  }

  async getUserConversations(userId: string): Promise<Array<{
    otherUser: any;
    lastMessage: any;
    unreadCount: number;
  }>> {
    const conversations = await db
      .select()
      .from(messagesTable)
      .where(or(eq(messagesTable.senderId, userId), eq(messagesTable.receiverId, userId)))
      .orderBy(desc(messagesTable.createdAt));

    const conversationMap = new Map();

    for (const message of conversations) {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      
      if (!conversationMap.has(otherUserId)) {
        const otherUser = await this.getUser(otherUserId);
        const unreadCount = conversations.filter(
          m => m.senderId === otherUserId && m.receiverId === userId && !m.isRead
        ).length;

        conversationMap.set(otherUserId, {
          otherUser,
          lastMessage: message,
          unreadCount,
        });
      }
    }

    return Array.from(conversationMap.values());
  }

  async getMessageThread(userId: string, otherUserId: string): Promise<any[]> {
    const messages = await db
      .select()
      .from(messagesTable)
      .where(
        or(
          and(eq(messagesTable.senderId, userId), eq(messagesTable.receiverId, otherUserId)),
          and(eq(messagesTable.senderId, otherUserId), eq(messagesTable.receiverId, userId))
        )
      )
      .orderBy(messagesTable.createdAt);

    return messages;
  }

  async sendMessage(senderId: string, receiverId: string, content: string, applicationId?: string, jobId?: string): Promise<any> {
    const [message] = await db
      .insert(messagesTable)
      .values({
        senderId,
        receiverId,
        content,
        applicationId,
        jobId,
      })
      .returning();

    return message;
  }

  async markMessagesAsRead(userId: string, otherUserId: string): Promise<void> {
    await db
      .update(messagesTable)
      .set({ isRead: true })
      .where(and(eq(messagesTable.senderId, otherUserId), eq(messagesTable.receiverId, userId)));
  }

  async getUserNotifications(userId: string): Promise<any[]> {
    const notifications = await db
      .select()
      .from(notificationsTable)
      .where(eq(notificationsTable.userId, userId))
      .orderBy(desc(notificationsTable.createdAt));

    return notifications;
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(notificationsTable)
      .where(and(eq(notificationsTable.userId, userId), eq(notificationsTable.isRead, false)));

    return Number(result?.count || 0);
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await db
      .update(notificationsTable)
      .set({ isRead: true })
      .where(eq(notificationsTable.id, notificationId));
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await db
      .update(notificationsTable)
      .set({ isRead: true })
      .where(eq(notificationsTable.userId, userId));
  }

  async createNotification(userId: string, type: string, title: string, message: string, linkUrl?: string): Promise<any> {
    const [notification] = await db
      .insert(notificationsTable)
      .values({
        userId,
        type,
        title,
        message,
        linkUrl,
      })
      .returning();

    return notification;
  }

  async createPremiumTransaction(userId: string, jobId: string | null, type: string, amount: number): Promise<any> {
    const [transaction] = await db
      .insert(premiumTransactionsTable)
      .values({
        userId,
        jobId,
        type,
        amount,
      })
      .returning();

    return transaction;
  }

  async getPremiumTransactions(userId: string): Promise<any[]> {
    const transactions = await db
      .select()
      .from(premiumTransactionsTable)
      .where(eq(premiumTransactionsTable.userId, userId))
      .orderBy(desc(premiumTransactionsTable.createdAt));

    return transactions;
  }

  async updateTransactionStatus(transactionId: string, status: string): Promise<any> {
    const [transaction] = await db
      .update(premiumTransactionsTable)
      .set({ status })
      .where(eq(premiumTransactionsTable.id, transactionId))
      .returning();

    return transaction;
  }

  async getUserPremiumBalance(userId: string): Promise<{ jobBoosts: number; featuredSlots: number }> {
    return {
      jobBoosts: 0,
      featuredSlots: 0,
    };
  }

  async getSavedCandidates(employerId: string): Promise<any[]> {
    const savedCandidates = await db
      .select()
      .from(savedCandidatesTable)
      .where(eq(savedCandidatesTable.employerId, employerId))
      .orderBy(desc(savedCandidatesTable.createdAt));

    const enrichedCandidates = await Promise.all(
      savedCandidates.map(async (saved) => {
        const candidate = await this.getUser(saved.candidateId);
        return {
          ...saved,
          candidate,
        };
      })
    );

    return enrichedCandidates;
  }

  async saveCandidate(employerId: string, candidateId: string, notes?: string): Promise<any> {
    const [saved] = await db
      .insert(savedCandidatesTable)
      .values({
        employerId,
        candidateId,
        notes,
      })
      .returning();

    return saved;
  }

  async removeSavedCandidate(employerId: string, candidateId: string): Promise<void> {
    await db
      .delete(savedCandidatesTable)
      .where(and(eq(savedCandidatesTable.employerId, employerId), eq(savedCandidatesTable.candidateId, candidateId)));
  }

  async checkCandidateSaved(employerId: string, candidateId: string): Promise<boolean> {
    const [saved] = await db
      .select()
      .from(savedCandidatesTable)
      .where(and(eq(savedCandidatesTable.employerId, employerId), eq(savedCandidatesTable.candidateId, candidateId)));

    return !!saved;
  }

  async getAllCompanies(): Promise<Company[]> {
    return await db.select().from(companiesTable).orderBy(companiesTable.name);
  }

  async getMyCompanies(userId: string): Promise<Company[]> {
    return await db.select().from(companiesTable).where(eq(companiesTable.createdBy, userId));
  }
}

export const storage = new DbStorage();
