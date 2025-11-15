# VidyaVichar_Team33

SSD MID Exam - Hackathon

Team 33

Github link - https://github.com/PrathyushaKalluri/VidyaVichar_Team33.git

## A collaborative classroom platform for real-time Q&A, class management, and sticky notes.

## Solution Diagram

```text
+-------------------+         +-------------------+         +-------------------+
|    Frontend       | <-----> |     Backend       | <-----> |     Database      |
| (React.js)        |  REST   | (Node.js/Express) | Mongoose|   (MongoDB)       |
+-------------------+         +-------------------+         +-------------------+
        |                            |                               |
        |  Auth, Q&A, Classes, UI    |  API, Auth, Logic, Models     |  Data Storage
        +----------------------------+-------------------------------+
```

## Design Assumption

- User Roles: There are two main roles: Student (can ask questions, join classes), Instructor (can answer questions, moderate, create classes) and TA (can answer and mark questions, moderate)
- Classroom Model: Each class has a unique code, an instructor.
- Q&A System: Questions are posted per class, with status (unanswered, answered, important, archived) and can be filtered/sorted.
- Sticky Notes: Sticky notes are for quick, informal collaboration and can have status.
- Authentication: JWT-based authentication for secure API access.
- Frontend-Backend Separation: The frontend and backend are decoupled and communicate via REST APIs.
- Instructors, Students and Teaching Assistants have to register along with their role, to access the system.
- Instructors, Students and Teaching Assistants can login directly using email and password and their role is the same as mentioned during registration.
- One person can register for only a single role using a single email.
- Instructor can create a class and share the class code to the students and TAs so that they can join the class.
- Instructors can mark the questions as answered, unanswered, important or clear the questions
- Clearing the questions hides the sticky notes and can be visible in the "cleared" bucket with archived label
- Instructors cannot add any questions.
- Instructors can join the session using the code after the session.
- Multiple Instructors can join the same session.
- Student can login using the access code of a particular class ask the questions.
- Student cannot mark any question and he can't create any session.
- Users can review the questions after the session by using access code of that particular class.
- TA's can't add a question and can't create a class but can mark the questions as answered or unanswered or Important or clear the questions.
- TA's can use the access code and review the questions later and resolve the issues if had any for the students.
- Our assumption for handling duplicate questions is that - "What is your name" and "What is your name?" (questions with and without question mark) are considered as different questions.
- The backend is always available and connected to the database.
- Each question is associated with a class and has a unique identifier.
- Users are authenticated, so only authorized users can view or post questions.
- The frontend fetches the latest questions from the backend each time the class page is loaded or refreshed.
- There is no local-only (browser) storage for questions; persistence is handled entirely by the backend.

## Implementation Details

## Backend

- Framework: Node.js with Express.js
- Database: MongoDB (Mongoose ODM)
- Key Folders:
  - controllers/: Business logic for auth, lectures, questions
  - models/: Mongoose schemas for User, Lecture, Question
  - routes/: API endpoints for auth, lectures, questions
  - middleware/: Auth middleware for protected routes
  - config/db.js: MongoDB connection setup

## Frontend

- Framework: React.js (functional components, hooks)
- Key Folders:
  - components/: UI components along with styles (ClassCard, ClassRoom, QuestionList, etc.)
  - context/: React context for authentication state
  - utils/api.js: API utility for backend communication

## Features

- User registration/login with role selection
- Class creation/joining
- Real-time Q&A with status and moderation
- Questions as Sticky notes
- Responsive, modern UI

## Setup Steps

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

## Backend Setup

1. Navigate to the backend folder:
   cd VidyaVichara/backend
2. Install dependencies:
   npm install
3. Create a .env file with your MongoDB URI and JWT secret:
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
4. Start the backend server:
   npm start

## Frontend Setup

1. Navigate to the frontend folder:
   cd VidyaVichara/frontend
2. Install dependencies:
   npm install
3. Start the frontend app:
   npm start
4. Open http://localhost:3000 in your browser.

## Notes

- For development, ensure both frontend and backend servers are running.
- Update API endpoints in frontend/src/utils/api.js if backend runs on a different port or host.
- For production, consider environment variables and secure deployment practices.

```

```
