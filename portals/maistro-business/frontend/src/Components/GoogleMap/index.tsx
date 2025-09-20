import React from "react"
import { Box, Text, Flex } from "@maistro/ui"

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

const GoogleMap: React.FC<SectionMapGoogleProps> = (props) => {
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
        <Box>

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


export default GoogleMap
