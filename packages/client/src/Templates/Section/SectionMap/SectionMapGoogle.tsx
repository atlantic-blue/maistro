import { Box, Text, Flex } from "@radix-ui/themes"
import React from "react"
import { TemplateCategory, TemplateComponentType, TemplateStruct } from "../../templateTypes"

export interface Address {
    postcode: string
    city: string
    country: string
    firstLine: string
}

export interface SectionMapGoogleProps {
    "data-hydration-id"?: string
    address: Address
    zoom: string
}

const SectionMapGoogle: React.FC<SectionMapGoogleProps> = (props) => {
    if (!props.address) {
        return null
    }

    const zoom = props.zoom || "12"

    const url = new URL("https://maps.google.com/maps")
    url.searchParams.append("hl", "en")
    url.searchParams.append("q", `${props.address.firstLine}, ${props.address.city}, ${props.address.postcode}, ${props.address.country}`)
    url.searchParams.append("z", zoom)
    url.searchParams.append("t", "")
    url.searchParams.append("ie", "UTF8")
    url.searchParams.append("iwloc", "B")
    url.searchParams.append("output", "embed")

    return (
        <Box data-hydration-id={props["data-hydration-id"]}>

            <iframe
                title="Google maps"
                width="100%"
                height="400"
                src={url.toString()}
            >
            </iframe>


            <Flex direction="column" gap="1" m="4" style={{ textAlign: "center" }}>
                <Flex direction="column" gap="1">
                    <Text weight="medium" size="4">
                        {props.address.firstLine}
                    </Text>
                    <Text weight="medium" size="1">
                        {props.address.city} {props.address.postcode},
                    </Text>
                    <Text weight="medium" size="1">
                        {props.address.country}
                    </Text>
                </Flex>
            </Flex>
        </Box>
    )
}


export default SectionMapGoogle
export const SectionMapGoogleItem: TemplateStruct<SectionMapGoogleProps> = {
    name: TemplateComponentType.MAP_GOOGLE,
    Component: SectionMapGoogle,
    categories: [TemplateCategory.MAP],
    description: "Section Map Google",
    classNames: [
        // ...Object.values(styles),
        // ...Object.values(ButtonStyles),
    ],
    props: {
        address: {
            postcode: "5070",
            city: "Payneham",
            country: "Australia",
            firstLine: "2 Sewell Avenue",
        }
    }
}
