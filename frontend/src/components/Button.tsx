// SpinnerButton.tsx
import React from "react";

interface SpinnerButtonProps {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
}

const SpinnerButton: React.FC<SpinnerButtonProps> = ({
  children,
  className,
  loading = false,
  disabled = false,
}) => {
  return (
    <button
      className={`w-full relative flex items-center justify-center px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60 ${className || ""}`}
      disabled={loading || disabled}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
        </span>
      )}
      <span className={loading ? "opacity-0" : ""}>{children}</span>
    </button>
  );
};

export default SpinnerButton;