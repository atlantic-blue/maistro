import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import classNames from "classnames";
import { Button, Callout } from "@radix-ui/themes";
import { postProject } from "../../../../../Api/Project/postProject";
import * as styles from "./SubmitProject.scss";
import { withHttps } from "../../../../../Utils/url";

import { Project } from "../../../../../Store/Project";
import useObservable from "../../../../../Utils/Hooks/UseObservable";
import PageStore from "../../../../../Store/Page";
import { PageMessageType } from "../../../../../types";
import { filter, tap } from "rxjs/operators";

interface SubmitProjectProps {
    project: Project,
    page?: PageStore,
    userId: string
    request?: (input: { project: Project, userId: string }) => Promise<void>
}

export const SubmitProject: React.FC<SubmitProjectProps> = ({
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
                size="2"
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
