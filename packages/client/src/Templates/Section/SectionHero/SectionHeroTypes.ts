export interface SectionHeroProps {
    "data-hydration-id"?: string
    title: string
    img: {
        src: string
        alt: string
    }
    content: string
    cta: string
    ctaLink?: string
    ctaOnClick?: () => void
}
