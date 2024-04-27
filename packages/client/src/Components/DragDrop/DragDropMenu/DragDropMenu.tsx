import React from "react"

import { PageContext } from "../../../PageContext";
import { PageMessageType } from "../../../types";
import { moveItemDown, moveItemUp } from "../utils";
import ProjectContent from "../../../Store/ProjectContent";

import classNames from "classnames";
import IconUp from "../../Icons/Up/Up";
import IconBin from "../../Icons/Bin/Bin";

import * as styles from "../Droppable.scss"

const DragDropMenu: React.FC = () => {
    const { page } = React.useContext(PageContext)

    const onMoveContentUp = (content: ProjectContent) => {
        const nextContent = moveItemUp(page.getContent(), content)
        page.event$.next({
            type: PageMessageType.SET_CONTENT,
            data: nextContent
        })
    }

    const onMoveContentDown = (content: ProjectContent) => {
        const nextContent = moveItemDown(page.getContent(), content)
        page.event$.next({
            type: PageMessageType.SET_CONTENT,
            data: nextContent
        })
    }

    const onDeleteContent = (currentItem: ProjectContent) => {
        const nextContent = page.getContent().filter(
            content => content.getId() !== currentItem.getId()
        )
        page.event$.next({
            type: PageMessageType.SET_CONTENT,
            data: nextContent
        })
    }

    return (
        <div className={styles.itemHelper}>
            <span>
                <button className={styles.itemHelperButton} onClick={() => onMoveContentUp(content)}>
                    <IconUp className={styles.itemHelperIcon} />
                </button>
            </span>
            <span>
                <button className={styles.itemHelperButton} onClick={() => onMoveContentDown(content)}>
                    <IconUp className={classNames(styles.itemHelperIcon, styles.itemHelperIconDown)} />
                </button>
            </span>
            <span>
                <button className={styles.itemHelperButton} onClick={() => onDeleteContent(content)}>
                    <IconBin className={styles.itemHelperIcon} />
                </button>
            </span>
        </div>
    )
}

export default DragDropMenu
