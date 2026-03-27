/**
 * Service: Reconciliation
 * Maqsad: Missing data ko dhoond kar sync karna
 */

export const reconcileInvoices = (stripeInvoices, localInvoices) => {
    let syncedCount = 0;
    let newItems = [];

    for (let i = 0; i < stripeInvoices.length; i++) {
        const stripeInv = stripeInvoices[i];
        
        // Check if this ID already exists in our local list
        let alreadyExists = false;
        for (let j = 0; j < localInvoices.length; j++) {
            if (localInvoices[j].stripe_id === stripeInv.id) {
                alreadyExists = true;
                break; // Mil gayi, toh mazeed dhoondne ki zaroorat nahi
            }
        }

        // Agar nahi mili, toh ye 'Missing' hai!
        if (!alreadyExists) {
            newItems.push(stripeInv);
            syncedCount++;
        }
    }

    return { syncedCount, newItems };
};