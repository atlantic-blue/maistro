import React from "react"
import { ProjectsContext } from "../../Projects"
import { useParams } from "react-router-dom"
import { Badge, Box, Button, DropdownMenu, Flex, Text, TextField } from "@radix-ui/themes"
import EditorData, { EditorDataType } from "./EditorData"
import env from "../../env"
import { SectionShoppingCartBasicProps } from "../../Templates/Section/SectionShoppingCart/SectionShoppingCartBasic/SectionShoppingCartBasic"

interface EditorProps {
    onSaveData: (props: SectionShoppingCartBasicProps) => void
    onUploadFile: (file: File) => Promise<string>
    children: React.ReactNode
}

const SectionShoppingCartBasicEditor: React.FC<SectionShoppingCartBasicProps & EditorProps> = (props) => {
    const { projects } = React.useContext(ProjectsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")
    const [state, setState] = React.useState(props)

    const onSave = () => {
        props.onSaveData({
            projectId: projectId || "",
            currency: project.getCurrency(),
            checkoutUrl: state.checkoutUrl,
        })
    }

    return (
        <>
            <Flex gap="3" mt="4" justify="end" mb="2">
                <Button onClick={onSave}>Save</Button>
            </Flex>

            <Text as="div" size="2" mb="1" weight="bold">
                Checkout URL
            </Text>

            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    <Button variant="soft">
                        {state.checkoutUrl ? `${state.checkoutUrl}` : "Select Page"}
                        <DropdownMenu.TriggerIcon />
                    </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    {Object.values(project.getPages()).map(page => {
                        return (
                            <DropdownMenu.Item
                                key={page.getId()}
                                onClick={() => {
                                    setState(prev => {
                                        return {
                                            ...prev,
                                            checkoutUrl: `/${page.getPath() === "index" ? "" : page.getPath()}`,
                                        }
                                    })
                                }}
                            >
                                {`/${page.getPath()}`}
                            </DropdownMenu.Item>
                        )
                    })}
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </>
    )
}

export default SectionShoppingCartBasicEditor
