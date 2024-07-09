import { Box, Button, Card, Flex, Inset, Strong, Text } from "@radix-ui/themes"
import React from "react"
import { TemplateCategory, TemplateStruct } from "../../../../../Templates/templateTypes"
import { templates } from "../../../../../Templates";
import TemplateView from "../../../../../Components/TemplateView/TemplateView";
import Thumbnail from "../../../../../Components/Thumbnail/Thumbnail";

const capitalise = (input: string) => {
    return input.charAt(0).toUpperCase() + input.slice(1);
}

interface TemplateThumbnail {
    category: TemplateCategory
    onClick?: (template: TemplateStruct) => void
    className?: string
}

export const TemplateThumbnail: React.FC<TemplateThumbnail> = (props) => {
    const template = Object.values(templates)
        .find(template => {
            return template.categories.includes(props.category)
        })

    if (!template) {
        return null
    }

    const Component = template.Component
    return (
        <Thumbnail {...{
            dimensions: {
                width: `140px`,
                height: `120px`,
                scale: 0.3,
            }
        }}>
            <Component {...template.props} />
        </Thumbnail>
    )
}

const TemplateThumbnails: React.FC<{ onClick: (category: TemplateCategory) => void }> = (props) => {
    return Object.values(TemplateCategory).map(category => {
        return (
            <Card key={category} onClick={() => props.onClick(category)} style={{ height: "155px", width: "140px" }}>
                <Flex direction="column" justify="center" align="center">
                    <Inset clip="padding-box" side="top" pb="current">
                        <TemplateThumbnail
                            category={category}
                        />
                    </Inset>
                    <Button variant="ghost">
                        {capitalise(category.toLowerCase())}
                    </Button>
                </Flex>
            </Card>
        )
    })
}

interface SelectedTemplatesProps {
    templates: TemplateStruct[]
    onClick: (template: TemplateStruct) => void
}

const SelectedTemplates: React.FC<SelectedTemplatesProps> = (props) => {
    return props.templates?.map(template => {
        const Component = template.Component
        return (
            <Card key={template.name} onClick={() => props.onClick(template)} style={{ height: "155px", width: "140px" }}>
                <Flex direction="column" justify="center" align="center">
                    <Inset clip="padding-box" side="top" pb="current">
                        <Thumbnail {...{
                            dimensions: {
                                width: `140px`,
                                height: `120px`,
                                scale: 0.5,
                            }
                        }}>
                            <Component {...template.props} />
                        </Thumbnail>
                    </Inset>
                    <Button variant="ghost">
                        {capitalise(template.name.replaceAll("_", " ").toLowerCase())}
                    </Button>
                </Flex>
            </Card>
        )
    })
}

const SectionFlow: React.FC<{ onTemplateClick: (template: TemplateStruct) => Promise<void> }> = (props) => {
    const [category, setCategory] = React.useState<TemplateCategory | null>(null)

    const onCategoryClick = (category: TemplateCategory) => {
        setCategory(category)
    }

    const selectedTemplates = Object.values(templates)
        .filter(template => {
            return category && template.categories.includes(category)
        })

    return (
        <Flex gap="2" justify="center" align="center" wrap="wrap">
            {!category ? (
                <TemplateThumbnails
                    onClick={onCategoryClick}
                />
            ) : (
                <SelectedTemplates
                    templates={selectedTemplates}
                    onClick={props.onTemplateClick}
                />
            )}
        </Flex>
    )
}

export default SectionFlow
