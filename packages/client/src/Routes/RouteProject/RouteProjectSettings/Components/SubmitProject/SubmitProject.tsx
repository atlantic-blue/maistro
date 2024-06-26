import React, { useEffect } from "react";
import { useQuery } from "react-query";
import classNames from "classnames";
import { Button, Callout } from "@radix-ui/themes";
import { postProject } from "../../../../../Api/Project/postProject";
import { withHttps } from "../../../../../Utils/url";

import { Project } from "../../../../../Store/Project";
import PageStore from "../../../../../Store/Page";
import { filter, tap } from "rxjs/operators";

import * as styles from "./SubmitProject.scss";
import { PageMessageType } from "../../../../../types";

interface SubmitProjectProps {
    token: string
    userId: string
    project: Project,
    page?: PageStore,
    request?: (input: { project: Project, userId: string }) => Promise<void>
}

export const SubmitProject: React.FC<SubmitProjectProps> = ({
    token,
    project,
    userId,
    page,
    request = postProject
}) => {
    const [viewLink, setViewLink] = React.useState<null | string>(null);
    const { isError, isLoading, refetch } = useQuery({
        enabled: false,
        queryKey: "SubmitProject",
        queryFn: async () => {
            return await request({
                token,
                project,
                userId
            });
        }
    });


    useEffect(() => {
        const subscription = page?.event$.pipe(
            filter(
                event => {
                    return (
                        event.type === PageMessageType.SET_CONTENT_IDS ||
                        event.type === PageMessageType.PUSH_CONTENT_IDS
                    )
                })).subscribe(() => {
                    setViewLink(null)
                })

        return () => {
            subscription?.unsubscribe()
        }
    }, [])

    const onPublish = () => {
        refetch()
            .then(() => {
                setViewLink(project.getUrl());
            });
    };

    const onSeeProject = () => {
        if (!viewLink) {
            return;
        }

        window.open(withHttps(viewLink), "_blank");
    };

    return (
        <div className={styles.content}>
            <Button
                size="1"
                className={classNames({
                    [styles.loading]: isLoading,
                    [styles.success]: viewLink,
                    [styles.error]: isError,
                })} onClick={viewLink ? onSeeProject : onPublish}>
                {isLoading ? "Publishing..." : viewLink ? "See Project" : "Publish"}
            </Button>

            {/* TODO use a toaster */}
            {isError &&
                (
                    <div className={styles.errorMessage}>
                        <Callout.Root data-accent-color="red">
                            <Callout.Text>
                                Failed to publish Page
                            </Callout.Text>
                        </Callout.Root>
                    </div>
                )}

        </div>
    );
};
