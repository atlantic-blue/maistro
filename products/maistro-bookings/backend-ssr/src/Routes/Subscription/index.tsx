import * as React from "react";
import { ArrowRight, CheckCircle2, CalendarDays, GraduationCap, Globe, Store, Sparkles, Shield, BadgeCheck } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

// Replace with your real Stripe Checkout link
const STRIPE_LINK = "https://buy.stripe.com/4gM4gz54UgiVbHOdmIbMQ03";

// Utility: join class names
const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");


{/* <script async
  src="https://js.stripe.com/v3/buy-button.js">
</script>

<stripe-buy-button
  buy-button-id="buy_btn_1SBKhTHdug2e0offz9PF7rgC"
  publishable-key="pk_live_51P46Q7Hdug2e0offIPNdkK7TF7Sjk7hPwU5M9ktkLZ4142DW94PQYqBjOFw6p4RokfUmHauVegatyhdTdbM43tOV00sZIRDPRb"
>
</stripe-buy-button> */}
export default function MaistroSubscriptionLanding() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 selection:bg-pink-200/60">
      <Header />
      <Hero />
      <TrustBar />
      <ValueSection />
      <IncludedSection />
      <CTASection />
      <FAQ />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* <div className="h-8 w-8 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-sm" /> */}
          <span className="font-semibold tracking-tight">Maistro</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-700">
          <a href="#valor" className="hover:text-neutral-900">Beneficios</a>
          <a href="#incluye" className="hover:text-neutral-900">Qué incluye</a>
          <a href="#faq" className="hover:text-neutral-900">Preguntas</a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={STRIPE_LINK}
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-white text-sm font-medium hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900/30"
          >
            Suscribirme <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_10%,rgba(255,51,102,.25),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-neutral-900 text-white px-3 py-1 text-[11px] tracking-wide">
              <Sparkles className="h-3.5 w-3.5" /> NUEVA SUSCRIPCIÓN
            </div>
            <h1 className="mt-4 text-4xl/tight sm:text-5xl/tight font-extrabold tracking-tight">
              Todo lo que necesitas para hacer crecer tu marca
            </h1>
            <p className="mt-4 text-neutral-700 max-w-prose">
              Por solo <strong>£15</strong> (≈ <strong>$80.000 COP</strong>) al mes obtienes seminarios presenciales, acceso a
              <strong> Maistro Academy</strong> y herramientas digitales para vender más.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={STRIPE_LINK}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-pink-600 px-6 py-3 text-white font-semibold shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
              >
                Suscribirme ahora <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#valor"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-300 bg-white px-6 py-3 text-neutral-900 font-semibold hover:bg-neutral-50"
              >
                Ver beneficios
              </a>
            </div>
            <p className="mt-3 text-xs text-neutral-500">Sin costos ocultos. Cancela cuando quieras.</p>
          </div>

          <div className="lg:justify-self-end w-full">
            <PricingCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingCard() {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm max-w-sm mx-auto">
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-extrabold">£15</span>
        <span className="text-neutral-500">/ mes</span>
      </div>
      <p className="text-sm text-neutral-500">≈ $80.000 COP / mes</p>
      <ul className="mt-6 space-y-3 text-sm">
        {[
          "Seminarios presenciales mensuales",
          "Acceso completo a Maistro Academy",
          "Sitio web profesional con plantillas",
          "Marketplace para exhibir y vender",
          "Nuevas funciones cada mes",
        ].map((t) => (
          <li key={t} className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
      <a
        href={STRIPE_LINK}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-white font-semibold hover:bg-neutral-800"
      >
        Empezar ahora
      </a>
      <p className="mt-2 text-[11px] text-neutral-500 text-center">Sin permanencia. Facturación mensual.</p>
    </div>
  );
}

function TrustBar() {
  return (
    <div className="border-y border-neutral-200 bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 md:grid-cols-5 gap-4 items-center text-neutral-600 text-xs">
        {[
          { icon: BadgeCheck, label: "Comunidad de emprendedores" },
          { icon: Shield, label: "Pago seguro con Stripe" },
          { icon: CalendarDays, label: "Eventos mensuales" },
          { icon: GraduationCap, label: "Academy ilimitado" },
          { icon: Globe, label: "Web lista para vender" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 justify-center md:justify-start">
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ValueSection() {
  return (
    <section id="valor" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid lg:grid-cols-3 gap-8">
        <Card
          icon={CalendarDays}
          title="Seminarios presenciales"
          body="Aprende de expertos, conecta con otros emprendedores y genera alianzas reales cada mes."
        />
        <Card
          icon={GraduationCap}
          title="Maistro Academy"
          body="Cursos prácticos de ventas, marketing, redes y finanzas. Avanza a tu ritmo, nuevas lecciones cada mes."
        />
        <Card
          icon={Sparkles}
          title="Herramientas digitales"
          body={
            <>
              <span className="block">Empieza hoy con:</span>
              <ul className="mt-2 space-y-1 text-sm list-disc ml-5">
                <li>Web profesional con plantillas Maistro</li>
                <li>Marketplace para mostrar y vender</li>
              </ul>
              <span className="mt-2 block text-neutral-600">
                Y cada mes sumamos nuevas funciones diseñadas para vender más.
              </span>
            </>
          }
        />
      </div>
    </section>
  );
}

function Card({ icon: Icon, title, body }: { icon: React.ComponentType<any>; title: string; body: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-neutral-900 text-white grid place-items-center">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="mt-3 text-neutral-700 text-sm leading-6">{body}</div>
    </div>
  );
}

function IncludedSection() {
  return (
    <section id="incluye" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold tracking-tight">Todo incluido por £15 / mes</h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          {[
            { icon: CalendarDays, text: "Seminarios presenciales mensuales" },
            { icon: GraduationCap, text: "Acceso completo a Maistro Academy" },
            { icon: Globe, text: "Sitio web profesional con plantillas" },
            { icon: Store, text: "Marketplace para exhibir y vender" },
            { icon: Sparkles, text: "Nuevas funciones se agregan cada mes" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 rounded-2xl border border-neutral-200 p-4">
              <Icon className="h-5 w-5 text-neutral-900" />
              <span>{text}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a
            href={STRIPE_LINK}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-6 py-3 text-white font-semibold hover:bg-neutral-800"
          >
            Suscribirme ahora <ArrowRight className="h-5 w-5" />
          </a>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-300 bg-white px-6 py-3 font-semibold hover:bg-neutral-50">
                Ver detalle
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40" />
              <Dialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 shadow-2xl focus:outline-none">
                <Dialog.Title className="text-lg font-semibold">Detalle de la suscripción</Dialog.Title>
                <Dialog.Description className="mt-2 text-sm text-neutral-600">
                  Un solo precio, todo incluido. Sin permanencia. Cancela cuando quieras.
                </Dialog.Description>
                <ul className="mt-4 space-y-2 text-sm">
                  {[
                    "Eventos con expertos y networking mensual",
                    "Cursos y plantillas actualizadas en Academy",
                    "Web profesional lista en minutos",
                    "Marketplace para ganar visibilidad y ventas",
                    "Novedades y mejoras continuas",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex justify-end gap-3">
                  <Dialog.Close asChild>
                    <button className="rounded-xl border border-neutral-300 px-4 py-2 font-medium hover:bg-neutral-50">Cerrar</button>
                  </Dialog.Close>
                  <a
                    href={STRIPE_LINK}
                    className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-white font-semibold hover:bg-neutral-800"
                  >
                    Suscribirme <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
      <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-gradient-to-br from-neutral-900 to-neutral-800 p-10 text-white">
        <div className="absolute -left-8 -top-8 h-40 w-40 rounded-full bg-pink-600/30 blur-2xl" />
        <div className="absolute -right-8 -bottom-8 h-40 w-40 rounded-full bg-rose-500/30 blur-2xl" />
        <div className="relative grid lg:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-2xl font-bold tracking-tight">Únete hoy. Haz crecer tu negocio este mes.</h3>
            <p className="mt-2 text-white/80">
              Seminarios + Academy + Website + Marketplace por una sola tarifa mensual. Sin sorpresas.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
            <a
              href={STRIPE_LINK}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-neutral-900 font-semibold hover:bg-neutral-100"
            >
              Suscribirme ahora <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#faq"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 px-6 py-3 font-semibold hover:bg-white/10"
            >
              Ver preguntas
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
      <h2 className="text-2xl font-bold tracking-tight">Preguntas frecuentes</h2>
      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <FAQItem q="¿Puedo cancelar cuando quiera?" a="Sí. No hay permanencia. Puedes cancelar en cualquier momento desde tu cuenta." />
        <FAQItem q="¿El precio incluye eventos presenciales?" a="Sí. Tu suscripción incluye el acceso a los seminarios mensuales organizados por Maistro." />
        <FAQItem q="¿Qué herramientas tengo hoy?" a="Desde ya cuentas con Website profesional y Marketplace. Además, agregamos nuevas funciones cada mes." />
        <FAQItem q="¿Cómo pago?" a="Aceptamos pagos con Stripe. Es rápido y seguro. Recibes confirmación inmediata." />
      </div>
    </section>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-xl bg-neutral-900 text-white grid place-items-center">
          <QuestionMark />
        </div>
        <div>
          <h3 className="font-semibold">{q}</h3>
          <p className="mt-1 text-sm text-neutral-700">{a}</p>
        </div>
      </div>
    </div>
  );
}

function QuestionMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.5 9a2.5 2.5 0 1 1 4.29 1.71C13.18 11.32 12 12 12 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="17" r="1" fill="currentColor"/>
    </svg>
  );
}

function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-sm text-neutral-600 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Maistro. Todos los derechos reservados.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-neutral-900">Términos</a>
          <a href="#" className="hover:text-neutral-900">Privacidad</a>
          <a href="#faq" className="hover:text-neutral-900">Ayuda</a>
        </div>
      </div>
    </footer>
  );
}