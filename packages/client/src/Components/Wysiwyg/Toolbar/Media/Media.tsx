import React from "react"

import ToolbarMediaImage from "./MediaImage/MediaImage"
import ToolbarMediaVideo from "./MediaVideo/MediaVideo"
import ToolbarLink from "./Link/Link"
import { Command } from "../../Wysiwyg.types"

import * as wysiwygStyles from "../../Wysiwyg.scss"

interface ToolbarToolbarMediaProps {
    editorRef: React.MutableRefObject<HTMLDivElement | null>
    execCommand: (cmd: Command, args?: string | Node) => void
    onUploadImage: (file: File) => Promise<string>
}

const ToolbarMedia: React.FC<ToolbarToolbarMediaProps> = (props) => {
    return (
        <div className={wysiwygStyles.toolbarGroup}>
            <ToolbarMediaImage
                editorRef={props.editorRef}
                execCommand={props.execCommand}
                onUploadImage={props.onUploadImage}
            />
            {/* // TODO enable video
            <ToolbarMediaVideo
                editorRef={props.editorRef}
                execCommand={props.execCommand}
            /> */}
            <ToolbarLink
                editorRef={props.editorRef}
                execCommand={props.execCommand}
            />
        </div>
    )
}

export default ToolbarMedia
