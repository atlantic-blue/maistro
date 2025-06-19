import React, { useEffect } from "react";
import {
  Flex,
  Button,
  Heading,
  Text,
  Theme,
} from "@radix-ui/themes";
import { TrackEvent, trackEvent, utmParams } from "./utils";

export default function FunnelContenidoConPoderSuccess() {
    useEffect(() => {
        utmParams.persistUTMsFromURL();
        trackEvent(TrackEvent.success_page_view)
    }, [])

    const handleCTAClick = async() => {
        await Promise.resolve()
        trackEvent(TrackEvent.success_page_cta_clicked)
        window.open("https://academy.maistro.website/", '_blank')
    }

    const handleUpsellClick = async() => {
        trackEvent(TrackEvent.success_page_upsell_clicked)
        window.open("https://buy.stripe.com/bIY8zK23z1q01yM000", '_blank')
    }

    const handleHelpClick = async() => {
        trackEvent(TrackEvent.success_page_help_clicked)
        window.open("https://api.whatsapp.com/send/?phone=573013239010", '_blank')
    }

  return (
    <Theme accentColor="pink" grayColor="sand" appearance="light">
      <Flex m="6" maxWidth="800px" mx="auto" direction="column" align="center" justify="center" p="6">
        <Heading size="7">🚀 ¡Estás dentro!</Heading>

        <Text size="4" mt="4" color="gray">
          ¡Felicitaciones! Acabas de dar el primer paso para transformar tu contenido en ventas reales con <strong>Contenido con Poder</strong>. 🎉
        </Text>

        <Flex direction="column" align="center" justify="center" mt="6" m="4" style={{ backgroundColor: "#FFF5F5", border: "1px solid #FFC1C1" }} p="5">
          <Text size="3">
            ⚠️ Recuerda: solo puedes ingresar usando tu cuenta de <strong>Gmail</strong>.
          </Text>
          <br/>
          <Text as="p" size="2" mt="2" color="gray">
            Si usaste otra cuenta para pagar, por favor comunícate con soporte para ayudarte.
          </Text>
        </Flex>

        <Button
          mt="6"
          size="4"
          radius="large"
          onClick={handleCTAClick}
          style={{ fontWeight: 700 }}
        >
          👉 Iniciar sesión y acceder al curso
        </Button>

        <Flex mt="8" p="4" style={{ backgroundColor: "#F5F0FF", border: "1px solid #D0B3FF" }} direction="column" justify="center" align="center">
          <Heading size="8" color="indigo" mb="2">🔥 Plan más popular</Heading>
          <Heading size="6" color="indigo">Growth Plan</Heading>
          <Text size="3" mt="1" mb="3" color="gray">
            Todo lo que necesitas para escalar tu marca digital como una profesional
          </Text>
          <Heading size="7" color="indigo">$140 000 COP<Text size="3" color="gray">/mes</Text></Heading>

          <Text size="3" mt="4" mb="1" align="left">
            ✅ páginas responsivas<br />
            ✅ Personalización de diseño<br />
            ✅ Subida de contenido<br />
            ✅ Galería de imágenes de stock<br />
            ✅ Asistente con IA<br />
            ✅ Imágenes generadas con IA<br />
            ✅ Capacidad de vender tus productos (aplican TyC)<br />
            ✅ Guía experta para crear contenido que conecta<br />
            ✅ 1,000 vistas mensuales recurrentes en Instagram<br />
            ✅ Crea páginas ilimitadas<br />
            ✅ Crea hasta 3 sitios web
          </Text>

          <Button
            mt="5"
            size="3"
            radius="large"
            color="indigo"
            onClick={handleUpsellClick}
          >
            📈 Quiero escalar con Maistro
          </Button>
        </Flex>

        <Text size="2" mt="4" color="gray">
          Si tienes problemas, contactanos a  nuestro <a onClick={handleHelpClick}>whatsapp</a>
        </Text>
      </Flex>
    </Theme>
  );
}
