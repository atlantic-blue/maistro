import React from 'react';
import { set } from "lodash"

import { ContentStruct, ContentCategory } from '../../../../types';

import Logo from '../../Components/Logo/Logo';
import NavNested from '../../Components/NavNested/NavNested';

import { HeaderProps } from '../HeaderTypes';

import * as styles from "./HeaderDropdown.scss"

const HeaderDropdown: React.FC<HeaderProps> = (props) => {
    const onChange = (id: string, content: string) => {
        set({ ...props }, id, content)
    }

    return (
        <nav className={styles.headDropdown}>
            <div className={styles.headDropdownContainer}>
                <Logo
                    imgUrl={props.logo.url}
                    slogan={props.logo.slogan}
                    edit={props.edit}
                    onChange={onChange}
                />
                <NavNested
                    edit={props.edit}
                    links={props.links}
                    onChange={(id, content) => onChange(`links.${id}`, content)}
                />
            </div>
        </nav>
    );
};

export const HeaderDropDownItem: ContentStruct<HeaderProps> = {
    id: "HeaderDropDownItem",
    description: "Places the logo centrally with navigation links on either side, creating a balanced, symmetrical layout. Perfect for brands emphasizing their logo or for sites with equal navigation weight on both sides of their branding.",
    Component: HeaderDropdown,
    categories: [ContentCategory.HEADER],
    props: {
        logo: {
            url: "/assets/pages/generic/logo.png",
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