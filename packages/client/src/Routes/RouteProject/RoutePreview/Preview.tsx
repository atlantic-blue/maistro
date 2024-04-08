import React from "react"
import { useNavigate, useParams } from "react-router-dom";

import { ProjectsContext } from "../../../Projects";

import { appRoutes } from "../../router";

import Helmet from "../Components/Helmet/Helmet"

import TemplateView from "../../../Components/TemplateView/TemplateView";
import * as styles from "./Preview.scss"
import Page from "../../../Store/Page";
import Metadata from "../RouteEdit/Components/Metadata/Metadata";

const RoutesPreview: React.FC = () => {
    const navigate = useNavigate();
    const { projects } = React.useContext(ProjectsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")

    const onTemplateViewClick = (page: Page) => {
        navigate(
            appRoutes.getProjectPreviewPageRoute(
                project.getId(),
                page.getPath()
            )
        )
    }

    if (!project) {
        return
    }

    return (
        <Helmet>
            <div className={styles.content}>
                {Object.keys(project.getPages()).length < 1 && (
                    <div className={styles.page}>
                        <div>Nothing to see!</div>
                        Choose or Create a template
                    </div>
                )}

                {Object.keys(project.getPages()).map(pageId => {
                    const page = project.getPageById(pageId)
                    if (!page) {
                        return
                    }

                    return (
                        <div
                            key={`${pageId}-${Math.random()}`}
                            className={styles.page}
                            onClick={() => onTemplateViewClick(page)}
                        >
                            <div className={styles.pagePreview}>
                                <TemplateView
                                    title={page.getDescription()}
                                >
                                    {page.getContent().map(content => {
                                        const Component = content.getComponent()
                                        return (
                                            <Component
                                                key={`${content.getId()}-${Math.random()}`}
                                                {...content.getProps() as any}
                                            />
                                        )
                                    })}
                                </TemplateView>
                            </div>
                            <div className={styles.pageContent}>
                                <Metadata page={page} isDisabled />
                            </div>
                        </div>
                    )
                })}
            </div>
        </Helmet>
    )
}

export default RoutesPreview
