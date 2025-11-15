# VidyaVichar - Real-time Classroom Q&A System

## Table of Contents
- [Overview](#overview)
- [Solution Architecture](#solution-architecture)
- [File Structure](#file-structure)
- [API Endpoints & Flow](#api-endpoints--flow)
- [Design Decisions](#design-decisions)
- [Key Assumptions](#key-assumptions)
- [Installation & Setup](#installation--setup)
- [Git Repository](#git-repository)
- [Commit History](#commit-history)

---

## Overview

**VidyaVichar** is a real-time classroom Q&A system that transforms traditional lecture interactions through a digital sticky board interface. Students can post questions during lectures without interrupting the flow, while instructors can view, prioritize, and respond to questions in real-time. The system features an authentic sticky note UI with colorful, rotated notes that simulate a physical classroom board experience.

### Core Features
- **Real-time Question Posting**: Students submit questions instantly during live sessions
- **Sticky Note Interface**: Visual representation mimicking physical sticky notes with random colors and rotations
- **Instructor Dashboard**: Comprehensive session management and question oversight
- **Session Management**: Create, join, and manage Q&A sessions with unique codes
- **Role-based Access**: Different permissions for instructors, TAs, and students
- **Reply Threading**: Hierarchical response system for detailed discussions
- **Activity Tracking**: Monitor session updates and user engagement
- **Persistent Storage**: All questions and responses saved for post-session review


---

## Solution Architecture

### High-Level Design Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           ACTUAL VIDYAVICHAR IMPLEMENTATION                         │
└─────────────────────────────────────────────────────────────────────────────────────┘

CLIENT TIER (React + Vite)        APPLICATION TIER (Express)         DATA TIER (MongoDB)
┌─────────────────┐              ┌─────────────────────┐             ┌─────────────────┐
│  React Frontend │              │  Express Backend    │             │   MongoDB       │
│                 │              │                     │             │                 │
│ ┌─────────────┐ │   11 API     │ ┌─────────────────┐ │  Mongoose   │ ┌─────────────┐ │
│ │Login.jsx    ├─┼─────────────►│ │middleware/      ├─┼────────────►│ │participants │ │
│ └─────────────┘ │   Endpoints  │ │auth.js          │ │   ODM       │ └─────────────┘ │
│ ┌─────────────┐ │              │ └─────────────────┘ │             │                 │
│ │Dashboard    ├─┼─────────────►│ ┌─────────────────┐ │             │ ┌─────────────┐ │
│ │Participant  │ │              │ │6 Controllers/   ├─┼────────────►│ │sessions     │ │
│ │.jsx         │ │              │ │Direct Model     │ │             │ │(embedded    │ │
│ └─────────────┘ │              │ │Access           │ │             │ │questions)   │ │
│ ┌─────────────┐ │              │ └─────────────────┘ │             │ └─────────────┘ │
│ │Dashboard    ├─┼─────────────►│ ┌─────────────────┐ │             │                 │
│ │Instructor   │ │              │ │6 Routes Files   │ │             │ ┌─────────────┐ │
│ │.jsx         │ │              │ └─────────────────┘ │             │ │sessionup-   │ │
│ └─────────────┘ │              │ ┌─────────────────┐ │             │ │dates        │ │
│ ┌─────────────┐ │ Socket.IO    │ │sockets/index.js ├─┼──┐          │ └─────────────┘ │
│ │SessionView  ├─┼─────────────►│ │Room-based       │ │  │          │                 │
│ │.jsx +       │ │ Events       │ │Broadcasting     │ │  │          │                 │
│ │Sticky Notes │ │              │ └─────────────────┘ │  │          │                 │
│ │CSS Animations│ │              │                     │  │          │                 │
│ └─────────────┘ │              │                     │  │          │                 │
│ ┌─────────────┐ │              │                     │  │          │                 │
│ │ProfilePage  │ │              │                     │  │          │                 │
│ │.jsx         │ │              │                     │  │          │                 │
│ └─────────────┘ │              │                     │  │          │                 │
└─────────────────┘              └─────────────────────┘  │          └─────────────────┘
                                                           │
Real-time Flow: Sticky Note Question → Socket Broadcast ──┘→ All Session Participants
```

### Low-Level Design Diagram

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│                        ACTUAL COMPONENT IMPLEMENTATION                                │
└───────────────────────────────────────────────────────────────────────────────────────┘

FRONTEND PAGES                    BACKEND - DIRECT MODEL ACCESS        DATABASE COLLECTIONS
┌─────────────────┐              ┌─────────────────┐                  ┌─────────────────┐
│  Login.jsx      │   JWT Token  │  authController │  Mongoose Query  │  participants   │
│  ┌───────────┐  ├─────────────►│  .js           ├─────────────────►│  {              │
│  │POST /auth/├──┤              │  ┌───────────┐  │                  │   id,email,     │
│  │login      │  │              │  │NO SERVICE ├──┤                  │   role,courses  │
│  └───────────┘  │              │  │LAYER      │  │                  │  }              │
│  AuthContext.jsx│              │  └───────────┘  │                  └─────────────────┘
└─────────────────┘              └─────────────────┘                                     
                                                                     ┌─────────────────┐
┌─────────────────┐              ┌─────────────────┐                  │    sessions     │
│ Dashboard       │  HTTP Req    │sessionController│  Direct Access   │  {              │
│ Participant.jsx ├─────────────►│.js              ├─────────────────►│   sessionId,    │
│ Dashboard       │              │questionController│                  │   courseName,   │
│ Instructor.jsx  │              │.js              │                  │   questions: [  │
│ (Embedded Forms)│              │replyController  │                  │     {text,      │
└─────────────────┘              │.js              │                  │      author,    │
                                 └─────────────────┘                  │      replies:[] │
┌─────────────────┐              ┌─────────────────┐                  │     }]          │
│ SessionView.jsx │   Socket.IO  │ sockets/index.js│  Update Tracking │   }             │
│ ┌─────────────┐ ├─────────────►│ ┌─────────────┐ ├─────────────────►└─────────────────┘
│ │Sticky Notes ├─┤   Events     │ │Room-based   │ │                                     
│ │CSS Animation│ │              │ │Broadcasting │ │                  ┌─────────────────┐
│ │Random Colors│ │              │ └─────────────┘ │                  │ sessionupdates  │
│ │& Rotations  │ │              └─────────────────┘                  │  {              │
│ └─────────────┘ │              ┌─────────────────┐                  │   sessionId,    │
│ ProfilePage.jsx │              │updateController │                  │   userId,       │
│ Header.jsx      │              │.js              │                  │   lastSeenAt,   │
└─────────────────┘              └─────────────────┘                  │   updates:[]    │
                                                                      │  }              │
API LAYER (7 files)              MIDDLEWARE (auth.js)                 └─────────────────┘
┌─────────────────┐              ┌─────────────────┐                                     
│ axiosInstance   │              │JWT Validation   │                                     
│ authApi.js      │              │Role-based Auth  │                                     
│ sessionApi.js   ├─────────────►│CORS Config      │                                     
│ questionApi.js  │              │Error Handling   │                                     
│ replyApi.js     │              └─────────────────┘                                     
│ updateApi.js    │                                                                      
│ userApi.js      │                                                                      
└─────────────────┘                                                                      

Actual Data Flow:
1. Login.jsx → authController.js → Participant.js model → participants collection
2. DashboardInstructor.jsx → sessionController.js → Session.js model → sessions collection  
3. SessionView.jsx → questionController.js → Session.js (embedded) → Socket broadcast
4. Sticky Notes CSS → Random colors/rotations → Real-time UI updates
5. updateController.js → SessionUpdate.js model → Dashboard "NEW" indicators
```

---

## File Structure

### Frontend Structure (React + Vite)
```
frontend/src/
├── pages/
│   ├── Login.jsx                    # User authentication interface
│   ├── DashboardParticipant.jsx     # Student dashboard with session list
│   ├── DashboardInstructor.jsx      # Instructor dashboard with controls
│   ├── SessionView.jsx              # Main Q&A interface with sticky notes
│   └── ProfilePage.jsx              # User profile management
├── components/
│   └── Header.jsx                   # Navigation and user info component
├── context/
│   ├── AuthContext.jsx              # Authentication state management
│   └── SocketContext.jsx            # Socket.IO connection management
├── hooks/
│   └── useAuth.js                   # Custom authentication hook
├── api/
│   ├── axiosInstance.js             # Configured HTTP client
│   ├── authApi.js                   # Authentication endpoints
│   ├── sessionApi.js                # Session management endpoints
│   ├── questionApi.js               # Question operations endpoints
│   ├── replyApi.js                  # Reply system endpoints
│   ├── updateApi.js                 # Activity tracking endpoints
│   └── userApi.js                   # User profile endpoints
├── utils/
│   └── sessionUtils.js              # Session helper functions
├── App.jsx                          # Root component with routing
├── main.jsx                         # Application entry point
└── styles.css                       # Global styles and sticky note CSS
```

### Backend Structure (Node.js + Express)
```
backend/src/
├── controllers/
│   ├── authController.js            # Authentication logic
│   ├── sessionController.js         # Session CRUD operations
│   ├── questionController.js        # Question management
│   ├── replyController.js           # Reply system handling
│   ├── updateController.js          # Activity tracking
│   └── userController.js            # User profile operations
├── models/
│   ├── Participant.js               # User schema with course enrollment
│   ├── Session.js                   # Session schema with embedded questions
│   └── SessionUpdate.js             # Activity tracking schema
├── middleware/
│   └── auth.js                      # JWT validation middleware
├── routes/
│   ├── authRoutes.js                # Authentication endpoints
│   ├── sessionRoutes.js             # Session management routes
│   ├── questionRoutes.js            # Question operation routes
│   ├── replyRoutes.js               # Reply system routes
│   ├── updateRoutes.js              # Activity tracking routes
│   └── userRoutes.js                # User profile routes
├── sockets/
│   └── index.js                     # Socket.IO event handlers
├── config/
│   └── db.js                        # MongoDB connection configuration
├── app.js                           # Express application setup
├── server.js                        # Server initialization
└── seedParticipants.js              # Database seeding script
```

### Database Collections (MongoDB)
```
test/
├── participants                     # User accounts and course enrollment
├── sessions                         # Q&A sessions with embedded questions
└── sessionupdates                   # User activity and notification tracking
```

---

## API Endpoints & Flow

### Authentication Endpoints
```
POST /api/auth/login
├── Input: { email: String, password: String }
├── Process: Validate credentials → Generate JWT → Return user data
├── Output: { token: String, user: { id, name, role, courses } }
└── Error: 401 Unauthorized, 400 Bad Request

Flow: Client → Validation → Database Lookup → Password Check → JWT Generation
```

### Session Management Endpoints
```
GET /api/sessions
├── Process: Fetch user's enrolled sessions (active + completed)
├── Authorization: Valid JWT required
└── Output: Array of session objects with metadata

POST /api/sessions
├── Input: { courseName: String, title?: String }
├── Authorization: Instructor role required
├── Process: Create session → Generate sessionId → Notify participants
└── Output: { sessionId, courseName, createdBy, startAt, status }

PATCH /api/sessions/:sessionId/end
├── Authorization: Session creator only
├── Process: Set endAt timestamp → Update status → Broadcast end event
└── Output: Updated session object

GET /api/sessions/active/:courseName
├── Process: Find currently live session for course
└── Output: Active session object or null
```

### Question Operations Endpoints
```
POST /api/questions/:sessionId
├── Input: { text: String }
├── Validation: Session must be live, prevent duplicate questions
├── Authorization: Student role, enrolled in course
├── Process: Add question to session → Track in updates → Broadcast
├── Socket Event: Emit "question:created" to session room
└── Output: Created question object

PATCH /api/questions/:sessionId/:questionId/answered
├── Authorization: Instructor (anytime) or TA (completed sessions only)
├── Process: Update question status → Track update → Broadcast change
├── Socket Event: Emit "question:answered" to session room
└── Output: Updated question object
```

### Reply System Endpoints
```
POST /api/replies/:sessionId/:questionId
├── Input: { text: String, parentReplyId?: ObjectId }
├── Authorization: Instructor (anytime) or TA (after session ends)
├── Process: Add reply to question → Support threading → Broadcast
├── Socket Event: Emit "reply:created" to session room
└── Output: Created reply object with threading information
```

### Activity Tracking Endpoints
```
POST /api/updates/:sessionId/seen
├── Process: Update user's lastSeenAt timestamp for session
├── Effect: Clear "new updates" indicators in UI
└── Output: Success confirmation

GET /api/updates/:sessionId
├── Process: Compare session updates vs user's lastSeenAt
├── Authorization: Course enrollment required
└── Output: Array of unseen updates with timestamps
```

### User Profile Endpoints
```
GET /api/users/me
├── Authorization: Valid JWT required
├── Process: Fetch user details with course enrollment
└── Output: { id, name, email, role, courses }
```

### Real-time Socket.IO Events
```
Connection Events:
├── joinSession(sessionId)           # Join session-specific room
├── leaveSession(sessionId)          # Leave session room
└── disconnect                       # Handle cleanup

Broadcast Events:
├── question:created → { question, sessionId }
├── question:answered → { questionId, status, sessionId }
├── reply:created → { reply, questionId, sessionId }
└── session:ended → { sessionId, endAt }

Error Events:
├── error → { message, code }
└── unauthorized → { reason }
```

---

## Design Decisions

### Architecture Patterns

#### 1. MERN Stack Selection
**Decision**: React + Node.js + Express + MongoDB

#### 2. Embedded vs Referenced Data
**Decision**: Embed questions within session documents

#### 3. Real-time Communication Strategy
**Decision**: Hybrid REST + WebSocket architecture

#### 4. Authentication & Authorization
**Decision**: JWT stateless authentication with role-based access

#### 5. UI/UX Philosophy
**Decision**: Authentic sticky note metaphor with CSS animations

#### 6. Database Design Patterns
**Decision**: Separate SessionUpdates collection for activity tracking

### **Actual Implementation Notes**

#### **Simplified Architecture**
- **No Service Layer**: Controllers directly access Mongoose models (no intermediate service abstraction)
- **Embedded Documents**: Questions and replies are embedded in session documents for atomic operations
- **Single Dashboard Logic**: TAs use the same `DashboardParticipant.jsx` as students (no separate TA interface)
- **Form Integration**: Session creation form is embedded within `DashboardInstructor.jsx`, not a separate page

#### **Real-time Features**
- **Sticky Note Animations**: CSS-based random colors, rotations, and wobble effects for authentic feel
- **Socket.IO Rooms**: Session-specific broadcasting prevents cross-session message leakage
- **Update Indicators**: "NEW" badges in dashboard for sessions with unseen activity since user's `lastSeenAt`

#### **Authentication Flow**
- **Role-Based Redirects**: Login automatically redirects to appropriate dashboard based on user role
- **Context Management**: `AuthContext.jsx` and `SocketContext.jsx` provide global state management
- **Middleware Chain**: Single `auth.js` middleware handles JWT validation and role authorization

---

## Key Assumptions
- Two separate roles for participants - students and instructors
    - TA is a student with elevated permissions for the course he/she is a TA for
- Pre-seeded database of participants - with sample email and password
    - 1 course
    - 1 instructor
    - 6 TAs 
    - 120 Students out of which 100 enrolled, 20 not enrolled 
- There can be only one live session per course at a time
- Instructor can both verbally answer during live class or write the response to the question as well
- TAs can respond only after the session has ended

---

## Installation & Setup

### Prerequisites
- **Node.js**: Version 18.0 or higher
- **MongoDB**: Version 6.0 or higher  
- **npm**: Version 9.0 or higher
- **Git**: For repository cloning

### Backend Setup

1. **Navigate to Backend Directory**
```bash
cd backend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Start Development Server**
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start

# Backend will be available at http://localhost:5000
```

### Frontend Setup

1. **Navigate to Frontend Directory**
```bash
cd frontend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Start Development Server**
```bash
# Development mode with hot reload
npm run dev

# Frontend will be available at http://localhost:3000
```

4. **Testing emails**
```bash
   Instructor - instructor@vidyavichar.com
   TA - ritika.sharma@vidyavichar.com
   Enrolled Student 1: tanya.kapoor@vidyavichar.com
   Enrolled Student 2: priya.joshi@vidyavichar.com
   Unenrolled Student: rahul.malhotra@vidyavichar.com

    Password: password123
```

### Testing Suite

#### Backend Tests
```bash
cd backend

# Run complete test suite (92 tests, 98% coverage)
npm test

# Run specific test categories
npm test auth.test.js          # Authentication & authorization
npm test session.test.js       # Session management
npm test reply.test.js         # Questions & replies system
npm test integratio.test.js    # Integration tests
npm test user.test.js          # User management
npm test update.test.js        # Activity tracking

# Run with coverage report
npm run test:coverage
```

### Development Workflow

1. **Start Both Services**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

2. **Verify Installation**
- Backend API: http://localhost:5000/api/auth/login
- Frontend App: http://localhost:3000
- MongoDB Connection: Check console logs for successful connection

---

## Git Repository

**Repository URL**: https://github.com/a-n-u-p-a-m/Group_27_SSD_MID_LAB

```bash
# Clone the repository
git clone https://github.com/a-n-u-p-a-m/Group_27_SSD_MID_LAB
cd Group_27_SSD_MID_LAB

# Install dependencies for both frontend and backend
npm run install:all

# Start development environment
npm run dev:all
```

### Repository Structure
```
Group_27_SSD_MID_LAB/
├── frontend/          # React application
├── backend/           # Express server
├── docs/              # Documentation and diagrams
├── .gitignore         # Git ignore patterns
└── README.md          # This documentation
```

---

## Commit History
```bash
18ba040 (HEAD -> master, origin/master, origin/HEAD) docs: solution and architecture diagrams
2774ba3 feat(frontend): implement dashboards and session interaction view
3c1e60c feat(frontend): initialize react app, auth context, and login flow
30edf47 Merge pull request #1 from a-n-u-p-a-m/main
e0668d5 (origin/main) feat(backend): add question and reply endpoints
d9b538e feat(backend): implement session management and real-time updates
4f07901 feat(backend): initialize server, user models, and authentication
```
### Commit Messages
```bash
feat(backend): initialize server, user models, and authentication
feat(backend): implement session management and real-time updates
feat(backend): add question and reply endpoints
feat(frontend): initialize react app, auth context, and login flow
feat(frontend): implement dashboards and session interaction view
docs: solution and architecture diagrams
```

---

*Contributors:*
1. Anupam Dwivedi   - 2025201032
2. Devansh Singh    - 2025204007
3. Shobhan Parida   - 2025201043
4. Krishna Pokuri   - 2025202024
5. Yashwanth B K    - 2025201028
