import React from "react"
import { Button, DropdownMenu } from "@radix-ui/themes"

import { ResourceStringsContext } from "../../../../ResourceStrings/ResourceStringsProvider"
import { ResourceStringLanguage } from "../../../../ResourceStrings"
import { useLocation, useNavigate } from "react-router-dom"
import { appRoutes } from "../../../router"

const DropDownLanguages: React.FC = () => {
    const { language, setLanguage } = React.useContext(ResourceStringsContext)
    const navigate = useNavigate()
    const location = useLocation()

    React.useEffect(() => {
        const prev = location.pathname
        const next = location.pathname.split("/")
        next[1] = language

        if (prev !== next.join("/")) {
            navigate(next.join("/"))
            appRoutes.setLanguage(language)
        }

    }, [language])

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <Button variant="outline">
                    {language}
                    <DropdownMenu.TriggerIcon />
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                {
                    Object.values(ResourceStringLanguage)
                        .map(l => {
                            return (
                                <DropdownMenu.Item
                                    key={l}
                                    onClick={() => setLanguage(l)}
                                >
                                    {l}
                                </DropdownMenu.Item>
                            )
                        })
                }
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    )
}

export default DropDownLanguages
