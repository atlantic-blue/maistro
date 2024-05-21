import React from "react"
import { Avatar, Box, Button, Card, Flex, TextArea } from "@radix-ui/themes"

import { ApiContext } from "../../Api/ApiProvider"
import { ProjectsContext } from "../../Projects"
import { ImagePreview } from "../../Api/Images/imagesGet"

interface ImagesGalleryProps {
    onChange: (src: string) => void
}

const ImagesGallery: React.FC<ImagesGalleryProps> = (props) => {
    const { api } = React.useContext(ApiContext)
    const { user } = React.useContext(ProjectsContext)
    const [input, setInput] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [gallery, setGallery] = React.useState<ImagePreview[]>([])

    const onClick = async () => {
        setIsLoading(true)
        try {
            const response = await api.images.get({
                token: user.getTokenId(),
                page: 4,
                perPage: 5,
                query: input
            })
            setGallery(response.results)
        } catch (error) {
            // TODO app level error
            console.log({ error })
        } finally {
            setIsLoading(false)
        }
    }

    const onImageClick = (image: ImagePreview) => {
        props.onChange(image.urls.full)
    }

    return (
        <Box>
            <Flex gap="2" align="center" justify="center" wrap="wrap" m="2">
                {gallery?.map(image => {
                    return (
                        <Box
                            key={image.urls.raw}
                            onClick={() => onImageClick(image)}>
                            <Avatar
                                size="7"
                                src={image.urls.thumb}
                                fallback="NA"
                            />
                        </Box>
                    )
                })}
            </Flex>

            <Flex gap="2" direction="column" justify="center">
                <TextArea
                    size="3"
                    variant="surface"
                    placeholder="What are searching for?"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                />
                <Button
                    size="1"
                    variant="soft"
                    onClick={onClick} loading={isLoading}>
                    Search
                </Button>
            </Flex>
        </Box>
    )
}

export default ImagesGallery
