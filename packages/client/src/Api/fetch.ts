import { Subject } from "rxjs"

export enum RequestEventType {
    REQUEST_INIT = "REQUEST_INIT",
    REQUEST_ERROR = "REQUEST_ERROR",
    REQUEST_ENDED = "REQUEST_ENDED",
}

export type RequestEvent = {
    type: RequestEventType.REQUEST_INIT
    data: {
        input: string | URL | globalThis.Request,
        init?: RequestInit
    }
} | {
    type: RequestEventType.REQUEST_ERROR
    data: {
        input: string | URL | globalThis.Request,
        init?: RequestInit
        error: any
    }
} | {
    type: RequestEventType.REQUEST_ENDED
    data: {
        response: Response,
    }
}

class RequestController {
    private requestsCounter = 0
    public event$ = new Subject<RequestEvent>()

    constructor(counter?: number) {
        this.requestsCounter = counter || 0
    }

    private increment = () => {
        this.requestsCounter++
    }
    private decrease = () => {
        this.requestsCounter--
    }
    private reset = () => {
        this.requestsCounter = 0
    }

    public getRequestsCounter(): number {
        return this.requestsCounter
    }

    public fetch = (
        input: string | URL | globalThis.Request,
        init?: RequestInit
    ): Promise<Response> => {
        this.increment()
        this.event$.next({
            type: RequestEventType.REQUEST_INIT,
            data: {
                input,
                init
            }
        })

        return fetch(input, init)
            .catch(error => {
                this.reset()
                this.event$.next({
                    type: RequestEventType.REQUEST_ERROR,
                    data: {
                        error,
                        input,
                        init,
                    }
                })
                throw error
            })
            .then((response) => {
                this.event$.next({
                    type: RequestEventType.REQUEST_ENDED,
                    data: {
                        response,
                    }
                })
                return response
            })
            .finally(() => {
                this.decrease()
            })
    }
}

const requestController = new RequestController()

export {
    requestController,
    RequestController
}