import React from "react"

import { PageContext } from "../../PageContext"
import Tree from "../Tree/Tree"

interface EditContentProps {
}

const EditContent: React.FC<EditContentProps> = (props) => {
    const { items, activeItem } = React.useContext(PageContext)

    const Component = activeItem?.Component

    return (
        <div>
            <Tree input={activeItem?.props} />
            {Component && <Component {...activeItem?.props} />}
        </div>
    )
}

export default EditContent
