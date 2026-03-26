import { normalizeInvoices } from '../services/stripe-service.js';

export const handleStripeEvent = (event) => {
    console.log(`🔔 Event Received: ${event.type}`);

    // Switch case is like a multiple choice 'if'
    switch (event.type) {
        case 'invoice.paid':
            const rawInvoice = event.data.object;
            // Hamara purana logic yahan reuse ho raha hai!
            const clean = normalizeInvoices([rawInvoice]); 
            console.log("✅ Success: Payment processed for", clean[0].customer_id);
            break;

        case 'customer.subscription.deleted':
            console.log("⚠️ Warning: Customer cancelled subscription.");
            break;

        default:
            console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }
};