import { Heading, Section } from "@radix-ui/themes";
import React from "react";
import RouteProjectHeader from "../../RouteProject/Components/Header/Header";
import { ProjectsContext } from "../../../Projects";
import PricingPage from "../../../Payments/PricingPage/PricingPage";

import * as styles from "./RoutePaymentsPricing.scss"

const RoutePaymentsPricing = () => {
    const { user } = React.useContext(ProjectsContext)

    return (
        <div className={styles.main}>
            <RouteProjectHeader user={user} />

            <Section p="4">
                <PricingPage />
            </Section>
        </div>
    );
}

export default RoutePaymentsPricing
