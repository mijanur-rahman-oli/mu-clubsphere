const LoadingSpinner = ({ smallHeight }) => {
  return (
    <div
      className={`${smallHeight ? 'h-[250px]' : 'h-[70vh]'}
      flex flex-col justify-center items-center`}
    >
      <div className="relative">
        {/* Outer Ring (Subtle Track) */}
        <div className="w-12 h-12 rounded-full border-4 border-lime-100"></div>
        
        {/* Animated Spinner */}
        <div className="absolute top-0 left-0 w-12 h-12">
          <svg className="animate-spin text-lime-500" viewBox="0 0 24 24">
            <circle
              className="opacity-100"
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="31.4, 31.4" 
              /* This creates a semi-circle effect */
            />
          </svg>
        </div>
      </div>
      
      {/* Optional: Professional Loading Text */}
      <span className="mt-4 text-sm font-medium text-gray-500 tracking-widest uppercase animate-pulse">
        Loading
      </span>
    </div>
  );
};

export default LoadingSpinner;