import React from "react"
import classNames from 'classnames'
import { Droppable, Draggable } from "react-beautiful-dnd";

import { PageContext } from "../../PageContext";
import { PageMessageType } from "../../types";
import PageContent from "../../Store/PageContent";

import IconUp from "../Icons/Up/Up";
import Editable from "../Editable/Editable";
import IconBin from "../Icons/Bin/Bin"

import { moveItemDown, moveItemUp } from "./utils";
import * as styles from "./Droppable.scss"

const COMPONENT_ID = "droppable"

const DroppableComponent: React.FC = () => {
    const { page } = React.useContext(PageContext)

    const onMoveContentUp = (content: PageContent) => {
        const nextContent = moveItemUp(page.getContent(), content)
        page.event$.next({
            type: PageMessageType.SET_CONTENT,
            data: nextContent
        })
    }

    const onMoveContentDown = (content: PageContent) => {
        const nextContent = moveItemDown(page.getContent(), content)
        page.event$.next({
            type: PageMessageType.SET_CONTENT,
            data: nextContent
        })
    }

    const onDeleteContent = (currentItem: PageContent) => {
        const nextContent = page.getContent().filter(
            content => content.getId() !== currentItem.getId()
        )
        page.event$.next({
            type: PageMessageType.SET_CONTENT,
            data: nextContent
        })
    }

    return (
        <>
            <Droppable droppableId={COMPONENT_ID}>
                {(provided, snapshot) => (
                    <div
                        id={COMPONENT_ID}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={snapshot.isDraggingOver ? styles.listDragging : styles.list}
                    >
                        {page.getContent().map((content, index) => (
                            <Draggable key={content.getId()} draggableId={content.getId()} index={index}>
                                {(provided, snapshot) => {
                                    return (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={provided.draggableProps.style}
                                            className={classNames({
                                                [styles.item]: !snapshot.isDragging,
                                                [styles.itemDragging]: snapshot.isDragging,
                                            })}
                                        >
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

                                            <div>
                                                <Editable content={content} />
                                            </div>
                                        </div>
                                    )
                                }}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable >
        </>
    )
}

export default DroppableComponent