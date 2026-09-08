import Link from "next/link";
import { StaticPage } from "@/components/layout/static-page";

const sections = [
  {
    title: "Getting started",
    items: [
      {
        name: "Create an account",
        body: "Sign up with your email and a strong password. Your ledger starts empty — and beautifully so.",
        href: "/register",
      },
      {
        name: "Add your first account",
        body: "Set up a cash or bank account, then start tracking expenses and income in seconds.",
        href: "/dashboard",
      },
    ],
  },
  {
    title: "Core features",
    items: [
      {
        name: "Transactions",
        body: "Capture expenses and income, categorize automatically, and search across your history.",
        href: "/transactions",
      },
      {
        name: "Budgets",
        body: "Set monthly budgets per category and watch progress bars fill in real time.",
        href: "/budgets",
      },
      {
        name: "Reports",
        body: "Category breakdowns, monthly trends, and savings insights as clean editorial charts.",
        href: "/reports",
      },
      {
        name: "Recurring",
        body: "Define rent, subscriptions, and EMIs once — Ledger creates them on schedule.",
        href: "/recurring",
      },
    ],
  },
  {
    title: "Developers",
    items: [
      {
        name: "API reference",
        body: "Explore the full REST API with interactive Swagger documentation.",
        href: "/api/docs",
      },
      {
        name: "Mobile app",
        body: "Ledger runs on Android, iPhone, tablets, and iPad with a fully responsive experience.",
        href: "/",
      },
    ],
  },
];

export default function DocsPage() {
  return (
    <StaticPage
      title="Documentation"
      subtitle="Everything you need to get the most out of Ledger."
    >
      <div className="flex flex-col gap-10">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-title-lg text-ink mb-4">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="card p-6 hover:shadow-soft transition-shadow"
                >
                  <h3 className="text-title-sm text-ink mb-2">{item.name}</h3>
                  <p className="text-body-sm text-muted leading-relaxed">
                    {item.body}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </StaticPage>
  );
}
