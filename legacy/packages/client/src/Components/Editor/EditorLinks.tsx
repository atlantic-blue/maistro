import React from "react"
import { Box, Button, Card, Checkbox, DropdownMenu, Flex, Tabs, Text } from "@radix-ui/themes"
import { randImg } from "@ngneat/falso"

import EditorData, { EditorDataType, EditorLinksProps } from "./EditorData"
import { ProjectsContext } from "../../Projects"
import { useParams } from "react-router-dom"

const EditorLinks: React.FC<EditorLinksProps> = (props) => {
    const { projects } = React.useContext(ProjectsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")

    return (
        <Box>
            {
                props.links.map((link, index) => {
                    if (typeof link.name !== "string") {
                        return
                    }

                    return (
                        <Card key={index} mb="2">
                            <Text as="div" size="1" mb="1" weight="bold">
                                Link
                            </Text>

                            <Box>
                                <Tabs.Root defaultValue={link.imgSrc ? "image" : "label"}>
                                    <Tabs.List size="2">
                                        <Tabs.Trigger value="label">Label</Tabs.Trigger>
                                        <Tabs.Trigger value="image">Image</Tabs.Trigger>
                                    </Tabs.List>
                                    <Box pt="3" width="100%">
                                        <Tabs.Content value="label">
                                            <EditorData
                                                type={EditorDataType.TEXT}
                                                name=""
                                                value={link.name}
                                                onChange={data => props.onChange(prev => {
                                                    prev[index] = {
                                                        ...prev[index],
                                                        name: data,
                                                    }
                                                    return [
                                                        ...prev
                                                    ]
                                                })}
                                            />
                                        </Tabs.Content>

                                        <Tabs.Content value="image">
                                            <EditorData
                                                type={EditorDataType.IMAGE}
                                                name="Image"
                                                value={link.imgSrc}
                                                onChange={data => props.onChange(prev => {
                                                    prev[index] = {
                                                        ...prev[index],
                                                        imgSrc: data,
                                                    }
                                                    return [
                                                        ...prev
                                                    ]
                                                })}
                                                onUploadFile={props.onUploadFile}
                                            />
                                        </Tabs.Content>
                                    </Box>
                                </Tabs.Root>
                            </Box>


                            <Box m="2">
                                <Tabs.Root defaultValue="page">
                                    <Tabs.List size="2">
                                        <Tabs.Trigger value="page">Page</Tabs.Trigger>
                                        <Tabs.Trigger value="external">External</Tabs.Trigger>
                                    </Tabs.List>

                                    <Box pt="3" width="100%">
                                        <Tabs.Content value="page">
                                            <DropdownMenu.Root>
                                                <DropdownMenu.Trigger>
                                                    <Button variant="soft">
                                                        {link.href ? `${link.href}` : "Select Page"}
                                                        <DropdownMenu.TriggerIcon />
                                                    </Button>
                                                </DropdownMenu.Trigger>
                                                <DropdownMenu.Content>
                                                    {Object.values(project.getPages()).map(page => {
                                                        return (
                                                            <DropdownMenu.Item
                                                                key={page.getId()}
                                                                onClick={() => {
                                                                    props.onChange(prev => {
                                                                        prev[index] = {
                                                                            ...prev[index],
                                                                            href: `/${page.getPath() === "index" ? "" : page.getPath()}`,
                                                                        }

                                                                        return [
                                                                            ...prev
                                                                        ]
                                                                    })
                                                                }}
                                                            >
                                                                {`/${page.getPath()}`}
                                                            </DropdownMenu.Item>
                                                        )
                                                    })}
                                                </DropdownMenu.Content>
                                            </DropdownMenu.Root>
                                        </Tabs.Content>

                                        <Tabs.Content value="external">
                                            <EditorData
                                                type={EditorDataType.TEXT}
                                                name=""
                                                value={link.href}
                                                onChange={data => props.onChange(prev => {
                                                    prev[index] = {
                                                        ...prev[index],
                                                        href: data,
                                                    }
                                                    return [
                                                        ...prev
                                                    ]
                                                })}
                                            />
                                        </Tabs.Content>
                                    </Box>
                                </Tabs.Root>
                            </Box>

                            <EditorData
                                type={EditorDataType.TEXT}
                                name="Description"
                                value={link.description}
                                onChange={data => props.onChange(prev => {
                                    prev[index] = {
                                        ...prev[index],
                                        description: data,
                                    }
                                    return [
                                        ...prev
                                    ]
                                })}
                            />

                            <Text as="label" size="2">
                                <Flex gap="2">
                                    <Checkbox defaultChecked={Boolean(link.isExternal)}
                                        onClick={() => props.onChange(prev => {
                                            prev[index] = {
                                                ...prev[index],
                                                isExternal: !link.isExternal,
                                            }
                                            return [
                                                ...prev
                                            ]
                                        })}
                                    />
                                    Open in a new tab
                                </Flex>
                            </Text>

                            <Flex justify="end" m="2">
                                <Button size="1" variant="ghost" onClick={() => {
                                    props.onChange(prev => {

                                        return prev.filter(i => i !== link)
                                    })
                                }}>
                                    Remove
                                </Button>
                            </Flex>
                        </Card>
                    )
                })
            }

            <Button
                size="1"
                variant="ghost"
                onClick={() => props.onChange([
                    ...props.links,
                    {
                        href: "#Edit-me!",
                        name: "Edit me",
                        description: "Edit me!",
                        isExternal: false,
                        imgSrc: randImg(),
                    }])
                }>
                Create Link
            </Button>
        </Box>
    )
}

export default EditorLinks
