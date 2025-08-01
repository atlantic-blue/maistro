import React from 'react';
import { Button, Badge, Card, Box } from '@maistro/ui';
import Header from '@/Components/Header';

export default function Homepage() {
  return (
    <div className="bg-[#FFF8F6] text-black min-h-screen font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#FFF8F6] to-white px-6 py-32 overflow-hidden">
        <div className="absolute top-[-80px] right-[-100px] w-[500px] h-[500px] bg-[#FF3366]/10 rounded-full blur-3xl" />
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl font-extrabold tracking-tight leading-tight mb-4">
              Reserva. Gestiona. <span className="text-[#FF3366]">Crece.</span>
            </h1>
            <p className="text-xl text-gray-600 font-light mb-6 max-w-lg">
              La plataforma gratuita para gestionar tu salón con estilo y cero complicaciones.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              <Button className="text-lg px-6 py-3 bg-[#FF3366] hover:bg-[#e52b5a] text-white">
                Empieza Gratis
              </Button>
              <Button variant="outline" className="text-lg px-6 py-3 border-gray-300">
                Explora Negocios
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <img
              src="/public/assets/hero-booking-ui.webp"
              alt="Vista previa de reservas Maistro"
              className="w-full max-w-md rounded-xl shadow-xl border border-gray-100"
            />
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="bg-[#FFF8F6] px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">
            Todo lo que necesitas para hacer crecer tu negocio
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <Card>
              <Box className="p-6">
                <h3 className="text-xl font-semibold mb-2">✅ Reservas automáticas 24/7</h3>
                <p className="text-gray-700">
                  Tus clientes reservan sin interrupciones, incluso mientras duermes.
                </p>
              </Box>
            </Card>
            <Card>
              <Box className="p-6">
                <h3 className="text-xl font-semibold mb-2">✅ WhatsApp & recordatorios</h3>
                <p className="text-gray-700">
                  Recordatorios automáticos que reducen ausencias y mejoran la experiencia.
                </p>
              </Box>
            </Card>
            <Card>
              <Box className="p-6">
                <h3 className="text-xl font-semibold mb-2">✅ CRM de clientes</h3>
                <p className="text-gray-700">
                  Conoce el historial de cada cliente y fideliza como nunca antes.
                </p>
              </Box>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 bg-white text-center">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">¿Cómo funciona Maistro?</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <Box className="p-6">
                <h3 className="font-bold text-xl mb-2">1. Crea tu cuenta</h3>
                <p>Regístrate gratis y accede al panel de control.</p>
              </Box>
            </Card>
            <Card className="bg-white border border-gray-200 shadow-sm">
              <Box className="p-6">
                <h3 className="font-bold text-xl mb-2">2. Configura tus servicios</h3>
                <p>Personaliza horarios, precios y redes sociales.</p>
              </Box>
            </Card>
            <Card className="bg-white border border-gray-200 shadow-sm">
              <Box className="p-6">
                <h3 className="font-bold text-xl mb-2">3. Comparte tu enlace</h3>
                <p>Empieza a recibir reservas por WhatsApp, Instagram y más.</p>
              </Box>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-6 text-center text-gray-500 text-sm">
        <p>Confiado por +1.200 salones en Colombia 🇨🇴</p>
      </section>

      {/* Final CTA */}
      <section className="text-center py-20 px-6 bg-[#FF3366] text-white">
        <h2 className="text-3xl font-bold mb-4">Empieza con Maistro hoy mismo</h2>
        <p className="mb-6 text-lg">Sin tarjeta. Sin complicaciones. 100% gratis.</p>
        <Button className="text-lg px-6 py-3 bg-white text-[#FF3366] hover:bg-gray-100">
          Crear mi cuenta
        </Button>
      </section>

      {/* Comparison */}
      <section className="bg-white px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Maistro vs. Booksy & Fresha</h2>
        <div className="overflow-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 font-bold">Función</th>
                <th className="py-2 px-4 font-bold">Maistro</th>
                <th className="py-2 px-4 font-bold">Booksy</th>
                <th className="py-2 px-4 font-bold">Fresha</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-4">Sitio web gratis</td>
                <td className="py-2 px-4">✅</td>
                <td className="py-2 px-4">❌</td>
                <td className="py-2 px-4">❌</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4">Chatbot Instagram</td>
                <td className="py-2 px-4">✅</td>
                <td className="py-2 px-4">❌</td>
                <td className="py-2 px-4">❌</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4">CRM integrado</td>
                <td className="py-2 px-4">✅</td>
                <td className="py-2 px-4">✅</td>
                <td className="py-2 px-4">✅</td>
              </tr>
              <tr>
                <td className="py-2 px-4">Recordatorios por WhatsApp</td>
                <td className="py-2 px-4">✅</td>
                <td className="py-2 px-4">❌</td>
                <td className="py-2 px-4">❌</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16 bg-[#FFF8F6] text-center">
        <h2 className="text-3xl font-bold mb-10">Historias de éxito</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <Box className="p-6">
              <p>“Con Maistro, tripliqué mis reservas en un mes.”</p>
              <Badge className="mt-4">Laura – Peluquería en Medellín</Badge>
            </Box>
          </Card>
          <Card>
            <Box className="p-6">
              <p>“El chatbot me ahorra horas al día.”</p>
              <Badge className="mt-4">Carlos – Barbería en Bogotá</Badge>
            </Box>
          </Card>
          <Card>
            <Box className="p-6">
              <p>“Nunca fue tan fácil organizar mi negocio.”</p>
              <Badge className="mt-4">Diana – Manicurista en Cali</Badge>
            </Box>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-16 px-6 bg-black text-white">
        <h2 className="text-3xl font-bold mb-4">Empieza hoy con Maistro</h2>
        <p className="mb-6">Sin tarjeta. Sin complicaciones. 100% gratis.</p>
        <Button className="text-lg px-6 py-3">Crear mi cuenta</Button>
      </section>
    </div>
  );
}
