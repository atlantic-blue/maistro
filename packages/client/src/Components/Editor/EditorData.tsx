import React from "react";
import EditorText from "./EditorText";
import EditorImage from "./EditorImage";
import EditorWysiwyg from "./EditorWysiwyg";
import EditorVideo from "./EditorVideo";
import { NavigationItem } from "../../Templates/Components/Navigation/Navigation";
import EditorLinks from "./EditorLinks";

export enum EditorDataType {
    TEXT = "TEXT",
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    WYSIWYG = "WYSIWYG",
    LINKS = "LINKS",
}

export interface EditorLinksProps {
    type: EditorDataType.LINKS
    links: NavigationItem[]
    onChange: React.Dispatch<React.SetStateAction<NavigationItem[]>>
    onUploadFile: (file: File) => Promise<string>
}

export interface EditorWysiwygProps {
    type: EditorDataType.WYSIWYG
    name: string
    value?: string
    onChange: (value: string) => void
    onUploadFile: (file: File) => Promise<string>
}

export interface EditorVideoProps {
    type: EditorDataType.VIDEO
    name: string
    value?: string
    onChange: (value: string) => void
    onUploadFile: (file: File) => Promise<string>
}

export interface EditorImageProps {
    type: EditorDataType.IMAGE
    name: string
    value?: string
    onChange: (value: string) => void
    onUploadFile: (file: File) => Promise<string>
}

export interface EditorTextProps {
    type: EditorDataType.TEXT
    name: string
    value?: string
    onChange: (value: string) => void
    aiEnabled?: boolean
    section?: "headline" | "content" | "cta"
}

export type EditorDataProps = EditorTextProps | EditorImageProps | EditorVideoProps | EditorWysiwygProps | EditorLinksProps

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
        case EditorDataType.VIDEO:
            return (
                <EditorVideo {...props} />
            )
        case EditorDataType.WYSIWYG:
            return (
                <EditorWysiwyg {...props} />
            )
        case EditorDataType.LINKS:
            return (
                <EditorLinks {...props} />
            )
        default:
            return null
    }
}

export default EditorData
