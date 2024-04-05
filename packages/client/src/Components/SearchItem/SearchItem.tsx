import React from "react"

import ComponentsGallery from "../Gallery/Components"

import { ContentStruct, ContentCategory } from "../../types"

import * as styles from "./Search.scss"
import PageContent from "../../Store/PageContent"

interface SearchItemProps {
    activeItem: PageContent
    templates: ContentStruct[]
    onClick: (item: ContentStruct) => void
}

const SearchItem: React.FC<SearchItemProps> = ({ activeItem, templates, onClick }) => {
    const activeCategories = activeItem?.getCategories().filter(c => ContentCategory.TEXT !== c) || []
    const [searchInput, setSearchInput] = React.useState("")
    const [categories, setCategories] = React.useState<ContentCategory[]>(activeCategories)

    const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setSearchInput(e.target.value)
    }

    const onOptionChange = (event: React.ChangeEvent<HTMLInputElement>, category: ContentCategory) => {
        if (event.target.checked) {
            setCategories([
                ...categories,
                category
            ])
        }

        if (!event.target.checked) {
            setCategories(categories.filter(c => c !== category))
        }
    }

    const filteredTemplates = templates.filter(contentStruct => {
        const includesSelectedCategories = contentStruct.categories.some(c => categories.includes(c))

        const matchedCategories = Object.values(contentStruct.categories)
            .map(i => i.toLowerCase())
            .filter(i => i.startsWith(searchInput))

        return includesSelectedCategories || (searchInput !== "" && matchedCategories.length)
    })

    return (
        <div className={styles.search}>
            <div className={styles.searchHeader}>
                <div className={styles.searchFind}>
                    <span className={styles.searchFindLabel}>
                        What are you looking for?
                    </span>
                    <input className={styles.searchFindInput} type="text" onChange={onChange} placeholder="e.g. About" />
                </div>
                <div className={styles.searchOptions}>
                    {Object.values(ContentCategory).map(c => c.toLocaleLowerCase()).map(c => (
                        <span key={`search-checkbox-${c}`} className={styles.searchCheckbox}>
                            <input id={`search-checkbox-${c}`} type="checkbox" checked={categories.map(ct => ct.toLocaleLowerCase()).includes(c)} onChange={(e) => onOptionChange(e, c.toUpperCase() as ContentCategory)} />
                            <label className={styles.searchOptionsLabel} htmlFor={`search-checkbox-${c}`}>{c}</label>
                        </span>
                    ))}
                </div>
            </div>
            <div className={styles.searchContent}>
                <ComponentsGallery
                    onClick={onClick}
                    templates={filteredTemplates.length < 1 ? templates : filteredTemplates}
                />
            </div>
        </div>
    )
}

export default SearchItem
