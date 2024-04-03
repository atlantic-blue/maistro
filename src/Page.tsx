import React from 'react'

import { PageContext } from './PageContext';
import Page from './Store/Page';

interface PageProps {
    page: Page
    children: React.ReactNode
}

const PageEdit: React.FC<PageProps> = (props) => {
    const [changeId, setChangeId] = React.useState("")

    React.useLayoutEffect(() => {
        const subscription = props.page.event$.subscribe(() => {
            setChangeId(`${Math.random()}`)
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
                <div key={changeId}>
                    {props.children}
                </div>
            </PageContext.Provider>
        </>
    )
}

export default PageEdit
