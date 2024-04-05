import React from 'react';

interface UseClickOutsideInput {
    onClickOutside: () => void
    ref: React.RefObject<HTMLDivElement>
}

const useClickOutside = (input: UseClickOutsideInput) => {
    React.useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            const clickInside = input.ref?.current?.contains(e.target as Node)
            if (!clickInside) {
                input.onClickOutside()
            }
        }

        document.addEventListener("mousedown", handleOutsideClick)
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick)
        }
    }, [])
}

export default useClickOutside