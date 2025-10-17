import { type User, type InsertUser, type Job, type Company } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Jobs
  getJobs(filters?: {
    keyword?: string;
    location?: string;
    industry?: string;
    jobType?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ jobs: (Job & { company: Company })[], total: number }>;
  getJobById(id: string): Promise<(Job & { company: Company }) | undefined>;
  
  // Companies
  getCompanyById(id: string): Promise<Company | undefined>;
}

import { db } from "./db";
import { users as usersTable, jobs as jobsTable, companies as companiesTable } from "@shared/schema";
import { eq, and, or, ilike, desc, sql } from "drizzle-orm";

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
    limit?: number;
    offset?: number;
  }): Promise<{ jobs: (Job & { company: Company })[], total: number }> {
    const { keyword, location, industry, jobType, limit = 20, offset = 0 } = filters || {};
    
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

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
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
}

export const storage = new DbStorage();
