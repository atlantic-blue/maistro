import React from "react"
import { ProjectsContext } from "../../../Projects"
import { ApiContext } from "../../../Api/ApiProvider"

const RouteAdminTransferProject: React.FC = () => {
    const { projects, user } = React.useContext(ProjectsContext)
    const {api} = React.useContext(ApiContext)
    
    return (
        <>

        </>
    )
}

export default RouteAdminTransferProject
