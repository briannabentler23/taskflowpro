# TaskFlowPro - AI-Powered Task Management & Time Tracking

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

TaskFlowPro is a comprehensive web application that combines AI-powered task extraction from communications with advanced time tracking capabilities. It features four professional task prioritization methods, project management, and gamified time tracking.

## 🚀 Features

### Core Functionality
- **AI Task Extraction** - Uses Anthropic's Claude Sonnet 4 to analyze communication text and extract structured tasks
- **Advanced Task Prioritization** - Four professional methods:
  - Eisenhower Matrix (urgent/important quadrants)
  - Eat The Frog (most important task first)
  - ABCDE Method (consequence-based priority levels)
  - Chunking Method (time-based task organization)
- **Intelligent Task Organization** - Tasks automatically sorted and displayed according to user's chosen prioritization method

### Time Tracking & Project Management
- **Dual Timer System** - Standard stopwatch and Pomodoro timer (25/5 minute intervals)
- **Project Organization** - Color-coded projects with time tracking across multiple initiatives
- **Gamification** - Children's mode with stars, achievements, and progress tracking

### Collaboration & Integration
- **Platform Integrations** - Slack, ClickUp, Google Drive, and Google Calendar support
- **Email Integration** - Send formatted task lists via email
- **User Authentication** - Secure login system using Replit Auth with OpenID Connect
- **Real-time Statistics** - Track completion rates, task status distribution, and time spent per project

### Design & Usability
- **Professional Design** - Elegant black, white, and gold color scheme
- **Mobile-Responsive** - Clean interface that works on all devices
- **Activity Tracking** - Monitor task creation, updates, completion history, and timer sessions

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript, Tailwind CSS, Shadcn/UI Components
- **Backend**: Node.js + Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI Processing**: Anthropic Claude Sonnet 4 (claude-sonnet-4-20250514)
- **Authentication**: Replit Auth with Passport.js + OpenID Connect
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing
- **Email Service**: Nodemailer for task sharing

## 📋 Prerequisites

- Node.js 20+ 
- PostgreSQL database
- Anthropic API key for AI task extraction

### Optional API Keys for Enhanced Features
- Slack Bot Token & Channel ID
- ClickUp API Token
- Google Drive API credentials
- Google Calendar API credentials

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/taskflowpro.git
cd taskflowpro
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
# Required
DATABASE_URL=your_postgresql_connection_string
ANTHROPIC_API_KEY=your_anthropic_api_key

# Automatically provided by Replit (for Replit deployments)
REPLIT_DOMAINS=your_replit_domains
REPL_ID=your_repl_id
SESSION_SECRET=your_session_secret

# Optional Platform Integrations
SLACK_BOT_TOKEN=your_slack_bot_token
SLACK_CHANNEL_ID=your_slack_channel_id
CLICKUP_API_TOKEN=your_clickup_api_token
GOOGLE_DRIVE_API_KEY=your_google_drive_api_key
GOOGLE_DRIVE_CLIENT_ID=your_google_drive_client_id
GOOGLE_CALENDAR_API_KEY=your_google_calendar_api_key
GOOGLE_CALENDAR_CLIENT_ID=your_google_calendar_client_id
```

### 4. Database Setup
```bash
npm run db:push
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📖 Usage Guide

### Setting Up Prioritization
1. Navigate to **Settings** in the top navigation
2. Choose your preferred prioritization method:
   - **Eisenhower Matrix** - Strategic planning with urgency/importance quadrants
   - **Eat The Frog** - Tackle most challenging tasks first
   - **ABCDE Method** - Consequence-based priority ranking
   - **Chunking Method** - Time-based task organization
3. Save your preferences

### Creating and Managing Tasks
1. Click **"Create Task"** on the dashboard
2. Fill in task details (title, description, due date, assignee, tags)
3. Set prioritization details based on your chosen method
4. Save the task to see it automatically sorted in your task list

### Time Tracking
1. Navigate to the **Timer** page
2. Choose between Standard Timer or Pomodoro mode
3. Select associated project/task
4. Start tracking time with visual progress indicators

### AI Task Extraction
1. Navigate to **Task Extraction** 
2. Paste communication text (emails, meeting notes, etc.)
3. AI will analyze and extract actionable tasks
4. Review and save extracted tasks with automatic prioritization

## 🏗️ Project Structure

```
taskflowpro/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                 # Express backend
│   ├── services/          # Business logic services
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database operations
│   └── replitAuth.ts      # Authentication setup
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema and types
└── docs/                  # Documentation
```

## 🔧 API Endpoints

### Authentication & User Management
- `GET /api/auth/user` - Get authenticated user information
- `PUT /api/auth/user/prioritization` - Update user's prioritization method

### Task & Communication Management
- `POST /api/communications/extract` - Extract tasks from communication text
- `GET /api/communications` - Get user's communications history
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update existing task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats` - Get task statistics
- `POST /api/tasks/email` - Send tasks via email

### Project & Time Tracking
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/timer-sessions` - Start timer session
- `PUT /api/timer-sessions/:id` - Update timer session
- `POST /api/pomodoro-sessions` - Create Pomodoro session
- `PUT /api/pomodoro-sessions/:id/complete` - Complete Pomodoro session

### Activity & Gamification
- `GET /api/activities` - Get user's activity history
- `GET /api/rewards` - Get user's earned rewards

## 🚀 Deployment

### Replit Deployment (Recommended)
1. Import this repository into Replit
2. Set up environment variables in Replit Secrets
3. Click "Deploy" to launch your application

### Manual Deployment
1. Build the application:
```bash
npm run build
```
2. Set up production environment variables
3. Deploy to your preferred hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Replit](https://replit.com) development environment
- UI components from [Shadcn/UI](https://ui.shadcn.com/)
- AI processing powered by [Anthropic Claude](https://www.anthropic.com/)
- Icons from [Lucide React](https://lucide.dev/)

## 📞 Support

For support, email your-email@example.com or open an issue on GitHub.

---

**TaskFlowPro** - Transform your productivity with AI-powered task management and intelligent prioritization.