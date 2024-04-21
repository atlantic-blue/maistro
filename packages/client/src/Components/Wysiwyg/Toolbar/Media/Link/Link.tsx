import React, { useRef } from 'react';

import useClickOutside from '../../../../../Utils/Hooks/UseClickOutside';

import IconLink from '../../../../Icons/Link/Link';
import { Command } from '../../../Wysiwyg.types';

import * as styles from "../Media.scss"
import * as wysiwygStyles from "../../../Wysiwyg.scss"
import { sanitizeHref } from '../../../../../Utils/url';
import { ProjectsContext } from '../../../../../Projects';

interface ToolbarLinkProps {
    editorRef: React.MutableRefObject<HTMLDivElement | null>
    execCommand: (cmd: Command, args?: string) => void
}

const ToolbarLink: React.FC<ToolbarLinkProps> = (props) => {
    const ref = useRef(null);
    const [lastSelection, setLastSelection] = React.useState<Selection | null>(null)
    const [toggle, setToggle] = React.useState(false)
    const [href, setHref] = React.useState("")
    const [text, setText] = React.useState("")
    const [currentLink, setCurrentLink] = React.useState<HTMLAnchorElement | null>(null)

    React.useEffect(() => {
        const handleClick = (event) => {
            const { target } = event;
            if (!['A'].includes(target.tagName)) {
                return
            }
            setToggle(true)
            // updateLastRange()
            setCurrentLink(event.target)
        };

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [])

    useClickOutside({
        ref,
        onClickOutside() {
            setToggle(false)
        },
    })

    const updateLastRange = () => {
        const selection = window.getSelection();
        if (!selection) {
            return
        }

        if (selection.rangeCount > 0) {
            setLastSelection(selection.getRangeAt(0));
        }
    };

    const onButtonClick = () => {
        updateLastRange()
        setToggle(!toggle)
    };

    const onHrefInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const href = e.target.value
        if (currentLink) {
            currentLink!.href = href
        } else {
            setHref(href)
        }
    }

    const onTextInput: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        const value = e.target.value
        if (currentLink) {
            currentLink!.innerText = value
        } else {
            setText(value)
        }
    }

    const onCreate = () => {
        if (currentLink) {
            setToggle(false)
            return
        }

        if (!href || !text) {
            return
        }

        try {
            props.editorRef?.current?.focus();
            if (lastSelection) {
                const selection = window.getSelection();
                selection?.removeAllRanges();
                selection?.addRange(lastSelection);
            }

            // Remove the old link
            if (currentLink) {
                const range = document.createRange();
                const sel = window.getSelection();

                range.selectNode(currentLink);
                sel?.removeAllRanges();
                sel?.addRange(range);

                currentLink.remove();
            }
            const html = `<a href="${href}" target="_blank">${text || 'Link'}</a>`;

            props.execCommand(Command.INSERT_HTML,
                html
            );
        } catch (error) {
            // TODO app level error
        } finally {
            setToggle(false)
        }
    }

    return (
        <div
            ref={ref}
            className={styles.section}
        >
            <button
                type="button"
                onClick={onButtonClick}
                className={wysiwygStyles.button}
            >
                <IconLink className={wysiwygStyles.buttonIcon} />
            </button>
            {
                toggle && (
                    <div className={styles.options}>
                        <div className={styles.option}>
                            <div className={styles.optionsTitle}>
                                URL
                            </div>
                            <input
                                type="text"
                                className={styles.optionsInput}
                                onChange={onHrefInput}
                                defaultValue={currentLink?.href}
                            />
                        </div>
                        <div className={styles.option}>
                            <div className={styles.optionsTitle}>
                                Text to display
                            </div>
                            <textarea
                                rows={2}
                                onChange={onTextInput}
                                className={styles.optionsInput}
                                defaultValue={currentLink?.innerText}
                            />
                        </div>
                        <div className={styles.optionsContainer}>
                            <button onClick={onCreate}>
                                Create
                            </button>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default ToolbarLink;