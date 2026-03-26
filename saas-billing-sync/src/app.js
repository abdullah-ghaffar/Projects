// 1. Importing our Machines
import { normalizeInvoices } from './services/stripe-service.js';
import { getTenantInvoices } from './services/tenant-service.js';

// 2. Dummy Raw Data from Stripe (Imagine this came from an API)
const stripeResponse = [
    { id: 'in_001', amount_paid: 5000, customer: 'cus_A', currency: 'usd', status: 'paid', tenant_id: 'netflix_01' },
    { id: 'in_002', amount_paid: 2000, customer: 'cus_B', currency: 'usd', status: 'paid', tenant_id: 'spotify_02' },
    { id: 'in_003', amount_paid: 15000, customer: 'cus_C', currency: 'usd', status: 'open', tenant_id: 'netflix_01' }
];

// --- THE EXECUTION PIPELINE ---

console.log("--- Starting Billing Sync ---");

// Step 1: Normalize (Cleaning the data)
const cleanData = normalizeInvoices(stripeResponse);
console.log("Step 1 Done: Data Normalized (Cents converted to Dollars)");

// Step 2: Tenant Isolation (Securing the data for Netflix)
const targetTenant = 'netflix_01';
const finalResult = getTenantInvoices(cleanData, targetTenant);

// 3. Final Output
console.log(`Step 2 Done: Found ${finalResult.length} invoices for ${targetTenant}`);
console.log("Final Data for Database:", finalResult);
