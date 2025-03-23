import loadable from "@loadable/component";
import { HeaderProps } from "../HeaderTypes";

import * as LogoStyles from "../../Components/Logo/Logo.scss"
import * as NavigationStyles from "../../Components/Navigation/Navigation.scss"
import * as styles from "./HeaderBasic.scss"

import { TemplateCategory, TemplateComponentType, TemplateStruct } from "../../templateTypes";
import HeaderBasic from "./HeaderBasic";

export const HeaderBasicItem: TemplateStruct<HeaderProps> = {
    name: TemplateComponentType.HEADER_BASIC,
    description: "Simple header",
    categories: [TemplateCategory.HEADER],
    classNames: [
        ...Object.values(styles),
        ...Object.values(LogoStyles),
        ...Object.values(NavigationStyles),
    ],
    Component: HeaderBasic,
    // getComponent: () => loadable<HeaderProps>(() => import(/* webpackChunkName: "HeaderBasic" */ "./HeaderBasic")),
    props: {
        logo: {
            url: "https://maistro.website/assets/logo.svg",
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