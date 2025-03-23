import React from "react"
import classNames from "classnames";
import { NavLink, useParams } from "react-router-dom";

import { appRoutes } from "../../../router";

import * as styles from "./Menu.scss"
import { ProjectsContext } from "../../../../Projects";
import { IconButton, Text } from "@radix-ui/themes";
import { CirclePlus, Cog, Pencil, School } from "lucide-react";

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
            <IconButton size="2" variant="ghost">
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
    const page = project.getPageById(pageId || "")

    if (!project || !page) {
        return null
    }

    return (
        <div className={styles.menu}>
            <ul className={styles.menuContent}>
                <li className={styles.link}>
                    <MenuButton
                        link={appRoutes.getProjectPageTemplatesRoute(project?.getId())}
                        text="New"
                        Icon={CirclePlus}
                    />
                </li>
                <li className={styles.link}>
                    <MenuButton
                        link={appRoutes.getProjectPageRoute(project?.getId(), page?.getId())}
                        text="Edit"
                        Icon={Pencil}
                    />
                </li>
                <li className={styles.link}>
                    <MenuButton
                        link={appRoutes.getProjectPageSettingsRoute(project?.getId(), page?.getId())}
                        text="Settings"
                        Icon={Cog}
                    />
                </li>
            </ul>
        </div>
    )
}

export default Menu