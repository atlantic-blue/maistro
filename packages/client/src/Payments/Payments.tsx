import React from 'react';

import { getStripe } from './stripe';

import { User } from '../Store/User';
import env from '../env';
import Button from '../Components/Gallery/Components/Button/Button';

interface PaymentsRedirectProps {
    user: User
}

const PaymentsRedirect: React.FC<PaymentsRedirectProps> = ({ user }) => {
    if (!user.getEmail()) {
        // TODO APP LEVEL ERROR
        console.warn("USER NOT SET, CANNOT SET SUBSCRIPTION WITHOUT AN USER")
        return null
    }

    const handleCheckout = async () => {
        const stripe = await getStripe();
        if (!stripe) {
            // TODO APP LEVEL ERROR
            console.warn("STRIPE NOT SET INITIALISED")
            return
        }

        const { error } = await stripe.redirectToCheckout({
            mode: 'subscription',
            lineItems: [
                {
                    price: env.payments.stripe.subscriptionPriceId,
                    quantity: 1,
                },
            ],
            successUrl: env.payments.successUrl,
            cancelUrl: env.payments.cancelUrl,
            customerEmail: user.getEmail(),
            clientReferenceId: user.getId(),
        });

        // TODO APP LEVEL ERROR
        console.warn(error.message);
    }

    return (
        <Button onClick={handleCheckout}>
            Subscribe
        </Button>
    );
}

export default PaymentsRedirect
