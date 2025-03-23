import Stripe from "stripe";

export const checkoutCompletedFixture: Stripe.CheckoutSessionCompletedEvent = {
    "id": "evt_1QBqPNQjzqJXb0YWM7DJ5pb3",
    "object": "event",
    "account": "acct_1PaE4OQjzqJXb0YW",
    "api_version": "2023-10-16",
    "created": 1729397185,
    "data": {
        "object": {
            "id": "cs_live_a1xDb1yE5Jbq6MOtYjEMsNDCPc1MjJCjq5rpF4dQDftEZsPyZ7LwsOYg7A",
            "object": "checkout.session",
            "after_expiration": null,
            "allow_promotion_codes": null,
            "amount_subtotal": 1300,
            "amount_total": 1300,
            "automatic_tax": {
                "enabled": false,
                "liability": null,
                "status": null
            },
            "billing_address_collection": null,
            "cancel_url": null,
            "client_reference_id": null,
            "client_secret": null,
            "consent": null,
            "consent_collection": null,
            "created": 1729396956,
            "currency": "aud",
            "currency_conversion": null,
            "custom_fields": [
            ],
            "custom_text": {
                "after_submit": null,
                "shipping_address": null,
                "submit": null,
                "terms_of_service_acceptance": null
            },
            "customer": null,
            "customer_creation": "if_required",
            "customer_details": {
                "address": {
                    "city": "Mock city",
                    "country": "AU",
                    "line1": "160 Mock Street",
                    "line2": null,
                    "postal_code": "5000",
                    "state": "SA"
                },
                "email": "mockEmail@gmail.com",
                "name": "Mock User Name",
                "phone": "+0000000000",
                "tax_exempt": "none",
                "tax_ids": [
                ]
            },
            "customer_email": null,
            "expires_at": 1729483356,
            "invoice": null,
            "invoice_creation": {
                "enabled": false,
                "invoice_data": {
                    "account_tax_ids": null,
                    "custom_fields": null,
                    "description": null,
                    "footer": null,
                    "issuer": null,
                    "metadata": {
                    },
                    "rendering_options": null
                }
            },
            "livemode": true,
            "locale": null,
            "metadata": {
                "account_id": "acct_1PaE4OQjzqJXb0YW",
                "order_id": "bce3495b-3e74-4560-8a27-5f9ea57f18f9",
                "shopping_cart_id": "f7b04339-bd5b-4c62-97df-ff5f20cc54fe",
                "project_id": "1f8418a9-527f-4856-b231-e523f6468025"
            },
            "mode": "payment",
            "payment_intent": "pi_3QBqPIQjzqJXb0YW0GvpAV9Z",
            "payment_link": null,
            "payment_method_collection": "if_required",
            "payment_method_configuration_details": {
                "id": "pmc_1PaE4wQjzqJXb0YWlVKMPfdp",
                "parent": "pmc_1PGseIHdug2e0offR2y0k4Ry"
            },
            "payment_method_options": {
            },
            "payment_method_types": [
                "card",
                "link"
            ],
            "payment_status": "paid",
            "phone_number_collection": {
                "enabled": true
            },
            "recovered_from": null,
            "redirect_on_completion": "always",
            "return_url": "https://sweetsin.maistro.live/order?orderId=bce3495b-3e74-4560-8a27-5f9ea57f18f9",
            "saved_payment_method_options": null,
            "setup_intent": null,
            "shipping_address_collection": {
                "allowed_countries": [
                    "AU"
                ]
            },
            "shipping_cost": {
                "amount_subtotal": 0,
                "amount_tax": 0,
                "amount_total": 0,
                "shipping_rate": "shr_1QBqLgQjzqJXb0YWxOdcIGNT"
            },
            "shipping_details": {
                "address": {
                    "city": "Mock city",
                    "country": "AU",
                    "line1": "160 Mock Street",
                    "line2": null,
                    "postal_code": "5000",
                    "state": "SA"
                },
                "name": "Mock User Name"
            },
            "shipping_options": [
                {
                    "shipping_amount": 0,
                    "shipping_rate": "shr_1QBqLgQjzqJXb0YWxOdcIGNT"
                },
                {
                    "shipping_amount": 800,
                    "shipping_rate": "shr_1QBqLgQjzqJXb0YWYLS6a8Dq"
                }
            ],
            "status": "complete",
            "submit_type": null,
            "subscription": null,
            "success_url": null,
            "total_details": {
                "amount_discount": 0,
                "amount_shipping": 0,
                "amount_tax": 0
            },
            "ui_mode": "embedded",
            "url": null
        }
    },
    "livemode": true,
    "pending_webhooks": 1,
    "request": {
        "id": null,
        "idempotency_key": null
    },
    "type": "checkout.session.completed"
}