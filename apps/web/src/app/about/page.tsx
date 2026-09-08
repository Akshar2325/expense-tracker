import { StaticPage } from "@/components/layout/static-page";

export default function AboutPage() {
  return (
    <StaticPage
      title="About Ledger"
      subtitle="A calm, private expense tracker. Built with care, designed with restraint."
    >
      <div className="flex flex-col gap-8">
        <section>
          <h2 className="text-title-lg text-ink mb-3">Our story</h2>
          <p className="text-body-md text-body leading-relaxed">
            Ledger began with a simple frustration: personal finance tools are
            loud, cluttered, and designed to keep you staring at screens. We
            wanted something quieter — a ledger that reads like a well-edited
            magazine, not a spreadsheet.
          </p>
          <p className="mt-4 text-body-md text-body leading-relaxed">
            Every rupee you track, every budget you set, every report you read
            is rendered with editorial clarity. No noise, no neon, just clarity.
          </p>
        </section>
        <section>
          <h2 className="text-title-lg text-ink mb-3">Our principles</h2>
          <ul className="space-y-3 text-body-md text-body">
            <li>
              <strong className="text-body-strong">Private by design.</strong>{" "}
              Argon2id password hashing, JWT sessions, and your data stays
              yours. No ads, no selling data, ever.
            </li>
            <li>
              <strong className="text-body-strong">Calm by default.</strong>{" "}
              Soft gradients, curved edges, and a restrained palette keep the
              experience gentle.
            </li>
            <li>
              <strong className="text-body-strong">Everywhere you are.</strong>{" "}
              Web, Android, iPhone, tablet, and iPad — your ledger is always
              current.
            </li>
          </ul>
        </section>
      </div>
    </StaticPage>
  );
}
