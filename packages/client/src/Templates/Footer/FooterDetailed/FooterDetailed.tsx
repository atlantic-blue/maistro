import React from 'react';


import * as styles from './FooterDetailed.scss';
import { ContentCategory, TemplateStruct } from '../../templateTypes';

const FooterDetailed = () => (
    <footer className={styles.detailedFooter}>
        <div className={styles.section}>
            <h3>About Us</h3>
            <p>Leading innovation in our industry for over a decade.</p>
        </div>
        <div className={styles.section}>
            <h3>Quick Links</h3>
            <ul>
                <li><a href="/terms">Terms of Service</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
            </ul>
        </div>
        <div className={styles.section}>
            <h3>Contact Us</h3>
            <p>Email: contact@example.com</p>
        </div>
    </footer>
);

export const FooterDetailedItem: TemplateStruct = {
    name: "footer-detailed",
    description: "A comprehensive footer that includes about info, quick links, and contact details.",
    Component: FooterDetailed,
    categories: [ContentCategory.FOOTER],
    classNames: [
        ...Object.values(styles)
    ],
    ComponentEditor: () => null,
    props: {},
};

export default FooterDetailed;
