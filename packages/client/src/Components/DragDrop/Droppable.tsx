import React, { useEffect } from "react"
import { Droppable } from "react-beautiful-dnd";

import { PageMessageType } from "../../types";

import { moveItemDown, moveItemUp } from "./utils";
import { ProjectsContext } from "../../Projects";
import { useParams } from "react-router-dom";
import DroppableItem from "./DroppableItem";
import { ApiContext } from "../../Api/ApiProvider";
import { debounceTime } from "rxjs";

import * as styles from "./Droppable.scss"

const COMPONENT_ID = "droppable"

const DroppableComponent: React.FC = () => {
    const { api } = React.useContext(ApiContext)
    const { projects, user } = React.useContext(ProjectsContext)
    const { projectId, pageId } = useParams()
    const project = projects.getProjectById(projectId || "")
    const page = project.getPageById(pageId || "")

    useEffect(() => {
        if (!projectId || !pageId) {
            return
        }

        const subscription = page.event$
            .pipe(
                debounceTime(1000 * 60)
            )
            .subscribe(event => {
                if (event.type === PageMessageType.SET_CONTENT_IDS) {
                    api.pages.updateById({
                        token: user.getTokenId(),
                        projectId,
                        pageId,
                        contentIds: [
                            ...new Set(event.data.filter(Boolean))
                        ]
                    })
                }
            })
        return () => {
            subscription.unsubscribe()
        }
    }, [])

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