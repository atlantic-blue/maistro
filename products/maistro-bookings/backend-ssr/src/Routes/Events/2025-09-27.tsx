import React from "react";
import { CalendarDays, MapPin, Clock, Rocket, Globe, Megaphone, Users2, Gift, AppWindow, Sparkles, ShieldCheck, Handshake, Presentation, CreditCard } from "lucide-react";
import { Badge, Button, Box, Text} from "@maistro/ui";

const MEMBERSHIP_URL = "https://buy.stripe.com/4gM4gz54UgiVbHOdmIbMQ03";
const EVENTO = {
  titulo: "Lanzamiento Maistro + Networking",
  fecha: "Sábado 27 de septiembre",
  hora: "9:30 – 11:30 a. m.",
  lugar: "Hotel Park House 101, Bogotá",
};

export default function MaistroEventSep2025() {
  return (
      <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-pink-500/30">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 via-transparent to-transparent" style={{"zIndex": "0"}} />
          <div className="container mx-auto px-4 py-20 md:py-28" style={{"position": "relative", "zIndex": "1"}}>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs md:text-sm">
                <Sparkles className="h-4 w-4" />
                <span>Evento íntimo — cupos limitados</span>
              </div>
              <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                ¿Listo para lograr en <span className="text-pink-500">2 horas</span> la visibilidad de meses?
              </h1>
              <p className="mt-4 text-white/80 md:text-lg">
                Únete al <strong>Lanzamiento de la App de Maistro</strong> y acelera tu marca con networking de alto valor, marketing en vivo y herramientas digitales que convierten.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-white/80">
                <div className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-pink-400" />{EVENTO.fecha}</div>
                <div className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-pink-400" />{EVENTO.hora}</div>
                <div className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-pink-400" />{EVENTO.lugar}</div>
              </div>
              <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
                <Button asChild size="4" className="h-12 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-500/20">
                  <a href={MEMBERSHIP_URL} target="_blank" rel="noreferrer">Asegurar mi cupo con la membresía</a>
                </Button>
                <p className="text-xs md:text-sm text-white/70">
                  Sin cláusula de permanencia · Comunidad · Crecimiento real
                </p>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-24 top-10 hidden aspect-square w-[40rem] rounded-full bg-pink-500/20 blur-3xl md:block" />
        </section>

        {/* Qué traemos a la mesa */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl md:text-4xl font-semibold tracking-tight">¿Qué traemos a la mesa?</h2>
              <p className="mt-3 text-white/80 md:text-lg">
                Diseñado para emprendedores que quieren dar un salto. En 120 minutos desbloqueas visibilidad, conexiones y un plan claro para vender más.
              </p>
              <div className="mt-8 grid gap-4">
                <Feature icon={<Globe className="h-5 w-5" />} title="Visibilidad continua en Google">
                  Tu marca presente donde tus clientes te buscan. Perfil en la app de Maistro y conexiones que no dependen solo de ferias.
                </Feature>
                <Feature icon={<Megaphone className="h-5 w-5" />} title="Marketing en vivo">
                  Impulso real a las marcas asistentes durante el evento. Te ayudamos a contar tu historia y amplificar tu alcance.
                </Feature>
                <Feature icon={<Users2 className="h-5 w-5" />} title="Networking mensual">
                  Conecta con 20–25 emprendedores, crea alianzas y oportunidades. Comunidad que empuja de verdad.
                </Feature>
                <Feature icon={<Gift className="h-5 w-5" />} title="Obsequio especial">
                  Te llevas herramientas digitales y recursos accionables para acelerar ventas desde ya.
                </Feature>
              </div>
            </div>
            <div className="grid gap-4 md:gap-6">
              <ValueCard icon={Rocket} title="2 horas que cambian el juego" subtitle="Haz en una mañana lo que te tomó meses">
                Agenda enfocada, mentores y ejercicios prácticos para salir con claridad y próximos pasos.
              </ValueCard>
              <ValueCard icon={AppWindow} title="Lanzamiento de la App Maistro" subtitle="Tu vitrina siempre encendida">
                Presencia constante para tu negocio + descubrimiento por nuevos clientes.
              </ValueCard>
              <ValueCard icon={ShieldCheck} title="Membresía sin permanencia" subtitle="Transparente y flexible">
                Entras, pruebas, creces. Sin ataduras. Todo el valor, cero fricción.
              </ValueCard>
            </div>
          </div>
        </section>

        {/* Agenda */}
        <section className="bg-white/5 border-y border-white/10">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="flex items-center gap-2">
              <Badge className="bg-pink-600 hover:bg-pink-600">Agenda</Badge>
              <span className="text-white/70 text-sm">120 minutos intensivos</span>
            </div>
            <h2 className="mt-4 text-2xl md:text-4xl font-semibold">Lo que haremos</h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <AgendaItem
                time="09:30 – 09:40"
                title="Bienvenida + Hook de Visibilidad"
                desc="Cómo lograr en 2 horas la visibilidad de meses. Objetivos del encuentro."
              />
              <AgendaItem
                time="09:40 – 10:05"
                title="Speaker 1 — Negocios Internacionales"
                desc="Mapa para abrir mercados y pensar en grande desde el día uno."
              />
              <AgendaItem
                time="10:05 – 10:25"
                title="Speaker 2 — Comercio & Finanzas"
                desc="Números simples para decisiones inteligentes y crecimiento rentable."
              />
              <AgendaItem
                time="10:25 – 10:40"
                title="Speaker 3 — Salud, Cuerpo & Ventas"
                desc="Vende desde la presencia: bienestar, comunicación y resultados."
              />
              <AgendaItem
                time="10:40 – 10:50"
                title="Mentora de Vida"
                desc="Mentalidad, foco y energía para sostener el crecimiento."
              />
              <AgendaItem
                time="10:50 – 11:10"
                title="Lanzamiento App Maistro + Marketing en Vivo"
                desc="Demostración, perfiles visibles en Google y difusión de las marcas asistentes."
              />
              <AgendaItem
                time="11:10 – 11:30"
                title="Networking Dirigido + Cierre Accionable"
                desc="Conexiones clave y próximos pasos claros para la semana."
              />
            </div>
          </div>
        </section>

        {/* CTA Sección */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid gap-8 md:grid-cols-5 items-center">
            <div className="md:col-span-3">
              <h3 className="text-2xl md:text-4xl font-semibold leading-tight">
                Súmate a Maistro y mantén tu marca visible, conectada y creciendo.
              </h3>
              <p className="mt-3 text-white/80 md:text-lg">
                Activa tu membresía para asegurar tu cupo al evento y desbloquear beneficios continuos: visibilidad en Google, networking mensual y marketing constante.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Badge className="bg-white/10 text-white border-white/10"><Users2 className="mr-2 h-4 w-4"/>Comunidad real</Badge>
                <Badge className="bg-white/10 text-white border-white/10"><Presentation className="mr-2 h-4 w-4"/>Mentores & speakers</Badge>
                <Badge className="bg-white/10 text-white border-white/10"><CreditCard className="mr-2 h-4 w-4"/>Sin cláusula de permanencia</Badge>
              </div>
              <div className="mt-8">
                <Button asChild size="4" className="h-12 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-500/20">
                  <a href={MEMBERSHIP_URL} target="_blank" rel="noreferrer">Activar mi membresía y reservar cupo</a>
                </Button>
            </div>
            </div>
            <div className="md:col-span-2">
              <Box className="border border-white/10 backdrop-blur rounded-2xl p-3">
                <Box className="mb-3">
                  <Text className="text-white mb-3">Detalles del evento</Text>
                </Box>
                <Box className="grid gap-3 text-sm text-white/80">
                  <Detail icon={CalendarDays} label="Fecha" value={EVENTO.fecha} />
                  <Detail icon={Clock} label="Hora" value={EVENTO.hora} />
                  <Detail icon={MapPin} label="Lugar" value={EVENTO.lugar} />
                </Box>
              </Box>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10">
          <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-white/60 text-sm">
            <p>© {new Date().getFullYear()} Maistro. Hecho con cariño para emprendedores.</p>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4"/>Membresía flexible</span>
              <span className="inline-flex items-center gap-2"><Handshake className="h-4 w-4"/>Comunidad</span>
              <span className="inline-flex items-center gap-2"><Rocket className="h-4 w-4"/>Crecimiento</span>
            </div>
          </div>
        </footer>
      </main>
  );
}

// ====== Subcomponentes ======
function Feature({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mt-0.5 rounded-lg bg-pink-500/20 p-2 text-pink-300">{icon}</div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-white/75 text-sm mt-1">{children}</p>
      </div>
    </div>
  );
}

function ValueCard({ icon: Icon, title, subtitle, children }: { icon: any; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <Box className="border border-white/10 backdrop-blur rounded-2xl p-3">
      <Box className="flex flex-row items-center gap-3">
        <div className="rounded-xl bg-pink-500/20 p-3 text-pink-300">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <Box className="text-white text-lg">{title}</Box>
          <p className="text-white/70 text-sm">{subtitle}</p>
        </div>
      </Box>
      <Box className="text-white/80 text-sm -mt-2">{children}</Box>
    </Box>
  );
}

function AgendaItem({ time, title, desc }: { time: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-2 text-xs text-white/60">
        <Clock className="h-4 w-4 text-pink-400" />
        <span>{time}</span>
      </div>
      <h4 className="mt-2 text-lg font-semibold">{title}</h4>
      <p className="mt-1 text-sm text-white/80">{desc}</p>
    </div>
  );
}

function Detail({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="rounded-lg bg-pink-500/20 p-2 text-pink-300"><Icon className="h-4 w-4"/></div>
      <div>
        <p className="text-xs uppercase tracking-wide text-white/60">{label}</p>
        <p className="text-sm text-white">{value}</p>
      </div>
    </div>
  );
}
