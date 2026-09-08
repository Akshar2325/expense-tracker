import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  items: {
    href: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    active?: boolean;
  }[];
  className?: string;
}

export function SidebarNav({ items, className }: SidebarNavProps) {
  return (
    <aside
      className={cn(
        "w-60 shrink-0 border-r border-hairline-soft bg-canvas sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto",
        className,
      )}
    >
      <nav className="py-6 px-3 flex flex-col gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm font-medium transition-colors",
                item.active
                  ? "bg-surface-strong text-ink"
                  : "text-muted hover:text-ink hover:bg-surface-strong/60",
              )}
            >
              {Icon && <Icon className="h-4.5 w-4.5" />}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
