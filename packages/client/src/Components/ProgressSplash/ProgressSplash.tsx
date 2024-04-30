import React from "react"
import { Progress } from "@radix-ui/themes"
import { Subject } from "rxjs"

import { RequestEvent, requestController } from "../../Api/fetch"
import useObservable from "../../Utils/Hooks/UseObservable"

import * as styles from "./ProgressSplash.scss"

interface ProgressSplashProps {
    event$?: Subject<RequestEvent>
}

const ProgressSplash: React.FC<ProgressSplashProps> = ({
    event$ = requestController.event$
}) => {
    useObservable(event$)
    const requestsInflight = requestController.getRequestsCounter()
    const progress = 100 - (requestsInflight * 10)
    const showProgress = progress < 100
    return (
        <>
            {showProgress && <Progress
                size="1"
                radius="none"
                value={progress}
                className={styles.progress}
            />}
        </>
    )
}

export default ProgressSplash
