const moveItem = <I,>(items: I[], item: I, delta: number): I[] => {
    const copy = [...items]
    const currentIndex = copy.indexOf(item)
    const nextIndex = currentIndex + delta
    if (nextIndex < 0 || nextIndex > copy.length) {
        return copy
    }

    // TODO do we need this?
    // const indexSorted = [currentIndex, nextIndex].sort()
    copy.splice(currentIndex, 1)
    copy.splice(nextIndex, 0, item)
    return copy
}

export const moveItemUp = <I,>(items: I[], item: I): I[] => {
    return moveItem(items, item, -1)
}

export const moveItemDown = <I,>(items: I[], item: I): I[] => {
    return moveItem(items, item, 1)
}
