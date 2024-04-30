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
    const { projectId, pageId } = useParams()
    const project = projects.getProjectById(projectId || "")

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
                        link={appRoutes.getProjectPageTemplatesRoute(project?.getId())}
                        text="New"
                        Icon={IconNew}
                    />
                </li>
                <li className={styles.link}>
                    <MenuButton
                        link={appRoutes.getProjectPageRoute(projectId, pageId)}
                        text="Edit"
                        Icon={IconWireframe}
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