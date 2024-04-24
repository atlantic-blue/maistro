import { useEffect, useState } from "react"
import { Observable } from "rxjs"

function useObservable<T>(observable: Observable<T>, initialState?: T) {
    const [value, setValue] = useState(initialState)
    useEffect(() => {
        const subscription = observable.subscribe((event) => {
            setValue(event)
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return value
}

export default useObservable
