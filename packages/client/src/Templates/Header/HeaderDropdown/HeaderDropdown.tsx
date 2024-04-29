import React from 'react';

import { TemplateStruct, ContentCategory } from '../../templateTypes';

import Logo from "../../Components/Logo/Logo"

import NavNested from '../../Components/NavNested/NavNested';

import * as LogoStyles from "../../Components/Logo/Logo.scss"
import * as NavNestedStyles from '../../Components/NavNested/NavNested.scss'
import * as styles from "./HeaderDropdown.scss"

import { HeaderProps } from '../HeaderTypes';

import HeaderBasicEditor from '../HeaderBasic/HeaderBasicEditor';

const COMPONENT_NAME = "HeaderDropdown"
const HeaderDropdown: React.FC<HeaderProps> = ({
    logo,
    links,
    ...props
}) => {
    return (
        <nav className={styles.headDropdown} data-hydration-id={props["data-hydration-id"]}>
            <div className={styles.headDropdownContainer}>
                <Logo
                    imgUrl={logo.url}
                    slogan={logo.slogan}
                />
                <NavNested
                    links={links}
                />
            </div>
        </nav>
    );
};

export const HeaderDropDownItem: TemplateStruct = {
    name: COMPONENT_NAME,
    description: "Header Dropdown",
    Component: HeaderDropdown,
    ComponentEditor: HeaderBasicEditor,
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