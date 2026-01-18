import type { Express } from "express";
import type { Server } from "http";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth FIRST
  await setupAuth(app);
  registerAuthRoutes(app);

  // === Goals Routes ===
  app.get(api.goals.list.path, isAuthenticated, async (req, res) => {
    // In Replit Auth, userId is in req.user.claims.sub
    const userId = (req.user as any).claims.sub;
    const goals = await storage.getGoals(userId);
    res.json(goals);
  });

  app.post(api.goals.create.path, isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const input = api.goals.create.input.parse(req.body);
      const goal = await storage.createGoal(userId, input);
      res.status(201).json(goal);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      throw err;
    }
  });

  app.put(api.goals.update.path, isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const id = parseInt(req.params.id);
      const input = api.goals.update.input.parse(req.body);
      const goal = await storage.updateGoal(userId, id, input);
      if (!goal) return res.status(404).json({ message: "Goal not found" });
      res.json(goal);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      throw err;
    }
  });

  app.delete(api.goals.delete.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const id = parseInt(req.params.id);
    await storage.deleteGoal(userId, id);
    res.status(204).send();
  });

  // === Daily Focus Routes ===
  app.get(api.dailyFocus.getToday.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const today = new Date();
    const focus = await storage.getDailyFocus(userId, today);
    res.json(focus || null);
  });

  app.post(api.dailyFocus.upsert.path, isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const input = api.dailyFocus.upsert.input.parse(req.body);
      const focus = await storage.upsertDailyFocus(userId, input);
      res.json(focus);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      throw err;
    }
  });

  // === Resources Routes (Public or Protected? Let's keep public for now or protected. Protected is safer for auth flow consistency) ===
  app.get(api.resources.list.path, async (req, res) => {
    // Optional: filter by category/type if we implemented it in storage
    const resources = await storage.getResources();
    res.json(resources);
  });

  app.get(api.resources.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
    const resource = await storage.getResource(id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    res.json(resource);
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getResources();
  if (existing.length === 0) {
    console.log("Seeding resources...");
    
    // Organization Tips
    await storage.createResource({
      title: "The Pomodoro Technique for ADHD",
      content: "Work for 25 minutes, then take a 5 minute break. This helps maintain focus without burnout. Use a timer!",
      type: "tip",
      category: "organization",
      tags: ["focus", "time-management"],
    });
    
    await storage.createResource({
      title: "Breaking Down Big Tasks",
      content: "Big tasks are overwhelming. Break them into tiny steps. Instead of 'Clean Room', try 'Pick up clothes', 'Take out trash', etc.",
      type: "tip",
      category: "organization",
      tags: ["planning", "overwhelm"],
    });

    // Interview Prep
    await storage.createResource({
      title: "Common Interview Question: 'Tell me about yourself'",
      content: "Keep it professional. Start with your current role/student status, mention key skills, and why you want this job. Don't ramble about personal history.",
      type: "interview_question",
      category: "interview",
      tags: ["soft-skills", "introduction"],
    });

    await storage.createResource({
      title: "Handling 'What is your greatest weakness?'",
      content: "Choose a real weakness but show how you manage it. Example: 'I sometimes get distracted, so I use detailed to-do lists to stay on track.'",
      type: "interview_question",
      category: "interview",
      tags: ["strategy", "honesty"],
    });

    // Workplace
    await storage.createResource({
      title: "Managing Workplace Distractions",
      content: "Noise-canceling headphones are your friend. Block calendar time for 'Deep Work'. Communicate with your manager about your best working style.",
      type: "article",
      category: "workplace",
      tags: ["environment", "communication"],
    });
    
    // College
    await storage.createResource({
      title: "First Week of College Checklist",
      content: "- Find your classrooms before day 1\n- Get your ID card\n- Locate the library and quiet study spots\n- Introduce yourself to one person in each class",
      type: "template",
      category: "study",
      tags: ["freshman", "logistics"],
    });
  }
}
