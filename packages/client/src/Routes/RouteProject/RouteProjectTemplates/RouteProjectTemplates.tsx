import React from "react";
import { useNavigate, useParams } from 'react-router-dom'

import Helmet from "../Components/Helmet/Helmet";
import TemplatesViews from "../../../Templates/Templates";
import { TemplateViewNew } from "../../../Components/TemplateView/TemplateView";
import { CreateTemplateNew } from "../../../Templates/TemplateNew";
import { PageStruct, ProjectMessageType } from "../../../types";
import { ProjectsContext } from "../../../Projects";

import { appRoutes } from "../../router";
import RouteProjectHeader from "../Components/Header/Header";
import * as styles from "./RouteProjectTemplates.scss"

const RouteProjectTemplates: React.FC = () => {
    const navigate = useNavigate();
    const { projects, user } = React.useContext(ProjectsContext)
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
            <RouteProjectHeader user={user} />
            <div className={styles.templates}>
                <div className={styles.templatesContent}>
                    <TemplateViewNew
                        onClick={onNewPageClick}
                        title="Create Your Own"
                        className={styles.template}
                    />
                    <TemplatesViews
                        onClick={onTemplateClick}
                        className={styles.template}
                    />
                </div >
            </div>
        </Helmet>
    );
};

export default RouteProjectTemplates