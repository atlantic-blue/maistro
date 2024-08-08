const fixture = {
    "id": "evt_1PjLJfQWfdmP9UpQnhFH3EO4",
    "object": "event",
    "account": "acct_1PHkJ4QWfdmP9UpQ",
    "api_version": "2023-10-16",
    "created": 1722604483,
    "data": {
        "object": {
            "id": "cs_live_a1dhVJKbtzjoNb3wFggOFc5cAqr5x7WcFcI5h7XKrSHcXbC213c17HYqNq",
            "object": "checkout.session",
            "after_expiration": null,
            "allow_promotion_codes": null,
            "amount_subtotal": 100,
            "amount_total": 100,
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
            "created": 1722604378,
            "currency": "gbp",
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
                    "city": "London",
                    "country": "GB",
                    "line1": "Orsett Terrace",
                    "line2": null,
                    "postal_code": "W2 6JU",
                    "state": null
                },
                "email": "iamjulioplaya@gmail.com",
                "name": "Julian Tellez",
                "phone": null,
                "tax_exempt": "none",
                "tax_ids": [
                ]
            },
            "customer_email": null,
            "expires_at": 1722690778,
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
                "account_id": "acct_1PHkJ4QWfdmP9UpQ",
                "order_id": "1d9e13ea-4162-4b17-a304-d04f7ca7a10b",
                "shopping_cart_id": "edde7543-e251-45b1-ab49-3faf3cf681aa",
                "project_id": "667d06ce-a707-4514-b85d-4fa14e27d901"
            },
            "mode": "payment",
            "payment_intent": "pi_3PjLJaQWfdmP9UpQ2v9PDWWk",
            "payment_link": null,
            "payment_method_collection": "if_required",
            "payment_method_configuration_details": {
                "id": "pmc_1PHkJ9QWfdmP9UpQhDPQSJyB",
                "parent": "pmc_1PGseIHdug2e0offR2y0k4Ry"
            },
            "payment_method_options": {
                "card": {
                    "request_three_d_secure": "automatic"
                }
            },
            "payment_method_types": [
                "card",
                "link"
            ],
            "payment_status": "paid",
            "phone_number_collection": {
                "enabled": false
            },
            "recovered_from": null,
            "redirect_on_completion": "always",
            "return_url": "https://polloasado.maistro.live/index",
            "saved_payment_method_options": null,
            "setup_intent": null,
            "shipping_address_collection": {
                "allowed_countries": [
                    "GB"
                ]
            },
            "shipping_cost": {
                "amount_subtotal": 0,
                "amount_tax": 0,
                "amount_total": 0,
                "shipping_rate": "shr_1PjLHyQWfdmP9UpQPNjqrC6t"
            },
            "shipping_details": {
                "address": {
                    "city": "London",
                    "country": "GB",
                    "line1": "Orsett Terrace",
                    "line2": null,
                    "postal_code": "W2 6JU",
                    "state": null
                },
                "name": "Julian Tellez"
            },
            "shipping_options": [
                {
                    "shipping_amount": 0,
                    "shipping_rate": "shr_1PjLHyQWfdmP9UpQPNjqrC6t"
                },
                {
                    "shipping_amount": 500,
                    "shipping_rate": "shr_1PjLHyQWfdmP9UpQ9c9tB261"
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

describe("Extract Data from event", () => {
    it("should support checkout.session.completed", () => {
        const value = extractDataFromEvent(fixture)
        const expected = {
            "amount_subtotal": 100,
            "amount_total": 100,
        }

        expect(value).toEqual(expected)
    })
})