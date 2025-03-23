import React, { useState } from 'react';

import { TemplateStruct, TemplateCategory } from '../../../templateTypes';

import * as styles from './SectionContactInteractive.scss';

const SectionContactInteractive = (props) => {
    const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

    const toggleFAQ = (id: number) => setActiveFAQ(activeFAQ === id ? null : id);

    return (
        <div className={styles.container} {...props}>
            <div className={styles.formContainer}>
                <h2>Have Questions?</h2>
                {/* TODO Implement FAQ toggle logic here */}
                <div className={styles.faq} onClick={() => toggleFAQ(1)}>
                    <h3>What services do you offer?</h3>
                    {activeFAQ === 1 && <p>Details about services...</p>}
                </div>
                {/* TODO Add more FAQs as needed */}
            </div>
            <div className={styles.contactForm}>
                <form>
                    <input type="text" placeholder="Your Name" />
                    <input type="email" placeholder="Your Email" />
                    <textarea placeholder="Your Message"></textarea>
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    );
};

export const SectionContactInteractiveItem: TemplateStruct = {
    name: "section-contact-interactive",
    description: "Interactive FAQs with a contact form for user engagement.",
    Component: SectionContactInteractive,
    categories: [TemplateCategory.CONTACT],
    classNames: [
        ...Object.values(styles)
    ],
    ComponentEditor: () => null,
    props: {},
};

export default SectionContactInteractive;