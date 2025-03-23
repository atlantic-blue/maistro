import loadable from "@loadable/component";
import { TemplateCategory, TemplateComponentType, TemplateStruct } from "../../templateTypes";
import { HeaderProps } from "../HeaderTypes";

import * as LogoStyles from "../../Components/Logo/Logo.scss"
import * as NavigationStyles from "../../Components/Navigation/Navigation.scss"
import * as styles from "./HeaderSticky.scss"
import HeaderSticky from "./HeaderSticky";

export const HeaderStickyItem: TemplateStruct<HeaderProps> = {
    name: TemplateComponentType.HEADER_STICKY,
    Component: HeaderSticky,
    // getComponent: () => loadable<HeaderProps>(() => import(/* webpackChunkName: "HeaderSticky" */ "./HeaderSticky")),
    description: "Sticky navigation bar",
    categories: [TemplateCategory.HEADER],
    classNames: [
        ...Object.values(styles),
        ...Object.values(LogoStyles),
        ...Object.values(NavigationStyles),
    ],
    props: {
        logo: {
            url: "https://maistro.website/assets/pages/generic/logo.png",
            slogan: "Empowering Your Vision"
        },
        links: [
            {
                name: "Home",
                href: "/",
                description: "Home page",
            },
            {
                name: "About",
                href: "/about",
                description: "About page",
            },
            {
                name: "Contact",
                href: "/contact",
                description: "contact page",
            },
        ]
    }
}
