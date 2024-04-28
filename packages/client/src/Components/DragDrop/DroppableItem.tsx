import React, { useEffect } from "react"
import classNames from 'classnames'
import { Droppable, Draggable } from "react-beautiful-dnd";

import IconUp from "../Icons/Up/Up";
import IconBin from "../Icons/Bin/Bin"

import { ProjectsContext } from "../../Projects";
import { useParams } from "react-router-dom";
import { templates } from "../Gallery";
import ErrorBoundary from "../../Errors/ErrorBoundary";
import { Button, Dialog, Flex, IconButton, TextField, Text } from "@radix-ui/themes";
import IconEdit from "../Icons/Edit/Edit";
import sanitiseInput from "../../Utils/sanitiseInput";
import { merge } from "lodash";
import * as styles from "./Droppable.scss"
import IconClose from "../Icons/Close/Close";
import { ApiContext } from "../../Api/ApiProvider";

interface DroppableItemProps {
    itemIndex: number
    itemId: string
    onMoveContentUp: (id: string) => void
    onMoveContentDown: (id: string) => void
    onDeleteContent: (id: string) => void
}

const COMPONENT_WRAPPER_CLASS = "COMPONENT_WRAPPER"

const DroppableItem: React.FC<DroppableItemProps> = (props) => {
    const { api } = React.useContext(ApiContext)
    const { projects, user } = React.useContext(ProjectsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")
    const [isEditing, setIsEditing] = React.useState(false)
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        const componentWrappers = Array.from(document.getElementsByClassName(COMPONENT_WRAPPER_CLASS))
        componentWrappers.forEach(componentWrapper => {
            const anchors = Array.from(componentWrapper.getElementsByTagName('a'));
            const buttons = Array.from(componentWrapper.getElementsByTagName('button'));

            [
                ...anchors,
                ...buttons,
            ].forEach(element => {
                element.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    // TODO add a toast message
                    alert("Publish your page test the link.")
                }
            });
        })
    }, [])

    if (!projectId) {
        return null
    }

    const content = project.getContentById(props.itemId)
    if (!content) {
        return null
    }

    const template = templates[content.getTemplateName()]
    if (!template) {
        return null
    }

    const Component = template?.Component
    const ComponentEditor = template?.ComponentEditor

    if (!Component) {
        return null
    }

    const componentProps = content.getData()

    if (!props) {
        return null
    }

    const onSaveData = async (input: Object) => {
        const data = sanitiseInput(input)
        const newData = {
            ...content?.getData() || {},
            ...data,
        }

        content.setData(newData)
        setOpen(false)

        // TODO error handling
        await api.content.updateById({
            token: user.getTokenId(),
            projectId,
            contentId: props.itemId,
            data: newData
        })
    }

    return (
        <ErrorBoundary>
            <Draggable draggableId={props.itemId} index={props.itemIndex}>
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
                            <Dialog.Root open={open} onOpenChange={setOpen}>
                                <div className={styles.itemHelper}>
                                    <Flex gap="1" direction="row" align="center">
                                        {Boolean(ComponentEditor) &&
                                            (
                                                <Dialog.Trigger>
                                                    <IconButton className={styles.itemHelperButton} onClick={() => setIsEditing(!isEditing)}>
                                                        <IconEdit className={styles.itemHelperIcon} />
                                                    </IconButton>
                                                </Dialog.Trigger>
                                            )
                                        }

                                        {props.itemIndex ?
                                            (
                                                <IconButton className={styles.itemHelperButton} onClick={() => props.onMoveContentUp(props.itemId)}>
                                                    <IconUp className={styles.itemHelperIcon} />
                                                </IconButton>
                                            ) : null
                                        }

                                        <IconButton className={styles.itemHelperButton} onClick={() => props.onMoveContentDown(props.itemId)}>
                                            <IconUp className={classNames(styles.itemHelperIcon, styles.itemHelperIconDown)} />
                                        </IconButton>


                                        <IconButton className={styles.itemHelperButton} onClick={() => props.onDeleteContent(props.itemId)}>
                                            <IconBin className={styles.itemHelperIcon} />
                                        </IconButton>
                                    </Flex>
                                </div>

                                <div>
                                    <div className={COMPONENT_WRAPPER_CLASS}>
                                        <Component {...componentProps} />
                                    </div>

                                    <Dialog.Content maxWidth="450px">
                                        <Flex>
                                            <Dialog.Close>
                                                <IconButton size="1" variant="soft" color="gray" style={{ marginLeft: "auto" }}>
                                                    <IconClose style={{ width: "10px" }} />
                                                </IconButton>
                                            </Dialog.Close>
                                        </Flex>

                                        <Dialog.Title>Edit </Dialog.Title>
                                        <Flex direction="column" gap="3">
                                            <ComponentEditor {...componentProps} onSaveData={onSaveData} />
                                        </Flex>
                                    </Dialog.Content>

                                </div>
                            </Dialog.Root>
                        </div>
                    )
                }}
            </Draggable>
        </ErrorBoundary >
    )
}

export default DroppableItem