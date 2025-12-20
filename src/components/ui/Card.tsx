import { ReactNode } from "react";

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
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={`px-5 py-4 border-b border-zinc-800 ${className}`}>
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