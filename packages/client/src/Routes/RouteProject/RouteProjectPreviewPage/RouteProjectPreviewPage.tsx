import React from "react"
import { useParams } from "react-router-dom";

import Helmet from "../Components/Helmet/Helmet"
import { ProjectsContext } from "../../../Projects";

import * as styles from "./RouteProjectPreviewPage.scss"

const RouteProjectPreviewPage: React.FC = () => {
    const { projects } = React.useContext(ProjectsContext)
    const { projectId, pagePathname } = useParams()

    const project = projects.getProjectById(projectId || "")

    if (!project) {
        return
    }

    const page = project.getPageByPathname(pagePathname || "")
    const Component = () => page.getContent().map(content => {
        const ChildComponent = content.getComponent()
        return (
            <ChildComponent {...content.getProps() as any} key={content.getId()} />
        )
    })

    return (
        <Helmet>
            <div className={styles.main}>
                <Component />
            </div>
        </Helmet>
    )
}

export default RouteProjectPreviewPage
