const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const app = require("../src/app");
const Participant = require("../src/models/Participant");
const Session = require("../src/models/Session");

let instructorToken, anotherInstructorToken;
let courseName = "System Design";

beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/vidyavichar_test_one_session");
  await Participant.deleteMany({});
  await Session.deleteMany({});

  const passwordHash = await bcrypt.hash("password123", 10);

  // Create first instructor
  await Participant.create({
    id: "inst001",
    name: "Dr. Instructor One",
    email: "instructor1@test.com",
    passwordHash,
    role: "instructor",
    courses: [{ courseName, enrolled: true, isInstructor: true }]
  });

  // Create second instructor for same course
  await Participant.create({
    id: "inst002", 
    name: "Dr. Instructor Two",
    email: "instructor2@test.com",
    passwordHash,
    role: "instructor",
    courses: [{ courseName, enrolled: true, isInstructor: true }]
  });

  // Login both instructors
  const res1 = await request(app)
    .post("/api/auth/login")
    .send({ email: "instructor1@test.com", password: "password123" });
  instructorToken = res1.body.token;

  const res2 = await request(app)
    .post("/api/auth/login") 
    .send({ email: "instructor2@test.com", password: "password123" });
  anotherInstructorToken = res2.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("One Session Per Course Restriction", () => {
  
  test("Should allow creating first session for a course", async () => {
    const res = await request(app)
      .post("/api/sessions")
      .set("Authorization", `Bearer ${instructorToken}`)
      .send({ courseName });

    expect(res.status).toBe(200);
    expect(res.body.courseName).toBe(courseName);
    expect(res.body.status).toBe("live");
  });

  test("Should prevent creating second session when one is already active", async () => {
    const res = await request(app)
      .post("/api/sessions")
      .set("Authorization", `Bearer ${anotherInstructorToken}`)
      .send({ courseName });

    expect(res.status).toBe(409);
    expect(res.body.message).toContain("A live session already exists");
    expect(res.body.existingSession).toBeDefined();
    expect(res.body.existingSession.sessionId).toBeDefined();
  });

  test("Should prevent same instructor from creating another session", async () => {
    const res = await request(app)
      .post("/api/sessions")
      .set("Authorization", `Bearer ${instructorToken}`)
      .send({ courseName });

    expect(res.status).toBe(409);
    expect(res.body.message).toContain("A live session already exists");
  });

  test("Should allow creating new session after ending the existing one", async () => {
    // First, get the existing session ID
    const sessionsRes = await request(app)
      .get("/api/sessions")
      .set("Authorization", `Bearer ${instructorToken}`);
    
    const activeSession = sessionsRes.body.find(s => s.status === "live");
    expect(activeSession).toBeDefined();

    // End the existing session
    const endRes = await request(app)
      .patch(`/api/sessions/${activeSession.sessionId}/end`)
      .set("Authorization", `Bearer ${instructorToken}`);
    
    expect(endRes.status).toBe(200);
    expect(endRes.body.status).toBe("completed");

    // Now try to create a new session - should succeed
    const createRes = await request(app)
      .post("/api/sessions")
      .set("Authorization", `Bearer ${anotherInstructorToken}`)
      .send({ courseName });

    expect(createRes.status).toBe(200);
    expect(createRes.body.courseName).toBe(courseName);
    expect(createRes.body.status).toBe("live");
  });

  test("Should get active session for a course", async () => {
    const res = await request(app)
      .get(`/api/sessions/active/${encodeURIComponent(courseName)}`)
      .set("Authorization", `Bearer ${instructorToken}`);

    expect(res.status).toBe(200);
    expect(res.body.courseName).toBe(courseName);
    expect(res.body.status).toBe("live");
  });

  test("Should return 404 when no active session exists", async () => {
    // End the current session first
    const sessionsRes = await request(app)
      .get("/api/sessions")
      .set("Authorization", `Bearer ${instructorToken}`);
    
    const activeSession = sessionsRes.body.find(s => s.status === "live");
    if (activeSession) {
      await request(app)
        .patch(`/api/sessions/${activeSession.sessionId}/end`)
        .set("Authorization", `Bearer ${instructorToken}`);
    }

    // Now check for active session
    const res = await request(app)
      .get(`/api/sessions/active/${encodeURIComponent(courseName)}`)
      .set("Authorization", `Bearer ${instructorToken}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toContain("No active session found");
  });

  test("Should prevent access to active session if not enrolled", async () => {
    // Create a user not enrolled in the course
    const passwordHash = await bcrypt.hash("password123", 10);
    await Participant.create({
      id: "outsider001",
      name: "Outsider User",
      email: "outsider@test.com", 
      passwordHash,
      role: "student",
      courses: [] // No courses
    });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "outsider@test.com", password: "password123" });
    
    const outsiderToken = loginRes.body.token;

    const res = await request(app)
      .get(`/api/sessions/active/${encodeURIComponent(courseName)}`)
      .set("Authorization", `Bearer ${outsiderToken}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toContain("Not enrolled");
  });

});