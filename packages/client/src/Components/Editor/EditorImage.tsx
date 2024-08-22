import React from "react";
import { Avatar, Box, Flex, Spinner, Tabs, Text, TextField } from "@radix-ui/themes";

import * as styles from "./EditorImage.scss"

import { EditorImageProps } from "./EditorData";
import IconUpLoad from "../Icons/Upload/Upload";
import AvatarMaistro from "../AvatarMaistro/AvatarMaistro";
import EditorImageAi from "../../Ai/EditorImageAi/EditorImageAi";
import ImagesGallery from "../ImagesGallery/ImagesGallery";
import { PaymentsContext, canUseFeature } from "../../Payments/PaymentsProvider";

const EditorImage: React.FC<EditorImageProps> = (props) => {
    const { paymentPlan, redirectToPaymentPlans } = React.useContext(PaymentsContext)
    const [preview, setPreview] = React.useState(props.value);
    const [isLoading, setLoading] = React.useState(false)
    const uploadId = `${props.name}-${Date.now()}`

    const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        if (!event.target.files || !event.target.files[0]) {
            return
        }
        setLoading(true)
        const file = event.target.files[0]
        const src = await props.onUploadFile(file)

        setPreview(src);
        props.onChange(src)
        setLoading(false)
    };

    return (
        <Tabs.Root defaultValue="gallery">
            <Flex justify="center" align="center" direction="column" width="100%">
                <Text as="div" size="2" mb="1" weight="bold">
                    {props.name}
                </Text>
                <Avatar
                    size="7"
                    src={preview}
                    fallback="Preview"
                    alt="Preview"
                />

                <Tabs.List size="2">
                    <Tabs.Trigger value="gallery">Gallery</Tabs.Trigger>
                    <Tabs.Trigger value="url">URL</Tabs.Trigger>
                    <Tabs.Trigger value="upload">Upload</Tabs.Trigger>
                    <Tabs.Trigger value="ai">
                        <AvatarMaistro isLoading={isLoading} />
                    </Tabs.Trigger>
                </Tabs.List>

                <Box pt="3" width="100%">
                    <Tabs.Content value="ai">
                        <EditorImageAi
                            onChange={src => {
                                setPreview(src);
                                props.onChange(src);
                            }}
                        />
                    </Tabs.Content>

                    <Tabs.Content value="upload">

                        {!isLoading && (
                            <>
                                {canUseFeature.aiImage[paymentPlan]() ? (
                                    <label htmlFor={uploadId} className={styles.uploadLabel}>
                                        <span>
                                            <IconUpLoad className={styles.uploadIcon} />
                                        </span>
                                        <span>Upload</span>
                                        <input
                                            id={uploadId}
                                            type="file"
                                            accept="image/*"
                                            className={styles.uploadInput}
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                ) : (
                                    <label htmlFor={uploadId} className={styles.uploadLabel} onClick={redirectToPaymentPlans}>
                                        <IconUpLoad className={styles.uploadIcon} />
                                    </label>
                                )
                                }
                            </>
                        )}

                        {isLoading && (
                            <Flex justify="center" align="center" direction="column" width="100%">
                                <Spinner />
                            </Flex>
                        )}

                    </Tabs.Content>

                    <Tabs.Content value="gallery">
                        <ImagesGallery
                            onChange={src => {
                                setPreview(src);
                                props.onChange(src);
                            }}
                        />
                    </Tabs.Content>

                    <Tabs.Content value="url">
                        <TextField.Root
                            placeholder={props.value}
                            type="text"
                            size="2"
                            variant="surface"
                            value={props.value}
                            onChange={e => {
                                const src = e.target.value;
                                setPreview(src);
                                props.onChange(src);
                            }}
                            required
                        />
                    </Tabs.Content>

                </Box>
            </Flex>
        </Tabs.Root>
    )
}

export default EditorImage

