import React from 'react';

import * as styles from './FooterSimple.scss';
import { TemplateCategory, TemplateStruct } from '../../templateTypes';

interface FooterSimpleProps {
    name: string
}

const FooterSimple: React.FC<FooterSimpleProps> = (props) => (
    <footer className={styles.simpleFooter}>
        <p>© {new Date().getFullYear()} {props.name}. All rights reserved.</p>
    </footer>
);

export const FooterSimpleItem: TemplateStruct = {
    name: "FooterSimpleItem",
    description: "A minimalistic footer with copyright information.",
    Component: FooterSimple,
    categories: [TemplateCategory.FOOTER],
    classNames: [
        ...Object.values(styles),
    ],
    props: {
        name: "Maistro"
    },
    ComponentEditor: () => null,
};

export default FooterSimple;
