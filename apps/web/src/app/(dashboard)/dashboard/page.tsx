import { DashboardWidgets } from "@/components/dashboard/dashboard-widgets";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-display-lg text-ink">Dashboard</h1>
        <p className="mt-1 text-body-sm text-muted">
          A quiet overview of your finances this month.
        </p>
      </div>
      <DashboardWidgets />
    </div>
  );
}
