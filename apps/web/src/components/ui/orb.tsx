import { cn } from "@/lib/utils";

type OrbColor = "mint" | "peach" | "lavender" | "sky" | "rose";

const orbColors: Record<OrbColor, string> = {
  mint: "gradient-orb-mint",
  peach: "gradient-orb-peach",
  lavender: "gradient-orb-lavender",
  sky: "gradient-orb-sky",
  rose: "gradient-orb-rose",
};

interface GradientOrbProps {
  color?: OrbColor;
  className?: string;
  delay?: string;
}

/** Atmospheric decorative gradient orb — pure ambiance, never functional */
export function GradientOrb({
  color = "mint",
  className,
  delay = "0s",
}: GradientOrbProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("gradient-orb", orbColors[color], className)}
      style={{ animationDelay: delay }}
    />
  );
}

interface GradientOrbCardProps {
  color?: OrbColor;
  className?: string;
  children: React.ReactNode;
}

/** Extra-soft card hosting an atmospheric gradient orb behind content */
export function GradientOrbCard({
  color = "mint",
  className,
  children,
}: GradientOrbCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xxl bg-canvas-soft p-xl",
        className,
      )}
    >
      <GradientOrb color={color} className="-top-16 -right-16 w-64 h-64" />
      <GradientOrb
        color={color === "mint" ? "peach" : "mint"}
        className="-bottom-20 -left-16 w-56 h-56"
        delay="6s"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
