import * as React from 'react';

import env from '../../env';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
}

const PricingPage: React.FC = () => {
    return (
        <stripe-pricing-table pricing-table-id={env.payments.stripe.pricingTableId}
            publishable-key={env.payments.stripe.publishableKey}>
        </stripe-pricing-table>
    );
}

export default PricingPage;
