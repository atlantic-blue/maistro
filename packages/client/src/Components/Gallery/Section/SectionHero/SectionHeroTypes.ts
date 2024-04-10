export interface SectionHeroProps {
    edit?: boolean
    title: string
    content: string | React.ReactNode
    cta: string
    ctaLink?: string
    ctaOnClick?: () => void
    img: {
        src: string
        alt: string
    }
}
