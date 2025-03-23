import React from "react"

import { Command, NodeName } from "../../Wysiwyg.types"

import * as styles from "./FormatBlock.scss"
import * as WysiwygStyles from "../../Wysiwyg.scss"

interface ToolbarJustifyProps {
    editorRef: React.MutableRefObject<HTMLDivElement | null>
    execCommand: (cmd: Command, args?: string | Node) => void
}

const ToolBarFormatBlock: React.FC<ToolbarJustifyProps> = (props) => {
    const [formatBlock, setFormatBlock] = React.useState<Node["nodeName"]>(NodeName.P);

    React.useEffect(() => {
        const checkCurrentFormatBlock = () => {
            const selection = document.getSelection();
            const node = selection?.anchorNode?.parentNode;
            let format = NodeName.P;

            if (node && node.nodeName.startsWith('H')) {
                format = node.nodeName as NodeName;
            } else if (node && node.nodeName === NodeName.P) {
                format = NodeName.P;
            }

            setFormatBlock(format);
        };

        props.editorRef.current?.addEventListener('click', checkCurrentFormatBlock);
        props.editorRef.current?.addEventListener('keyup', checkCurrentFormatBlock);

        return () => {
            props.editorRef.current?.removeEventListener('click', checkCurrentFormatBlock);
            props.editorRef.current?.removeEventListener('keyup', checkCurrentFormatBlock);
        };
    }, []);

    const handleFormatChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
        const newFormatBlock = event.target.value;
        setFormatBlock(newFormatBlock);
        props.execCommand(Command.FORMAT_BLOCK, newFormatBlock);
    };

    return (
        <div className={WysiwygStyles.toolbarGroup}>
            <select className={styles.select} value={formatBlock} onChange={handleFormatChange}>
                <option value={NodeName.P}>Paragraph</option>
                <option value={NodeName.H1}>Heading 1</option>
                <option value={NodeName.H2}>Heading 2</option>
                <option value={NodeName.H3}>Heading 3</option>
                <option value={NodeName.H4}>Heading 4</option>
                <option value={NodeName.H5}>Heading 5</option>
                <option value={NodeName.H6}>Heading 6</option>
            </select>
        </div>
    )
}

export default ToolBarFormatBlock
