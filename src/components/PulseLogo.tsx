import { cn } from "@/lib/utils";

interface PulseLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  showText?: boolean;
}

export function PulseLogo({ className, size = "md", animated = true, showText = true }: PulseLogoProps) {
  const sizes = {
    sm: { svg: 28, text: "text-lg" },
    md: { svg: 36, text: "text-xl" },
    lg: { svg: 48, text: "text-3xl" },
  };
  const { svg, text } = sizes[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width={svg}
        height={svg}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Outer glow ring */}
        <circle
          cx="24"
          cy="24"
          r="22"
          className="stroke-primary/20"
          strokeWidth="2"
          fill="none"
        >
          {animated && (
            <animate
              attributeName="r"
              values="20;22;20"
              dur="3s"
              repeatCount="indefinite"
            />
          )}
        </circle>

        {/* Main circle */}
        <circle
          cx="24"
          cy="24"
          r="18"
          className="fill-primary"
        >
          {animated && (
            <animate
              attributeName="opacity"
              values="1;0.85;1"
              dur="3s"
              repeatCount="indefinite"
            />
          )}
        </circle>

        {/* Pulse wave (ECG-like line) */}
        <path
          d="M10 24 L17 24 L20 16 L24 32 L28 16 L31 24 L38 24"
          className="stroke-primary-foreground"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {animated && (
            <animate
              attributeName="stroke-dashoffset"
              from="60"
              to="0"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
          {animated && (
            <animate
              attributeName="stroke-dasharray"
              values="0 60;60 0;60 0"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </path>

        {/* Bold P letter */}
        <text
          x="24"
          y="25"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-primary-foreground"
          fontWeight="800"
          fontSize="14"
          fontFamily="system-ui, sans-serif"
          opacity="0"
        >
          P
        </text>
      </svg>

      {showText && (
        <span className={cn("font-bold tracking-tight text-foreground", text)}>
          Pulse
        </span>
      )}
    </div>
  );
}
