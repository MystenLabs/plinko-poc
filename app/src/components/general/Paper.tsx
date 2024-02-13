import React from "react";

interface PaperProps {
  className?: string;
  children: React.ReactNode | React.ReactNode[];
}

export const Paper = ({ className = "", children }: PaperProps) => {
  return (
    <div
      className={`min-w-[200px] max-w-full p-2 md:p-5 bg-opacity-0 shadow-xl rounded-xl ${className} `}
    >
      {children}
    </div>
  );
};
