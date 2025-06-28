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

      {/* Centered spinning loader overlay */}
      {/* {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full border-4 border-blue-600 border-t-transparent h-16 w-16"></div>
            <span className="text-lg font-medium text-gray-700">{loadingText}</span>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default BlurLoadingOverlay;