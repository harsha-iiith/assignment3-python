import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ClassroomPage from './pages/ClassroomPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          {/* Protected Routes */}
          <Route path="" element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/class/:classId" element={<ClassroomPage />} />
            <Route path="/" element={<DashboardPage />} />
          </Route>
        </Routes>
      </main>
    </Router>
  );
}
export default App;