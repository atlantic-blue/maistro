import { Button, Dialog, Flex } from "@radix-ui/themes";
import React, { useState } from "react"
import { DayPicker } from "react-day-picker";

interface SectionCheckoutDateProps {
    availableDays: number[]
    onChange: (date: Date) => void
}

const weekDays = [0, 1, 2, 3, 4, 5, 6]
const SectionCheckoutDate: React.FC<SectionCheckoutDateProps> = (props) => {
    const [open, setIsOpen] = React.useState(false)
    const [date, setDate] = useState<Date>();
    const disabledDays = weekDays.filter(d => !props?.availableDays?.includes(d))

    const onSelectDate = (date: Date | undefined) => {
        if (!date) {
            return
        }

        setDate(date)
        setIsOpen(false)
        props.onChange(date)
    }

    const onOpenDialog = () => {
        setIsOpen(true)
    }

    return (
        <Dialog.Root open={open}>
            <Dialog.Trigger>
                <Button variant="outline" onClick={onOpenDialog}>
                    {date ? date.toLocaleDateString() : "Select Date"}
                </Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="320px">
                <DayPicker
                    mode="single"
                    selected={date}
                    onSelect={onSelectDate}
                    disabled={[{ dayOfWeek: disabledDays }, { before: new Date() }]}
                    weekStartsOn={1}
                />
            </Dialog.Content>
        </Dialog.Root>
    )
}

interface SectionCheckoutProps {
    availableDays: AvailableDay[]
    onChange: (input: AvailableDayInterval) => void
}

const SectionCheckoutInterval: React.FC<SectionCheckoutProps> = (props) => {
    const [open, setIsOpen] = React.useState(false)
    const [dayInterval, setDayInterval] = useState<AvailableDayInterval | null>(null)

    const onSelectDayInterval = (dayInterval: AvailableDayInterval) => {
        setDayInterval(dayInterval)
        setIsOpen(false)
        props.onChange(dayInterval)
    }

    const onOpenDialog = () => {
        setIsOpen(true)
    }

    return (
        <Dialog.Root open={open}>
            <Dialog.Trigger>
                <Button variant="outline" onClick={onOpenDialog}>
                    {dayInterval ? `${dayInterval.from} - ${dayInterval.to}` : "Select Time"}
                </Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="320px">
                <Flex direction="column" gap="2" justify="center" align="center">
                    {
                        props.availableDays
                            .map(d => d.intervals)
                            .flat()
                            .map(i => {
                                return (
                                    <Button
                                        key={i.from}
                                        variant="outline"
                                        size="2"
                                        onClick={() => onSelectDayInterval(i)}
                                    >
                                        {`${i.from} - ${i.to}`}
                                    </Button>
                                )
                            })
                    }
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}

export interface AvailableDayInterval {
    from: string, // "HH:mm"
    to: string,
}

export interface AvailableDay {
    day: number // 0 to 6 Starts on Sunday
    intervals: AvailableDayInterval[]
}

interface SectionCheckoutSlotProps {
    availableDays: AvailableDay[]
    onDateChange: (date: Date) => void
    onDayIntervalChange: (interval: AvailableDayInterval) => void
}

const SectionCheckoutSlot: React.FC<SectionCheckoutSlotProps> = (props) => {
    const [date, setDate] = React.useState<Date | null>(null)

    const onChangeDate = (date: Date) => {
        setDate(date)
        props.onDateChange(date)
    }

    if (!props.availableDays || !props.availableDays.length) {
        return null
    }

    return (
        <>
            <Flex direction="column" gap="2">
                <SectionCheckoutDate
                    availableDays={props.availableDays.map(d => d.day)}
                    onChange={onChangeDate}
                />
                {
                    date ? (
                        <SectionCheckoutInterval
                            availableDays={props.availableDays.filter(d => d.day === date.getDay())}
                            onChange={props.onDayIntervalChange}
                        />
                    ) : null
                }
            </Flex>
        </>
    )
}

export default SectionCheckoutSlot