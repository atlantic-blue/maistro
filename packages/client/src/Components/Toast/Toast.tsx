import * as React from 'react';
import * as Toast from '@radix-ui/react-toast';
import './styles.css';
import { Button } from '@radix-ui/themes';

const ToastDemo = () => {
    const [open, setOpen] = React.useState(false);
    const eventDateRef = React.useRef(new Date());
    const timerRef = React.useRef(0);

    React.useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);

    return (
        <Toast.Provider swipeDirection="right">
            <button
                className="Button large violet"
                onClick={() => {
                    setOpen(false);
                    window.clearTimeout(timerRef.current);
                    timerRef.current = window.setTimeout(() => {
                        eventDateRef.current = oneWeekAway();
                        setOpen(true);
                    }, 100);
                }}
            >
                Add to calendar
            </button>

            <Toast.Root className="ToastRoot" open={open} onOpenChange={setOpen}>
                <Toast.Title className="ToastTitle">Scheduled: Catch up</Toast.Title>
                <Toast.Description asChild>
                    <time className="ToastDescription" dateTime={eventDateRef.current.toISOString()}>
                        {prettyDate(eventDateRef.current)}
                    </time>
                </Toast.Description>
                <Toast.Action className="ToastAction" asChild altText="Goto schedule to undo">
                    <Button variant="ghost">Undo</Button>
                </Toast.Action>
            </Toast.Root>
            <Toast.Viewport className="ToastViewport" />
        </Toast.Provider>
    );
};


export default ToastDemo;