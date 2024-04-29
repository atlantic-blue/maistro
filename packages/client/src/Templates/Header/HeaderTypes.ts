export interface HeaderBurgerLink {
    href: string;
    value: string
    links?: Record<string, HeaderBurgerLink>
}

export interface HeaderProps {
    "data-hydration-id"?: string
    logo: {
        url: string
        slogan?: string
    }
    links?: Record<string, HeaderBurgerLink>
}
