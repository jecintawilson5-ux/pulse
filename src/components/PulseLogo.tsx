import { cn } from "@/lib/utils";

interface PulseLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function PulseLogo({ className, size = "md", showText = true }: PulseLogoProps) {
  const sizes = {
    sm: { box: "w-8 h-8 rounded-lg text-sm", text: "text-lg" },
    md: { box: "w-9 h-9 rounded-[10px] text-[16px]", text: "text-xl" },
    lg: { box: "w-11 h-11 rounded-xl text-xl", text: "text-2xl" },
  };
  const { box, text } = sizes[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center font-display font-extrabold text-primary-foreground shrink-0 shadow-lg shadow-primary/20",
        box
      )}>
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
