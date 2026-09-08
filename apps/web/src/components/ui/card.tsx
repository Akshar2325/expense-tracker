import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Interactive cards lift softly on hover */
  interactive?: boolean;
}

export function Card({
  className,
  interactive = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface-card rounded-xl border border-hairline",
        interactive &&
          "transition-shadow duration-200 hover:shadow-soft cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function Header({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("px-6 pt-6 pb-4 border-b border-hairline-soft", className)}
    >
      {children}
    </div>
  );
};

Card.Body = function Body({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("p-6", className)}>{children}</div>;
};

Card.Title = function Title({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h3 className={cn("text-title-md text-ink font-sans", className)}>
      {children}
    </h3>
  );
};
