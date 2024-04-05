import React from "react"
import { CreateTemplateMaistro } from "../../../../Templates/TemplateMaistro"

const RouteProjectHeader: React.FC = () => {
    const Header = CreateTemplateMaistro()[0].content[0].Component
    const headerProps = CreateTemplateMaistro()[0].content[0].props

    return (
        <Header {...headerProps} />
    )
}

export default RouteProjectHeader
