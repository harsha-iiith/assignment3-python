# VidhyaVichaar - Interactive Learning Platform

VidhyaVichaar is a real-time educational platform that enables seamless interaction between students, teachers, and teaching assistants through live classes and doubt management systems.

## Github Link - https://github.com/guptamanali0/VidhyaVichaar.git

## Original Problem Statement

**Problem Code:** VidyaVichar

**Problem Statement:** VidyaVichara is a classroom Q&A sticky board where students can post questions in real-time during lectures. Questions appear as colorful sticky notes that instructors can view, mark, and organize. The system must be built using the MERN stack, where React handles the interactive frontend, Express + Node.js manages the backend logic, and MongoDB stores all questions, statuses, and timestamps. This ensures questions are persistently saved, retrievable across sessions, and available for later review and analytics.

### Example Scenario
During a lecture on System Design principles in the Software System Development course, the instructor is explaining concepts like load balancing, caching, and database sharding. Students use VidyaVichara to post their questions in real-time without interrupting the flow of teaching. One student asks "What's the difference between horizontal and vertical scaling?", another posts "Can caching introduce consistency issues?", and a third asks "How does CAP theorem apply to microservices?".

All these questions appear as sticky notes on the instructor's board. The instructor can quickly filter to view only unanswered questions and mark questions as "answered" once addressed. At the end of class, the full set of questions (along with timestamps and statuses) is stored in the MongoDB backend, allowing the teaching assistant to review them later and prepare additional clarifications or study resources.

## Project Interpretation & Design Decisions

### Core Interpretation
We interpreted the "classroom Q&A sticky board" concept as a comprehensive learning management system that extends beyond simple question posting to include:

1. **Multi-Role Architecture**: Extended the basic student-instructor model to include Teaching Assistants for better classroom management
2. **Live Class Management**: Added the concept of "live classes" that students can join, making the Q&A contextual to specific lecture sessions
3. **Session Persistence**: Added user authentication and session management for secure access across different roles

### Key Design Decisions

#### 1. Database Schema Design
- **Flexible Schema**: Used MongoDB's flexible schema with Mongoose for rapid development while maintaining data integrity
- **Separate Collections**: Designed separate collections for users (students, teachers, TAs), classes, and doubts for better data organization
- **Relationship Mapping**: Established clear relationships between classes, users, and doubts using reference IDs

#### 2. Authentication & Authorization
- **Role-Based Access**: Implemented three distinct user roles with different permissions and interfaces
- **Simple Authentication**: Used a token-based authentication system suitable for the academic environment
- **Session Persistence**: Maintained user sessions across browser refreshes for better user experience

#### 3. Real-time Features
- **Room-based Architecture**: Implemented class-specific rooms to ensure scalability and targeted message delivery
- **Event-driven Updates**: Real-time updates for doubt posting, status changes, and class management

#### 4. User Interface Design
- **Sticky Notes Visualization**: Implemented colorful, rotated sticky notes with stable colors based on content hash
- **Role-specific Interfaces**: Designed different dashboards and views optimized for each user role

#### 5. Class Management System
- **Live vs Past Classes**: Distinguished between active (live) and completed (past) classes for better organization
- **Class Lifecycle**: Implemented complete class lifecycle from creation to ending with proper state management
- **Student Enrollment**: Added functionality for students to join classes and track their participation history

### Solution Architecture

#### Frontend Architecture (React)
```
src/
├── components/          # Reusable UI components
│   ├── ClassCard.jsx   # Class display component
│   ├── Header.jsx      # Navigation header
│   └── Navigation.jsx  # Role-based navigation
├── pages/              # Page-level components
│   ├── Login.jsx       # Authentication page
│   ├── StudentDashboard.jsx
│   ├── TeacherDashboard.jsx
│   └── LiveClass.jsx   # Real-time Q&A interface
├── contexts/           # React Context for state management
│   └── AuthContext.js  # Authentication state
└── services/           # API communication layer
    └── api.js          # HTTP requests
```

#### Backend Architecture (Node.js/Express)
```
server.js               # Main server with all endpoints
├── Authentication API  # Login and user management
├── Classes API        # Class CRUD operations
├── Doubts API         # Q&A management
├── WebSocket Server   # Real-time communication
└── Database Models    # MongoDB collections
```

#### Database Design (MongoDB)
```
Collections:
├── student            # Student user data
├── Teacher            # Teacher user data  
├── teachingassistant  # TA user data
├── classes            # Class information
├── doubt              # Questions/doubts
└── student_past_classes # Enrollment tracking
```

## Features

### Core Functionality
- **Real-time Class Management**: Create, join, and manage live classes
- **Interactive Doubt System**: Students can post doubts during live classes
- **Role-based Access Control**: Separate interfaces for Students, Teachers, and Teaching Assistants
- **Session Persistence**: Stay logged in across browser refreshes

### User Roles

#### Students
- Join live classes using class topics
- Post doubts during live sessions
- View their own doubt history

#### Teachers
- Create and manage live classes
- View all student doubts in real-time
- Mark doubts as answered/unanswered
- Manage past class records

#### Teaching Assistants (TAs)
- Assist in live classes
- View student doubts

## Technology Stack

### Backend
- **Node.js** with **Express.js** framework
- **MongoDB** with **Mongoose** ODM
- **CORS** for cross-origin resource sharing
- **dotenv** for environment configuration

### Frontend
- **React 18** with functional components
- **React Router DOM** for navigation
- **Axios** for API communication


## Database Schema

### Collections

#### Students
```javascript
{
  roll_no: String,
  name: String,
  password: String,
  email: String
}
```

#### Teachers
```javascript
{
  tid: String,
  name: String,
  password: String,
  email: String
}
```

#### Teaching Assistants
```javascript
{
  taid: String,
  name: String,
  password: String,
  email: String,
  tid: String  // Assigned teacher ID
}
```

#### Classes
```javascript
{
  classId: String,
  tid: String,
  active: Boolean,
  createdAt: Date
}
```

#### Doubts
```javascript
{
  classtopic: String,
  sid: String,
  tid: String,
  doubtasked: String,
  sstatus: String,  // answered/unanswered
  timestamp: Date
}
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VidhyaVichaar
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
      
   **Backend `.env`:**
   ```env
  MONGO_URL=mongodb+srv://guptamanali0_db_user:TVpSZW8ABd9CTtFV@student.ms3h7a1.mongodb.net/VidhyaVichaar?retryWrites=true&w=majority&appName=Student
  PORT=5000
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev  # For development with nodemon
   # or
   npm start    # For production
   ```

2. **Start the Frontend Application**
   ```bash
   cd frontend
   npm start
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

##  Demo Credentials

Use these demo credentials to test the application with different user roles:

### Student Login
- **Roll Number:** `2025201088`
- **Password:** `abc@123`
- **Role:** Student

### Teacher Login
- **Teacher ID:** `T202`
- **Password:** `abc@123`
- **Role:** Teacher

### Teaching Assistant Login
- **TA ID:** `S202`
- **Password:** `abc@123`
- **Role:** TA

> **Note:** These are demo accounts for testing purposes.


## UI/UX Features

- **Sticky Notes Interface**: Colorful, rotated sticky notes for doubts
- **Tab-based Navigation**: Easy switching between live and past classes
- **Status Indicators**: Visual feedback for doubt status and class activity
- **Role-based Interfaces**: Customized views for different user types


