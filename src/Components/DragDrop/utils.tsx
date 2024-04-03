import PageContent from "../../Store/PageContent"

const moveItem = (items: PageContent[], item: PageContent, delta: number): PageContent[] => {
    const copy = [...items]
    const currentIndex = copy.indexOf(item)
    const nextIndex = currentIndex + delta
    if (nextIndex < 0 || nextIndex > copy.length) {
        return copy
    }

    const indexSorted = [currentIndex, nextIndex].sort()
    copy.splice(currentIndex, 1)
    copy.splice(nextIndex, 0, item)
    return copy
}

export const moveItemUp = (items: PageContent[], item: PageContent): PageContent[] => {
    return moveItem(items, item, -1)
}

export const moveItemDown = (items: PageContent[], item: PageContent): PageContent[] => {
    return moveItem(items, item, 1)
}
