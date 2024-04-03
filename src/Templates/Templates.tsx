import React from "react"

import { PageStruct } from "../types"
import TemplateView from "../Components/TemplateView/TemplateView"

import { CreateTemplateRetreats } from "./TemplateRetreats"
import { CreateTemplateJewellery } from "./TemplateJewellery"
import { CreateTemplateLanding } from "./TemplateLanding"

const GetTemplates = (): Array<PageStruct[]> => {
    return [
        CreateTemplateLanding(),
        CreateTemplateRetreats(),
        CreateTemplateJewellery(),
    ]
}

interface TemplatesProps {
    onClick: (items: PageStruct[]) => void
}

const TemplateViews: React.FC<TemplatesProps> = (props) => {
    const templatesGallery = GetTemplates()

    return (
        <>
            {templatesGallery.map(template => {
                const firstPage = template[0]

                return (
                    <TemplateView
                        key={`${firstPage.id}-${Math.random()}`}
                        onClick={() => props.onClick(template)}
                        title={firstPage.description}
                    >
                        {firstPage.content?.map(content => {
                            const Component = content.Component
                            return (
                                <Component
                                    key={`${content.id}-${Math.random()}`}
                                    {...content.props}
                                />
                            )
                        })}
                    </TemplateView>
                )
            })}
        </>
    )
}

export default TemplateViews
