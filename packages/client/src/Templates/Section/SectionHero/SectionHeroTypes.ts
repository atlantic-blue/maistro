export interface SectionHeroProps {
    "data-hydration-id"?: string
    title: string
    content: string
    cta: string
    ctaLink?: string
    ctaOnClick?: () => void
    img: {
        src: string
        alt: string
    }
}
