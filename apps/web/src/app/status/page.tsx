import { StaticPage } from "@/components/layout/static-page";

const services = [
  {
    name: "Web app",
    status: "Operational",
    detail: "All systems normal",
    ok: true,
  },
  {
    name: "API",
    status: "Operational",
    detail: "All endpoints responding",
    ok: true,
  },
  {
    name: "Database",
    status: "Operational",
    detail: "PostgreSQL healthy",
    ok: true,
  },
  {
    name: "Mobile app",
    status: "Operational",
    detail: "Android, iOS, tablets & iPad",
    ok: true,
  },
];

export default function StatusPage() {
  return (
    <StaticPage
      title="System Status"
      subtitle="Live health of the Ledger platform."
    >
      <div className="flex flex-col gap-4">
        {services.map((s) => (
          <div
            key={s.name}
            className="card p-6 flex items-center justify-between"
          >
            <div>
              <h3 className="text-title-sm text-ink">{s.name}</h3>
              <p className="text-body-sm text-muted mt-1">{s.detail}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  s.ok ? "bg-semantic-success" : "bg-semantic-error"
                }`}
              />
              <span className="text-body-sm text-body-strong">{s.status}</span>
            </div>
          </div>
        ))}
      </div>
    </StaticPage>
  );
}
