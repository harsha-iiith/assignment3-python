// import React from 'react';
// import { motion } from 'motion/react';
// import { 
//   BarChart3, 
//   Video, 
//   Settings, 
//   Users, 
//   Calendar,
//   MessageCircle,
//   User
// } from 'lucide-react';

// export function Sidebar({ activeItem, onItemClick, isLiveSession = false }) {
//   const menuItems = [
//     { id: 'dashboard', icon: BarChart3, label: 'Dashboard' }
//   ];

//   return (
//     <div className="w-20 bg-card border-r border-border flex flex-col items-center py-6">
//       {/* Logo */}
//       <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-8">
//         <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
//           <div className="w-3 h-3 bg-primary rounded-full"></div>
//         </div>
//       </div>

//       {/* Menu Items */}
//       <div className="flex flex-col gap-4 flex-1">
//         {menuItems.map((item) => {
//           const Icon = item.icon;
//           const isActive = activeItem === item.id;
          
//           return (
//             <motion.button
//               key={item.id}
//               onClick={() => {
//                 if (!isLiveSession) {
//                   onItemClick(item.id);
//                 }
//               }}
//               className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors relative ${
//                 isActive 
//                   ? 'bg-primary text-white' 
//                   : isLiveSession 
//                     ? 'text-muted-foreground cursor-not-allowed opacity-50' 
//                     : 'text-muted-foreground hover:bg-muted hover:text-white'
//               }`}
//               whileHover={{ scale: isLiveSession ? 1 : 1.05 }}
//               whileTap={{ scale: isLiveSession ? 1 : 0.95 }}
//               style={{ cursor: isLiveSession ? 'not-allowed' : 'pointer' }}
//               title={isLiveSession ? "Cannot navigate during live session" : item.label}
//             >
//               <Icon className="w-5 h-5" />
//               {isActive && (
//                 <motion.div
//                   className="absolute -right-4 w-1 h-8 bg-primary rounded-l-full"
//                   layoutId="activeIndicator"
//                 />
//               )}
//             </motion.button>
//           );
//         })}
//       </div>

//       {/* User Profile */}
//       <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
//         <User className="w-5 h-5 text-muted-foreground" />
//       </div>
//     </div>
//   );
// }

import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Video, 
  Settings, 
  Users, 
  Calendar,
  MessageCircle,
  User
} from 'lucide-react';

export function Sidebar({ activeItem, onItemClick, onBack }) {
  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' }
  ];

  return (
    <div className="w-20 bg-card border-r border-border flex flex-col items-center py-6">
      {/* Logo */}
      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-8">
        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col gap-4 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          // If dashboard button, call onBack if provided
          const handleClick = item.id === 'dashboard' && typeof onBack === 'function'
            ? () => {
                onItemClick(item.id);
                onBack();
              }
            : () => onItemClick(item.id);
          return (
            <motion.button
              key={item.id}
              onClick={handleClick}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors relative ${
                isActive 
                  ? 'bg-primary text-white' 
                  : 'text-muted-foreground hover:bg-muted hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-5 h-5" />
              {isActive && (
                <motion.div
                  className="absolute -right-4 w-1 h-8 bg-primary rounded-l-full"
                  layoutId="activeIndicator"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* User Profile */}
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
        <User className="w-5 h-5 text-muted-foreground" />
      </div>
    </div>
  );
}