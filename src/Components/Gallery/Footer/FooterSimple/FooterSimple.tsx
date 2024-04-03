import React from 'react';

import { ContentStruct, ContentCategory } from '../../../../types';

import * as styles from './FooterSimple.scss';

const FooterSimple = () => (
    <footer className={styles.simpleFooter}>
        <p>© {new Date().getFullYear()} {/*TODO Your Company Name. */} All rights reserved.</p>
    </footer>
);

export const FooterSimpleItem: ContentStruct = {
    id: "FooterSimpleItem",
    description: "A minimalistic footer with copyright information.",
    Component: FooterSimple,
    categories: [ContentCategory.FOOTER],
};

export default FooterSimple;
