import React, { useEffect } from "react"
import classNames from 'classnames'
import { Draggable } from "react-beautiful-dnd";

import IconUp from "../Icons/Up/Up";
import IconBin from "../Icons/Bin/Bin"

import { ProjectsContext } from "../../Projects";
import { useParams } from "react-router-dom";
import ErrorBoundary from "../../Errors/ErrorBoundary";
import { Box, Dialog, Flex, IconButton, Tabs, Text } from "@radix-ui/themes";
import IconEdit from "../Icons/Edit/Edit";
import sanitiseInput from "../../Utils/sanitiseInput";
import IconClose from "../Icons/Close/Close";
import { ApiContext } from "../../Api/ApiProvider";
import { templates } from "../../Templates";
import editors from "../Editor";

import * as styles from "./Droppable.scss"
import { convertFileToBase64 } from "../../Utils/toBase64";

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

    // TODO undo
    // useEffect(() => {
    //     const componentWrappers = Array.from(document.getElementsByClassName(COMPONENT_WRAPPER_CLASS))
    //     componentWrappers.forEach(componentWrapper => {
    //         const anchors = Array.from(componentWrapper.getElementsByTagName('a'));
    //         const buttons = Array.from(componentWrapper.getElementsByTagName('button'));

    //         [
    //             ...anchors,
    //             ...buttons,
    //         ].forEach(element => {
    //             element.onclick = (e) => {
    //                 e.preventDefault();
    //                 e.stopPropagation();
    //                 e.stopImmediatePropagation();
    //                 // TODO add a toast message
    //                 alert("Publish your page test the link.")
    //             }
    //         });
    //     })
    // }, [])

    if (!projectId) {
        return null
    }

    const content = project.getContentById(props.itemId)
    if (!content) {
        return null
    }

    const template = templates[content.getTemplate()]
    if (!template) {
        return null
    }

    const Component = template?.Component
    const ComponentEditor = editors[template?.name] || (() => null)

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

    const onUploadFile = async (file: File): Promise<string> => {
        try {
            const maxSize = 5 * 1024 * 1024; // 5 MB limit
            if (file.size > maxSize) {
                // TODO app level error
                console.log(`File size should not exceed 5 MB.`)
                return ""
            }

            const fileBase64 = await convertFileToBase64(file)
            const { src } = await api.file.createFile({
                // token: user.getTokenId(),
                userId: user.getId(),
                projectId,
                fileContent: fileBase64,
                fileName: file.name,
                fileType: file.type,
            })

            return src
        } catch (error) {
            // TODO app level error
            console.log(error)
            return ""
        }
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
                                    {Boolean(ComponentEditor) &&
                                        (
                                            <Dialog.Trigger>
                                                <IconButton size="1" className={styles.itemHelperButton} onClick={() => setIsEditing(!isEditing)}>
                                                    <IconEdit className={styles.itemHelperIcon} />
                                                </IconButton>
                                            </Dialog.Trigger>
                                        )
                                    }

                                    {props.itemIndex ?
                                        (
                                            <IconButton size="1" className={styles.itemHelperButton} onClick={() => props.onMoveContentUp(props.itemId)}>
                                                <IconUp className={styles.itemHelperIcon} />
                                            </IconButton>
                                        ) : null
                                    }

                                    <IconButton size="1" className={styles.itemHelperButton} onClick={() => props.onMoveContentDown(props.itemId)}>
                                        <IconUp className={classNames(styles.itemHelperIcon, styles.itemHelperIconDown)} />
                                    </IconButton>


                                    <IconButton size="1" className={styles.itemHelperButton} onClick={() => props.onDeleteContent(props.itemId)}>
                                        <IconBin className={styles.itemHelperIcon} />
                                    </IconButton>
                                </div>

                                <div>
                                    <div className={COMPONENT_WRAPPER_CLASS}>
                                        <Component {...componentProps} />
                                    </div>

                                    <Dialog.Content maxWidth="800px">
                                        <Flex>
                                            <Dialog.Close>
                                                <IconButton size="1" variant="soft" color="gray" style={{ marginLeft: "auto" }}>
                                                    <IconClose style={{ width: "10px" }} />
                                                </IconButton>
                                            </Dialog.Close>
                                        </Flex>

                                        <Dialog.Title>Edit </Dialog.Title>
                                        <Flex direction="column" gap="3">
                                            <Tabs.Root defaultValue="data">
                                                <Tabs.List>
                                                    <Tabs.Trigger value="data">Data</Tabs.Trigger>
                                                    <Tabs.Trigger value="styles">Styles</Tabs.Trigger>
                                                </Tabs.List>

                                                <Box pt="3">
                                                    <Tabs.Content value="data">
                                                        <ComponentEditor
                                                            {...componentProps}
                                                            onSaveData={onSaveData}
                                                            onUploadFile={onUploadFile}
                                                        />
                                                    </Tabs.Content>

                                                    <Tabs.Content value="syles">
                                                        <Text size="2">Access and update your documents.</Text>
                                                    </Tabs.Content>
                                                </Box>
                                            </Tabs.Root>

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