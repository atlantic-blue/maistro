import React from 'react';

import Button from '../Components/Gallery/Components/Button/Button';
import { PaymentsContext } from './PaymentsProvider';

interface PaymentsRedirectProps {

}

const PaymentsRedirect: React.FC<PaymentsRedirectProps> = (props) => {
    const { redirectToCheckout } = React.useContext(PaymentsContext)

    return (
        <Button onClick={redirectToCheckout}>
            Subscribe
        </Button>
    );
}

export default PaymentsRedirect

