import React from "react"
import { 
    ResourceStringLanguage, 
    ResourceStrings, 
    resourceStrings 
} from "."

interface ApiContextState {
    language: ResourceStringLanguage
    setLanguage: React.Dispatch<React.SetStateAction<ResourceStringLanguage>>
    data: Record<ResourceStringLanguage, ResourceStrings>
}

const context: ApiContextState = {
    data: resourceStrings,
    language: ResourceStringLanguage.ENGLISH,
    setLanguage: () => void 0,
}

export const ResourceStringsContext = React.createContext<ApiContextState>(context)

interface ResourceStringsProviderProps {
    children: React.ReactNode
}

export const getCurrentLanguage = () => {
    const languages = Object.values(ResourceStringLanguage)
    const locationLanguage = location.pathname
        .split("/")
        .filter(Boolean)
        .find((l) => languages.includes(l as ResourceStringLanguage)) as ResourceStringLanguage
    const navigatorLanguage = languages?.find(l => l === navigator.language.split("-")[0])
    const language = locationLanguage || navigatorLanguage || ResourceStringLanguage.ENGLISH
    return language
}

const ResourceStringsProvider: React.FC<ResourceStringsProviderProps> = (props) => {
    const [currentLanguage, setCurrentLanguage] = React.useState<ResourceStringLanguage>(getCurrentLanguage())

    return (
        <>
            <ResourceStringsContext.Provider value={{
                data: resourceStrings,
                language: currentLanguage,
                setLanguage: setCurrentLanguage,
            }} >
                {props.children}
            </ResourceStringsContext.Provider>
        </>
    )
}

export default ResourceStringsProvider
