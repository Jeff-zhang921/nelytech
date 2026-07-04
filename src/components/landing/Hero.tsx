import Image from "next/image";

const INTRO_COPY =
  "Sir, what are you looking for? Lcd & lcms? Ok, just take a seat and have a cup of tea. To calm down and to reach far...... now let's talk about LCD & LCM Solutions. NELYTECH is very famous for its R&D ability, prices, services and speed. Tell us your requirement, your troubles or just your ideas, NELYTECH will give you the best solutions.";

export interface HeroProps {
  eyebrow?: string;
  title?: string;
  intro?: string;
}

export function Hero({
  eyebrow = "LCD & LCM Solutions",
  title = "NELYTECH",
  intro = INTRO_COPY,
}: HeroProps) {
  return (
    <section
      id="about-us"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[76svh] scroll-mt-32 overflow-hidden bg-slate-950 text-white"
      style={{ position: "relative" }}
    >
      <Image
        src="/images/lcd-lcm-hero.png"
        alt="LCD and LCM display modules on an electronics engineering bench"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-slate-950/72" />

      <div className="mx-auto flex w-full max-w-7xl items-center px-6 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="max-w-4xl">
          <p className="mb-5 text-sm font-semibold tracking-[0.28em] text-teal-200 uppercase">
            {eyebrow}
          </p>
          <h1
            id="hero-title"
            className="max-w-3xl text-6xl font-semibold leading-none tracking-normal text-white sm:text-7xl lg:text-8xl"
          >
            {title}
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-100 sm:text-xl sm:leading-9">
            {intro}
          </p>
        </div>
      </div>
    </section>
  );
}
