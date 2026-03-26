export const normalizeInvoices = (stripeRawInvoices) => {
    let cleanInvoices = [];

    for (let i = 0; i < stripeRawInvoices.length; i++) {
        const raw = stripeRawInvoices[i];

        const cleanFormat = {
            stripe_id: raw.id,
            customer_id: raw.customer,
            // $5000 / 100 = 50$
            amount: raw.amount_paid / 100, 
            currency: raw.currency.toUpperCase(),
            status: raw.status,
            tenant_id: raw.tenant_id // YE LINE ZAROORI HAI!
        };

        cleanInvoices.push(cleanFormat);
    }

    return cleanInvoices;
};