import React, { useState } from 'react';

import { ContentStruct, ContentCategory } from '../../../../../types';

import * as styles from "./SectionAboutUsInteractive.scss"

const SectionAboutUsInteractive = () => {
    const [activeTab, setActiveTab] = useState('mission');

    return (
        <div className={styles.aboutUs}>
            <div className={styles.tabs}>
                <button className={activeTab === 'mission' ? styles.active : ''} onClick={() => setActiveTab('mission')}>Mission</button>
                <button className={activeTab === 'vision' ? styles.active : ''} onClick={() => setActiveTab('vision')}>Vision</button>
                <button className={activeTab === 'history' ? styles.active : ''} onClick={() => setActiveTab('history')}>History</button>
            </div>
            <div className={styles.content}>
                {activeTab === 'mission' && <p>Our mission is to deliver unparalleled service.</p>}
                {activeTab === 'vision' && <p>Our vision is to innovate and expand globally.</p>}
                {activeTab === 'history' && <p>We started in 2005 with just five employees.</p>}
            </div>
        </div>
    );
};

export const SectionAboutUsInteractiveItem: ContentStruct = {
    id: "SectionAboutUsInteractive",
    Component: SectionAboutUsInteractive,
    categories: [ContentCategory.ABOUT, ContentCategory.TEXT],
    description: "",
    classNames: [
        ...Object.values(styles)
    ],
}

export default SectionAboutUsInteractive;