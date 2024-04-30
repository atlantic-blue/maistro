import React from "react";

import { projectsCreate } from "./Projects/projectsCreate";
import { projectsRead } from "./Projects/projectsRead";
import { projectsReadById } from "./Projects/projectsReadById";
import { projectsUpdateById } from "./Projects/projectsUpdateById";
import { projectsDelete } from "./Projects/projectsDelete";
import { paymentsSubscriptionsRead } from "./Payments/PaymentSubscriptions/PaymentSubscriptionsRead";
import { EmailListsCreateInput, EmailListsCreateOutput, emailListsCreate } from "./EmailLists/emailListsCreate";
import { EmailListsReadInput, EmailListsReadOutput, emailListsRead } from "./EmailLists/emailListsRead";

import { ProjectStruct } from "../types";
import { EmailEntriesCreateInput, EmailEntriesCreateOutput, emailEntriesCreate } from "./EmailEntries/emailEntriesCreate";
import { EmailEntriesReadInput, EmailEntriesReadOutput, emailEntriesReadById } from "./EmailEntries/emailEntriesReadById";
import { PagesCreateInput, PagesCreateOutput, pagesCreate } from "./Pages/pagesCreate";
import { PagesReadByIdInput, PagesReadByIdOutput, pagesReadById } from "./Pages/pagesReadById";
import { PagesReadInput, PagesReadOutput, pagesRead } from "./Pages/projectsRead";
import { ContentCreateInput, ContentCreateOutput, contentCreate } from "./Content/contentCreate";
import { ContentReadByIdInput, ContentReadByIdOutput, contentReadById } from "./Content/contentReadById";
import { ContentReadInput, ContentReadOutput, contentRead } from "./Content/contentRead";
import { PagesUpdateByIdInput, pagesUpdateById } from "./Pages/pagesUpdateById";
import { ContentUpdateByIdInput, contentUpdateById } from "./Content/contentUpdateById";
import { CreateFileInput, CreateFileOutput, fileCreate } from "./File/fileCreate";

import ProgressSplash from "../Components/ProgressSplash/ProgressSplash";

interface ApiContextState {
    api: {
        content: {
            create: (input: ContentCreateInput) => Promise<ContentCreateOutput>,
            read: (input: ContentReadInput) => Promise<ContentReadOutput>
            readById: (input: ContentReadByIdInput) => Promise<ContentReadByIdOutput>
            updateById: (input: ContentUpdateByIdInput) => Promise<void>,
        }
        pages: {
            create: (input: PagesCreateInput) => Promise<PagesCreateOutput>,
            read: (input: PagesReadInput) => Promise<PagesReadOutput>
            readById: (input: PagesReadByIdInput) => Promise<PagesReadByIdOutput>
            updateById: (input: PagesUpdateByIdInput) => Promise<void>,
        }
        projects: {
            create: ({ token, name, url }: { token: string, name: string, url: string }) => Promise<{ id: string, name: string, url: string }>
            read: ({ token }: { token: string }) => Promise<Partial<ProjectStruct[]>>
            readById: ({ projectId, token }: { projectId: string, token: string }) => Promise<Partial<ProjectStruct>>
            updateById: ({ projectId, token, name, url }: { projectId: string, token: string, name: string, url: string }) => Promise<void>,
            delete: ({ token, id }: { token: string, id: string }) => Promise<void>,
        }
        file: {
            createFile(input: CreateFileInput): Promise<CreateFileOutput>
        }
        email: {
            lists: {
                create: (input: EmailListsCreateInput) => Promise<EmailListsCreateOutput>
                read: (input: EmailListsReadInput) => Promise<EmailListsReadOutput>
            },
            entries: {
                create: (input: EmailEntriesCreateInput) => Promise<EmailEntriesCreateOutput>
                readById: (input: EmailEntriesReadInput) => Promise<EmailEntriesReadOutput>
            },
        },
        payments: {
            subscriptions: {
                read: ({ token }: { token: string }) => Promise<{ subscription: { status: string } }>
            }
        }
    }
}

const context: ApiContextState = {
    api: {
        file: {
            createFile: fileCreate
        },
        content: {
            create: contentCreate,
            read: contentRead,
            readById: contentReadById,
            updateById: contentUpdateById,
        },
        pages: {
            create: pagesCreate,
            read: pagesRead,
            readById: pagesReadById,
            updateById: pagesUpdateById,
        },
        projects: {
            create: projectsCreate,
            read: projectsRead,
            readById: projectsReadById,
            updateById: projectsUpdateById,
            delete: projectsDelete,
        },
        email: {
            lists: {
                create: emailListsCreate,
                read: emailListsRead,
            },
            entries: {
                create: emailEntriesCreate,
                readById: emailEntriesReadById,
            }
        },
        payments: {
            subscriptions: {
                read: paymentsSubscriptionsRead
            }
        }
    }
}

export const ApiContext = React.createContext<ApiContextState>(context)

interface ApiProviderProps {
    children: React.ReactNode
}

const ApiProvider: React.FC<ApiProviderProps> = (props) => {
    return (
        <>
            <ProgressSplash />
            <ApiContext.Provider value={context}>
                {props.children}
            </ApiContext.Provider>
        </>
    )
}

export default ApiProvider

