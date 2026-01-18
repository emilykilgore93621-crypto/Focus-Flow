import { db } from "./db";
import {
  goals,
  dailyFocus,
  resources,
  type Goal,
  type InsertGoal,
  type UpdateGoalRequest,
  type DailyFocus,
  type InsertDailyFocus,
  type Resource,
  type InsertResource,
} from "@shared/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { authStorage, type IAuthStorage } from "./replit_integrations/auth/storage";

export interface IStorage extends IAuthStorage {
  // Goals
  getGoals(userId: string): Promise<Goal[]>;
  getGoal(id: number): Promise<Goal | undefined>;
  createGoal(userId: string, goal: InsertGoal): Promise<Goal>;
  updateGoal(userId: string, id: number, updates: UpdateGoalRequest): Promise<Goal>;
  deleteGoal(userId: string, id: number): Promise<void>;

  // Daily Focus
  getDailyFocus(userId: string, date: Date): Promise<DailyFocus | undefined>;
  upsertDailyFocus(userId: string, focus: InsertDailyFocus): Promise<DailyFocus>;

  // Resources
  getResources(): Promise<Resource[]>;
  getResource(id: number): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>; // For seeding
}

export class DatabaseStorage extends (authStorage.constructor as new () => IAuthStorage) implements IStorage {
  // Goals
  async getGoals(userId: string): Promise<Goal[]> {
    return await db.select().from(goals).where(eq(goals.userId, userId)).orderBy(desc(goals.createdAt));
  }

  async getGoal(id: number): Promise<Goal | undefined> {
    const [goal] = await db.select().from(goals).where(eq(goals.id, id));
    return goal;
  }

  async createGoal(userId: string, insertGoal: InsertGoal): Promise<Goal> {
    const [goal] = await db
      .insert(goals)
      .values({ ...insertGoal, userId })
      .returning();
    return goal;
  }

  async updateGoal(userId: string, id: number, updates: UpdateGoalRequest): Promise<Goal> {
    const [goal] = await db
      .update(goals)
      .set(updates)
      .where(and(eq(goals.id, id), eq(goals.userId, userId)))
      .returning();
    return goal;
  }

  async deleteGoal(userId: string, id: number): Promise<void> {
    await db
      .delete(goals)
      .where(and(eq(goals.id, id), eq(goals.userId, userId)));
  }

  // Daily Focus
  async getDailyFocus(userId: string, date: Date): Promise<DailyFocus | undefined> {
    // Basic date matching - strictly for "today" logic in MVP
    // For more robust date handling, we'd truncate the timestamp in DB query
    // But here we rely on the fact that we query for "today" and the seed/upsert handles current date.
    // Actually, let's just get the latest one and check if it's from today in application logic or query by date range.
    // For simplicity, let's assume one per day and we just query by a date range of the day.
    
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const [focus] = await db
      .select()
      .from(dailyFocus)
      .where(
        and(
          eq(dailyFocus.userId, userId),
          sql`${dailyFocus.focusDate} >= ${startOfDay.toISOString()} AND ${dailyFocus.focusDate} <= ${endOfDay.toISOString()}`
        )
      )
      .limit(1);
    
    return focus;
  }

  async upsertDailyFocus(userId: string, insertFocus: InsertDailyFocus): Promise<DailyFocus> {
    // Check if one exists for today
    const today = new Date();
    const existing = await this.getDailyFocus(userId, today);

    if (existing) {
      const [updated] = await db
        .update(dailyFocus)
        .set({ ...insertFocus }) // Updates whatever fields are passed
        .where(eq(dailyFocus.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(dailyFocus)
        .values({ ...insertFocus, userId })
        .returning();
      return created;
    }
  }

  // Resources
  async getResources(): Promise<Resource[]> {
    return await db.select().from(resources).orderBy(desc(resources.createdAt));
  }

  async getResource(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource;
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const [resource] = await db.insert(resources).values(insertResource).returning();
    return resource;
  }
}

export const storage = new DatabaseStorage();
