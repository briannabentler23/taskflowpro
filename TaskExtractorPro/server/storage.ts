import {
  users,
  communications,
  tasks,
  activities,
  projects,
  timerSessions,
  pomodoroSessions,
  userRewards,
  type User,
  type UpsertUser,
  type Communication,
  type InsertCommunication,
  type Task,
  type InsertTask,
  type UpdateTask,
  type Activity,
  type InsertActivity,
  type Project,
  type InsertProject,
  type UpdateProject,
  type TimerSession,
  type InsertTimerSession,
  type UpdateTimerSession,
  type PomodoroSession,
  type InsertPomodoroSession,
  type UserReward,
  type InsertUserReward,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserPrioritizationMethod(userId: string, method: string): Promise<User>;
  
  // Communication operations
  createCommunication(communication: InsertCommunication): Promise<Communication>;
  getCommunication(id: number): Promise<Communication | undefined>;
  getUserCommunications(userId: string): Promise<Communication[]>;
  
  // Task operations
  createTask(task: InsertTask): Promise<Task>;
  updateTask(taskUpdate: UpdateTask): Promise<Task>;
  deleteTask(id: number): Promise<void>;
  getTask(id: number): Promise<Task | undefined>;
  getUserTasks(userId: string): Promise<Task[]>;
  
  // Activity operations
  createActivity(activity: InsertActivity): Promise<Activity>;
  getUserActivities(userId: string, limit?: number): Promise<Activity[]>;
  
  // Project operations
  createProject(project: InsertProject): Promise<Project>;
  updateProject(projectUpdate: UpdateProject): Promise<Project>;
  deleteProject(id: number): Promise<void>;
  getProject(id: number): Promise<Project | undefined>;
  getUserProjects(userId: string): Promise<Project[]>;
  
  // Timer session operations
  createTimerSession(session: InsertTimerSession): Promise<TimerSession>;
  updateTimerSession(sessionUpdate: UpdateTimerSession): Promise<TimerSession>;
  getTimerSession(id: number): Promise<TimerSession | undefined>;
  getUserTimerSessions(userId: string, dateRange?: { start: Date; end: Date }): Promise<TimerSession[]>;
  
  // Pomodoro session operations
  createPomodoroSession(session: InsertPomodoroSession): Promise<PomodoroSession>;
  completePomodoroSession(id: number): Promise<PomodoroSession>;
  getUserPomodoroSessions(userId: string, dateRange?: { start: Date; end: Date }): Promise<PomodoroSession[]>;
  
  // User rewards operations (for gamification)
  createUserReward(reward: InsertUserReward): Promise<UserReward>;
  getUserRewards(userId: string): Promise<UserReward[]>;
}

export class DatabaseStorage implements IStorage {

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserPrioritizationMethod(userId: string, method: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        prioritizationMethod: method,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Communication operations
  async createCommunication(communicationData: InsertCommunication): Promise<Communication> {
    const [communication] = await db
      .insert(communications)
      .values(communicationData)
      .returning();
    return communication;
  }

  async getCommunication(id: number): Promise<Communication | undefined> {
    const [communication] = await db.select().from(communications).where(eq(communications.id, id));
    return communication || undefined;
  }

  async getUserCommunications(userId: string): Promise<Communication[]> {
    return await db
      .select()
      .from(communications)
      .where(eq(communications.userId, userId))
      .orderBy(desc(communications.createdAt));
  }

  // Task operations
  async createTask(taskData: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values(taskData)
      .returning();
    return task;
  }

  async updateTask(taskUpdate: UpdateTask): Promise<Task> {
    const [task] = await db
      .update(tasks)
      .set({
        ...taskUpdate,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, taskUpdate.id!))
      .returning();
    if (!task) {
      throw new Error(`Task with id ${taskUpdate.id} not found`);
    }
    return task;
  }

  async deleteTask(id: number): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async getUserTasks(userId: string): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt));
  }

  // Activity operations
  async createActivity(activityData: InsertActivity): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values(activityData)
      .returning();
    return activity;
  }

  async getUserActivities(userId: string, limit: number = 10): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  // Project operations
  async createProject(projectData: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(projectData)
      .returning();
    return project;
  }

  async updateProject(projectUpdate: UpdateProject): Promise<Project> {
    const [project] = await db
      .update(projects)
      .set({
        ...projectUpdate,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectUpdate.id!))
      .returning();
    if (!project) {
      throw new Error(`Project with id ${projectUpdate.id} not found`);
    }
    return project;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.createdAt));
  }

  // Timer session operations
  async createTimerSession(sessionData: InsertTimerSession): Promise<TimerSession> {
    const [session] = await db
      .insert(timerSessions)
      .values(sessionData)
      .returning();
    return session;
  }

  async updateTimerSession(sessionUpdate: UpdateTimerSession): Promise<TimerSession> {
    const [session] = await db
      .update(timerSessions)
      .set(sessionUpdate)
      .where(eq(timerSessions.id, sessionUpdate.id!))
      .returning();
    if (!session) {
      throw new Error(`Timer session with id ${sessionUpdate.id} not found`);
    }
    return session;
  }

  async getTimerSession(id: number): Promise<TimerSession | undefined> {
    const [session] = await db.select().from(timerSessions).where(eq(timerSessions.id, id));
    return session || undefined;
  }

  async getUserTimerSessions(userId: string, dateRange?: { start: Date; end: Date }): Promise<TimerSession[]> {
    let query = db
      .select()
      .from(timerSessions)
      .where(eq(timerSessions.userId, userId));

    if (dateRange) {
      // Note: In a real implementation, you'd add date filtering here
      // query = query.where(and(gte(timerSessions.startedAt, dateRange.start), lte(timerSessions.startedAt, dateRange.end)));
    }

    return await query.orderBy(desc(timerSessions.startedAt));
  }

  // Pomodoro session operations
  async createPomodoroSession(sessionData: InsertPomodoroSession): Promise<PomodoroSession> {
    const [session] = await db
      .insert(pomodoroSessions)
      .values(sessionData)
      .returning();
    return session;
  }

  async completePomodoroSession(id: number): Promise<PomodoroSession> {
    const [session] = await db
      .update(pomodoroSessions)
      .set({
        isCompleted: true,
        completedAt: new Date(),
      })
      .where(eq(pomodoroSessions.id, id))
      .returning();
    if (!session) {
      throw new Error(`Pomodoro session with id ${id} not found`);
    }
    return session;
  }

  async getUserPomodoroSessions(userId: string, dateRange?: { start: Date; end: Date }): Promise<PomodoroSession[]> {
    let query = db
      .select()
      .from(pomodoroSessions)
      .where(eq(pomodoroSessions.userId, userId));

    if (dateRange) {
      // Note: In a real implementation, you'd add date filtering here
    }

    return await query.orderBy(desc(pomodoroSessions.createdAt));
  }

  // User rewards operations (for gamification)
  async createUserReward(rewardData: InsertUserReward): Promise<UserReward> {
    const [reward] = await db
      .insert(userRewards)
      .values(rewardData)
      .returning();
    return reward;
  }

  async getUserRewards(userId: string): Promise<UserReward[]> {
    return await db
      .select()
      .from(userRewards)
      .where(eq(userRewards.userId, userId))
      .orderBy(desc(userRewards.earnedAt));
  }
}

export const storage = new DatabaseStorage();
