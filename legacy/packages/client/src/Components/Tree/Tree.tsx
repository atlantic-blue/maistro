import React from "react"
import classnames from "classnames"

import IconMinus from "../Icons/Minus/Minus"
import IconPlus from "../Icons/Plus/Plus"

import * as styles from "./Tree.scss"
import Input from "../Input/Input"
import { PageContext, page$ } from "../../PageContext"
import { PageMessageType } from "../../types"

interface TreeStructure {
    [k: string]: string | TreeStructure
}

const isObject = (obj: TreeStructure | string) => {
    return typeof obj === "object" && typeof obj !== "string" && !Array.isArray(obj) && obj !== null
}

function setProperty<O, T>(obj: O, path: string, value: T) {
    const [head, ...rest] = path.split('.')

    return {
        ...obj,
        [head]: rest.length
            ? setProperty(obj[head], rest.join('.'), value)
            : value
    }
}


const KeyValue: React.FC<{ input: { key: string; value: string | TreeStructure }; parentKey?: string }> = (props) => {
    const { activeItem } = React.useContext(PageContext)
    const isNested = isObject(props.input.value)
    const [showMore, setShowMore] = React.useState(true)

    const [edit, setEdit] = React.useState(false)
    const [inputValue, setInputValue] = React.useState(isNested ? "" : String(props.input.value))
    const lens = props.parentKey ? `${props.parentKey}.${props.input.key}` : props.input.key


    const onClick = () => {
        setShowMore(!showMore)
    }

    const onValueClick = () => {
        setEdit(true)
    }

    const onChangeInput = (value: string) => {
        setInputValue(value)
    }

    const handleOutsideClick = () => {
        setEdit(false)

        if (!activeItem) {
            return
        }

        page$.next({
            type: PageMessageType.SET_ACTIVE_ITEM,
            items: [{
                ...activeItem,
                props: setProperty(activeItem.props, lens, inputValue)
            }]
        })
    }

    return (
        <div className={classnames(styles.tree, {
            [styles.treeIsNested]: isNested && showMore,
        })}>
            <div className={styles.key}>
                {isNested && (
                    <span onClick={onClick}>
                        {showMore ? <IconMinus className={styles.icon} /> : <IconPlus className={classnames(styles.icon, styles.iconShowMore)} />}
                    </span>
                )}
                <span>
                    <span className={styles.delimiter}>"</span>
                    {props.input.key}
                    <span className={styles.delimiter}>"</span>
                    <span className={styles.delimiter}>:</span>
                </span>
            </div>
            {showMore ? (
                <div className={styles.value}>
                    {isNested ? (
                        <Tree input={props.input.value} parentKey={lens} />
                    ) : (
                        <span onClick={onValueClick}>
                            <span className={styles.delimiter}>"</span>
                            {edit ? (
                                <Input
                                    value={inputValue}
                                    onChange={onChangeInput}
                                    handleOutsideClick={handleOutsideClick}
                                />
                            ) : (
                                <span>{String(props.input.value)}</span>
                            )}
                            <span className={styles.delimiter}>"</span>
                        </span>
                    )}
                </div>
            ) : (
                <div className={styles.value}>
                    ". . ."
                </div>
            )}
        </div>
    )
}

const Tree: React.FC<{
    parentKey?: string
    input: TreeStructure
}> = (props) => {
    return (
        Object.keys(props.input).map(key => {
            return (
                <KeyValue
                    key={key}
                    input={{ key, value: props.input[key] }}
                    parentKey={props.parentKey}
                />
            )
        })
    )
}

export default Tree
