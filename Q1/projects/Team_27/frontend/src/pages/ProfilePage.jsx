import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { getUserProfile } from "../api/userApi";

export default function ProfilePage() {
  const { user } = useAuthContext();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile();
        setProfileData(data);
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile information");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const getRoleName = (role) => {
    if (role === "instructor") return "Professor";
    if (role === "student") return "Student";
    return role;
  };

  if (loading) {
    return (
      <div className="container fade-in">
        <div className="text-center" style={{ padding: "var(--space-8)" }}>
          <div className="spinner"></div>
          <p style={{ marginTop: "var(--space-4)", color: "var(--text-secondary)" }}>
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container fade-in">
        <div className="card text-center">
          <div style={{ padding: "var(--space-8)", color: "var(--error-color)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>⚠️</div>
            <h3>Error Loading Profile</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="container fade-in">
        <div className="card text-center">
          <div style={{ padding: "var(--space-8)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>👤</div>
            <h3>No Profile Data</h3>
            <p style={{ color: "var(--text-secondary)" }}>
              No profile information available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <div className="text-center mb-8">
        <h1>My Profile</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem" }}>
          Your account information and course enrollments
        </p>
      </div>

      {/* Basic Information Card */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="card-title">Basic Information</h2>
          <p className="card-subtitle">Your personal details</p>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "var(--space-4)", alignItems: "center" }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "var(--primary-gradient)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "2rem",
            fontWeight: "600"
          }}>
            {profileData.name.charAt(0).toUpperCase()}
          </div>
          
          <div>
            <h3 style={{ margin: 0, marginBottom: "var(--space-2)", color: "var(--text-primary)" }}>
              {profileData.name}
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
              <span style={{ color: "var(--text-secondary)" }}>📧 {profileData.email}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <span style={{
                background: "var(--primary-gradient)",
                color: "white",
                padding: "var(--space-1) var(--space-3)",
                borderRadius: "var(--radius-md)",
                fontSize: "0.875rem",
                fontWeight: "500"
              }}>
                {getRoleName(profileData.role)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Card */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="card-title">
            Course Enrollments
            {profileData.courses && (
              <span style={{ 
                background: "var(--primary-color)", 
                color: "white", 
                borderRadius: "var(--radius-md)", 
                padding: "0.25rem 0.5rem", 
                fontSize: "0.75rem", 
                marginLeft: "var(--space-2)" 
              }}>
                {profileData.courses.length}
              </span>
            )}
          </h2>
          <p className="card-subtitle">Your registered courses and roles</p>
        </div>

        {!profileData.courses || profileData.courses.length === 0 ? (
          <div style={{ textAlign: "center", padding: "var(--space-8)" }}>
            <div style={{ fontSize: "3rem", color: "var(--text-muted)", marginBottom: "var(--space-4)" }}>📚</div>
            <h3 style={{ color: "var(--text-muted)" }}>No Course Enrollments</h3>
            <p style={{ color: "var(--text-secondary)" }}>
              You are not enrolled in any courses yet.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "var(--space-4)" }}>
            {profileData.courses.map((course, index) => (
              <div key={index} style={{
                padding: "var(--space-4)",
                background: "var(--background-secondary)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 style={{ margin: 0, marginBottom: "var(--space-2)", color: "var(--text-primary)" }}>
                      {course.courseName}
                    </h4>
                    <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                      {course.isInstructor ? (
                        <span style={{
                          background: "var(--success-color)",
                          color: "white",
                          padding: "var(--space-1) var(--space-2)",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.75rem",
                          fontWeight: "500"
                        }}>
                          �‍🏫 Instructor
                        </span>
                      ) : course.isTA ? (
                        <span style={{
                          background: "var(--warning-color)",
                          color: "white",
                          padding: "var(--space-1) var(--space-2)",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.75rem",
                          fontWeight: "500"
                        }}>
                          🎓 Teaching Assistant
                        </span>
                      ) : course.enrolled ? (
                        <span style={{
                          background: "var(--info-color)",
                          color: "white",
                          padding: "var(--space-1) var(--space-2)",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.75rem",
                          fontWeight: "500"
                        }}>
                          📖 Student
                        </span>
                      ) : (
                        <span style={{
                          background: "var(--text-muted)",
                          color: "white",
                          padding: "var(--space-1) var(--space-2)",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.75rem",
                          fontWeight: "500"
                        }}>
                          ❌ Not Enrolled
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: "2rem" }}>
                    {course.isInstructor ? "👨‍🏫" : course.isTA ? "🎓" : "📚"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account Details Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Account Details</h2>
          <p className="card-subtitle">System information</p>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)" }}>
          <div style={{ textAlign: "center", padding: "var(--space-4)" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "var(--space-2)" }}>🆔</div>
            <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "var(--space-1)" }}>User ID</div>
            <div style={{ fontFamily: "monospace", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              {profileData.id}
            </div>
          </div>
          
          <div style={{ textAlign: "center", padding: "var(--space-4)" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "var(--space-2)" }}>📅</div>
            <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "var(--space-1)" }}>Member Since</div>
            <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              {profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : "Unknown"}
            </div>
          </div>
          
          <div style={{ textAlign: "center", padding: "var(--space-4)" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "var(--space-2)" }}>🔄</div>
            <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "var(--space-1)" }}>Last Updated</div>
            <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              {profileData.updatedAt ? new Date(profileData.updatedAt).toLocaleDateString() : "Unknown"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}