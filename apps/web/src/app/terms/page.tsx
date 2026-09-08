import { StaticPage } from "@/components/layout/static-page";

export default function TermsPage() {
  return (
    <StaticPage
      title="Terms of Service"
      subtitle="The simple rules that keep Ledger fair for everyone."
    >
      <div className="flex flex-col gap-8">
        <section>
          <h2 className="text-title-lg text-ink mb-3">1. Your account</h2>
          <p className="text-body-md text-body leading-relaxed">
            You are responsible for keeping your credentials secure and for all
            activity under your account. You must be at least 13 years old to
            use Ledger.
          </p>
        </section>
        <section>
          <h2 className="text-title-lg text-ink mb-3">2. Acceptable use</h2>
          <p className="text-body-md text-body leading-relaxed">
            Use Ledger for lawful personal finance management. Do not attempt to
            disrupt the service, access other users' data, or misuse the API.
          </p>
        </section>
        <section>
          <h2 className="text-title-lg text-ink mb-3">3. Data & privacy</h2>
          <p className="text-body-md text-body leading-relaxed">
            Your data belongs to you. We process it only to provide the service,
            as described in our Privacy Policy.
          </p>
        </section>
        <section>
          <h2 className="text-title-lg text-ink mb-3">4. Termination</h2>
          <p className="text-body-md text-body leading-relaxed">
            You may delete your account at any time. We may suspend accounts
            that violate these terms.
          </p>
        </section>
        <section>
          <h2 className="text-title-lg text-ink mb-3">5. Changes</h2>
          <p className="text-body-md text-body leading-relaxed">
            We may update these terms from time to time. Continued use of Ledger
            after changes constitutes acceptance.
          </p>
        </section>
      </div>
    </StaticPage>
  );
}
