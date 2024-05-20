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

export interface SectionHeroSubscribeProps extends SectionHeroProps {
    url: string
    emailListId: string
    redirectTo?: string
    successMessage: string
}
