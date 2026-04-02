import { cn } from "@/lib/utils";

interface PulseLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function PulseLogo({ className, size = "md", showText = true }: PulseLogoProps) {
  const sizes = {
    sm: { box: "w-7 h-7 rounded-lg text-xs", text: "text-base" },
    md: { box: "w-8 h-8 rounded-[9px] text-[15px]", text: "text-lg" },
    lg: { box: "w-10 h-10 rounded-[10px] text-lg", text: "text-xl" },
  };
  const { box, text } = sizes[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className={cn("bg-primary flex items-center justify-center font-display font-extrabold text-primary-foreground shrink-0", box)}>
        P
      </div>
      {showText && (
        <span className={cn("font-display font-bold tracking-tight text-foreground", text)}>
          Pulse
        </span>
      )}
    </div>
  );
}
