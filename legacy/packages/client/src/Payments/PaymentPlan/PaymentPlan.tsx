import { Badge, Card } from "@radix-ui/themes"
import React from "react"

import * as styles from "./PaymentPlan.scss"
import { PaymentPlan, PaymentsContext } from "../PaymentsProvider"

const PaymentPlanBadge: React.FC = () => {
    const { paymentPlan } = React.useContext(PaymentsContext)
    const plan = {
        [PaymentPlan.FREE]: { color: "lime", text: "Free" },
        [PaymentPlan.BASIC]: { color: "sky", text: "Basic" },
        [PaymentPlan.STANDARD]: { color: "orange", text: "Standard" },
        [PaymentPlan.PREMIUM]: { color: "bronze", text: "Premium" },
        [PaymentPlan.VIP]: { color: "gold", text: "VIP" },
        [PaymentPlan.ADMIN]: { color: "gold", text: "ADMIN" },
    }[paymentPlan]

    return (
        <Card size='1' className={styles.card}>
            <Badge color={plan?.color || "teal"} size="1" >{plan?.text}</Badge>
        </Card>
    )
}

export default PaymentPlanBadge
