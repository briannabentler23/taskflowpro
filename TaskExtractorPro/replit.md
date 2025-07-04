# TaskFlowPro - AI-Powered Task Extraction & Time Tracking Web Application

## Overview
TaskFlowPro is a comprehensive web application that automatically extracts actionable tasks from communications and provides advanced time tracking capabilities with both standard and Pomodoro timers. It combines AI-powered task extraction with project management and gamified time tracking features.

## Key Features
- **AI Task Extraction**: Uses Anthropic's Claude Sonnet 4 to analyze communication text and extract structured tasks
- **Advanced Task Prioritization**: Four professional prioritization methods (Eisenhower Matrix, Eat The Frog, ABCDE Method, Chunking Method)
- **Intelligent Task Organization**: Tasks automatically sorted and displayed according to user's chosen prioritization method
- **Time Tracking**: Standard stopwatch timer and Pomodoro timer (25/5 minute intervals) with project/task association
- **Project Management**: Create, organize, and track time across multiple projects with color coding
- **Gamification**: Children's mode with stars, achievements, and progress tracking for completed Pomodoro sessions
- **User Authentication**: Secure login system using Replit Auth with OpenID Connect
- **Task Management**: Full CRUD operations for tasks with priority levels, due dates, assignees, and tags
- **Email Integration**: Send task lists via email with formatted output
- **Activity Tracking**: Monitor task creation, updates, completion history, and timer sessions
- **Real-time Statistics**: Track completion rates, task status distribution, and time spent per project
- **Mobile-Responsive**: Clean, professional interface that works on all devices
- **Elegant Design**: Professional black, white, and gold color scheme for sophistication

## Technology Stack
- **Frontend**: React with TypeScript, Tailwind CSS, Shadcn/UI components
- **Backend**: Node.js with Express, TypeScript
- **AI Processing**: Anthropic Claude Sonnet 4 (claude-sonnet-4-20250514)
- **Storage**: PostgreSQL database with Drizzle ORM
- **Authentication**: Replit Auth with Passport.js
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state
- **Email Service**: Nodemailer for task sharing

## Project Architecture
### Backend Structure
- `server/index.ts` - Main Express application entry point
- `server/routes.ts` - API route definitions with authentication middleware
- `server/storage.ts` - PostgreSQL database storage implementation with IStorage interface
- `server/db.ts` - Database connection and Drizzle configuration
- `server/replitAuth.ts` - Replit authentication setup and middleware
- `server/openai.ts` - Anthropic API integration for task extraction (renamed from openai)
- `server/services/` - Business logic services (task extraction, email)

### Frontend Structure
- `client/src/App.tsx` - Main React application with routing (includes Settings page)
- `client/src/pages/` - Landing page, dashboard, timer page, and settings page
- `client/src/components/` - Reusable UI components including:
  - Task management with TaskModal and TaskPrioritization
  - PrioritizedTaskList for method-based task display
  - PrioritizationSettings for user preference configuration
  - Timer and project manager components
- `client/src/hooks/` - Custom React hooks for authentication and utilities
- `client/src/lib/` - Utility functions and API client configuration

### Shared Schema
- `shared/schema.ts` - Database schema definitions using Drizzle ORM and Zod validation

## API Endpoints
### Authentication & User Management
- `GET /api/auth/user` - Get authenticated user information
- `PUT /api/auth/user/prioritization` - Update user's prioritization method preference

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
- `PUT /api/timer-sessions/:id` - Update timer session (pause, stop, complete)
- `POST /api/pomodoro-sessions` - Create Pomodoro session
- `PUT /api/pomodoro-sessions/:id/complete` - Complete Pomodoro session

### Activity & Gamification
- `GET /api/activities` - Get user's activity history
- `GET /api/rewards` - Get user's earned rewards (stars, achievements)

## Environment Requirements
- `ANTHROPIC_API_KEY` - Required for AI task extraction functionality
- `REPLIT_DOMAINS` - Automatically provided by Replit for authentication
- `REPL_ID` - Automatically provided by Replit
- `SESSION_SECRET` - Automatically provided for session management

## GitHub Repository
**Status**: Ready for Release  
**Repository**: Complete TaskFlowPro application with professional documentation  
**Structure**: All application files, documentation, and deployment guides prepared  
**Collaboration**: Ready for multi-user development and testing  

## Recent Changes
- **2025-01-03**: Implemented comprehensive task prioritization system with four methods:
  * Eisenhower Matrix (urgent/important quadrants)
  * Eat The Frog (most important task first)
  * ABCDE Method (consequence-based priority levels)
  * Chunking Method (time-based task organization)
- **2025-01-03**: Added PrioritizationSettings component with method selection and comparison
- **2025-01-03**: Created TaskPrioritization component for individual task prioritization
- **2025-01-03**: Implemented PrioritizedTaskList with method-specific task sorting and display
- **2025-01-03**: Added Settings page with navigation integration for user preferences
- **2025-01-03**: Extended database schema with prioritization fields (eisenhowerQuadrant, abcdePriority, isEatTheFrog, chunkSize, estimatedTime)
- **2025-01-03**: Updated TaskModal to include prioritization options based on user's chosen method
- **2025-01-03**: Updated application name from TaskFlow to TaskFlowPro
- **2025-01-03**: Implemented professional black, white, and gold color scheme for elegant and sophisticated design
- **2025-01-03**: Updated all components with consistent elegant styling using CSS variables and custom classes
- **2025-01-02**: Added comprehensive timer and time tracking features with standard and Pomodoro modes
- **2025-01-02**: Implemented project management system with color-coded organization
- **2025-01-02**: Created children's mode with gamification (stars, achievements, progress tracking)
- **2025-01-02**: Added timer page with navigation and mobile-responsive interface
- **2025-01-02**: Extended database schema with projects, timer sessions, Pomodoro sessions, and user rewards
- **2025-01-24**: Migrated from in-memory storage to PostgreSQL database with Drizzle ORM
- **2025-01-24**: Switched from OpenAI to Anthropic Claude Sonnet 4 for AI processing
- **2025-01-24**: Fixed nodemailer configuration error (createTransporter → createTransport)
- **2025-01-24**: Implemented complete task management system with authentication
- **2025-01-24**: Added email integration for task sharing
- **2025-01-24**: Created responsive UI with landing page and dashboard
- **2025-01-04**: Prepared comprehensive GitHub repository with:
  * Professional README.md with complete feature documentation
  * MIT license for open source collaboration
  * Comprehensive .env.example for environment setup
  * CONTRIBUTING.md with development guidelines
  * Complete API documentation in docs/API.md
  * Deployment guide in docs/DEPLOYMENT.md
  * GITHUB_RELEASE.md with step-by-step release instructions
  * Proper .gitignore for clean repository management
  * Ready for collaborative development and testing

## User Preferences
- Prefers Anthropic API over OpenAI for AI functionality
- Uses PostgreSQL database for persistent data storage
- Professional black, white, and gold color scheme for elegance and sophistication
- Modern, clean UI design with professional styling

## Deployment
The application is configured to run on Replit with the "Start application" workflow using `npm run dev`. The workflow runs the Express server which serves both the API and the Vite-built frontend on port 5000.

## Future Enhancements
- **Time Analytics**: Advanced reporting with charts showing daily, weekly, monthly time logs
- **Export Functionality**: CSV/PDF export of time logs for billing and reports
- **Calendar Integration**: Create events from tasks and sync timer sessions
- **Notion and Slack Integrations**: Connect with external productivity tools
- **File Upload Support**: Process documents and extract tasks from PDFs
- **Voice Input**: Process voicemails and audio recordings for task extraction
- **Team Features**: Shared projects and collaborative time tracking