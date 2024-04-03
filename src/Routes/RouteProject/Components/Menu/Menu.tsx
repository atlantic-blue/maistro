import React from "react"
import classNames from "classnames";
import { NavLink, useParams } from "react-router-dom";

import IconWireframe from "../../../../Components/Icons/Wireframe/Wireframe";
import IconPlay from "../../../../Components/Icons/Play/Play";

import { Routes, appRoutes } from "../../../router";

import * as styles from "./Menu.scss"
import { ProjectsContext } from "../../../../Projects";
import IconHome from "../../../../Components/Icons/Home/Home";
import IconNew from "../../../../Components/Icons/New/New";

const Menu: React.FC = () => {
    const { projects } = React.useContext(ProjectsContext)
    const { projectId, pageId, pagePathname } = useParams()
    const project = projects.getProjectById(projectId || "")

    const editLink = () => {
        if (pagePathname) {
            const pageId = project?.getPageByPathname(pagePathname).getId()
            return appRoutes.getProjectEditPageRoute(project?.getId(), pageId)
        } else {
            return appRoutes.getProjectEditRoute(project?.getId())
        }
    }

    const previewLink = () => {
        if (pageId) {
            const pathname = project?.getPageById(pageId).getPath()
            return appRoutes.getProjectPreviewPageRoute(project?.getId(), pathname)
        } else {
            return appRoutes.getProjectPreviewRoute(project?.getId())
        }
    }

    return (
        <ul className={styles.menu}>
            <li className={styles.link}>
                <NavLink
                    to={
                        appRoutes.getProjectsRoute()
                    }
                    className={({ isActive, isPending }) => {
                        return classNames({
                            [styles.linkIsActive]: isActive,
                            isPending: ""
                        })
                    }}
                >
                    <div className={styles.linkContainer}>
                        <IconHome className={styles.linkIcon} />
                        <span>Home</span>
                    </div>
                </NavLink>
            </li>
            <li className={styles.link}>
                <NavLink
                    to={
                        appRoutes.getProjectTemplateRoute(project?.getId())
                    }
                    className={({ isActive, isPending }) => {
                        return classNames({
                            [styles.linkIsActive]: isActive,
                            isPending: ""
                        })
                    }}
                >
                    <div className={styles.linkContainer}>
                        <IconNew className={styles.linkIcon} />
                        <span>Templates</span>
                    </div>
                </NavLink>
            </li>
            <li className={styles.link}>
                <NavLink
                    to={editLink()}
                    className={({ isActive, isPending }) => {
                        return classNames({
                            [styles.linkIsActive]: isActive,
                            isPending: ""
                        })
                    }}
                >
                    <div className={styles.linkContainer}>
                        <IconWireframe className={styles.linkIcon} />
                        <span>Edit</span>
                    </div>
                </NavLink>
            </li>
            <li className={styles.link}>
                <NavLink
                    to={previewLink()}
                    className={({ isActive, isPending }) => {
                        return classNames({
                            [styles.linkIsActive]: isActive,
                            isPending: ""
                        })
                    }}
                >
                    <div className={styles.linkContainer}>
                        <IconPlay className={styles.linkIcon} />
                        <span>Preview</span>
                    </div>
                </NavLink>
            </li>
        </ul>
    )
}

export default Menu