import React, { useEffect } from "react"

import PageStore from "../../../../../Store/Page"
import { PageMessageType } from "../../../../../types"

import * as styles from "./Metadata.scss"
import { Project } from "../../../../../Store/Project"

interface MetadataProps {
    page: PageStore
    project: Project
    isDisabled?: boolean
}

const Metadata: React.FC<MetadataProps> = ({ project, page, isDisabled }) => {
    const [title, setTitle] = React.useState(page.getTitle())
    const [path, setPath] = React.useState(page.getPath())
    const [description, setDescription] = React.useState(page.getDescription())

    useEffect(() => {
        page.event$.next({
            type: PageMessageType.SET_TITLE,
            data: title
        })
    }, [title])

    useEffect(() => {
        page.event$.next({
            type: PageMessageType.SET_PATH,
            data: path
        })
    }, [path])

    useEffect(() => {
        page.event$.next({
            type: PageMessageType.SET_DESCRIPTION,
            data: description
        })
    }, [description])

    return (
        <div>
            <div>
                <div
                    className={styles.title}
                >
                    Title
                </div>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    disabled={isDisabled}
                    className={styles.input}
                />
            </div>
            <div>
                <div
                    className={styles.title}
                >
                    URL
                </div>
                <span>{`${project.getUrl()}/`}</span>
                <input
                    type="text"
                    value={path}
                    onChange={e => setPath(e.target.value)}
                    disabled={isDisabled}
                    className={styles.input}
                />
            </div>
            <div>
                <div
                    className={styles.title}
                >
                    Page Description
                </div>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    disabled={isDisabled}
                    className={styles.textarea}
                />
            </div>
        </div>
    )
}

export default Metadata
