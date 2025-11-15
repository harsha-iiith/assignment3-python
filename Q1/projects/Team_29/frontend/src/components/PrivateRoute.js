import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/authSlice';

const PrivateRoute = () => {
  const user = useSelector(selectCurrentUser);
  return user ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default PrivateRoute;