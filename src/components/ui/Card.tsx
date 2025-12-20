import { ReactNode, MouseEventHandler } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning" | "danger";
}

export function Card({ children, className = "", variant = "default" }: CardProps) {
  const variants = {
    default: "border-zinc-800",
    success: "border-green-500/50",
    warning: "border-amber-500/50",
    danger: "border-red-500/50",
  };

  return (
    <div className={`bg-zinc-900 rounded-xl border ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export function CardHeader({ children, className = "", onClick }: CardHeaderProps) {
  return (
    <div 
      className={`px-5 py-4 border-b border-zinc-800 ${onClick ? "cursor-pointer hover:bg-zinc-800/50 transition-colors" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}