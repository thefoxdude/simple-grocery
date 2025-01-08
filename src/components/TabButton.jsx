export const TabButton = ({ icon: Icon, label, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center px-6 py-3
                        border-b-2 transition-all duration-200
                        ${isActive 
                            ? 'border-emerald-500 text-emerald-700' 
                            : 'border-transparent text-emerald-600 hover:text-emerald-500'}`}
            aria-selected={isActive}
            role="tab"
        >
        <Icon className={`h-5 w-5 mb-1 transition-colors duration-200
                        ${isActive ? 'text-emerald-500' : ''}`} />
        <span className="font-medium">{label}</span>
        </button>
    );
};