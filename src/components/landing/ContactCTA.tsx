export function ContactCTA() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-cta-title"
      className="relative overflow-hidden bg-gradient-to-br from-[#1a365d] via-[#102747] to-[#061525] px-6 py-20 text-white sm:px-8 lg:px-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(144,224,239,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(144,224,239,0.22) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h2
          id="contact-cta-title"
          className="text-3xl font-semibold leading-tight tracking-normal sm:text-4xl lg:text-5xl"
        >
          Ready to Start Your Custom Display Project?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
          Get a quote within 24 hours. Our R&amp;D team is ready to assist you with custom LCD,
          LCM, and PCBA solutions.
        </p>

        <a
          href="mailto:contact@nelytech.com"
          className="mt-9 inline-flex items-center justify-center gap-3 rounded-md bg-yellow-400 px-7 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-yellow-400/20 outline-none transition duration-200 hover:scale-105 hover:bg-yellow-300 hover:shadow-xl hover:shadow-yellow-400/30 focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#102747]"
        >
          <EnvelopeIcon className="h-5 w-5" />
          Contact Our Engineers Today
        </a>
      </div>
    </section>
  );
}

interface IconProps {
  className?: string;
}

function EnvelopeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M4.5 6.5h15v11h-15v-11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m5 7 7 5 7-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
