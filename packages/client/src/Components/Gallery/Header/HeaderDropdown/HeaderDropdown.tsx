import React from 'react';

import { TemplateStruct, ContentCategory } from '../../../../types';

import Logo from "../../Components/Logo/Logo"
import * as LogoStyles from "../../Components/Logo/Logo.scss"

import NavNested from '../../Components/NavNested/NavNested';
import * as NavNestedStyles from '../../Components/NavNested/NavNested.scss'

import { HeaderProps } from '../HeaderTypes';

import * as styles from "./HeaderDropdown.scss"

const HeaderDropdown: React.FC<HeaderProps> = (props) => {
    return (
        <nav className={styles.headDropdown}>
            <div className={styles.headDropdownContainer}>
                <Logo
                    imgUrl={props.logo.url}
                    slogan={props.logo.slogan}
                />
                <NavNested
                    links={props.links}
                />
            </div>
        </nav>
    );
};

export const HeaderDropDownItem: TemplateStruct<HeaderProps> = {
    id: "HeaderDropDownItem",
    description: "Places the logo centrally with navigation links on either side, creating a balanced, symmetrical layout. Perfect for brands emphasizing their logo or for sites with equal navigation weight on both sides of their branding.",
    Component: HeaderDropdown,
    categories: [ContentCategory.HEADER],
    classNames: [
        ...Object.values(styles),
        ...Object.values(LogoStyles),
        ...Object.values(NavNestedStyles),
    ],
    props: {
        logo: {
            url: "https://maistro.website/assets/pages/generic/logo.png",
            slogan: "Empowering Your Vision"
        },
        links: {
            home: {
                href: "#home",
                value: "Home",
            },
            about: {
                href: "#about",
                value: "About",
            },
            services: {
                href: "#services",
                value: "Services",
                links: {
                    design: {
                        href: "#services-design",
                        value: "Design",
                    },
                    development: {
                        href: "#services-development",
                        value: "Development",
                    },
                    marketing: {
                        href: "#services-marketing",
                        value: "Marketing",
                    }
                }
            },
            contact: {
                href: "#contact",
                value: "Contact",
            }
        },
    }
}

export default HeaderDropdown;