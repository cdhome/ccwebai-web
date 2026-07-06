import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlowPanelProps = {
  children: ReactNode;
  className?: string;
};

export default function GlowPanel({ children, className }: GlowPanelProps) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_80px_rgba(10,12,31,0.55)] backdrop-blur-xl",
        className
      )}
    >
      {children}
    </div>
  );
}
