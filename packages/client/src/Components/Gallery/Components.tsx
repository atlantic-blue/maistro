import React from 'react'

import GalleryItem from '../TemplateView/TemplateView'
import ProjectContent from '../../Store/ProjectContent'
import { TemplateStruct } from '../../types'

interface ComponentsGalleryProps {
    onClick: (content: TemplateStruct) => void
    templates: TemplateStruct[]
}

const ComponentsGallery: React.FC<ComponentsGalleryProps> = (props) => {
    return props.templates.map(template => {
        const Component = template.Component
        return (
            <GalleryItem
                key={`${template.name}-${Math.random()}`}
                onClick={() => props.onClick(template)}
                title={template.description}
                thumbnail={{
                    dimensions: {
                        width: `350px`,
                        height: `130px`,
                        scale: 0.5,
                    }
                }}
            >
                {/*  //TODO types */}
                <Component {...template.props as any} />
            </GalleryItem>
        )
    })
}

export default ComponentsGallery

