import React, { useEffect } from "react"

import { Project } from "../../../../../Store/Project"
import { ProjectMessageType } from "../../../../../types"

import Button from "../../../../../Components/Gallery/Components/Button/Button"
import { ProjectsContext } from "../../../../../Projects"

import { createUrl, isValidUrl } from "../../../../../Utils/url"

import * as styles from "./SettingsMetadata.scss"
import { ApiContext } from "../../../../../Api/ApiProvider"

interface SettingsMetadataProps {
    project: Project
    isDisabled?: boolean
}

const HOSTING_DOMAIN = ".maistro.website"

const SettingsMetadata: React.FC<SettingsMetadataProps> = ({ project, isDisabled }) => {
    const { api } = React.useContext(ApiContext)
    const { user } = React.useContext(ProjectsContext)
    const [name, setName] = React.useState(project.getName())
    const [projectUrl, setProjectURl] = React.useState(project.getUrl())

    useEffect(() => {
        project.event$.next({
            type: ProjectMessageType.SET_NAME,
            data: name
        })
    }, [name])

    useEffect(() => {
        project.event$.next({
            type: ProjectMessageType.SET_URL,
            data: projectUrl
        })
    }, [projectUrl])


    const onClick = async () => {
        await api.projects.updateById({
            token: user.getTokenId(),
            projectId: project.getId(),
            name: name,
            url: createUrl(projectUrl)
        })
        // TODO show success 
    }

    return (
        <div className={styles.content}>
            <div className={styles.section}>
                <div
                    className={styles.title}
                >
                    Project Name
                </div>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    disabled={isDisabled}
                    className={styles.input}
                />
            </div>

            <div className={styles.section}>
                <div
                    className={styles.title}
                >
                    Project URL
                </div>
                <div>
                    <input
                        type="text"
                        value={projectUrl}
                        onChange={e => setProjectURl(e.target.value)}
                        disabled={isDisabled}
                        className={styles.input}
                    />
                </div>
            </div>

            <Button onClick={onClick}>
                Update
            </Button>
        </div>
    )
}

export default SettingsMetadata
