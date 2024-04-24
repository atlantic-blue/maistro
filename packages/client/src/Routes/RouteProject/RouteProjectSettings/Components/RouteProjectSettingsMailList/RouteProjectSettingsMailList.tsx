import React, { useEffect } from "react"
import { filter } from "rxjs/operators"
import { Box, Button, Callout, Card, Heading, Section, Table, Text, TextField } from "@radix-ui/themes"

import { ApiContext } from "../../../../../Api/ApiProvider"
import { ProjectsContext } from "../../../../../Projects"

import { Project } from "../../../../../Store/Project"
import RouteProjectSettingsMailListCreate from "./RouteProjectSettingsMailListCreate"
import { ProjectMessageType } from "../../../../../types"
import useObservable from "../../../../../Utils/Hooks/UseObservable"

import { EmailEntriesReadOutput } from "../../../../../Api/EmailEntries/emailEntriesReadById"
import * as styles from "./RouteProjectSettingsMailList.scss"

interface RouteProjectSettingsMailListProps {
    project: Project
}

const RouteProjectSettingsMailList: React.FC<RouteProjectSettingsMailListProps> = (props) => {
    const { user } = React.useContext(ProjectsContext)
    const { api } = React.useContext(ApiContext)
    const [emailEntries, setEmailEntries] = React.useState<EmailEntriesReadOutput["data"]>([])
    const [emailEntriesCount, setEmailEntriesCount] = React.useState(0)

    useEffect(() => {
        api.email.lists.read({
            token: user.getTokenId()
        })
            .then(emailLists => {
                emailLists.forEach((emailList) => {
                    if (emailList.projectId === props.project.getId()) {
                        props.project.event$.next({
                            type: ProjectMessageType.SET_EMAIL_LIST,
                            data: emailList
                        })

                        api.email.entries
                            .readById({
                                emailListId: emailList.id,
                                token: user.getTokenId(),
                            })
                            .then(response => {
                                setEmailEntriesCount(response.totalCount)
                                setEmailEntries(response.data)
                            })
                    }
                })
            })
    }, [props.project.getId()])


    useObservable(
        props.project.event$
            .pipe(
                filter(
                    e => (
                        e.type === ProjectMessageType.SET_EMAIL_LIST &&
                        e.data.projectId === props.project.getId()
                    )
                )
            )
    )

    if (!Object.keys(props.project.getEmailLists()).length) {
        return <RouteProjectSettingsMailListCreate project={props.project} />
    }

    const emailList = Object.values(props.project.getEmailLists())[0]

    return (
        <Card className={styles.section}>
            <Heading align="center">{emailList.getTitle()}</Heading>
            <Text as="p" size="1" align="center">
                Created on {new Date(emailList.getCreatedAt()).toUTCString()}
            </Text>
            <Text as="p" align="center">
                {emailList.getDescription()}
            </Text>

            <Section size="1">
                <Callout.Root>
                    <Callout.Text>
                        Subscribers {emailEntriesCount}
                    </Callout.Text>
                </Callout.Root>
            </Section>

            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {emailEntries.map(entry => {
                        return (
                            <Table.Row key={entry.id}>
                                <Table.RowHeaderCell>{entry.name}</Table.RowHeaderCell>
                                <Table.Cell>{entry.email}</Table.Cell>
                            </Table.Row>
                        )
                    })}
                </Table.Body>
            </Table.Root>
        </Card>
    )
}

export default RouteProjectSettingsMailList