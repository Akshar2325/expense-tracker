import { StaticPage } from "@/components/layout/static-page";

export default function PrivacyPage() {
  return (
    <StaticPage
      title="Privacy Policy"
      subtitle="Your data stays yours. Here's exactly what we collect and why."
    >
      <div className="flex flex-col gap-8">
        <section>
          <h2 className="text-title-lg text-ink mb-3">What we collect</h2>
          <p className="text-body-md text-body leading-relaxed">
            We collect only what is necessary to run your ledger: your name,
            email address, and the financial records you create (accounts,
            transactions, budgets, and categories).
          </p>
        </section>
        <section>
          <h2 className="text-title-lg text-ink mb-3">What we never do</h2>
          <ul className="space-y-3 text-body-md text-body">
            <li>We never sell your personal or financial data.</li>
            <li>We never show third-party ads.</li>
            <li>We never share your data with analytics trackers.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-title-lg text-ink mb-3">How we protect it</h2>
          <p className="text-body-md text-body leading-relaxed">
            Passwords are hashed with Argon2id. Sessions use short-lived JWT
            access tokens with rotating refresh tokens. Data is transmitted over
            TLS.
          </p>
        </section>
        <section>
          <h2 className="text-title-lg text-ink mb-3">Your control</h2>
          <p className="text-body-md text-body leading-relaxed">
            You can export your data at any time, and deleting your account
            permanently removes all associated records.
          </p>
        </section>
      </div>
    </StaticPage>
  );
}
