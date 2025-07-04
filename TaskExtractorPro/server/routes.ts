import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { processAndExtractTasks } from "./services/taskExtraction";
import { sendTaskEmail } from "./services/emailService";
import { 
  insertCommunicationSchema, 
  insertTaskSchema, 
  updateTaskSchema,
  type Task 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user prioritization method
  app.put('/api/auth/user/prioritization', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { method } = req.body;
      
      if (!["eisenhower", "eat-the-frog", "abcde", "chunking"].includes(method)) {
        return res.status(400).json({ message: "Invalid prioritization method" });
      }
      
      const user = await storage.updateUserPrioritizationMethod(userId, method);
      res.json(user);
    } catch (error) {
      console.error("Error updating prioritization method:", error);
      res.status(500).json({ message: "Failed to update prioritization method" });
    }
  });

  // Communication routes
  app.post('/api/communications/extract', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { title, content, type } = req.body;

      if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
      }

      const result = await processAndExtractTasks(userId, title, content, type);
      res.json(result);
    } catch (error) {
      console.error("Task extraction error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to extract tasks" 
      });
    }
  });

  app.get('/api/communications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const communications = await storage.getUserCommunications(userId);
      res.json(communications);
    } catch (error) {
      console.error("Error fetching communications:", error);
      res.status(500).json({ message: "Failed to fetch communications" });
    }
  });

  // Task routes
  app.get('/api/tasks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tasks = await storage.getUserTasks(userId);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post('/api/tasks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const taskData = insertTaskSchema.parse({ ...req.body, userId });
      
      const task = await storage.createTask(taskData);
      
      // Log activity
      await storage.createActivity({
        userId,
        taskId: task.id,
        action: "created",
        description: `Task "${task.title}" created manually`,
      });

      res.json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.put('/api/tasks/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const taskId = parseInt(req.params.id);
      
      // Verify task belongs to user
      const existingTask = await storage.getTask(taskId);
      if (!existingTask || existingTask.userId !== userId) {
        return res.status(404).json({ message: "Task not found" });
      }

      const taskUpdate = updateTaskSchema.parse({ ...req.body, id: taskId });
      const updatedTask = await storage.updateTask(taskUpdate);

      // Log activity
      await storage.createActivity({
        userId,
        taskId: updatedTask.id,
        action: "updated",
        description: `Task "${updatedTask.title}" updated`,
      });

      res.json(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete('/api/tasks/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const taskId = parseInt(req.params.id);
      
      // Verify task belongs to user
      const existingTask = await storage.getTask(taskId);
      if (!existingTask || existingTask.userId !== userId) {
        return res.status(404).json({ message: "Task not found" });
      }

      await storage.deleteTask(taskId);

      // Log activity
      await storage.createActivity({
        userId,
        taskId: null,
        action: "deleted",
        description: `Task "${existingTask.title}" deleted`,
      });

      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Activity routes
  app.get('/api/activities', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activities = await storage.getUserActivities(userId, limit);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Email integration routes
  app.post('/api/tasks/email', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { taskIds, email, subject } = req.body;

      if (!taskIds || !Array.isArray(taskIds) || !email) {
        return res.status(400).json({ message: "Task IDs and email are required" });
      }

      // Get tasks and verify they belong to user
      const tasks: Task[] = [];
      for (const taskId of taskIds) {
        const task = await storage.getTask(taskId);
        if (task && task.userId === userId) {
          tasks.push(task);
        }
      }

      if (tasks.length === 0) {
        return res.status(404).json({ message: "No valid tasks found" });
      }

      await sendTaskEmail(email, tasks, subject);
      res.json({ message: "Tasks sent via email successfully" });
    } catch (error) {
      console.error("Error sending task email:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to send email" 
      });
    }
  });

  // Task statistics
  app.get('/api/tasks/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tasks = await storage.getUserTasks(userId);
      
      const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'completed').length,
        inProgress: tasks.filter(t => t.status === 'in_progress').length,
        pending: tasks.filter(t => t.status === 'pending').length,
        overdue: tasks.filter(t => t.dueDate && t.dueDate < new Date() && t.status !== 'completed').length,
      };

      const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

      res.json({ ...stats, completionRate });
    } catch (error) {
      console.error("Error fetching task stats:", error);
      res.status(500).json({ message: "Failed to fetch task statistics" });
    }
  });

  // Project routes for time tracking
  app.get("/api/projects", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projects = await storage.getUserProjects(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projectData = { ...req.body, userId };
      const project = await storage.createProject(projectData);
      
      // Log activity
      await storage.createActivity({
        userId,
        taskId: null,
        action: "created",
        description: `Created project: ${project.name}`,
      });
      
      res.json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const projectUpdate = { ...req.body, id: projectId };
      const project = await storage.updateProject(projectUpdate);
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      await storage.deleteProject(projectId);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Timer session routes
  app.post("/api/timer-sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionData = { ...req.body, userId };
      const session = await storage.createTimerSession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating timer session:", error);
      res.status(500).json({ message: "Failed to create timer session" });
    }
  });

  app.put("/api/timer-sessions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const sessionUpdate = { ...req.body, id: sessionId };
      const session = await storage.updateTimerSession(sessionUpdate);
      
      // If session completed, log activity
      if (req.body.isCompleted) {
        const userId = req.user.claims.sub;
        await storage.createActivity({
          userId,
          taskId: session.taskId,
          action: "completed",
          description: `Completed ${session.timerType} timer session (${Math.floor(session.duration / 60)} minutes)`,
        });
      }
      
      res.json(session);
    } catch (error) {
      console.error("Error updating timer session:", error);
      res.status(500).json({ message: "Failed to update timer session" });
    }
  });

  // Pomodoro session routes
  app.post("/api/pomodoro-sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionData = { ...req.body, userId };
      const session = await storage.createPomodoroSession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating pomodoro session:", error);
      res.status(500).json({ message: "Failed to create pomodoro session" });
    }
  });

  app.put("/api/pomodoro-sessions/:id/complete", isAuthenticated, async (req: any, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const session = await storage.completePomodoroSession(sessionId);
      
      // Award rewards for children mode
      const userId = req.user.claims.sub;
      if (session.sessionType === "work") {
        await storage.createUserReward({
          userId,
          rewardType: "star",
          title: "Pomodoro Completed!",
          description: "You completed a 25-minute focus session",
        });
      }
      
      await storage.createActivity({
        userId,
        taskId: session.taskId,
        action: "completed",
        description: `Completed ${session.sessionType} pomodoro session`,
      });
      
      res.json(session);
    } catch (error) {
      console.error("Error completing pomodoro session:", error);
      res.status(500).json({ message: "Failed to complete pomodoro session" });
    }
  });

  // User rewards routes (for gamification)
  app.get("/api/rewards", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const rewards = await storage.getUserRewards(userId);
      res.json(rewards);
    } catch (error) {
      console.error("Error fetching rewards:", error);
      res.status(500).json({ message: "Failed to fetch rewards" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
