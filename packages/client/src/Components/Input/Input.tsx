import React from "react"

interface InputProps {
    value: string
    onChange: (value: string) => void
    handleOutsideClick: () => void
}

const Input: React.FC<InputProps> = (props) => {
    const ref = React.useRef<HTMLInputElement>(null)
    const [inputValue, setInputValue] = React.useState(String(props.value))

    React.useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            const clickInside = ref?.current?.contains(e.target as Node)
            if (!clickInside) {
                props.handleOutsideClick()
            }
        }

        document.addEventListener("mousedown", handleOutsideClick)
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick)
        }
    }, [inputValue])

    const onChangeInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        props.onChange(e.target.value)
        setInputValue(e.target.value)
    }

    return (
        <input type="text" value={inputValue} onChange={onChangeInput} ref={ref} />
    )
}

export default Input
