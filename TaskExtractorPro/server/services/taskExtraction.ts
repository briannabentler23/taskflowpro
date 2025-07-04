import { storage } from "../storage";
import { extractTasksFromText } from "../openai";
import type { InsertCommunication, InsertTask, InsertActivity } from "@shared/schema";

export async function processAndExtractTasks(
  userId: string,
  title: string,
  content: string,
  type: string = "text"
) {
  try {
    // Extract tasks using OpenAI
    const { summary, tasks } = await extractTasksFromText(content);

    // Store the communication
    const communication = await storage.createCommunication({
      userId,
      title,
      content,
      summary,
      type,
    });

    // Create tasks from extracted data
    const createdTasks = [];
    for (const taskData of tasks) {
      const task = await storage.createTask({
        userId,
        communicationId: communication.id,
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        assignee: taskData.assignee || null,
        tags: taskData.tags,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
        status: "pending",
      });

      // Log activity
      await storage.createActivity({
        userId,
        taskId: task.id,
        action: "created",
        description: `Task "${task.title}" created from communication analysis`,
      });

      createdTasks.push(task);
    }

    return {
      communication,
      tasks: createdTasks,
    };
  } catch (error) {
    console.error("Task extraction error:", error);
    throw error;
  }
}
