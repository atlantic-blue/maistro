import loadable from "@loadable/component";
import { TemplateCategory, TemplateComponentType, TemplateStruct } from "../../templateTypes";

import { HeaderProps } from "../HeaderTypes";

import * as LogoStyles from "../../Components/Logo/Logo.scss"
import * as NavStyles from "../../Components/Nav/Nav.scss"
import * as NavLinkStyles from "../../Components/NavLink/NavLink.scss"
import * as styles from "./HeaderBurger.scss";
import HeaderBurger from "./HeaderBurger";

export const HeaderBurgerItem: TemplateStruct<HeaderProps> = {
    name: TemplateComponentType.HEADER_BURGER,
    Component: HeaderBurger,
    // getComponent: () => loadable<HeaderProps>(() => import(/* webpackChunkName: "HeaderBurger" */ "./HeaderBurger")),
    categories: [TemplateCategory.HEADER],
    description: "Header Burger",
    classNames: [
        ...Object.values(styles),
        ...Object.values(LogoStyles),
        ...Object.values(NavStyles),
        ...Object.values(NavLinkStyles),
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
    },
}
