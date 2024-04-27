import React from 'react';

import { TemplateStruct, ContentCategory } from '../../../../../types';

import * as styles from './SectionContactDetailed.scss';

const options = [
    {
        key: "web",
        value: "Web Development",
    },
    {
        key: "design",
        value: "Graphic Design",
    },
]

const SectionContactDetailed = () => (
    <div className={styles.container}>
        <h2>Contact Us for More Info</h2>
        <form>
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Your Email" />
            <input type="tel" placeholder="Your Phone Number" />
            {options.length && <select>
                <option value="">Select a Service</option>
                {options.map(o => {
                    return (
                        <option key={o.key} value={o.key}>{o.value}</option>
                    )
                })}
            </select>}
            <textarea placeholder="Your Message"></textarea>
            <button type="submit">Send Message</button>
        </form>
    </div>
);

export const SectionContactDetailedItem: TemplateStruct = {
    name: "section-contact-detailed",
    description: "A detailed contact form for comprehensive inquiries.",
    Component: SectionContactDetailed,
    categories: [ContentCategory.CONTACT],
    classNames: [
        ...Object.values(styles)
    ],
};

export default SectionContactDetailed;
