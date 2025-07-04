import nodemailer from "nodemailer";
import type { Task } from "@shared/schema";

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
  },
});

export async function sendTaskEmail(
  to: string,
  tasks: Task[],
  subject: string = "Your Extracted Tasks"
): Promise<void> {
  try {
    const taskList = tasks
      .map(
        (task, index) => `
${index + 1}. ${task.title}
   Priority: ${task.priority.toUpperCase()}
   ${task.dueDate ? `Due: ${task.dueDate.toLocaleDateString()}` : ""}
   ${task.assignee ? `Assignee: ${task.assignee}` : ""}
   ${task.description ? `Description: ${task.description}` : ""}
   ${task.tags && task.tags.length > 0 ? `Tags: ${task.tags.join(", ")}` : ""}
`
      )
      .join("\n");

    const html = `
      <h2>Your Extracted Tasks</h2>
      <p>Here are the tasks that were extracted from your communication:</p>
      <div style="font-family: monospace; background: #f5f5f5; padding: 20px; border-radius: 5px;">
        ${tasks
          .map(
            (task, index) => `
          <div style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 5px;">
            <h3 style="margin: 0 0 10px 0;">${index + 1}. ${task.title}</h3>
            <p style="margin: 5px 0;"><strong>Priority:</strong> <span style="color: ${
              task.priority === "high"
                ? "#ef4444"
                : task.priority === "medium"
                ? "#f59e0b"
                : "#10b981"
            };">${task.priority.toUpperCase()}</span></p>
            ${
              task.dueDate
                ? `<p style="margin: 5px 0;"><strong>Due:</strong> ${task.dueDate.toLocaleDateString()}</p>`
                : ""
            }
            ${
              task.assignee
                ? `<p style="margin: 5px 0;"><strong>Assignee:</strong> ${task.assignee}</p>`
                : ""
            }
            ${
              task.description
                ? `<p style="margin: 5px 0;"><strong>Description:</strong> ${task.description}</p>`
                : ""
            }
            ${
              task.tags && task.tags.length > 0
                ? `<p style="margin: 5px 0;"><strong>Tags:</strong> ${task.tags.join(", ")}</p>`
                : ""
            }
          </div>
        `
          )
          .join("")}
      </div>
      <p>You can manage these tasks in your TaskFlow dashboard.</p>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_USER || process.env.EMAIL_USER,
      to,
      subject,
      text: `Your Extracted Tasks\n\n${taskList}`,
      html,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send email. Please check your email configuration.");
  }
}
