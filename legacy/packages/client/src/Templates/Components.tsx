import React from 'react'

import { TemplateStruct } from './templateTypes'
import TemplateView from '../Components/TemplateView/TemplateView'


interface ComponentsGalleryProps {
    onClick: (content: TemplateStruct) => void
    templates: TemplateStruct[]
    className?: string
}

const ComponentsGallery: React.FC<ComponentsGalleryProps> = (props) => {
    return props.templates.map(template => {
        const Component = template.Component
        return (
            <TemplateView
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
                className={props.className}
            >
                <Component {...template.props} />
            </TemplateView>
        )
    })
}

export default ComponentsGallery

