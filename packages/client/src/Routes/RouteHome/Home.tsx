import React from "react"

import { CreateTemplateMaistro } from "../../Templates/TemplateMaistro";

const RoutesHome: React.FC = () => {
    return (
        <>
            {CreateTemplateMaistro()[0].content.map(c => {
                return (
                    <c.Component
                        key={c.id}
                        {...c.props}
                    />
                )
            })}
        </>
    )
}

export default RoutesHome
