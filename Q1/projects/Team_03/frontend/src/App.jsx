import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useContext } from "react";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ProfilePage from "./components/ProfilePage";
import ClassPage from "./components/ClassPage";
import { UserContext } from "./contexts/userContext";

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useContext(UserContext);

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}

function MainLayout() {
  const location = useLocation();

  // Pages where Navbar should NOT appear
  const hideNavbarPaths = ["/login", "/signup"];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {!shouldHideNavbar && <div style={{ marginTop: 60 }}></div>}

      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups/:classId"
          element={
            <ProtectedRoute>
              <ClassPage />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={<p className="text-center mt-20 text-red-600">Page not found</p>}
        />
      </Routes>
    </>
  );
}

export default App;
