import React, { useEffect } from "react"

import { Project } from "../../../../../Store/Project"
import { ProjectMessageType } from "../../../../../types"

import Button from "../../../../../Components/Gallery/Components/Button/Button"
import { ProjectsContext } from "../../../../../Projects"

import * as styles from "./SettingsMetadata.scss"

interface SettingsMetadataProps {
    project: Project
    isDisabled?: boolean
}

const HOSTING_DOMAIN = ".hosting.maistro.website"

const SettingsMetadata: React.FC<SettingsMetadataProps> = ({ project, isDisabled }) => {
    const { api, user } = React.useContext(ProjectsContext)
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

    const isValidDomain = (url: string) => {
        const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (domainRegex.test(url)) {
            return true
        }

        return false
    }

    const onClick = async () => {
        await api.projects.updateById({
            token: user.getTokenId(),
            projectId: project.getId(),
            name: name,
            url: isValidDomain(projectUrl) ? projectUrl : `${projectUrl}${HOSTING_DOMAIN}`
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
                    {!isValidDomain(projectUrl) && (
                        <span>
                            {HOSTING_DOMAIN}
                        </span>
                    )}

                </div>
            </div>

            <Button onClick={onClick}>
                Update
            </Button>
        </div>
    )
}

export default SettingsMetadata