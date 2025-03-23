import React from "react"
import { useParams } from "react-router-dom"
import { DragDropContext as DnDContext, OnDragEndResponder } from "react-beautiful-dnd"

import { PageMessageType } from "../../types"
import { ProjectsContext } from "../../Projects"

import DroppableComponent from "./Droppable"
import * as styles from "./DragDrop.scss"

// a little function to help us with reordering the result
const reorder = (contentIds: string[], startIndex: number, endIndex: number) => {
    const result = Array.from(contentIds);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const DragAndDrop: React.FC = () => {
    const { projects } = React.useContext(ProjectsContext)
    const { projectId, pageId } = useParams()
    const project = projects.getProjectById(projectId || "")
    const page = project.getPageById(pageId || "")

    const onDragEnd: OnDragEndResponder = (dropResult) => {
        // dropped outside the list
        if (!dropResult.destination) {
            return;
        }

        const nextContentIds = reorder(
            page.getContentIds(),
            dropResult.source.index,
            dropResult.destination.index
        );

        page.event$.next({
            type: PageMessageType.SET_CONTENT_IDS,
            data: nextContentIds
        })
    }

    return (
        <div className={styles.main} >
            <div className={styles.view}>
                <DnDContext onDragEnd={onDragEnd}>
                    <DroppableComponent />
                </DnDContext>
            </div>
        </div>
    )
}

export default DragAndDrop
