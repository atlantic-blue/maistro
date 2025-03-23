import React, { useState } from 'react';

import { TemplateStruct, TemplateCategory } from '../../../templateTypes';

import * as styles from "./SectionAboutUsInteractive.scss"

const SectionAboutUsInteractive = (props) => {
    const [activeTab, setActiveTab] = useState('mission');

    return (
        <div className={styles.aboutUs}  {...props}>
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

export const SectionAboutUsInteractiveItem: TemplateStruct = {
    name: "SectionAboutUsInteractive",
    Component: SectionAboutUsInteractive,
    categories: [TemplateCategory.ABOUT],
    description: "",
    classNames: [
        ...Object.values(styles)
    ],
    ComponentEditor: () => null,
    props: {},
}

export default SectionAboutUsInteractive;