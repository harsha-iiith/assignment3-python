import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { GlobalStyles } from "./styles/GlobalStyles";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Home from "./pages/Home";
import InstructorDashboard from "./pages/InstructorDashboard";
import StudentInterface from "./pages/StudentInterface";
import { USER_ROLES } from "./utils/constants";

// Reset Component for easy app reset
const ResetComponent = () => {
  const { actions } = useApp();

  React.useEffect(() => {
    actions.resetApp();
  }, [actions]);

  return <Navigate to="/" replace />;
};

// Main App Content Component
const AppContent = () => {
  const { state, actions } = useApp();
  const { userRole } = state;

  const handleRoleSelect = (role) => {
    actions.setUserRole(role);
  };

  return (
    <Router>
      <GlobalStyles />
      <ErrorBoundary>
        <Routes>
          <Route
            path="/"
            element={
              userRole ? (
                userRole === USER_ROLES.INSTRUCTOR ? (
                  <Navigate to="/instructor" replace />
                ) : (
                  <Navigate to="/student" replace />
                )
              ) : (
                <Home onRoleSelect={handleRoleSelect} />
              )
            }
          />

          <Route
            path="/instructor"
            element={
              userRole === USER_ROLES.INSTRUCTOR ? (
                <InstructorDashboard />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/student"
            element={
              userRole === USER_ROLES.STUDENT ? (
                <StudentInterface />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Reset route for development */}
          <Route path="/reset" element={<ResetComponent />} />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

// Main App Component with Providers
function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
