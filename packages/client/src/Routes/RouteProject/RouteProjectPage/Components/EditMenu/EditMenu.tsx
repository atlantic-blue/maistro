import React from "react"

import EditMenuItem from "../../../../../Components/EditMenuItem/EditMenuItem"

import { PageContext } from "../../../../../PageContext"
import { TemplateStruct, PageMessageType } from "../../../../../types"
import SearchItem from "../../../../../Components/SearchItem/SearchItem"
import ProjectContent from "../../../../../Store/ProjectContent"
import { GetTemplates } from "../../../../../Components/Gallery"

import * as styles from "./EditMenu.scss"

interface ContentMenuProps {

}

const ContentMenu: React.FC<ContentMenuProps> = () => {
    const { page } = React.useContext(PageContext)
    const ref = React.useRef<HTMLDivElement>(null)

    const onSearchClick = (content: TemplateStruct) => {
        const contentActive = page.getContentActive()
        if (!contentActive) {
            return
        }

        // TODO fix with a subscription
        page.getContent()[page.getContent().indexOf(contentActive)] = new ProjectContent(content)
        page.event$.next({
            type: PageMessageType.SET_CONTENT,
            data: page.getContent()
        })

        page.event$.next({
            type: PageMessageType.SET_CONTENT_ID_ACTIVE,
            data: null
        })
    }

    const contentActive = page.getContentActive()
    return true ? (
        <div className={styles.menu} ref={ref}>
            <EditMenuItem title="Content" show>
                <SearchItem
                    activeItem={contentActive}
                    templates={GetTemplates()}
                    onClick={onSearchClick}
                />
            </EditMenuItem>
        </div>
    ) : null
}

export default ContentMenu