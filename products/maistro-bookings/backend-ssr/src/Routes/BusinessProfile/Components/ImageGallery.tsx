import React, { useMemo, useState, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import ImagePlaceHolder from "./ImagePlaceHolder";

type Locale = "es" | "en";

export type GalleryHeroProps = {
  main?: string | null;
  gallery?: string[];
  businessName: string;
  locale?: Locale; // "es" por defecto
  className?: string;
};

const galleryDict = {
  es: { open: "Ampliar imagen", close: "Cerrar", next: "Siguiente", prev: "Anterior" },
  en: { open: "Expand image", close: "Close", next: "Next", prev: "Previous" },
} as const;

const cx = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(" ");
const toAbs = (u?: string | null) => (!u ? "" : /^https?:\/\//i.test(u) ? u : `https://${u}`);

export function BusinessGalleryHero({ main, gallery = [], businessName, locale = "es", className }: GalleryHeroProps) {
  const t = galleryDict[locale];

  // principal + galería, sin duplicados y absolutas
  const images = useMemo(() => {
    const raw = [main, ...gallery].filter(Boolean) as string[];
    const uniq: string[] = [];
    for (const u of raw) {
      const abs = toAbs(u);
      if (abs && !uniq.includes(abs)) uniq.push(abs);
    }
    return uniq;
  }, [main, gallery]);

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const has = images.length > 0;
  const heroSrc = has ? images[0] : "";

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  // Carrusel móvil (scroll suave)
  const railRef = useRef<HTMLDivElement | null>(null);
  const scrollBy = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const delta = Math.floor(el.clientWidth * 0.9) * dir;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section className={cx("space-y-4", className)}>
      {/* Hero */}
      {heroSrc ? (
        <button
          type="button"
          onClick={() => openAt(0)}
          aria-label={t.open}
          className="group relative block w-full overflow-hidden rounded-2xl"
        >
          <img
            src={heroSrc}
            alt={businessName}
            className="h-[38vh] w-full rounded-2xl object-cover sm:h-[48vh] lg:h-[56vh]"
          />
          <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/5" />
          <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-lg bg-black/70 px-2 py-1 text-xs font-medium text-white">
            <Maximize2 className="h-4 w-4" /> {images.length}
          </div>
        </button>
      ) : (
        <ImagePlaceHolder name={businessName} />
      )}

      {/* Galería: desktop grid / móvil carrusel */}
      {images.length > 1 ? (
        <>
          {/* Desktop */}
          <div className="hidden lg:grid grid-cols-4 gap-4">
            {images.slice(1, 5).map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => openAt(i + 1)}
                className="group relative block w-full overflow-hidden rounded-xl"
              >
                <img src={src} alt={`${businessName} — Galería ${i + 1}`} className="h-36 w-full rounded-xl object-cover" />
                <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
              </button>
            ))}
          </div>

          {/* Móvil */}
          <div className="lg:hidden relative">
            <div className="overflow-x-auto snap-x snap-mandatory flex space-x-3 pb-2" ref={railRef}>
              {images.slice(1, 7).map((src, i) => (
                <div key={src} className="snap-center flex-shrink-0 w-[75%]">
                  <button
                    type="button"
                    onClick={() => openAt(i + 1)}
                    className="group relative block w-full overflow-hidden rounded-xl"
                  >
                    <img src={src} alt={`${businessName} — Galería ${i + 1}`} className="h-40 w-full rounded-xl object-cover" />
                    <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
                  </button>
                </div>
              ))}
            </div>
            {/* Controles (móvil) */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-1">
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                className="pointer-events-auto inline-grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/70"
                aria-label={t.prev}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                className="pointer-events-auto inline-grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/70"
                aria-label={t.next}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      ): (
        <div className="hidden lg:grid grid-cols-4 gap-4">
            <ImagePlaceHolder name="G1" />
            <ImagePlaceHolder name="G2" />
            <ImagePlaceHolder name="G3" />
            <ImagePlaceHolder name="G4" />
        </div>
      )}

      {/* Dialog ampliado */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70" />
          <Dialog.Content className="fixed inset-0 z-50 grid place-items-center p-4">
            <div className="relative w-full max-w-5xl">
              <img
                src={images[index]}
                alt={`${businessName} — ${index + 1}/${images.length}`}
                className="max-h-[80vh] w-full rounded-xl object-contain shadow-2xl"
              />

              {/* Navegación */}
              {images.length > 1 && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2">
                  <button
                    type="button"
                    onClick={prev}
                    className="pointer-events-auto inline-grid h-9 w-9 place-items-center rounded-full bg-white/80 text-neutral-900 backdrop-blur hover:bg-white"
                    aria-label={t.prev}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="pointer-events-auto inline-grid h-9 w-9 place-items-center rounded-full bg-white/80 text-neutral-900 backdrop-blur hover:bg-white"
                    aria-label={t.next}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-2 top-2 inline-grid h-9 w-9 place-items-center rounded-full bg-white/90 text-neutral-900 backdrop-blur hover:bg-white"
                aria-label={t.close}
              >
                <X className="h-5 w-5" />
              </button>

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
                {index + 1} / {images.length}
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}