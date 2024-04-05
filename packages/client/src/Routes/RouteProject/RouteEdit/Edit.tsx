import React from "react"
import { useNavigate, useParams } from "react-router-dom"

import TemplateView from "../../../Components/TemplateView/TemplateView"
import ColorScheme from "../../../Components/ColourScheme/ColourScheme";
import FontDesign from "../../../Components/FontScheme/FontScheme";
import { ProjectsContext } from "../../../Projects";
import { ProjectMessageType } from "../../../types";
import Page from "../../../Store/Page";

import { appRoutes } from "../../router";

import Helmet from "../Components/Helmet/Helmet"

import EditMenuItem from "../../../Components/EditMenuItem/EditMenuItem";
import EditMenuTabs from "../../../Components/EditMenuTabs/EditMenuTabs";
import Metadata from "./Components/Metadata/Metadata";
import IconBin from "../../../Components/Icons/Bin/Bin";

import * as styles from "./Edit.scss"

const PageEdit: React.FC = () => {
    const [key, setKey] = React.useState("")
    const navigate = useNavigate();

    const { projects } = React.useContext(ProjectsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")

    const onTemplateViewClick = (page: Page) => {
        navigate(
            appRoutes.getProjectEditPageRoute(
                project.getId(),
                page.getId()
            )
        )
    }

    const onPageDelete = (page: Page) => {
        project.event$.next({
            type: ProjectMessageType.DELETE_PAGE,
            data: page.getId()
        })
        setKey(`${Date.now()}`)
    }

    if (!project) {
        return
    }

    return (
        <Helmet key={key}>
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
                        >
                            <div className={styles.pagePreview}>
                                <TemplateView
                                    onClick={() => onTemplateViewClick(page)}
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
                                <Metadata page={page} />
                            </div>
                            <button className={styles.button} onClick={() => onPageDelete(page)}>
                                <IconBin className={styles.buttonIcon} />
                            </button>
                        </div>
                    )
                })}
            </div>
        </Helmet>
    )
}

export default PageEdit