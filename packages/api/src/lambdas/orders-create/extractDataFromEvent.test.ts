const fixture = {
    "object": {
        "id": "cs_live_a1cItzUcTMclthcCYT7spBGrgRduJnnFGoKAUZoRUx87XH5BDjsJxhlO1J",
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
        "created": 1720573665,
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
                "city": null,
                "country": "GB",
                "line1": null,
                "line2": null,
                "postal_code": "SW10 0LB",
                "state": null
            },
            "email": "juliantellezmendez@gmail.com",
            "name": "julian tellez mendez",
            "phone": null,
            "tax_exempt": "none",
            "tax_ids": [
            ]
        },
        "customer_email": null,
        "expires_at": 1720660065,
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
            "project_id": "1f8418a9-527f-4856-b231-e523f6468025"
        },
        "mode": "payment",
        "payment_intent": "pi_3Pap5LQWfdmP9UpQ2Z4w1qg3",
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
        "return_url": "https://sweetsin.maistro.live/index",
        "saved_payment_method_options": null,
        "setup_intent": null,
        "shipping_address_collection": null,
        "shipping_cost": null,
        "shipping_details": null,
        "shipping_options": [
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