import React from 'react'

import { PageContext } from './PageContext';
import Page from './Store/Page';
import { PageMessageType } from './types';

interface PageProps {
    page: Page
    children: React.ReactNode
}

const PageEdit: React.FC<PageProps> = (props) => {
    const [changeId, setChangeId] = React.useState("")

    React.useLayoutEffect(() => {
        const subscription = props.page.event$.subscribe((event) => {
            if (
                event.type === PageMessageType.PUT_CONTENT ||
                event.type === PageMessageType.SET_CONTENT ||
                event.type === PageMessageType.SET_CONTENT_ACTIVE
            ) {

                setChangeId(`${Math.random()}`)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])


    return (
        <>
            <PageContext.Provider value={{
                page: props.page
            }}>
                {props.children}
            </PageContext.Provider>
        </>
    )
}

export default PageEdit
