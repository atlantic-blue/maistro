export interface HeaderBurgerLink {
    href: string;
    value: string
    links?: Record<string, HeaderBurgerLink>
}

export interface HeaderProps {
    edit?: boolean
    logo: {
        url: string
        slogan?: string
    }
    links?: Record<string, HeaderBurgerLink>
}
