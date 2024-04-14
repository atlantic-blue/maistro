import { Stripe, loadStripe } from '@stripe/stripe-js';

import env from '../env';

let stripeInstance: Stripe

const getStripe = async () => {
    if (stripeInstance) {
        return stripeInstance
    }

    const stripe = await loadStripe(env.payments.stripe.publishableKey);
    if (stripe) {
        stripeInstance = stripe
    }
    return stripe
}

export { getStripe }
