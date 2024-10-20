import Stripe from "stripe"

interface NewOrderEmailProps {
    orderId?: string
    projectId?: string
    paymentIntent?: string | Stripe.PaymentIntent | null
    returnUrl?: string
}

const newOrderEmail = ({
    orderId,
    projectId,
    paymentIntent,
    returnUrl,
}: NewOrderEmailProps) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Order Confirmation</title>
    <style>
        body { background-color: #f4f4f4; font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        h1 {margin: 0}
        h2 {margin: 0}
        .header { padding: 10px; text-align: center; }
        .content { padding: 10px; text-align: center; }
        .button { display: inline-block; padding: 10px 20px; background-color: #FFC53D; color: white; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <img src="https://maistro.website/assets/logo.svg" alt="Maistro Logo" class="logo" width="100">
        <h1>You have a new order!</h1>
    </div>
    <div class="content">
        <h2>Order Details</h2>
        <p><strong>Maistro Order:</strong><br>
        <a href="https://maistro.website/en/projects/${projectId}/orders/${orderId}" class="button">View Order Details</a></p>
        
        <p><strong>Stripe Payment:</strong><br>
        <a href="https://dashboard.stripe.com/payments/${paymentIntent}" class="button">View Payment Details</a></p>
        
        <p><strong>Order Receipt:</strong><br>
        <a href="${returnUrl}" class="button">Customer Order Receipt</a></p>
        
        <p>If you have any questions, please contact our customer support team.</p>
        <p>Thank you for choosing our service!</p>
        <p>The Maistro Team</p>
    </div>
</body>
</html>
`
}

export default newOrderEmail