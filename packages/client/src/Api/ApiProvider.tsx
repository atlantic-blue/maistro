import React from "react";

import { ProjectsCreateInput, ProjectsCreateOutput, projectsCreate } from "./Projects/projectsCreate";
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
import { AiImagesCreateInput, AiImagesCreateOutput, aiImagesCreate } from "./Ai/aiImagesCreate";
import { AiThreadsCreateInput, AiThreadsCreateOutput, aiThreadsCreate } from "./Ai/aiThreadsCreate";
import { AiThreadsUpdateByIdInput, AiThreadsUpdateByIdOutput, aiThreadsUpdateById } from "./Ai/aiThreadsUpdateById";
import { AiThreadsReadByIdInput, AiThreadsReadByIdOutput, aiThreadsReadById } from "./Ai/aiThreadsReadById";
import { AiThreadsReadInput, AiThreadsReadOutput, aiThreadsRead } from "./Ai/aiThreadsRead";

interface ApiContextState {
    api: {
        ai: {
            aiThreads: {
                create: (input: AiThreadsCreateInput) => Promise<AiThreadsCreateOutput>,
                read: (input: AiThreadsReadInput) => Promise<AiThreadsReadOutput>,
                readById: (input: AiThreadsReadByIdInput) => Promise<AiThreadsReadByIdOutput>,
                updateById: (input: AiThreadsUpdateByIdInput) => Promise<AiThreadsUpdateByIdOutput>,
            }
            aiImages: {
                create: (input: AiImagesCreateInput) => Promise<AiImagesCreateOutput>,
            }
        }
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
            create: (input: ProjectsCreateInput) => Promise<ProjectsCreateOutput>
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
        ai: {
            aiThreads: {
                create: aiThreadsCreate,
                updateById: aiThreadsUpdateById,
                read: aiThreadsRead,
                readById: aiThreadsReadById,
            },
            aiImages: {
                create: aiImagesCreate
            },
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

