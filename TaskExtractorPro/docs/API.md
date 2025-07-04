# TaskFlowPro API Documentation

This document provides detailed information about the TaskFlowPro REST API endpoints.

## Base URL

```
https://your-deployment-url.replit.app/api
```

## Authentication

TaskFlowPro uses Replit Auth with OpenID Connect for authentication. Most endpoints require authentication.

### Authentication Flow

1. **Login**: `GET /api/login` - Redirects to Replit authentication
2. **Callback**: `GET /api/callback` - Handles authentication callback
3. **Logout**: `GET /api/logout` - Logs out the user
4. **User Info**: `GET /api/auth/user` - Returns current user information

## Error Responses

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

Error response format:
```json
{
  "message": "Error description"
}
```

## Endpoints

### User Management

#### Get Current User
```http
GET /api/auth/user
```

**Response:**
```json
{
  "id": "user123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "profileImageUrl": "https://...",
  "prioritizationMethod": "eisenhower",
  "createdAt": "2025-01-03T00:00:00Z"
}
```

#### Update User Prioritization Method
```http
PUT /api/auth/user/prioritization
```

**Body:**
```json
{
  "method": "eisenhower" // "eisenhower", "abcde", "eat-the-frog", "chunking"
}
```

### Task Management

#### Get All Tasks
```http
GET /api/tasks
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Complete project proposal",
    "description": "Write detailed project proposal for Q2",
    "priority": "high",
    "status": "pending",
    "assignee": "john@example.com",
    "dueDate": "2025-01-15T00:00:00Z",
    "tags": ["project", "proposal"],
    "eisenhowerQuadrant": "urgent-important",
    "abcdePriority": "A",
    "isEatTheFrog": true,
    "chunkSize": "large",
    "estimatedTime": 120,
    "createdAt": "2025-01-03T00:00:00Z",
    "updatedAt": "2025-01-03T00:00:00Z"
  }
]
```

#### Create Task
```http
POST /api/tasks
```

**Body:**
```json
{
  "title": "Complete project proposal",
  "description": "Write detailed project proposal for Q2",
  "priority": "high",
  "status": "pending",
  "assignee": "john@example.com",
  "dueDate": "2025-01-15T00:00:00Z",
  "tags": ["project", "proposal"],
  "eisenhowerQuadrant": "urgent-important",
  "abcdePriority": "A",
  "isEatTheFrog": true,
  "chunkSize": "large",
  "estimatedTime": 120
}
```

#### Update Task
```http
PUT /api/tasks/:id
```

**Body:** Same as create task (partial updates supported)

#### Delete Task
```http
DELETE /api/tasks/:id
```

#### Get Task Statistics
```http
GET /api/tasks/stats
```

**Response:**
```json
{
  "total": 25,
  "completed": 15,
  "inProgress": 5,
  "pending": 5,
  "overdue": 2
}
```

#### Send Tasks via Email
```http
POST /api/tasks/email
```

**Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Task List for Today",
  "includeCompleted": false
}
```

### Communication & Task Extraction

#### Extract Tasks from Text
```http
POST /api/communications/extract
```

**Body:**
```json
{
  "content": "Meeting notes: We need to finish the quarterly report by Friday and schedule a team meeting for next week.",
  "source": "email",
  "subject": "Weekly Planning Meeting"
}
```

**Response:**
```json
{
  "summary": "Meeting notes discussing quarterly report and team meeting scheduling",
  "tasks": [
    {
      "title": "Finish quarterly report",
      "description": "Complete the quarterly report as discussed in meeting",
      "priority": "high",
      "dueDate": "2025-01-10T00:00:00Z",
      "tags": ["report", "quarterly"]
    },
    {
      "title": "Schedule team meeting",
      "description": "Organize team meeting for next week",
      "priority": "medium",
      "tags": ["meeting", "team"]
    }
  ]
}
```

For support or questions about the API, please open an issue on GitHub.