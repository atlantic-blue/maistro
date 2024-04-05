import React from 'react'

import GalleryItem from '../TemplateView/TemplateView'
import PageContent from '../../Store/PageContent'
import { ContentStruct } from '../../types'

interface ComponentsGalleryProps {
    onClick: (content: ContentStruct) => void
    templates: ContentStruct[]
}

const ComponentsGallery: React.FC<ComponentsGalleryProps> = (props) => {
    return props.templates.map(content => {
        const Component = content.Component
        // TODO revise, does it need to update the store?
        const id = `${content.id}-${Math.random()}`
        content.id = id

        return (
            <GalleryItem
                key={`${content.id}-${Math.random()}`}
                onClick={() => props.onClick(content)}
                title={content.description}
                thumbnail={{
                    dimensions: {
                        width: `350px`,
                        height: `130px`,
                        scale: 0.5,
                    }
                }}
            >
                {/*  //TODO types */}
                <Component {...content.props as any} />
            </GalleryItem>
        )
    })
}

export default ComponentsGallery

