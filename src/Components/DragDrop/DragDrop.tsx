import React, { useContext } from "react"

import { DragDropContext as DnDContext, OnDragEndResponder } from "react-beautiful-dnd"

import DroppableComponent from "./Droppable"
import { PageContext } from "../../PageContext"

import { PageMessageType, ContentStruct } from "../../types"
import * as styles from "./DragDrop.scss"
import PageContent from "../../Store/PageContent"

// a little function to help us with reordering the result
const reorder = (content: PageContent[], startIndex: number, endIndex: number) => {
    const result = Array.from(content);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const DragAndDrop: React.FC = () => {
    const { page } = useContext(PageContext)

    const onDragEnd: OnDragEndResponder = (dropResult) => {
        // dropped outside the list
        if (!dropResult.destination) {
            return;
        }

        const nextItems = reorder(
            page.getContent(),
            dropResult.source.index,
            dropResult.destination.index
        );

        page.event$.next({ type: PageMessageType.SET_CONTENT, data: nextItems })
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
