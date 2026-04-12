import { cn } from "@/lib/utils";

interface CognaraLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function CognaraLogo({ className, size = "md", showText = true }: CognaraLogoProps) {
  const sizes = {
    sm: { svg: 28, text: "text-lg", gap: "gap-2" },
    md: { svg: 36, text: "text-xl", gap: "gap-2.5" },
    lg: { svg: 48, text: "text-2xl", gap: "gap-3" },
  };
  const { svg: svgSize, text, gap } = sizes[size];

  return (
    <div className={cn("flex items-center", gap, className)}>
      <svg
        width={svgSize}
        height={svgSize}
        viewBox="0 0 140 140"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Constellation lines */}
        <line x1="70" y1="28" x2="70" y2="52" stroke="currentColor" strokeWidth="2" opacity="0.55" className="text-primary" />
        <line x1="36" y1="108" x2="56" y2="88" stroke="currentColor" strokeWidth="2" opacity="0.55" className="text-primary" />
        <line x1="104" y1="108" x2="84" y2="88" stroke="currentColor" strokeWidth="2" opacity="0.55" className="text-primary" />
        <line x1="112" y1="45" x2="88" y2="65" stroke="currentColor" strokeWidth="1.5" opacity="0.4" className="text-primary" />
        <line x1="70" y1="26" x2="112" y2="45" stroke="currentColor" strokeWidth="1.5" opacity="0.35" className="text-primary" />
        {/* Glow */}
        <circle cx="70" cy="70" r="20" className="fill-primary" opacity="0.15" />
        {/* Center node */}
        <circle cx="70" cy="70" r="13" className="fill-primary" />
        {/* Satellite nodes */}
        <circle cx="70" cy="20" r="8" className="fill-primary" opacity="0.85" />
        <circle cx="28" cy="114" r="7" className="fill-primary" opacity="0.75" />
        <circle cx="112" cy="114" r="7" className="fill-primary" opacity="0.75" />
        <circle cx="120" cy="38" r="5.5" className="fill-primary" opacity="0.6" />
        {/* Center letter */}
        <text
          x="70"
          y="75"
          fontFamily="'Palatino Linotype',Palatino,Georgia,serif"
          fontSize="15"
          fontWeight="400"
          className="fill-primary-foreground"
          textAnchor="middle"
        >
          C
        </text>
      </svg>
      {showText && (
        <span className={cn("font-display font-bold tracking-tight text-foreground", text)}>
          Cognara
        </span>
      )}
    </div>
  );
}
