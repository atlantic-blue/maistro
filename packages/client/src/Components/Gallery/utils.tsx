import { set } from "lodash"

export function onChange<P extends object>(props: P) {
    return (id: string, content: string) => {
        set(props, id, content)
    }
}
