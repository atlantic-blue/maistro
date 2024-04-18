import React from 'react';

import { ContentStruct, ContentCategory } from '../../../../types';

import * as styles from './FooterWithNavigation.scss';

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

export const FooterWithNavigationItem: ContentStruct = {
    id: "footer-with-navigation",
    description: "A footer featuring a simple navigation menu and copyright text.",
    Component: FooterWithNavigation,
    categories: [ContentCategory.FOOTER],
    classNames: [
        ...Object.values(styles)
    ],
};

export default FooterWithNavigation;