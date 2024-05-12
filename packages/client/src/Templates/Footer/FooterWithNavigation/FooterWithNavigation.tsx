import React from 'react';


import * as styles from './FooterWithNavigation.scss';
import { TemplateCategory, TemplateStruct } from '../../templateTypes';

const FooterWithNavigation = () => (
    <footer className={styles.footerWithNav}>
        <nav>
            <ul className={styles.navList}>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/services">Services</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </nav>
        <p>© {new Date().getFullYear()} {/*TODO Your Company Name. */} All rights reserved.</p>
    </footer>
);

export const FooterWithNavigationItem: TemplateStruct = {
    name: "footer-with-navigation",
    description: "A footer featuring a simple navigation menu and copyright text.",
    Component: FooterWithNavigation,
    categories: [TemplateCategory.FOOTER],
    classNames: [
        ...Object.values(styles)
    ],
    ComponentEditor: () => null,
    props: {},
};

export default FooterWithNavigation;