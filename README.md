# BookMyShow Lite++ 🎬

A full-stack Movie Ticket Booking Platform built with the MERN stack.

## Tech Stack
- **Frontend**: React 18 + Vite, React Router v6, Axios, Vanilla CSS (Dark Theme)
- **Backend**: Node.js + Express.js (MVC Architecture)
- **Database**: MongoDB + Mongoose ODM
- **CORS**: Configured with `cors` middleware

## Project Setup

### Prerequisites
- Node.js >= 18
- MongoDB running locally on port 27017

### 1. Backend Setup
```bash
cd server
npm install
cp .env.example .env   # Edit MONGO_URI if needed
npm run dev            # Starts on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev            # Starts on http://localhost:5173
```

credential:
admin : Email - admin123@gmail.com
        password - admin123@

user : Email-  dangibalchand935@gmail.com
       password - dangi@123

## API Endpoints

### Admin Routes (`/api/admin/*`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/admin/movies` | Create a new movie |
| GET | `/api/admin/movies` | List all movies |
| POST | `/api/admin/shows` | Create a show (auto-generates 30 seats) |
| GET | `/api/admin/shows` | List all shows (filterable by `?movieId=`) |

### User Routes
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/movies` | Get all movies (supports `?page=&limit=`) |
| GET | `/api/movies/:id` | Get movie details |
| GET | `/api/shows/:movieId` | Get shows for a movie |
| POST | `/api/seats/lock` | Lock selected seats (2-min TTL) |
| POST | `/api/book` | Confirm a booking |
| GET | `/api/bookings/:userId` | Get user's booking history |

## Business Logic

### Seat Pricing (Backend Only)
| Row | Seats | Price |
|-----|-------|-------|
| Row A (Standard) | 1–10 | ₹150 |
| Row B (Premium) | 11–20 | ₹180 |
| Row C (VIP) | 21–30 | ₹200 |

### Seat Locking
- Seats are locked for **2 minutes** when selected
- Lock expiry is checked **lazily** before every lock/book request
- Expired locks are automatically released

### Booking Validation
All 6 required checks implemented: show existence, seat range (1-30), no double-booking, no cross-user lock conflict, non-empty seat array, userId required.

## Features
- ✅ Admin panel: create movies + shows, view lists
- ✅ User: browse movies, view details, pick shows
- ✅ Interactive 30-seat grid with color-coded states
- ✅ 2-minute countdown timer after locking seats
- ✅ Booking confirmation with itemized price breakdown
- ✅ Booking history with user search
- ✅ Dark theme with glassmorphism UI
- ✅ Fully responsive (mobile-first design)
- ✅ CORS configured
- ✅ MVC backend architecture
- ✅ Global error handling middleware

## Assumptions
- Default userId is `user_001` (can be changed via the booking history page)
- Authentication is role-flag based (admin routes vs user routes), not JWT
- MongoDB is expected to run locally; update `MONGO_URI` in `.env` for cloud

## Known Issues
- None at time of submission
