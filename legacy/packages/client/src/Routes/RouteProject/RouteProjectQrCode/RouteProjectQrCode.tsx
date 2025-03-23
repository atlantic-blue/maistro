import React from "react"
import QRCode from "../../../Components/QRCode/QRCode"
import Helmet from "../Components/Helmet/Helmet"
import { Card } from "@radix-ui/themes"
import { useParams } from "react-router-dom"
import { ProjectsContext } from "../../../Projects"

const RouteProjectQrCode: React.FC = () => {
    const { projects } = React.useContext(ProjectsContext)

    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")

    return (
        <Helmet>
            <Card m="3">
                <QRCode
                    url={project.getUrl()}
                    logo={project.getLogo()}
                />
            </Card>
        </Helmet>
    )
}

export default RouteProjectQrCode
