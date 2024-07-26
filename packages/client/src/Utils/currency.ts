/**
 * inspired from https://docs.stripe.com/currencies#zero-decimal
 */
export enum Currency {
    USD = "USD",
    AUD = "AUD",
    GBP = "GBP",
    COP = "COP",
}

export enum CurrencySymbol {
    USD = "$",
    AUD = "$",
    GPB = "£",
    COP = "$",
}

const zeroDecimalCurrencies: Currency[] = [
    Currency.COP
]

const toSmallestUnit = (amount: number, currency: Currency): number => {
    if (zeroDecimalCurrencies.includes(currency)) {
        return amount
    } else {
        return Math.round(amount * 100)
    }
}

const fromSmallestUnit = (amount: number, currency: Currency): string => {
    if (zeroDecimalCurrencies.includes(currency)) {
        return amount.toFixed(2)
    } else {
        return (amount / 100).toFixed(2)
    }
}

export {
    toSmallestUnit,
    fromSmallestUnit
}