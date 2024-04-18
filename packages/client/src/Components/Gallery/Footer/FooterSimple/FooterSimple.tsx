import React from 'react';

import { ContentStruct, ContentCategory } from '../../../../types';

import * as styles from './FooterSimple.scss';

interface FooterSimpleProps {
    name: string
}

const FooterSimple: React.FC<FooterSimpleProps> = (props) => (
    <footer className={styles.simpleFooter}>
        <p>© {new Date().getFullYear()} {props.name}. All rights reserved.</p>
    </footer>
);

export const FooterSimpleItem: ContentStruct = {
    id: "FooterSimpleItem",
    description: "A minimalistic footer with copyright information.",
    Component: FooterSimple,
    categories: [ContentCategory.FOOTER],
    classNames: [
        ...Object.values(styles),
    ],
    props: {
        name: "Maistro"
    }
};

export default FooterSimple;
