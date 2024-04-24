import React from "react"
import classNames from "classnames";
import { NavLink, useParams } from "react-router-dom";

import IconWireframe from "../../../../Components/Icons/Wireframe/Wireframe";
import IconPlay from "../../../../Components/Icons/Play/Play";

import { appRoutes } from "../../../router";

import * as styles from "./Menu.scss"
import { ProjectsContext } from "../../../../Projects";
import IconHome from "../../../../Components/Icons/Home/Home";
import IconNew from "../../../../Components/Icons/New/New";
import IconSettings from "../../../../Components/Icons/Settings/Settings";
import { IconButton, Text } from "@radix-ui/themes";

interface MenuButtonProps {
    link: string
    text: string
    Icon: React.FC<any>
}

const MenuButton: React.FC<MenuButtonProps> = (props) => {
    return (
        <NavLink
            to={props.link}
            className={({ isActive, isPending }) => {
                return classNames({
                    [styles.linkIsActive]: isActive,
                    isPending: ""
                })
            }}
        >
            <IconButton size="4" variant="ghost">
                <div className={styles.linkContainer}>
                    <props.Icon className={styles.linkStrokeIcon} />
                    <Text>
                        {props.text}
                    </Text>
                </div>
            </IconButton>
        </NavLink>
    )
}
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
        <div className={styles.menu}>
            <ul className={styles.menuContent}>
                <li className={styles.link}>
                    <MenuButton
                        link={appRoutes.getProjectsRoute()}
                        text="Home"
                        Icon={IconHome}
                    />
                </li>
                <li className={styles.link}>
                    <MenuButton
                        link={appRoutes.getProjectTemplateRoute(project?.getId())}
                        text="Templates"
                        Icon={IconNew}
                    />
                </li>
                <li className={styles.link}>
                    <MenuButton
                        link={editLink()}
                        text="Edit"
                        Icon={IconWireframe}
                    />
                </li>
                <li className={styles.link}>
                    <MenuButton
                        link={previewLink()}
                        text="Preview"
                        Icon={IconPlay}
                    />
                </li>
                <li className={styles.link}>
                    <MenuButton
                        link={appRoutes.getProjectSettingsRoute(project?.getId())}
                        text="Settings"
                        Icon={IconSettings}
                    />
                </li>
            </ul>
        </div>
    )
}

export default Menu