import * as Toast from '@radix-ui/react-toast';
import { Button, Flex, Text } from '@radix-ui/themes';
import React from 'react';
import { RequestController, RequestEvent, RequestEventType } from '../../Api/fetch';
import { filter } from 'rxjs';
import { TriangleAlert, X } from 'lucide-react';

import * as styles from "./ErrorToast.scss"

interface ErrorToastProps {
    requestController: RequestController
}

const ErrorToast: React.FC<ErrorToastProps> = (props) => {
    const [open, setOpen] = React.useState(false);
    const timerRef = React.useRef(0);

    const handleError = (event: RequestEvent) => {
        setOpen(false);
        window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
            setOpen(true);
        }, 100);
    }

    React.useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);

    React.useEffect(() => {
        const subscription = props.requestController.event$.pipe(
            filter(event => {
                return event.type === RequestEventType.REQUEST_ERROR
            })
        ).subscribe(handleError)

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return (
        <Toast.Provider swipeDirection="down" duration={2000}>
            <Toast.Root className={styles.toastRoot} open={open} onOpenChange={setOpen}>
                <Toast.Action className={styles.toastAction} asChild altText="Close">
                    <Button size="1" variant="outline" onClick={() => setOpen(false)}>
                        <X style={{ width: "15px" }} />
                    </Button>
                </Toast.Action>
                <Toast.Title className={styles.toastTitle}>
                    <Flex gap="1" align="center" justify="start">
                        <TriangleAlert style={{ width: "15px" }} />
                        <Text weight="bold">Error</Text>
                    </Flex>
                </Toast.Title>
                <Toast.Description>
                    This action didn't go as planned!
                    Please try again.
                </Toast.Description>
            </Toast.Root>
            <Toast.Viewport className={styles.toastViewport} />
        </Toast.Provider>
    )
}


export default ErrorToast
