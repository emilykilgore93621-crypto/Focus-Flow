import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export * from "./models/auth";

// === TABLE DEFINITIONS ===

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(), // Links to users.id from auth
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // 'career', 'college', 'daily', 'financial', 'health'
  priority: text("priority").default("medium"), // 'high', 'medium', 'low'
  dueDate: timestamp("due_date"),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(), // Markdown supported
  type: text("type").notNull(), // 'tip', 'article', 'interview_question', 'template'
  category: text("category").notNull(), // 'organization', 'interview', 'workplace', 'study'
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dailyFocus = pgTable("daily_focus", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  focusDate: timestamp("focus_date").defaultNow(),
  topPriorityId: integer("top_priority_id"), // Optional link to a specific goal
  mood: text("mood"), // 'great', 'good', 'okay', 'overwhelmed', 'distracted'
  energyLevel: integer("energy_level"), // 1-5 scale
  notes: text("notes"),
});

// === RELATIONS ===

export const goalsRelations = relations(goals, ({ one }) => ({
  user: one(users, {
    fields: [goals.userId],
    references: [users.id],
  }),
}));

export const dailyFocusRelations = relations(dailyFocus, ({ one }) => ({
  user: one(users, {
    fields: [dailyFocus.userId],
    references: [users.id],
  }),
  topPriority: one(goals, {
    fields: [dailyFocus.topPriorityId],
    references: [goals.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertGoalSchema = createInsertSchema(goals).omit({ id: true, createdAt: true, userId: true });
export const insertResourceSchema = createInsertSchema(resources).omit({ id: true, createdAt: true });
export const insertDailyFocusSchema = createInsertSchema(dailyFocus).omit({ id: true, userId: true });

// === EXPLICIT API CONTRACT TYPES ===

export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type CreateGoalRequest = InsertGoal;
export type UpdateGoalRequest = Partial<InsertGoal>;

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

export type DailyFocus = typeof dailyFocus.$inferSelect;
export type InsertDailyFocus = z.infer<typeof insertDailyFocusSchema>;
export type CreateDailyFocusRequest = InsertDailyFocus;
export type UpdateDailyFocusRequest = Partial<InsertDailyFocus>;
