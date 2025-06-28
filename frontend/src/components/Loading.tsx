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
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Main content */}
      <div className={loading ? "blur-sm pointer-events-none" : ""}>
        {children}
      </div>
    </div>
  );
};

export default BlurLoadingOverlay;