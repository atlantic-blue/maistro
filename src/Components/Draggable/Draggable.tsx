import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import * as styles from "./Draggable.scss";
import IconDrag from '../Icons/Drag/Drag';

interface DraggableWidgetProps {
    id: string
    position: {
        x: number
        y: number
    }
    children: React.ReactNode
}

/**
 * DraggableWidget tracks its dragging state and position.
 * When the mouse is pressed down, 
 * it records the widget's position relative to the mouse 
 * to allow for smooth dragging.
 */
const DraggableWidget: React.FC<DraggableWidgetProps> = (props) => {
    const initialPosition = props.position || { x: 0, y: 0 }
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState(initialPosition);
    const [relPosition, setRelPosition] = useState(initialPosition);

    const createContainer = () => {
        const popoverRoot = document.createElement('div');
        popoverRoot.setAttribute('id', props.id);
        document.body.appendChild(popoverRoot);
        return popoverRoot
    }

    // Create the div to hold the popover content
    React.useEffect(() => {
        const popoverRoot = createContainer()

        return () => {
            document.body.removeChild(popoverRoot);
        };
    }, [props.id]);

    const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setRelPosition({
            x: e.pageX - position.x,
            y: e.pageY - position.y,
        });
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();

        if (!isDragging) {
            return;
        }
        setPosition({
            x: e.pageX - relPosition.x,
            y: e.pageY - relPosition.y,
        });

    };

    let container = document.getElementById(props.id)
    if (!container) {
        container = createContainer()
    }

    return ReactDOM.createPortal(
        <div
            className={styles.draggableWidget}
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
            onMouseDown={onMouseDown}
            onMouseMove={isDragging ? onMouseMove : void 0}
            onMouseUp={onMouseUp}
        >
            <div className={styles.container}>
                <div className={styles.header}>
                    <button className={styles.button}>
                        <IconDrag className={styles.buttonIcon} />
                    </button>
                </div>
                <div className={styles.body}>
                    {props.children}
                </div>
            </div>
        </div>,
        container
    );
};

export default DraggableWidget;