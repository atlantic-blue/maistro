import React from "react"

import { PageStruct } from "../types"
import TemplateView from "../Components/TemplateView/TemplateView"

import { CreateTemplateRetreats } from "./TemplateRetreats"
import { CreateTemplateJewellery } from "./TemplateJewellery"
import { CreateTemplateLanding } from "./TemplateLanding"
import { CreateTemplateMaistro } from "./TemplateMaistro"
import { CreateTemplateLogin } from "./TemplateLogin"
import { ThumbnailProps } from "../Components/Thumbnail/Thumbnail"

const GetTemplates = (): Array<PageStruct[]> => {
    return [
        CreateTemplateLanding(),
        CreateTemplateLogin(),
        CreateTemplateMaistro(),
        CreateTemplateRetreats(),
        CreateTemplateJewellery(),
    ]
}

interface TemplatesProps {
    className?: string
    onClick: (items: PageStruct[]) => void
    thumbnail?: Partial<ThumbnailProps>
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
                        className={props.className}
                        thumbnail={props.thumbnail}
                    >
                        {firstPage.content?.map(content => {
                            const Component = content.Component
                            return (
                                <Component
                                    key={`${content.name}-${Math.random()}`}
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
