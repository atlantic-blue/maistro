import React from "react"
import { useQuery } from "react-query"

import { Project } from "../../../../../Store/Project"

import { postProject } from "../../../../../Api/Project/postProject"

import * as styles from "./SubmitProject.scss"
import env from "../../../../../env"

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
    const [viewLink, setViewLink] = React.useState<null | string>(null)
    const { isError, isLoading, refetch } = useQuery({
        enabled: false,
        queryKey: "SubmitProject",
        queryFn: async () => {
            return await request({
                project,
                userId
            })
        }
    })

    const onPublish = () => {
        refetch()
            .then(response => {
                if (!response.data) {
                    // TODO app level message
                    return
                }
                // TODO needs a link to the index.html of that project instead
                setViewLink(`${env.hosting.baseUrl}/${response.data[0].key}`)
            })
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

            {viewLink && (
                <div className={styles.link}>
                    <a href={viewLink}
                    >See Project</a>
                </div>
            )}
        </div>
    )
}

export default SubmitProject