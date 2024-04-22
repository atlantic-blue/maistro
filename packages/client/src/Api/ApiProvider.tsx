import React from "react";
import { projectsCreate } from "./Projects/projectsCreate";
import { projectsRead } from "./Projects/projectsRead";
import { projectsReadById } from "./Projects/projectsReadById";
import { projectsUpdateById } from "./Projects/projectsUpdateById";
import { projectsDelete } from "./Projects/projectsDelete";
import { paymentsSubscriptionsRead } from "./Payments/PaymentSubscriptions/PaymentSubscriptionsRead";

interface ApiContextState {
    api: {
        projects: {
            create: ({ token, name, url }: { token: string, name: string, url: string }) => Promise<{ id: string, name: string, url: string }>
            read: ({ token }: { token: string }) => Promise<Partial<ProjectStruct[]>>
            readById: ({ projectId, token }: { projectId: string, token: string }) => Promise<Partial<ProjectStruct>>
            updateById: ({ projectId, token, name, url }: { projectId: string, token: string, name: string, url: string }) => Promise<void>,
            delete: ({ token, id }: { token: string, id: string }) => Promise<void>,
        }
        payments: {
            subscriptions: {
                read: ({ token }: { token: string }) => Promise<{ subscription: { status: string } }>
            }
        }
    }
}

const context: ApiContextState = {
    api: {
        projects: {
            create: projectsCreate,
            read: projectsRead,
            readById: projectsReadById,
            updateById: projectsUpdateById,
            delete: projectsDelete,
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
            <ApiContext.Provider value={context}>
                {props.children}
            </ApiContext.Provider>
        </>
    )
}

export default ApiProvider

