import React from "react";

import { ProjectsCreateInput, ProjectsCreateOutput, projectsCreate } from "./Projects/projectsCreate";
import { projectsRead } from "./Projects/projectsRead";
import { projectsReadById } from "./Projects/projectsReadById";
import { ProjectsUpdateInput, projectsUpdateById } from "./Projects/projectsUpdateById";
import { projectsDelete } from "./Projects/projectsDelete";
import { PaymentsSubscriptionsReadInput, PaymentsSubscriptionsReadOutput, paymentsSubscriptionsRead } from "./Payments/PaymentSubscriptions/PaymentSubscriptionsRead";
import { EmailListsCreateInput, EmailListsCreateOutput, emailListsCreate } from "./EmailLists/emailListsCreate";
import { EmailListsReadInput, EmailListsReadOutput, emailListsRead } from "./EmailLists/emailListsRead";

import { OrderStruct, ProductStruct, ProjectStruct } from "../types";
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
import { PaymentsAccountsCreateInput, PaymentsAccountsCreateOutput, paymentsAccountsCreate } from "./Payments/PaymentsAccountsCreate";
import { PaymentsAccountsLinkCreateInput, PaymentsAccountsLinkCreateOutput, paymentsAccountsLinkCreate } from "./Payments/PaymentsAccountsLinkCreate";
import { PaymentsAccountsReadInput, PaymentsAccountsReadOutput, paymentsAccountsRead } from "./Payments/PaymentsAccountsRead";
import { PaymentsAccountsReadByIdInput, PaymentsAccountsReadByIdOutput, paymentsAccountsReadById } from "./Payments/PaymentsAccountsReadById";
import { ImagesGetInput, ImagesGetOutput, imagesGet } from "./Images/imagesGet";
import { AiComponentsCreateInput, AiComponentsCreateOutput, aiComponentsCreate } from "./Ai/aiComponentsCreate";
import { AiTemplatesCreateInput, AiTemplatesCreateOutput, aiTemplatesCreate } from "./Ai/aiTemplatesCreate";
import { AiTemplatesReadByIdInput, AiTemplatesReadByIdOutput, aiTemplatesReadById } from "./Ai/aiTemplatesReadById";
import { AiTemplatesReadInput, AiTemplatesReadOutput, aiTemplatesRead } from "./Ai/aiTemplatesRead";
import { Product, ProductsCreateInput, ProductsCreateOutput, productsCreate } from "./Products/productsCreate";
import { ProductsReadInput, productsRead } from "./Products/productsRead";
import { ProductsReadByIdInput, productsReadById } from "./Products/productsReadById";
import { ProductsUpdateByIdInput, ProductsUpdateByIdOutput, productsUpdateById } from "./Products/productsUpdateById";
import { ProductsDeleteInput, productsDelete } from "./Products/productsDelete";
import { ContentDeleteByIdInput, contentDeleteById } from "./Content/contentDeleteById";
import { OrdersReadByIdInput, ordersReadById } from "./Orders/ordersReadById";
import { OrdersDeleteInput, ordersDelete } from "./Orders/ordersDelete";
import { OrdersReadInput, ordersRead } from "./Orders/ordersRead";
import { OrdersUpdateByIdInput, OrdersUpdateByIdOutput, ordersUpdateById } from "./Orders/ordersUpdateById";
import { systemUsersRead, SystemUsersReadInput, SystemUsersReadOutput } from "./System/systemUsersRead";
import { systemProjectsRead, SystemProjectsReadInput, SystemProjectsReadOutput } from "./System/systemProjectsRead";
import { systemProjectsReadById, SystemProjectsReadByIdInput, SystemProjectsReadByIdOutput } from "./System/systemProjectsReadById";
import { SystemProjectsReadUpdateUserOutput, systemProjectsUpdateUser, SystemProjectsUpdateUserInput } from "./System/systemProjectsUpdateUser";
import { projectUpload, ProjectUploadInput, ProjectUploadOutput } from "./Project/projectUpload";
import { projectUploadMultipart, ProjectUploadMultipartInput, ProjectUploadMultipartOutput } from "./Project/projectUploadMultipart";
import ErrorToast from "../Components/ErrorToast/ErrorToast";
import { requestController } from "./fetch";


interface ApiContextState {
    api: {
        ai: {
            aiTemplates: {
                create: (input: AiTemplatesCreateInput) => Promise<AiTemplatesCreateOutput>,
                read: (input: AiTemplatesReadInput) => Promise<AiTemplatesReadOutput>,
                readById: (input: AiTemplatesReadByIdInput) => Promise<AiTemplatesReadByIdOutput>,
            }
            aiComponents: {
                create: (input: AiComponentsCreateInput) => Promise<AiComponentsCreateOutput>,
            }
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
            deleteById: (input: ContentDeleteByIdInput) => Promise<void>,
        }
        images: {
            get: (input: ImagesGetInput) => Promise<ImagesGetOutput>
        }
        pages: {
            create: (input: PagesCreateInput) => Promise<PagesCreateOutput>,
            read: (input: PagesReadInput) => Promise<PagesReadOutput>
            readById: (input: PagesReadByIdInput) => Promise<PagesReadByIdOutput>
            updateById: (input: PagesUpdateByIdInput) => Promise<void>,
        }
        products: {
            create: (input: ProductsCreateInput) => Promise<ProductsCreateOutput>
            read: (input: ProductsReadInput) => Promise<ProductStruct[]>
            readById: (input: ProductsReadByIdInput) => Promise<ProductStruct>
            updateById: (input: ProductsUpdateByIdInput) => Promise<ProductsUpdateByIdOutput>,
            delete: (input: ProductsDeleteInput) => Promise<void>,
        }
        orders: {
            read: (input: OrdersReadInput) => Promise<OrderStruct[]>
            delete: (input: OrdersDeleteInput) => Promise<void>,
            readById: (input: OrdersReadByIdInput) => Promise<OrderStruct>
            updateById: (input: OrdersUpdateByIdInput) => Promise<OrdersUpdateByIdOutput>,
        }
        projects: {
            create: (input: ProjectsCreateInput) => Promise<ProjectsCreateOutput>
            read: ({ token }: { token: string }) => Promise<Partial<ProjectStruct[]>>
            readById: ({ projectId, token }: { projectId: string, token: string }) => Promise<Partial<ProjectStruct>>
            updateById: (input: ProjectsUpdateInput) => Promise<void>,
            delete: ({ token, id }: { token: string, id: string }) => Promise<void>,
            upload: (input: ProjectUploadInput) => Promise<ProjectUploadOutput>
            uploadMultipart: (input: ProjectUploadMultipartInput) => Promise<ProjectUploadMultipartOutput>
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
            accounts: {
                create: (input: PaymentsAccountsCreateInput) => Promise<PaymentsAccountsCreateOutput>
                read: (input: PaymentsAccountsReadInput) => Promise<PaymentsAccountsReadOutput>
                readById: (input: PaymentsAccountsReadByIdInput) => Promise<PaymentsAccountsReadByIdOutput>
            }
            accountsLink: {
                create: (input: PaymentsAccountsLinkCreateInput) => Promise<PaymentsAccountsLinkCreateOutput>
            }
            subscriptions: {
                read: (input: PaymentsSubscriptionsReadInput) => Promise<PaymentsSubscriptionsReadOutput>
            }
        }
        system: {
            users: {
                read: (input: SystemUsersReadInput) => Promise<SystemUsersReadOutput>
            }
            projects: {
                read: (input: SystemProjectsReadInput) => Promise<SystemProjectsReadOutput>
                readById: (input: SystemProjectsReadByIdInput) => Promise<SystemProjectsReadByIdOutput>
                updateUser: (input: SystemProjectsUpdateUserInput) => Promise<SystemProjectsReadUpdateUserOutput>
            }
        }
    }
}

const context: ApiContextState = {
    api: {
        file: {
            // TODO @deprecate in favour of projectUpload // what's the deal with the token?
            createFile: fileCreate
        },
        ai: {
            aiTemplates: {
                create: aiTemplatesCreate,
                read: aiTemplatesRead,
                readById: aiTemplatesReadById,
            },
            aiComponents: {
                create: aiComponentsCreate,
            },
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
            deleteById: contentDeleteById,
        },
        images: {
            get: imagesGet,
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
            upload: projectUpload,
            uploadMultipart: projectUploadMultipart
        },
        products: {
            updateById: productsUpdateById,
            readById: productsReadById,
            read: productsRead,
            delete: productsDelete,
            create: productsCreate,
        },
        orders: {
            read: ordersRead,
            readById: ordersReadById,
            delete: ordersDelete,
            updateById: ordersUpdateById,
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
            accounts: {
                create: paymentsAccountsCreate,
                read: paymentsAccountsRead,
                readById: paymentsAccountsReadById,
            },
            accountsLink: {
                create: paymentsAccountsLinkCreate,
            },
            subscriptions: {
                read: paymentsSubscriptionsRead
            }
        },
        system: {
            users: {
                read: systemUsersRead,
            },
            projects: {
                read: systemProjectsRead,
                readById: systemProjectsReadById,
                updateUser: systemProjectsUpdateUser,
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

            <ErrorToast
                requestController={requestController}
            />
        </>
    )
}

export default ApiProvider

