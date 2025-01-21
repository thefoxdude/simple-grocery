export const TabButton = ({ icon: Icon, label, isActive, onClick }) => {
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
            <Icon className={`mb-1 transition-colors duration-200
                            ${isActive ? 'text-emerald-500 dark:text-emerald-400' : ''}`} 
                            size={32} />
            <span className="font-medium">{label}</span>
        </button>
    );
};