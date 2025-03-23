import { Order } from "./extractDataFromEvent"


const newOrderEmail = (order: Order) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Order Confirmation</title>
    <style>
        body {
            background-color: #f9f9f9;
            font-family: Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #dddddd;
        }
        .header img {
            width: 50px;
        }
        .header h1 {
            font-size: 24px;
            margin: 10px 0;
            color: #333333;
        }
        .section {
            margin-top: 20px;
        }
        .section h2 {
            font-size: 18px;
            margin-bottom: 10px;
            color: #333333;
        }
        .section p {
            font-size: 14px;
            line-height: 1.6;
            margin: 5px 0;
            color: #666666;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #FFC53D;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 10px;
            font-weight: bold;
        }
        .button-container {
            text-align: center;
            margin-top: 20px;
        }
        .divider {
            margin: 20px 0;
            border-top: 1px solid #dddddd;
        }
        .footer {
            font-size: 12px;
            color: #999999;
            text-align: center;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header Section -->
        <div class="header">
            <img src="https://maistro.website/assets/favicon.png" alt="Maistro Logo">
            <h1>New Order Confirmation</h1>
        </div>

        <!-- Order Details Section -->
        <div class="section">
            <h2>Order Details</h2>
            <p><strong>Maistro Order:</strong> <br>
                <a href="https://maistro.website/en/projects/${order.projectId}/orders/${order.orderId}" class="button">View Order Details</a>
            </p>
        </div>

        <!-- Payment Details Section -->
        <div class="section">
            <h2>Payment Information</h2>
            <p><strong>Stripe Payment:</strong> <br>
                <a href="https://dashboard.stripe.com/payments/${order.paymentIntent}" class="button">View Payment Details</a>
            </p>
            <p><strong>Order Receipt:</strong> <br>
                <a href="${order.returnUrl}" class="button">Customer Order Receipt</a>
            </p>
        </div>

        <!-- Divider -->
        <div class="divider"></div>

        <!-- Fulfilment Details Section -->
        <div class="section">
            <h2>Fulfilment Details</h2>
            <p><strong>Date:</strong> ${order.fulfilment.date}</p>
            <p><strong>Time:</strong> ${order.fulfilment.interval}</p>
        </div>

        <!-- Customer Details Section -->
        <div class="section">
            <h2>Customer Information</h2>
            <p><strong>Name:</strong> ${order.customerDetails.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${order.customerDetails.email}">${order.customerDetails.email}</a></p>
            <p><strong>Phone:</strong> ${order.customerDetails.phone}</p>
            
            <h3>Shipping Address</h3>
            <p><strong>Address:</strong> ${order.customerDetails.address.line1}</p>
            ${order.customerDetails.address.line2 ? `<p>${order.customerDetails.address.line2}</p>` : ''}
            <p>${order.customerDetails.address.city}, ${order.customerDetails.address.state}, ${order.customerDetails.address.postalCode}</p>
            <p>${order.customerDetails.address.country}</p>
        </div>

        <!-- Divider -->
        <div class="divider"></div>

        <!-- Footer Section -->
        <div class="footer">
            <p>If you have any questions, please contact our customer support team.</p>
            <p>Thank you for choosing Maistro!</p>
            <p>&copy; 2024 Maistro. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`
}

export default newOrderEmail