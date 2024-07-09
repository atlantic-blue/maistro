import { useParams } from "react-router-dom"
import { ProjectsContext } from "../../../../../Projects"
import { Card, Flex, Heading, Inset, Text } from "@radix-ui/themes"
import React from "react"
import Thumbnail from "../../../../../Components/Thumbnail/Thumbnail"
import ProjectContent from "../../../../../Store/ProjectContent"

interface SectionCustomProps {
    onClick: (template: ProjectContent) => Promise<void>
}

const SectionCustom: React.FC<SectionCustomProps> = (props) => {
    const { projects } = React.useContext(ProjectsContext)
    const { projectId, pageId } = useParams()

    const project = projects.getProjectById(projectId || "")
    const page = project.getPageById(pageId || "")
    if (!projectId || !project || !page) {
        return null
    }

    const sections = Object.values(project.getContent()).map(content => {
        return (
            <Card
                key={content.getId()}
                style={{ height: "200px", width: "200px" }}
                onClick={() => props.onClick(content)}
            >
                <Flex direction="column" justify="center" align="center">
                    <Inset clip="padding-box" side="top" pb="current">
                        <Thumbnail {...{
                            dimensions: {
                                width: `200px`,
                                height: `120px`,
                                scale: 0.5,
                            }
                        }}>
                            <content.Component {...content.getData()} />
                        </Thumbnail>
                    </Inset>
                    <Heading
                        as="h4"
                    >
                        {content.getTemplate().toLocaleLowerCase().replaceAll("_", " ")}
                    </Heading>
                    <Text as="p">
                        {new Date(content.getCreatedAt()).toLocaleDateString()}
                    </Text>

                </Flex>
            </Card>
        )
    })
    return (
        <Flex direction="row" wrap="wrap" align="center" gap="2">
            {sections}
        </Flex>
    )
}

export default SectionCustom
