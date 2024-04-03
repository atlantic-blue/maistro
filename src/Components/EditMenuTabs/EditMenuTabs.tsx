import React from 'react'
import classNames from 'classnames';

import * as styles from "./EditMenuTabs.scss"

interface ContentTabsProps {
    content: Record<string, React.ReactNode>
}

const EditMenuTabs: React.FC<ContentTabsProps> = (props) => {
    const [activeTab, setActiveTab] = React.useState(Object.keys(props.content)[0]);

    return (
        <div className={styles.tabs}>
            <div className={styles.tabsMenu}>
                {
                    Object.keys(props.content).map(tab => {
                        return (
                            <button
                                key={tab}
                                className={classNames(styles.tabsMenuTab, {
                                    [styles.tabsMenuTabActive]: activeTab === tab
                                })}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        )
                    })
                }
            </div>
            <div className={styles.tab}>
                {
                    Object.keys(props.content).map(tab => {
                        const currentTab = activeTab === tab
                        return currentTab && (
                            <React.Fragment key={tab}>
                                {props.content[tab]}
                            </React.Fragment>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default EditMenuTabs
