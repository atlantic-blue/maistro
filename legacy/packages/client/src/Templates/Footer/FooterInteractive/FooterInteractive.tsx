import React, { useState } from 'react';

import * as styles from './FooterInteractive.scss';
import { TemplateCategory, TemplateStruct } from '../../templateTypes';

const FooterInteractive = () => {
    const [feedback, setFeedback] = useState('');

    const handleFeedbackChange: React.FormEventHandler<HTMLFormElement> = (event) => {
        setFeedback(event.target.value);
    };

    const submitFeedback: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
        event.preventDefault();
        alert(`Feedback submitted: ${feedback}`);
        setFeedback(''); // Reset feedback input after submission
    };

    return (
        <footer className={styles.interactiveFooter}>
            <form onSubmit={submitFeedback}>
                <h3>Your Feedback</h3>
                <textarea value={feedback} onChange={handleFeedbackChange} placeholder="Share your thoughts"></textarea>
                <button type="submit">Submit</button>
            </form>
        </footer>
    );
};

export const FooterInteractiveItem: TemplateStruct = {
    name: "footer-interactive",
    description: "An interactive footer that engages users by collecting their feedback directly.",
    Component: FooterInteractive,
    categories: [TemplateCategory.FOOTER],
    classNames: [
        ...Object.values(styles)
    ],
    ComponentEditor: () => null,
    props: {},
};

export default FooterInteractive;
