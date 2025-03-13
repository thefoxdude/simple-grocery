import React from 'react';
import NotificationBadge from './NotificationBadge';

export const TabButton = ({ icon: Icon, label, isActive, onClick, notificationCount }) => {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center px-6 py-3
                        border-b-2 transition-all duration-200
                        ${isActive 
                            ? 'border-emerald-500 text-emerald-700 dark:text-emerald-400' 
                            : 'border-transparent text-emerald-600 dark:text-emerald-500 hover:text-emerald-500 dark:hover:text-emerald-400'}
                            text-lg`}
            aria-selected={isActive}
            role="tab"
        >
            <div className="relative">
                <Icon className={`mb-1 transition-colors duration-200
                            ${isActive ? 'text-emerald-500 dark:text-emerald-400' : ''}`} 
                            size={24} />
                <NotificationBadge count={notificationCount} />
            </div>
            <span className="hidden sm:block font-medium mt-1">{label}</span>
        </button>
    );
};