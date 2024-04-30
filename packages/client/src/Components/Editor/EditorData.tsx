import React from "react";
import EditorText from "./EditorText";
import EditorImage from "./EditorImage";

export enum EditorDataType {
    TEXT = "TEXT",
    IMAGE = "IMAGE",
}

export interface EditorImageProps {
    type: EditorDataType.IMAGE
    name: string
    value?: string
    onChange: (value: string) => void
    onUploadImage: (file: File) => Promise<string>
}

export type EditorDataProps = {
    type: EditorDataType.TEXT
    name: string
    value?: string
    onChange: (value: string) => void
} | EditorImageProps

const EditorData: React.FC<EditorDataProps> = (props) => {
    switch (props.type) {
        case EditorDataType.TEXT:
            return (
                <EditorText {...props} />
            )
        case EditorDataType.IMAGE:
            return (
                <EditorImage {...props} />
            )
        default:
            return null
    }
}

export default EditorData
