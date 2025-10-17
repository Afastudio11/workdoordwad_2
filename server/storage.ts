import { type User, type InsertUser, type Job, type Company, type InsertCompany, type Application, type InsertApplication, type Wishlist } from "@shared/schema";
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
  
  // Companies
  getCompanyById(id: string): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  
  // Applications
  createApplication(application: InsertApplication): Promise<Application>;
  getUserApplications(userId: string): Promise<(Application & { job: Job & { company: Company } })[]>;
  checkApplicationExists(userId: string, jobId: string): Promise<boolean>;
  
  // Wishlists
  getUserWishlists(userId: string): Promise<(Wishlist & { job: Job & { company: Company } })[]>;
  addToWishlist(userId: string, jobId: string): Promise<Wishlist>;
  removeFromWishlist(userId: string, jobId: string): Promise<void>;
  checkWishlistExists(userId: string, jobId: string): Promise<boolean>;
}

import { db } from "./db";
import { users as usersTable, jobs as jobsTable, companies as companiesTable, applications as applicationsTable, wishlists as wishlistsTable } from "@shared/schema";
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(usersTable).values(insertUser).returning();
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
    const { keyword, location, industry, jobType, experience, salaryMin, salaryMax, sortBy = "newest", limit = 20, offset = 0 } = filters || {};
    
    let query = db.select({
      id: jobsTable.id,
      companyId: jobsTable.companyId,
      title: jobsTable.title,
      description: jobsTable.description,
      requirements: jobsTable.requirements,
      location: jobsTable.location,
      jobType: jobsTable.jobType,
      industry: jobsTable.industry,
      salaryMin: jobsTable.salaryMin,
      salaryMax: jobsTable.salaryMax,
      education: jobsTable.education,
      experience: jobsTable.experience,
      isFeatured: jobsTable.isFeatured,
      isActive: jobsTable.isActive,
      source: jobsTable.source,
      sourceUrl: jobsTable.sourceUrl,
      postedBy: jobsTable.postedBy,
      createdAt: jobsTable.createdAt,
      updatedAt: jobsTable.updatedAt,
      company: companiesTable,
    })
    .from(jobsTable)
    .innerJoin(companiesTable, eq(jobsTable.companyId, companiesTable.id))
    .where(eq(jobsTable.isActive, true))
    .orderBy(desc(jobsTable.isFeatured), desc(jobsTable.createdAt))
    .$dynamic();

    const conditions = [eq(jobsTable.isActive, true)];

    if (keyword) {
      conditions.push(
        or(
          ilike(jobsTable.title, `%${keyword}%`),
          ilike(jobsTable.description, `%${keyword}%`),
          ilike(companiesTable.name, `%${keyword}%`)
        )!
      );
    }

    if (location) {
      conditions.push(ilike(jobsTable.location, `%${location}%`));
    }

    if (industry) {
      conditions.push(eq(jobsTable.industry, industry));
    }

    if (jobType) {
      conditions.push(eq(jobsTable.jobType, jobType));
    }

    if (experience) {
      conditions.push(eq(jobsTable.experience, experience));
    }

    if (salaryMin !== undefined) {
      conditions.push(gte(jobsTable.salaryMax, salaryMin));
    }

    if (salaryMax !== undefined) {
      conditions.push(lte(jobsTable.salaryMin, salaryMax));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    if (sortBy === "oldest") {
      query = query.orderBy(jobsTable.createdAt);
    } else if (sortBy === "salary") {
      query = query.orderBy(desc(jobsTable.salaryMax));
    } else {
      // Default: newest
      query = query.orderBy(desc(jobsTable.isFeatured), desc(jobsTable.createdAt));
    }

    const results = await query.limit(limit).offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(jobsTable)
      .innerJoin(companiesTable, eq(jobsTable.companyId, companiesTable.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return {
      jobs: results as (Job & { company: Company })[],
      total: Number(count),
    };
  }

  async getJobById(id: string): Promise<(Job & { company: Company }) | undefined> {
    const [result] = await db.select({
      id: jobsTable.id,
      companyId: jobsTable.companyId,
      title: jobsTable.title,
      description: jobsTable.description,
      requirements: jobsTable.requirements,
      location: jobsTable.location,
      jobType: jobsTable.jobType,
      industry: jobsTable.industry,
      salaryMin: jobsTable.salaryMin,
      salaryMax: jobsTable.salaryMax,
      education: jobsTable.education,
      experience: jobsTable.experience,
      isFeatured: jobsTable.isFeatured,
      isActive: jobsTable.isActive,
      source: jobsTable.source,
      sourceUrl: jobsTable.sourceUrl,
      postedBy: jobsTable.postedBy,
      createdAt: jobsTable.createdAt,
      updatedAt: jobsTable.updatedAt,
      company: companiesTable,
    })
    .from(jobsTable)
    .innerJoin(companiesTable, eq(jobsTable.companyId, companiesTable.id))
    .where(eq(jobsTable.id, id));

    return result as (Job & { company: Company }) | undefined;
  }

  async getCompanyById(id: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companiesTable).where(eq(companiesTable.id, id));
    return company;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    return user;
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const [company] = await db.insert(companiesTable).values(insertCompany).returning();
    return company;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    const users = await db.select().from(usersTable).where(eq(usersTable.role, role));
    return users;
  }

  async updateUserProfile(userId: string, updates: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(usersTable)
      .set(updates)
      .where(eq(usersTable.id, userId))
      .returning();
    return updatedUser;
  }

  async getRecommendedJobs(userId: string, limit: number = 10): Promise<(Job & { company: Company })[]> {
    const user = await this.getUser(userId);
    if (!user) return [];

    const conditions = [eq(jobsTable.isActive, true)];

    if (user.preferredIndustries && user.preferredIndustries.length > 0) {
      conditions.push(inArray(jobsTable.industry, user.preferredIndustries));
    }

    if (user.preferredLocations && user.preferredLocations.length > 0) {
      const locationConditions = user.preferredLocations.map(loc => 
        ilike(jobsTable.location, `%${loc}%`)
      );
      if (locationConditions.length > 0) {
        conditions.push(or(...locationConditions)!);
      }
    }

    if (user.preferredJobTypes && user.preferredJobTypes.length > 0) {
      conditions.push(inArray(jobsTable.jobType, user.preferredJobTypes));
    }

    if (user.expectedSalaryMin) {
      conditions.push(gte(jobsTable.salaryMax, user.expectedSalaryMin));
    }

    const results = await db.select({
      id: jobsTable.id,
      companyId: jobsTable.companyId,
      title: jobsTable.title,
      description: jobsTable.description,
      requirements: jobsTable.requirements,
      location: jobsTable.location,
      jobType: jobsTable.jobType,
      industry: jobsTable.industry,
      salaryMin: jobsTable.salaryMin,
      salaryMax: jobsTable.salaryMax,
      education: jobsTable.education,
      experience: jobsTable.experience,
      isFeatured: jobsTable.isFeatured,
      isActive: jobsTable.isActive,
      source: jobsTable.source,
      sourceUrl: jobsTable.sourceUrl,
      postedBy: jobsTable.postedBy,
      createdAt: jobsTable.createdAt,
      updatedAt: jobsTable.updatedAt,
      company: companiesTable,
    })
    .from(jobsTable)
    .innerJoin(companiesTable, eq(jobsTable.companyId, companiesTable.id))
    .where(and(...conditions))
    .orderBy(desc(jobsTable.isFeatured), desc(jobsTable.createdAt))
    .limit(limit);

    return results as (Job & { company: Company })[];
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    const [newApplication] = await db
      .insert(applicationsTable)
      .values(application)
      .returning();
    return newApplication;
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

  async checkApplicationExists(userId: string, jobId: string): Promise<boolean> {
    const [result] = await db
      .select()
      .from(applicationsTable)
      .where(and(
        eq(applicationsTable.applicantId, userId),
        eq(applicationsTable.jobId, jobId)
      ));
    return !!result;
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
      .where(and(
        eq(wishlistsTable.userId, userId),
        eq(wishlistsTable.jobId, jobId)
      ));
  }

  async checkWishlistExists(userId: string, jobId: string): Promise<boolean> {
    const [result] = await db
      .select()
      .from(wishlistsTable)
      .where(and(
        eq(wishlistsTable.userId, userId),
        eq(wishlistsTable.jobId, jobId)
      ));
    return !!result;
  }
}

export const storage = new DbStorage();
