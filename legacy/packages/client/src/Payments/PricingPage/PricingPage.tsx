import * as React from 'react';

import env from '../../env';
import { Section } from '@radix-ui/themes';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
}

const PricingPage: React.FC = () => {
    return (
        <Section p="5" style={{ backgroundColor: "#FAFAFA" }}>
            <stripe-pricing-table pricing-table-id={env.payments.stripe.pricingTableId}
                publishable-key={env.payments.stripe.publishableKey}>
            </stripe-pricing-table>
        </Section>
    );
}

export default PricingPage;
