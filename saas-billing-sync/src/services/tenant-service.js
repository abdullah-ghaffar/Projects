/**
 * Service: Tenant Isolation
 * Maqsad: Mix data mein se sirf ek company ka data nikaalna
 */

export const getTenantInvoices = (allInvoices, tenantId) => {
    // 1. Khali basket
    let isolatedInvoices = [];

    // 2. Loop (The Pointer)
    for (let i = 0; i < allInvoices.length; i++) {
        
        // 3. Current item ko check karein
        const currentInvoice = allInvoices[i];

        // 4. Match the Tenant ID
        if (currentInvoice.tenant_id === tenantId) {
            isolatedInvoices.push(currentInvoice);
        }
    }

    // 5. Result wapis bheinjein
    return isolatedInvoices;
};

