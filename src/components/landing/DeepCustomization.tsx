import Link from "next/link";

interface CustomCapability {
  title: string;
  description: string;
}

interface EngineeringOutcome {
  title: string;
  description: string;
}

const customCapabilities = [
  {
    title: "Mechanical Dimensions",
    description: "Custom glass shapes, specific FPC lengths, and tailored bezels.",
  },
  {
    title: "Optical Adjustments",
    description: "Sunlight-readable backlights (1000+ nits) and custom viewing angles.",
  },
  {
    title: "Bespoke PCBA",
    description: "Complete motherboard design with tailored interfaces (SPI, RGB, MIPI).",
  },
  {
    title: "Extreme Environments",
    description: "Wide-temperature fluids (-30\u00B0C to 80\u00B0C) and anti-UV glass.",
  },
  {
    title: "EMI Shielding",
    description: "Advanced anti-interference designs for strict medical and industrial certs.",
  },
  {
    title: "Low NRE & Fast Samples",
    description: "Highly affordable tooling costs and rapid prototype delivery.",
  },
] as const satisfies readonly CustomCapability[];

const engineeringOutcomes = [
  {
    title: "EV Charger",
    description: "1000-nits FSTN engineered for high-readability outdoor charging interfaces.",
  },
  {
    title: "Medical Ventilator UI",
    description: "Custom PCBA with strict EMI shielding, passing rigorous healthcare certs.",
  },
  {
    title: "Smart Meter",
    description: "Low-power custom FPC design for compact industrial metering hardware.",
  },
] as const satisfies readonly EngineeringOutcome[];

export function DeepCustomization() {
  return (
    <section
      id="deep-customization"
      aria-labelledby="deep-customization-title"
      className="relative flex min-h-[75vh] scroll-mt-32 items-center overflow-hidden bg-slate-50 px-6 py-20 sm:px-8 lg:min-h-[85vh] lg:px-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_20%,rgba(37,99,235,0.1),transparent_32%),radial-gradient(circle_at_88%_72%,rgba(14,165,233,0.12),transparent_28%)]"
      />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-8">
          <p className="mb-4 text-sm font-semibold tracking-[0.18em] text-blue-700 uppercase">
            Custom Engineering
          </p>
          <h2
            id="deep-customization-title"
            className="mb-4 max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl"
          >
            Deep Customization. Engineered to Your Specs.
          </h2>
          <p className="mb-10 max-w-3xl text-lg leading-relaxed text-slate-600">
            We don&apos;t just sell standard panels. We resolve your toughest hardware challenges
            with complete end-to-end customization, turning raw concepts into mass-produced
            reality.
          </p>

          <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
            {customCapabilities.map((capability) => (
              <article key={capability.title} className="flex gap-3">
                <CheckIcon />
                <div>
                  <h3 className="mb-1 text-base font-bold tracking-normal text-slate-800">
                    {capability.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {capability.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="flex flex-col justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50 lg:col-span-4">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h3 className="text-lg font-bold tracking-normal text-slate-900">
              Recent Engineering Outcomes
            </h3>
            <Link
              href="/solutions"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 transition hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              View All
              <svg
                viewBox="0 0 20 20"
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 10h11M11 5l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          <div className="space-y-6">
            {engineeringOutcomes.map((outcome) => (
              <article key={outcome.title}>
                <h4 className="mb-1 text-sm font-bold tracking-normal text-slate-800">
                  {outcome.title}
                </h4>
                <p className="text-sm leading-relaxed text-slate-500">{outcome.description}</p>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m4.5 10.5 3.3 3.3 7.7-8.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
