import React from "react"
import classNames from 'classnames'
import { Droppable, Draggable } from "react-beautiful-dnd";

import { PageMessageType } from "../../types";

import { moveItemDown, moveItemUp } from "./utils";
import { ProjectsContext } from "../../Projects";
import { useParams } from "react-router-dom";
import * as styles from "./Droppable.scss"
import DroppableItem from "./DroppableItem";

const COMPONENT_ID = "droppable"

const DroppableComponent: React.FC = () => {
    const { projects } = React.useContext(ProjectsContext)
    const { projectId, pageId } = useParams()
    const project = projects.getProjectById(projectId || "")
    const page = project.getPageById(pageId || "")

    const onMoveContentUp = (contentId: string) => {
        const nextContentIds = moveItemUp(page.getContentIds(), contentId)
        page.event$.next({
            type: PageMessageType.SET_CONTENT_IDS,
            data: nextContentIds
        })
    }

    const onMoveContentDown = (contentId: string) => {
        const nextContentIds = moveItemDown(page.getContentIds(), contentId)
        page.event$.next({
            type: PageMessageType.SET_CONTENT_IDS,
            data: nextContentIds
        })
    }

    const onDeleteContent = (contentId: string) => {
        const nextContentIds = page.getContentIds().filter(
            id => id !== contentId
        )
        page.event$.next({
            type: PageMessageType.SET_CONTENT_IDS,
            data: nextContentIds
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
                        {
                            page.getContentIds().map((contentId, index) => {
                                return (
                                    <DroppableItem
                                        key={contentId}
                                        itemId={contentId}
                                        itemIndex={index}
                                        onMoveContentUp={onMoveContentUp}
                                        onMoveContentDown={onMoveContentDown}
                                        onDeleteContent={onDeleteContent}
                                    />
                                )
                            })
                        }

                        {provided.placeholder}
                    </div>
                )}
            </Droppable >
        </>
    )
}

export default DroppableComponent