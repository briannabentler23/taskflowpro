import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  prioritizationMethod: varchar("prioritization_method").default("eisenhower"), // eisenhower, eat-the-frog, abcde, chunking
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Communications table for storing input text
export const communications = pgTable("communications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary"),
  type: varchar("type").notNull().default("text"), // text, file, voice
  createdAt: timestamp("created_at").defaultNow(),
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  communicationId: integer("communication_id").references(() => communications.id),
  title: text("title").notNull(),
  description: text("description"),
  priority: varchar("priority").notNull().default("medium"), // low, medium, high
  status: varchar("status").notNull().default("pending"), // pending, in_progress, completed
  assignee: text("assignee"),
  tags: text("tags").array().default([]),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  // Prioritization method specific fields
  eisenhowerQuadrant: varchar("eisenhower_quadrant"), // urgent-important, urgent-not-important, not-urgent-important, not-urgent-not-important
  abcdePriority: varchar("abcde_priority"), // A, B, C, D, E
  isEatTheFrog: boolean("is_eat_the_frog").default(false), // true for the most important task of the day
  chunkSize: varchar("chunk_size"), // small, medium, large (for chunking method)
  estimatedTime: integer("estimated_time"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Activity logs for tracking task changes
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  taskId: integer("task_id").references(() => tasks.id),
  action: varchar("action").notNull(), // created, updated, completed, deleted
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Projects table for time tracking organization
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  description: text("description"),
  color: varchar("color").default("#3b82f6"), // Hex color for UI differentiation
  isActive: boolean("is_active").default(true),
  totalTimeSpent: integer("total_time_spent").default(0), // in seconds
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Timer sessions for tracking work periods
export const timerSessions = pgTable("timer_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  projectId: integer("project_id").references(() => projects.id),
  taskId: integer("task_id").references(() => tasks.id),
  timerType: varchar("timer_type").notNull(), // "standard", "pomodoro"
  duration: integer("duration").notNull(), // in seconds
  isCompleted: boolean("is_completed").default(false),
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  notes: text("notes"),
});

// Pomodoro sessions for detailed pomodoro tracking
export const pomodoroSessions = pgTable("pomodoro_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  projectId: integer("project_id").references(() => projects.id),
  taskId: integer("task_id").references(() => tasks.id),
  sessionType: varchar("session_type").notNull(), // "work", "short_break", "long_break"
  duration: integer("duration").notNull(), // in seconds (1500 work, 300 short break, 900 long break)
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User rewards for gamification (children mode)
export const userRewards = pgTable("user_rewards", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  rewardType: varchar("reward_type").notNull(), // "star", "badge", "achievement"
  title: varchar("title").notNull(),
  description: text("description"),
  earnedAt: timestamp("earned_at").defaultNow(),
});

// Schema types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertCommunicationSchema = createInsertSchema(communications).omit({
  id: true,
  createdAt: true,
});
export type InsertCommunication = z.infer<typeof insertCommunicationSchema>;
export type Communication = typeof communications.$inferSelect;

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export const updateTaskSchema = insertTaskSchema.partial().extend({
  id: z.number(),
});
export type UpdateTask = z.infer<typeof updateTaskSchema>;

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

// Project types
export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  totalTimeSpent: true,
});
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export const updateProjectSchema = insertProjectSchema.partial().extend({
  id: z.number(),
});
export type UpdateProject = z.infer<typeof updateProjectSchema>;

// Timer session types
export const insertTimerSessionSchema = createInsertSchema(timerSessions).omit({
  id: true,
  startedAt: true,
  endedAt: true,
});
export type InsertTimerSession = z.infer<typeof insertTimerSessionSchema>;
export type TimerSession = typeof timerSessions.$inferSelect;

export const updateTimerSessionSchema = insertTimerSessionSchema.partial().extend({
  id: z.number(),
});
export type UpdateTimerSession = z.infer<typeof updateTimerSessionSchema>;

// Pomodoro session types
export const insertPomodoroSessionSchema = createInsertSchema(pomodoroSessions).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});
export type InsertPomodoroSession = z.infer<typeof insertPomodoroSessionSchema>;
export type PomodoroSession = typeof pomodoroSessions.$inferSelect;

// User rewards types
export const insertUserRewardSchema = createInsertSchema(userRewards).omit({
  id: true,
  earnedAt: true,
});
export type InsertUserReward = z.infer<typeof insertUserRewardSchema>;
export type UserReward = typeof userRewards.$inferSelect;
