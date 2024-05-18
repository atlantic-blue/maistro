import { Card, Flex, Heading, Section } from "@radix-ui/themes";
import React from "react";
import RouteProjectHeader from "../RouteProject/Components/Header/Header";
import { ProjectsContext } from "../../Projects";

const RoutePaymentsAccountsLinkSuccess = () => {
    const { user } = React.useContext(ProjectsContext)

    return (
        <div className="container">
            <RouteProjectHeader user={user} />

            <Section className="content">
                <Heading size="4" as="h1" align="center">
                    Payments Account
                </Heading>

                <Card m="6">
                    <Flex align="center" justify="center" gap="4">
                        That's everything for now!
                    </Flex>
                </Card>
            </Section>
        </div>
    );
}

export default RoutePaymentsAccountsLinkSuccess
