import React from 'react';

import { TemplateStruct, ContentCategory } from '../../../../../types';

import * as styles from './SectionContactBasic.scss';

const SectionContactBasic = () => (
    <div className={styles.container}>
        <h1>Subscribe to Our Newsletter</h1>
        <form
            action="https://api.maistro.website/v1/email/entries"
            method="POST"
            onSubmit={() => window.location.href = '/success.html'}
        >
            <div>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" required />
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required />
            </div>
            <input type="hidden" name="emailListId" value="4c613ac4-99cf-49ec-bff7-29efa4b7d8af" />
            <input type="hidden" name="redirectTo" value="/success" />
            <div>
                <button type="submit">Subscribe</button>
            </div>
        </form>
    </div>
);

export const SectionContactBasicItem: TemplateStruct = {
    name: "SectionContactBasic",
    description: "A basic contact form for user inquiries.",
    Component: SectionContactBasic,
    categories: [ContentCategory.CONTACT],
    classNames: [
        ...Object.values(styles)
    ],
};

export default SectionContactBasic;
