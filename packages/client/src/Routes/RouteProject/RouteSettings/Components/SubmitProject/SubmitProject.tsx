import React from "react"
import { useQuery } from "react-query"

import { Project } from "../../../../../Store/Project"

import { postProject } from "../../../../../Api/Project/postProject"

import * as styles from "./SubmitProject.scss"

interface SubmitProjectProps {
    project: Project,
    userId: string
    request?: (input: { project: Project, userId: string }) => Promise<void>
}

const SubmitProject: React.FC<SubmitProjectProps> = ({
    project,
    userId,
    request = postProject
}) => {
    const { isError, isLoading, refetch } = useQuery({
        enabled: false,
        queryKey: "SubmitProject",
        queryFn: async () => {
            await request({
                project,
                userId
            })
        }
    })

    const onPublish = () => {
        refetch()
    }

    return (
        <div>
            {isError &&
                (
                    <div className={styles.error}>
                        Failed to publish Page
                    </div>
                )
            }

            {isLoading && (
                <div className={styles.loading}>
                    Publishing...
                </div>
            )}

            <button className={styles.button} onClick={onPublish}>
                Publish
            </button>
        </div>
    )
}

export default SubmitProject