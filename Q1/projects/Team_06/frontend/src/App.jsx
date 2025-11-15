import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home.jsx'
import CourseDetails from './pages/CourseDetails.jsx'
import Doubts from './pages/Doubts.jsx';
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/Admin.jsx';

function App() {
  const user = useSelector((state) => state.user);

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route element = {<ProtectedRoute isAuthenticated={user.token!==null} />}>
          <Route path="/" element={<Home />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/doubts/:id" element={<Doubts />} />
        </Route>
       
        <Route path="/signin" element={<SignIn />} />  
        <Route path="/signup" element={<SignUp />} />  
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App;
