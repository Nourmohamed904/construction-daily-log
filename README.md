# 🏗️ Construction Daily Log

A full-stack web application for construction site managers to submit, track, and export daily progress reports. Built as a domain-specific project inspired by **Procore's Daily Log** feature — one of the core tools used by construction teams worldwide to track site activity.

## 🌐 Live Demo
**[https://construction-daily-log.vercel.app](https://construction-daily-log.vercel.app)**

> **Demo credentials:**
> - Register a new account to try as Manager
> - Contact admin to get Admin role

## ✨ Features

### Authentication
- Register and login with JWT token-based authentication
- Passwords encrypted with bcrypt
- Token stored in localStorage, auto-expires after 7 days
- Automatic redirect to login on token expiration (401 handling)

### Daily Reports
- Submit daily construction site reports with: site name, date, workers present, tasks completed, issues encountered, weather condition
- View all past reports with a responsive design
- Search reports in real time by site name or weather
- View full report detail page
- Export any report as a formatted **PDF** with one click

### Role-Based Access Control
- **Manager** — create and view their own reports only
- **Admin** — view ALL reports from all managers, delete any report
- Admin badge shown in header
- Delete confirmation modal before any deletion

### CI/CD Pipeline
- GitHub Actions runs automatically on every push to main
- Spins up fresh PostgreSQL, creates tables, runs Jest test suite
- 4 automated tests covering register, duplicate register, login, wrong password

### Responsive Design
- Fully responsive — works on mobile, tablet, and desktop
- Table view on desktop switches to card view on mobile automatically

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js | UI framework |
| React Router | Client-side navigation |
| Axios | HTTP requests with interceptors |
| jsPDF | PDF generation in browser |
| CSS3 | Responsive styling |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | REST API framework |
| PostgreSQL | Relational database |
| bcryptjs | Password encryption |
| jsonwebtoken | JWT authentication |
| cors | Cross-origin requests |

### Testing & DevOps
| Technology | Purpose |
|---|---|
| Jest | Unit testing framework |
| Supertest | HTTP endpoint testing |
| GitHub Actions | CI/CD pipeline |

### Deployment
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| Supabase | Cloud PostgreSQL database |


## 📋 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login | No |
| POST | /api/reports | Create daily report | Yes |
| GET | /api/reports | Get reports | Yes |
| GET | /api/reports/:id | Get single report | Yes |
| DELETE | /api/reports/:id | Delete report | Admin only |

## 🔐 Role System

| Feature | Manager | Admin |
|---------|---------|-------|
| Register/Login | ✅ | ✅ |
| Create report | ✅ | ✅ |
| View own reports | ✅ | ✅ |
| View all reports | ❌ | ✅ |
| Delete reports | ❌ | ✅ |
| Admin badge | ❌ | ✅ |

## ✅ Automated Tests

```
Auth Endpoints
  ✓ POST /api/auth/register - should register a new user
  ✓ POST /api/auth/register - should fail if user already exists
  ✓ POST /api/auth/login - should login successfully
  ✓ POST /api/auth/login - should fail with wrong password
```

