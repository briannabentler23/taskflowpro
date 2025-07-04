# TaskFlowPro Deployment Guide

This guide covers different deployment options for TaskFlowPro.

## Replit Deployment (Recommended)

Replit provides the easiest deployment experience with built-in authentication and database hosting.

### Prerequisites
- Replit account
- GitHub repository (this one!)

### Steps

1. **Import Repository**
   - Go to [Replit](https://replit.com)
   - Click "Create Repl"
   - Choose "Import from GitHub"
   - Enter your repository URL

2. **Configure Environment Variables**
   - Open the "Secrets" tab in Replit
   - Add the following secrets:
     ```
     ANTHROPIC_API_KEY=your_anthropic_api_key
     DATABASE_URL=your_postgresql_url
     ```
   - Optional integrations:
     ```
     SLACK_BOT_TOKEN=your_slack_bot_token
     SLACK_CHANNEL_ID=your_slack_channel_id
     CLICKUP_API_TOKEN=your_clickup_token
     GOOGLE_DRIVE_API_KEY=your_google_drive_key
     GOOGLE_DRIVE_CLIENT_ID=your_google_drive_client_id
     GOOGLE_CALENDAR_API_KEY=your_google_calendar_key
     GOOGLE_CALENDAR_CLIENT_ID=your_google_calendar_client_id
     ```

3. **Database Setup**
   - Replit automatically provisions a PostgreSQL database
   - Run the setup command:
     ```bash
     npm run db:push
     ```

4. **Deploy**
   - Click the "Deploy" button in Replit
   - Your app will be available at `https://yourappname.yourusername.replit.app`

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key | `ant_api_key_...` |
| `SESSION_SECRET` | Secret for session encryption | `your_random_32_char_string` |

### Replit-Specific Variables

| Variable | Description | Auto-Generated |
|----------|-------------|----------------|
| `REPLIT_DOMAINS` | Allowed domains for auth | Yes |
| `REPL_ID` | Replit app identifier | Yes |

### Optional Integration Variables

| Variable | Description | Required For |
|----------|-------------|-------------|
| `SLACK_BOT_TOKEN` | Slack bot authentication | Slack integration |
| `SLACK_CHANNEL_ID` | Default Slack channel | Slack integration |
| `CLICKUP_API_TOKEN` | ClickUp API access | ClickUp integration |
| `GOOGLE_DRIVE_API_KEY` | Google Drive API key | Drive integration |
| `GOOGLE_DRIVE_CLIENT_ID` | Google Drive OAuth client | Drive integration |
| `GOOGLE_CALENDAR_API_KEY` | Google Calendar API key | Calendar integration |
| `GOOGLE_CALENDAR_CLIENT_ID` | Google Calendar OAuth client | Calendar integration |

For additional deployment support, please refer to the platform-specific documentation or open an issue on GitHub.