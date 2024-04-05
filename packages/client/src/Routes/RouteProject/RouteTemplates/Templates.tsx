import React from "react";
import { useNavigate, useParams } from 'react-router-dom'

import Helmet from "../Components/Helmet/Helmet";
import TemplatesViews from "../../../Templates/Templates";
import { TemplateViewNew } from "../../../Components/TemplateView/TemplateView";
import { CreateTemplateNew } from "../../../Templates/TemplateNew";
import { PageStruct, ProjectMessageType } from "../../../types";
import { ProjectsContext } from "../../../Projects";

import * as styles from "./Templates.scss"
import { appRoutes } from "../../router";
import RouteProjectHeader from "../Components/Header/Header";

const RouteGallery: React.FC = () => {
    const navigate = useNavigate();
    const { projects } = React.useContext(ProjectsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")


    if (!project) {
        return
    }

    const onNewPageClick = () => {
        if (!projectId) {
            return
        }

        const newPages = CreateTemplateNew()
        newPages.map(page => {
            project.event$.next({
                type: ProjectMessageType.SET_PAGE,
                data: page
            })
        })

        navigate(
            appRoutes.getProjectEditPageRoute(project.getId(), newPages[0].id)
        )
    }

    const onTemplateClick = (template: PageStruct[]) => {
        template.map(page => {
            project.event$.next({
                type: ProjectMessageType.SET_PAGE,
                data: page
            })
        })

        navigate(
            appRoutes.getProjectEditPageRoute(project.getId(), template[0].id)
        )
    }

    return (
        <Helmet>
            <RouteProjectHeader />
            <div className={styles.templates}>
                <div className={styles.templatesContent}>
                    <TemplateViewNew
                        onClick={onNewPageClick}
                        title="Create Your Own"
                    />
                    <TemplatesViews
                        onClick={onTemplateClick}
                    />
                </div >
            </div>
        </Helmet>
    );
};

export default RouteGallery
