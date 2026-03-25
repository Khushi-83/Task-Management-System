# Comprehensive Task Management System

An enterprise-grade, full-stack Web Application built using React, Node.js, Express, and PostgreSQL, boasting robust JWT authentication, complex temporal analytics, and layered scalable architecture.

## 🚀 Features & Architecture
- **Layered Backend**: Services, Controllers, and Repositories strictly isolating business logic from routing.
- **Dual-Token Authentication**: Secure 15-minute `access_token` and 7-day `refresh_token` flow with automated frontend Axios interceptor recovery.
- **Advanced Analytics**: Heuristic Productivity Scoring and algorithmic calculation of Average Completion Time using SQL Postgres Extracted Epochs.
- **Strict Database State Tracking**: Automated trigger logging or transactional `TaskHistory` capturing every single entity mutation.

## 💾 Database ER Diagram

```mermaid
erDiagram
    USERS ||--o{ TASKS : "creates"
    USERS ||--o{ FEEDBACK : "submits"
    TASKS ||--o{ TASK_HISTORY : "tracks"
    TASKS ||--o{ FEEDBACK : "receives"

    USERS {
        uuid id PK
        varchar name
        varchar email
        varchar password
        timestamp created_at
    }
    TASKS {
        uuid id PK
        uuid user_id FK
        varchar title
        text description
        varchar priority "Low/Medium/High"
        varchar status "Pending/Completed/Archived"
        timestamp due_date
    }
    TASK_HISTORY {
        uuid id PK
        uuid task_id FK
        varchar action_type "created/updated/completed/deleted"
        jsonb previous_state
        timestamp timestamp
    }
    FEEDBACK {
        uuid id PK
        uuid user_id FK
        uuid task_id FK
        text comment
        int rating "1-5"
    }
```

## 🔒 JWT Authentication Flow
1. **Login/Register**: User sends credentials. Backend verifies using `bcryptjs` and returns `accessToken` (15m) and `refreshToken` (7d).
2. **Accessing Protected Routes**: Frontend attaches `Authorization: Bearer <accessToken>` to headers.
3. **Token Expiration**: When `accessToken` expires, backend rejects with `401 Unauthorized`.
4. **Automated Interception**: An Axios response interceptor on the frontend catches the 401, immediately pauses the failed request, and pushes the `refreshToken` to `/api/auth/refresh`.
5. **Replay**: Backend verifies the `refreshToken`, granting a new `accessToken`. The frontend interceptor saves the new token and silently replays the original failed request back to the server.

## 📊 Analytics Logic & Formulas
- **Average Completion Time**: Uses `EXTRACT(EPOCH FROM (completed_at - created_at))` by querying the exact temporal timeline between the `created` and `completed` history events for each individual task, returning a consolidated arithmetic mean `AVG()` grouped across all completed tasks.
- **Productivity Score**: `(Completed Tasks * 10) + (High Priority Completed * 5) - (Pending Tasks > 7 days old * 2)`. This rewards volume and prioritization while penalizing stagnation. Negative scores are bottomed out at 0.

## ⚙️ Setup Instructions
1. Setup a PostgreSQL database and create a new schema.
2. In `backend/`, create an `.env` file with `DATABASE_URL=postgresql://user:pass@localhost:5432/db` and JWT secrets.
3. Run `npm run setup-db` inside `backend/` to wipe existing tables and execute strictly constrained SQL migrations.
4. Run `npm run dev` in both `backend` and `frontend`.
5. Access Swagger API documentation at `http://localhost:5000/api-docs`.
