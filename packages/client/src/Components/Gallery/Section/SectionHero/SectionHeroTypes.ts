export interface SectionHeroProps {
    edit?: boolean
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
