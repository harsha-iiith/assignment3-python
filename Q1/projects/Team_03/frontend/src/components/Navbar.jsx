import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { UserContext } from '../contexts/userContext';

import { CircleUserRound, GraduationCap } from 'lucide-react'; 


function Navbar() {
  const navigate = useNavigate();
  const {setUser} = useContext(UserContext);

  // logout handler
  const handleLogout = () => {
    setUser(null); // Clear the user context
    navigate('/login', { replace: true }); // redirect to login
  };

  
  // go to profile page
  const handleProfileClick = () => {
    navigate('/user/profile'); 
  };

  return (
    
    <div className="w-full bg-white/95 backdrop-blur-sm h-[60px] text-gray-800 p-4 border-b-2 border-gray-200 shadow-xl fixed top-0 z-10">
      <div className="max-w-6xl mx-auto flex justify-between items-center h-full">
        
        {/* logo / dashboard navigation */}
        <div
          id="logo"
         
          className="flex items-center text-2xl font-extrabold tracking-widest text-gray-900 cursor-pointer" 
          onClick={() => navigate('/user/dashboard')}
        >
          
          <GraduationCap 
            className="h-7 w-7 mr-2 text-black-600" 
            strokeWidth={2.5} 
          />
          
       
          <span className="text-black font-bold">
              Vidya Vichar
          </span>
        </div>
        
        
        <div id="navlinks" className="flex flex-row gap-4 items-center">
          
          {/* profile button */}
          <button
            onClick={handleProfileClick}
            className="text-gray-600 hover:text-gray-800 transition-colors duration-300 p-1 rounded-full focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50"
            title="Profile"
          >
            <CircleUserRound className="h-6 w-6" />
          </button>
          
          {/* logout button */}
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 text-sm font-semibold rounded-lg shadow-md
                      bg-gradient-to-r from-gray-100 to-gray-200
                      text-gray-800
                      hover:from-purple-100 hover:to-purple-200 hover:text-purple-700
                      transition-all duration-300 ease-in-out
                      focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
          >
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}

export default Navbar;