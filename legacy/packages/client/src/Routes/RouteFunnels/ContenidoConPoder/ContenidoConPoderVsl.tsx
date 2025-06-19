import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Heading,
  Text,
  Theme,
} from "@radix-ui/themes";
import { TrackEvent, trackEvent, utmParams } from "./utils";

const stripeCheckoutURL = "https://buy.stripe.com/4gMcN5cxmgiVaDK96sbMQ02"

export default function FunnelContenidoConPoderVsl() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showUnmuteOverlay, setShowUnmuteOverlay] = useState(true);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [milestones, setMilestones] = useState({ 
    q0: false,
    q25: false,
    q50: false,
    q100: false,
    revealed: false,
  });
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      if(milestones.q0) {
        return
      }

      trackEvent(TrackEvent.vsl_page_video_progress_0)
      setMilestones(prev => ({ ...prev, q0: true }));
    };

    const handleEnded = () => {
      if(milestones.q100) {
        return
      }

      trackEvent(TrackEvent.vsl_page_video_progress_100)
      setMilestones(prev => ({ ...prev, q100: true }));
    };

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      const duration = video.duration;
      const progress = current / duration;

      if (progress > 0.25 && !milestones.q25) {
        trackEvent(TrackEvent.vsl_page_video_progress_25)
        setMilestones(prev => ({ ...prev, q25: true }));
      }

      if (progress > 0.5 && !milestones.q50) {
        trackEvent(TrackEvent.vsl_page_video_progress_50)
        setMilestones(prev => ({ ...prev, q50: true }));
        setShowStickyCta(true);
      }

      const shouldRevealCta = 7 * 60 // 7min
      if (current >= shouldRevealCta && !milestones.revealed) {
        trackEvent(TrackEvent.vsl_page_cta_revealed)
        setShowCta(true);
        setMilestones(prev => ({ ...prev, revealed: true }));
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [milestones]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showCta && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showCta, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 0) {
        setShowExitIntent(true);
        trackEvent(TrackEvent.vsl_page_exit_intent)
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    utmParams.persistUTMsFromURL();
    trackEvent(TrackEvent.vsl_page_view)
  }, [])

  const handleUnmute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      video.volume = 1;
      video.play();
      setShowUnmuteOverlay(false);
      trackEvent(TrackEvent.vsl_page_video_unmuted, {timeLeft})
    }
  };

  const handleClickExitIntent = () => {
    trackEvent(TrackEvent.vsl_page_exit_intent_cta, {timeLeft})
    window.open(stripeCheckoutURL, '_blank');
  }

  const handleClickStickyBar = () => {
    trackEvent(TrackEvent.vsl_page_cta_sticky_clicked, {timeLeft})
    window.open(stripeCheckoutURL, '_blank');
  }

  const handleClick = () => {
    trackEvent(TrackEvent.vsl_page_cta_clicked, {timeLeft})
    window.open(stripeCheckoutURL, '_blank');
  }

  return (
   <Theme accentColor="pink" grayColor="sand" appearance="light">
    {showStickyCta && !showCta && (
        <Box position="fixed" bottom="0" left="0" right="0" px="4" py="2" style={{ backgroundColor: '#fff', borderTop: '1px solid #eee', zIndex: 999 }}>
          <Flex justify="center" align="center" gap="3" wrap="wrap">
            <Text size="3">🎯 ¿Lista para empezar?</Text>
            <Button size="3" radius="large" onClick={handleClickStickyBar}>
              75% OFF con el código PODER75 solo por hoy
            </Button>
          </Flex>
        </Box>
      )}

    <Dialog.Root open={showExitIntent} onOpenChange={setShowExitIntent}>
        <Dialog.Content style={{ maxWidth: 400 }}>
          <Dialog.Title>¿Aún no estás lista?</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Aprovecha un <strong>75% de descuento</strong> usando el código <strong>PODER75</strong> antes de salir. Solo pagarás <strong>$25.000 COP</strong> por acceso completo.
          </Dialog.Description>
          <Flex gap="3" mt="3" justify="end">
            <Button variant="soft" color="gray" onClick={() => setShowExitIntent(false)}>Seguir viendo</Button>
            <Button onClick={handleClickExitIntent}>Usar descuento</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <Box p="4" maxWidth="800px" mx="auto">
        <Flex justify="center" direction="column" align="center">
        <Heading size="8" align="center" mt="3" mb="4">
          Convierte tu contenido en ventas reales.
        </Heading>
        <Text as="p" size="4" align="center"  color="gray">
          Un curso express para emprendedoras que quieren usar Instagram para vender con estrategia.
        </Text>
        <Text as="p" size="4" align="center"  color="gray">
          Creado por una mamá que aprendió a vender desde cero y ahora te guía paso a paso.
        </Text>
        </Flex>

        <Flex mt="6" overflow="hidden" justify="center" direction="column">
          <video
             playsInline
             muted
             autoPlay
             controls
             ref={videoRef}
             poster="https://maistro.website/assets/videos/contenido-con-poder/thumbnails/contenido_con_poder_modulo_0.png"
             style={{ width: "100%", borderRadius: "16px" }}
          >
            <source
              src="https://maistro.website/assets/videos/funnels/contenido-con-poder-v1/vsl.mp4"
              type="video/mp4"
            />
            <track
              src="https://maistro.website/assets/videos/funnels/contenido-con-poder-v1/subs.vtt"
              kind="subtitles"
              srcLang="es"
              label="Español"
              default
            />
            Tu navegador no soporta video HTML5.
          </video>
          {showUnmuteOverlay && <Button
            onClick={handleUnmute}
            mt="4"
            size="4"
            radius="large"
            >
            🔊 Activa el sonido y conoce cómo cambió mi vida este curso
          </Button>}
        </Flex>

        {showCta && 
        <>
        <Flex mt="8" align="center" direction="column" p="4" style={{
              backgroundColor: "#FFF5F5",
              border: "1px solid #FFC1C1",
              borderRadius: "12px"
            }}>
              <Heading size="4" color="crimson">🎉 ¡Oferta limitada!</Heading>
              <Text size="3" mt="2">
                El curso tiene un precio de <s>$100.000 COP</s>,
                pero usando el código <strong>PODER75</strong> pagas <strong>$25.000 COP</strong>.
              </Text>
              <Text size="2" mt="1" color="gray">
                Tiempo limitado. No lo dejes pasar. ⏳
              </Text>
              <Text size="2" mt="1" color="crimson">
                Tiempo restante: <strong>{timeLeft > 0 ? formatTime(timeLeft) : '00:00 — ¡última oportunidad!'}</strong>  
              </Text>

              <Button
                mt="4"
                size="4"
                radius="large"
                onClick={handleClick}
              >
                  <p>Ahora solo <strong>$25.000 COP</strong> con el código <strong>PODER75</strong></p>
              </Button>
        </Flex>
        <Text as="p" size="2" align="center" mt="2" color="gray">
          Garantía de satisfacción 100% 💬 | Acceso inmediato ⚡️
        </Text>
        
        </>
        }

        <Flex gap="5" mt="6" direction={{ initial: "column", md: "row" }} justify="center">
          <Card size="3">
            <Text size="6">📲</Text>
            <Heading size="4" mt="2">Instagram Estratégico</Heading>
            <Text size="2" color="gray">Aprende a atraer, enamorar y vender.</Text>
          </Card>
          <Card size="3">
            <Text size="6">💻</Text>
            <Heading size="4" mt="2">Webs que Venden</Heading>
            <Text size="2" color="gray">Convierte tu página en tu mejor embudo de ventas.</Text>
          </Card>
          <Card size="3">
            <Text size="6">❤️</Text>
            <Heading size="4" mt="2">Ventas con Alma</Heading>
            <Text size="2" color="gray">Vende sin sonar a robot. Conecta desde el corazón.</Text>
          </Card>
        </Flex>

        <Flex direction="row" justify="center" align="center" mb="5">
          <Text align="center" mt="8" weight="medium">
           💬 Un curso express <strong>diseñado para emprendedoras</strong> que quieren usar Instagram para vender con estrategia y propósito.
        </Text>
        </Flex>
        

        {showCta && 
        <Flex direction="column" justify="center" align="center" mb="5">
        <Flex direction="column" justify="center" align="center">
          <Heading size="5">¿Estás lista para transformar tu contenido en un canal de ventas?</Heading>
          <Text align="center" size="3" color="gray">
            Este es tu momento para empezar con una estrategia clara, práctica y hecha para emprendedoras como tú.
          </Text>
          <Button
                mt="4"
                size="4"
                radius="large"
                onClick={handleClick}
              >
                  <p>Ahora solo <strong>$25.000 COP</strong> con el código <strong>PODER75</strong></p>
              </Button>
          <Text size="2" color="gray" align="center" mt="2">
            Sin suscripciones. Acceso de por vida. Garantía incluida.
        </Text>
        </Flex>


        <Box mt="6" p="4" style={{ backgroundColor: "#FFF3CD", border: "1px solid #FFEB99", borderRadius: "12px" }}>
          🎁 <strong>BONUS EXCLUSIVO:</strong> empieza hoy con nuestro planificador descargable para organizar una semana completa de contenido estratégico. Solo disponible hasta el <strong>domingo</strong>.
        </Box>
        </Flex>
        }
      </Box>
    </Theme>
  );
}
