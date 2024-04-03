import React from "react"

import EditMenuTabs from "../../../../../Components/EditMenuTabs/EditMenuTabs"
import EditMenuItem from "../../../../../Components/EditMenuItem/EditMenuItem"

import { PageContext } from "../../../../../PageContext"
import { ContentStruct, PageMessageType } from "../../../../../types"
import SearchItem from "../../../../../Components/SearchItem/SearchItem"
import PageContent from "../../../../../Store/PageContent"
import { GetTemplates } from "../../../../../Components/Gallery"

import * as styles from "./EditMenu.scss"

const ContentMenu = () => {
    const { page } = React.useContext(PageContext)
    const ref = React.useRef<HTMLDivElement>(null)

    const onSearchClick = (content: ContentStruct) => {
        const contentActive = page.getContentActive()
        if (!contentActive) {
            return
        }

        // TODO fix with a subscription
        page.getContent()[page.getContent().indexOf(contentActive)] = new PageContent(content)
        page.event$.next({
            type: PageMessageType.SET_CONTENT,
            data: page.getContent()
        })

        page.event$.next({
            type: PageMessageType.SET_CONTENT_ACTIVE,
            data: null
        })
    }

    const contentActive = page.getContentActive()
    return contentActive ? (
        <div className={styles.menu} ref={ref}>
            <EditMenuItem title="Edit Content" show>
                <EditMenuTabs
                    content={
                        {
                            "Sections": <SearchItem activeItem={contentActive} templates={GetTemplates()} onClick={onSearchClick} />,
                        }
                    }
                />
            </EditMenuItem>
        </div>
    ) : null
}

export default ContentMenu