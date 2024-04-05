import React from "react"
import { iframe$ } from "../Iframe/Iframe"
import FrameLaptop from "../Frames/FrameLaptop/FrameLaptop"
import { PageContext } from "../../PageContext"

import Thumbnail from "../Thumbnail/Thumbnail"
import IconClose from "../Icons/Close/Close"
import IconMagnifyingGlass from "../Icons/MagnifyingGlass/MagnifyingGlass"

import * as styles from "./Preview.scss"
import DragAndDrop from "../DragDrop/DragDrop"

const Preview: React.FC = () => {
    const { items } = React.useContext(PageContext)
    const [toggle, setToggle] = React.useState<boolean>(false)

    React.useLayoutEffect(() => {
        if (!items) {
            return
        }

        const content = items.map(item => item.Component)
        iframe$.next({ type: "content", content: content })
    }, [items, toggle])

    const onClick = () => {
        setToggle(prev => !prev)
    }

    const Icon = toggle ? IconClose : IconMagnifyingGlass

    return (
        <div className={styles.preview}>
            <div className={styles.head}>
                <button onClick={onClick} className={styles.headButton}>
                    <Icon className={styles.headButtonIcon} />
                </button>
            </div>
            <div className=''>
                {toggle && (
                    <Thumbnail>
                        <FrameLaptop>
                            <DragAndDrop />
                        </FrameLaptop>
                    </Thumbnail>
                )}
            </div>
        </div>
    )
}

export default Preview
