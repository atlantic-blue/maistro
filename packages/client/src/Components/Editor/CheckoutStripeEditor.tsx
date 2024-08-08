import * as uuid from "uuid"
import React from "react"
import { useParams } from "react-router-dom"
import { Badge, Box, Button, Card, Checkbox, DropdownMenu, Flex, Switch, Text, TextField } from "@radix-ui/themes"

import { ProjectsContext } from "../../Projects"
import { SectionCheckoutStripeProps } from "../../Templates/Section/SectionCheckout/SectionCheckoutStripe/SectionCheckoutStripe"
import EditorData, { EditorDataType } from "./EditorData"
import { PaymentsContext } from "../../Payments/PaymentsProvider"
import { fromSmallestUnit, toSmallestUnit } from "../../Utils/currency"
import env from "../../env"
import { MinusCircle, PlusCircle } from "lucide-react"
import { AvailableDay, AvailableDayInterval } from "../../Templates/Section/SectionCheckout/SectionCheckoutStripe/SectionCheckoutSlot/SectionCheckoutSlot"


interface AvailabilityIntervalsProps {
    from: string
    to: string
    onChange: (input: { to: string, from: string }) => void
}

const AvailabilityIntervals: React.FC<AvailabilityIntervalsProps> = (props) => {
    const [fromInterval, setFromInterval] = React.useState(props.from)
    const [toInterval, setToInterval] = React.useState(props.to)

    const onSetFromInterval = (i: string) => {
        setFromInterval(i)
        props.onChange({
            to: toInterval,
            from: i
        })
    }

    const onSetToInterval = (i: string) => {
        setToInterval(i)
        props.onChange({
            to: i,
            from: fromInterval
        })
    }

    return (
        <>
            <Flex direction="row" gap="1">
                <TextField.Root
                    type="time"
                    value={fromInterval}
                    onChange={e => {
                        onSetFromInterval(e.target.value)
                    }}
                />
                <Text>-</Text>
                <TextField.Root
                    type="time"
                    value={toInterval}
                    onChange={e => {
                        onSetToInterval(e.target.value)
                    }}
                />
            </Flex>
        </>
    )
}

interface AvailabilityDayProps {
    isChecked: boolean
    intervals: AvailableDay["intervals"]
    label: string
    onChange: (input: { from: string, to: string }[]) => void
    onCheckChange: (isChecked: boolean) => void
}

const AvailabilityDay: React.FC<AvailabilityDayProps> = (props) => {
    const [isChecked, setIsChecked] = React.useState(props.isChecked)
    const [intervals, setIntervals] = React.useState<{ from: string, to: string }[]>(props.intervals || [])

    const onIntervalsCreate = () => {
        setIntervals(prev => {
            let interval = {
                from: "00:00",
                to: "01:00"
            }
            if (prev.length - 1 >= 0) {
                interval = { ...prev[prev.length - 1] }
            }

            prev.push(interval)

            const next = prev
            props.onChange(next)

            return [
                ...next
            ]
        })
    }

    const onIntervalsUpdate = (input: { from: string, to: string }, current: { from: string, to: string }) => {
        setIntervals(prev => {
            const next = prev.map(pi => {
                if (pi === current) {
                    return input
                }

                return pi
            })

            props.onChange(next)
            return next
        })
    }

    const onIntervalsDelete = (input: { from: string, to: string }) => {
        setIntervals(prev => {
            const next = [
                ...prev.filter(p => p !== input)
            ]

            props.onChange(next)
            return next
        })
    }

    const onCheck = () => {
        setIsChecked(!isChecked)
        props.onCheckChange(!isChecked)
    }

    return (
        <>
            <Card>
                <Flex direction="column" gap="2">
                    <Text as="label" size="2">
                        <Flex gap="2">
                            <Checkbox
                                checked={isChecked}
                                onClick={onCheck}
                            />
                            {props.label}
                        </Flex>
                    </Text>

                    {isChecked ? (
                        <>
                            {
                                intervals.map((i, key) => {
                                    return (
                                        <>
                                            <Flex gap="2" justify="between" key={key}>
                                                <AvailabilityIntervals
                                                    key={i.from}
                                                    from={i.from}
                                                    to={i.to}
                                                    onChange={output => {
                                                        onIntervalsUpdate(output, i)
                                                    }}
                                                />

                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        onIntervalsDelete(i)
                                                    }}>
                                                    <MinusCircle style={{ width: "15px" }} />
                                                </Button>
                                            </Flex>
                                        </>
                                    )
                                })
                            }

                            <Button onClick={() => {
                                onIntervalsCreate()
                            }}>
                                <Flex gap="1">
                                    <Text>Add Times</Text>
                                    <PlusCircle />
                                </Flex>
                            </Button>
                        </>
                    ) : null}

                </Flex >
            </Card>
        </>
    )
}

interface AvailabilityProps {
    availability: AvailableDay[]
    onChange: (input: AvailableDay[]) => void
}

const Availability: React.FC<AvailabilityProps> = (props) => {
    const [availability, setAvailability] = React.useState<AvailableDay[]>(props.availability || [])

    const onDelete = (day: number) => {
        setAvailability(prev => {
            const next = prev.filter(a => a.day !== day)
            props.onChange(next)
            return next
        })
    }

    const onUpdate = (day: number, intervals: AvailableDayInterval[]) => {
        setAvailability(prev => {
            const next = prev.map((a) => {
                return a.day === day ? ({ day, intervals }) : a
            })

            props.onChange(next)
            return next
        })
    }

    const onCreate = (day: number, intervals: AvailableDayInterval[]) => {
        setAvailability(prev => {
            const next = [...prev, { day, intervals }]

            props.onChange(next)
            return next
        })
    }

    return (
        <Flex gap="2" direction="column">
            {
                Object.values(WeekDays).map((label, labelIndex) => {
                    const availabilityDay = availability?.find(a => a.day === labelIndex)
                    const isChecked = Boolean(availabilityDay)
                    return (
                        <AvailabilityDay
                            key={label}
                            isChecked={isChecked}
                            intervals={availabilityDay?.intervals || []}
                            label={label}
                            onCheckChange={check => {
                                if (!check) {
                                    onDelete(labelIndex)
                                }
                            }}
                            onChange={output => {
                                if (isChecked) {
                                    onUpdate(labelIndex, output)
                                } else {
                                    onCreate(labelIndex, output)
                                }
                            }}
                        />
                    )
                })
            }
        </Flex>
    )
}

enum WeekDays {
    SUNDAY = "Sunday",
    MONDAY = "Monday",
    TUESDAY = "Tuesday",
    WEDNESDAY = "Wednesday",
    THURSDAY = "Thursday",
    FRIDAY = "Friday",
    SATURDAY = "Saturday"
}

interface EditorProps {
    onSaveData: (props: SectionCheckoutStripeProps) => void
    onUploadFile: (file: File) => Promise<string>
    children: React.ReactNode
}

const SectionCheckoutStripeEditor: React.FC<SectionCheckoutStripeProps & EditorProps> = (props) => {
    const { projects } = React.useContext(ProjectsContext)
    const { projectId } = useParams()
    const { connectedAccount } = React.useContext(PaymentsContext)
    const project = projects.getProjectById(projectId || "")
    const [state, setState] = React.useState(props)

    const onSave = () => {
        props.onSaveData({
            accountId: state.accountId || connectedAccount?.id || "",
            projectId: projectId || "",
            checkoutUrl: env.api.payments.checkouts.create.stripe,

            returnUrl: state.returnUrl,
            // Shipping
            enableShipping: state.enableShipping || false,
            allowedCountries: state.allowedCountries || [],

            shippingOptions: state.shippingOptions || []
        })
    }

    return (
        <>
            <Flex gap="3" mt="4" justify="end" mb="2">
                <Button onClick={onSave}>Save</Button>
            </Flex>

            <Text as="div" size="1" weight="bold">
                Account ID
            </Text>

            <Badge
                color="green"
                mt="2"
                mb="2"
                size="2"
                onClick={() => {
                    setState(prev => {
                        return {
                            ...prev,
                            accountId: connectedAccount?.id || "",
                        }
                    })
                }}
            >
                {connectedAccount?.id}
            </Badge>



            <EditorData
                type={EditorDataType.TEXT}
                name=""
                value={state.accountId}
                onChange={data => {
                    setState(prev => {
                        return {
                            ...prev,
                            accountId: data,
                        }
                    })
                }}
            />

            <Text as="div" size="1" weight="bold">
                Return URL
            </Text>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    <Button variant="soft" size="2" mb="2">
                        <Badge>{state.returnUrl}</Badge>
                        <DropdownMenu.TriggerIcon />
                    </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    {project.getPagesMap().map(page => {
                        const url = `https://${project.getUrl()}/${page.getPath()}`
                        return (
                            <DropdownMenu.Item
                                key={page.getId()}
                                onClick={() => {
                                    setState(prev => {
                                        return {
                                            ...prev,
                                            returnUrl: url
                                        }
                                    })
                                }}
                            >
                                <Text>
                                    {url}
                                </Text>
                            </DropdownMenu.Item>
                        )
                    })}
                </DropdownMenu.Content>
            </DropdownMenu.Root>


            <Text as="div" size="1" weight="bold">Fulfilment</Text>
            <EditorData
                type={EditorDataType.TEXT}
                name="Country"
                value={state?.allowedCountries ? state?.allowedCountries[0] : ""}
                onChange={data => {
                    setState(prev => {
                        return {
                            ...prev,
                            allowedCountries: [
                                data
                            ],
                        }
                    })
                }}
            />

            <>
                <Flex gap="2" direction="column">
                    {
                        state?.shippingOptions?.map((option, index) => {
                            return (
                                <Card key={`${uuid.v1()}-${index}`}>
                                    <Flex direction="column">
                                        <EditorData
                                            type={EditorDataType.TEXT}
                                            name="Name"
                                            value={option.shipping_rate_data.display_name}
                                            onChange={data => {
                                                setState(prev => {
                                                    return {
                                                        ...prev,
                                                        shippingOptions: prev.shippingOptions?.map((option, i) => {
                                                            return i === index ? ({
                                                                ...option,
                                                                shipping_rate_data: {
                                                                    ...option.shipping_rate_data,
                                                                    type: "fixed_amount",
                                                                    display_name: data,
                                                                }
                                                            }) : option
                                                        })
                                                    }
                                                })
                                            }}
                                        />


                                        <Box mb="2">
                                            <Flex align="center" gap="2" justify="between" mb="2">
                                                <Text as="div" size="1" mb="1" weight="bold">
                                                    Price
                                                </Text>
                                            </Flex>
                                            <TextField.Root
                                                type="number"
                                                size="2"
                                                variant="surface"
                                                value={fromSmallestUnit(option.shipping_rate_data.fixed_amount.amount, project.getCurrency())}
                                                onChange={e => {
                                                    setState(prev => {
                                                        return {
                                                            ...prev,
                                                            shippingOptions: prev?.shippingOptions?.map((option, i) => {
                                                                return i === index ? ({
                                                                    ...option,
                                                                    shipping_rate_data: {
                                                                        ...option.shipping_rate_data,
                                                                        type: "fixed_amount",
                                                                        fixed_amount: {
                                                                            ...option.shipping_rate_data.fixed_amount,
                                                                            amount: toSmallestUnit(Number(e.target.value), project.getCurrency()),
                                                                            currency: project.getCurrency()
                                                                        }
                                                                    }
                                                                }) : option
                                                            })
                                                        }
                                                    })
                                                }}
                                            />
                                        </Box>

                                        <Box mb="2">
                                            <Flex align="center" gap="2" justify="between" mb="2">
                                                <Text as="div" size="1" mb="1" weight="bold">
                                                    Minimum Delivery Amount
                                                </Text>
                                            </Flex>
                                            <TextField.Root
                                                type="number"
                                                size="2"
                                                variant="surface"
                                                value={fromSmallestUnit(option.minimumDeliveryAmount, project.getCurrency())}
                                                onChange={e => {
                                                    setState(prev => {
                                                        return {
                                                            ...prev,
                                                            shippingOptions: prev?.shippingOptions?.map((option, i) => {
                                                                return i === index ? ({
                                                                    ...option,
                                                                    minimumDeliveryAmount: toSmallestUnit(Number(e.target.value), project.getCurrency()),
                                                                }) : option
                                                            })
                                                        }
                                                    })
                                                }}
                                            />
                                        </Box>

                                        <Box mb="2">
                                            <EditorData
                                                type={EditorDataType.IMAGE}
                                                name="Image"
                                                value={option.imgSrc}
                                                onChange={data => {
                                                    setState(prev => {
                                                        return {
                                                            ...prev,
                                                            shippingOptions: prev?.shippingOptions?.map((option, i) => {
                                                                return i === index ? ({
                                                                    ...option,
                                                                    imgSrc: data
                                                                }) : option
                                                            })
                                                        }
                                                    })
                                                }}
                                                onUploadFile={props.onUploadFile}
                                            />
                                        </Box>

                                        <Text as="div" size="1" weight="bold" mb="2">
                                            Availability
                                        </Text>
                                        <Availability
                                            availability={state.shippingOptions[index].availability}
                                            onChange={output => {
                                                setState(prev => {
                                                    return {
                                                        ...prev,
                                                        shippingOptions: prev.shippingOptions.map((s, i) => {
                                                            return index === i ? {
                                                                ...s,
                                                                availability: output,
                                                            } : s
                                                        })
                                                    }
                                                })
                                            }}
                                        />

                                        <Button
                                            size="1"
                                            onClick={() => {
                                                setState(prev => {
                                                    return {
                                                        ...prev,
                                                        shippingOptions: [
                                                            ...prev?.shippingOptions?.filter(o => o !== option),
                                                        ]
                                                    }
                                                })
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </Flex>
                                </Card>
                            )
                        })
                    }
                </Flex>
            </>

            {state?.shippingOptions?.length < 5 &&
                <Button
                    mt="2"
                    variant="outline"
                    onClick={() => {
                        setState(prev => {
                            return {
                                ...prev,
                                shippingOptions: [
                                    ...prev?.shippingOptions,
                                    {
                                        minimumDeliveryAmount: 0,
                                        availability: [],
                                        imgSrc: "",
                                        shipping_rate_data: {
                                            display_name: "Edit Me!",
                                            type: "fixed_amount",
                                            fixed_amount: {
                                                amount: toSmallestUnit(500, project.getCurrency()),
                                                currency: project.getCurrency()
                                            },
                                        }
                                    }
                                ]
                            }
                        })
                    }}>
                    Add Shipping Options
                </Button>
            }
        </>
    )
}

export default SectionCheckoutStripeEditor
