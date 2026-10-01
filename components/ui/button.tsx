"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-slate-100 text-slate-950 hover:bg-white",
  secondary: "border border-slate-800/80 bg-white/5 text-slate-100 hover:bg-white/10",
  ghost: "text-slate-400 hover:bg-white/5 hover:text-slate-100",
  danger: "border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

/** Class string for anchors/links that should look and feel like a Button. */
export function buttonStyles(variant: ButtonVariant = "primary", size: ButtonSize = "md") {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium whitespace-nowrap",
    "transition-[background-color,color,transform] duration-200 ease-out-expo active:scale-[0.98]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
  );
}

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(buttonStyles(variant, size), className)}
      {...props}
    />
  );
}
