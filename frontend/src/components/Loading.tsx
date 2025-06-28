// BlurLoadingOverlay.tsx
import React from "react";

interface BlurLoadingOverlayProps {
  loading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
}

const BlurLoadingOverlay: React.FC<BlurLoadingOverlayProps> = ({
  loading,
  children,
  loadingText = "Loading...",
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Main content */}
      <div className={loading ? "blur-sm pointer-events-none" : ""}>
        {children}
      </div>
      
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="flex flex-col items-center justify-center gap-4 bg-white rounded-lg shadow-lg p-8">
            <div className="animate-spin h-8 w-8 border-3 border-blue-600 border-t-transparent rounded-full"></div>
            <span className="text-lg font-medium text-gray-700">{loadingText}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlurLoadingOverlay;