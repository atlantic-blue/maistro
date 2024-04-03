import React from "react"
import { useParams } from 'react-router-dom';
import * as uuid from "uuid"

import Helmet from "../Components/Helmet/Helmet"
import DragAndDrop from "../../../Components/DragDrop/DragDrop";
import IconNew from "../../../Components/Icons/New/New";
import { PageMessageType } from "../../../types";
import PageContent from "../../../Store/PageContent";
import PageEdit from "../../../Page";

import { ProjectsContext } from "../../../Projects";

import EditMenu from "./Components/EditMenu/EditMenu";

import * as styles from "./Edit.scss"

const RoutesEditPage: React.FC = () => {
    const { projects } = React.useContext(ProjectsContext)
    const { projectId, pageId } = useParams()
    const project = projects.getProjectById(projectId || "")

    if (!project) {
        return
    }

    const page = project.getPageById(pageId || "")

    const onCreateNewContentClick = () => {
        const content = new PageContent({
            id: uuid.v4(),
            description: "",
            Component: () => <div>Edit me!</div>,
            categories: [],
            props: {},
        })

        page.event$.next({
            type: PageMessageType.PUT_CONTENT,
            data: [content],
        })

        page.event$.next({
            type: PageMessageType.SET_CONTENT_ACTIVE,
            data: content,
        })
    }

    return (
        <Helmet>
            <PageEdit
                page={page}
            >
                <div className={styles.main}>
                    <DragAndDrop />
                    <div className={styles.section}>
                        <div className={styles.sectionContent}>
                            Add a new section
                        </div>
                        <button
                            className={styles.sectionButton}
                            onClick={onCreateNewContentClick}
                        >
                            <IconNew className={styles.sectionImage} />
                        </button>
                    </div>
                </div>
                <EditMenu />
            </PageEdit>
        </Helmet>
    )
}

export default RoutesEditPage
