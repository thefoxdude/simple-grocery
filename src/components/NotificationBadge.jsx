import React from 'react';

const NotificationBadge = ({ count }) => {
  if (!count || count <= 0) return null;
  
  return (
    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs 
                  rounded-full w-5 h-5 flex items-center justify-center">
      {count > 9 ? '9+' : count}
    </div>
  );
};

export default NotificationBadge;