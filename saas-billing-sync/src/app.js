import { normalizeInvoices } from './services/stripe-service.js';
import { reconcileInvoices } from './services/reconciliation-service.js';
import { saveInvoices, loadInvoices } from './services/storage-service.js';

// Dummy Stripe Data (Imagine this is from an API)
const stripeAPIInvoices = [
    { id: 'in_001', amount_paid: 5000, customer: 'cus_A', currency: 'usd', status: 'paid', tenant_id: 'netflix_01' },
    { id: 'in_002', amount_paid: 2000, customer: 'cus_B', currency: 'usd', status: 'paid', tenant_id: 'spotify_02' },
    { id: 'in_003', amount_paid: 15000, customer: 'cus_C', currency: 'usd', status: 'open', tenant_id: 'netflix_01' },
    { id: 'in_004', amount_paid: 3000, customer: 'cus_D', currency: 'usd', status: 'paid', tenant_id: 'netflix_01' },
    { id: 'in_005', amount_paid: 9000, customer: 'cus_E', currency: 'usd', status: 'paid', tenant_id: 'spotify_02' }
];

async function startSync() {
    console.log("Starting SaaS Billing Sync...");

    // 1. Load what we already have
    const localData = await loadInvoices();
    
    // 2. Find only the new stuff
    const { newItems } = reconcileInvoices(stripeAPIInvoices, localData);

    if (newItems.length > 0) {
        // 3. Clean & Save
        const cleanData = normalizeInvoices(newItems);
        await saveInvoices(cleanData);
        console.log(`✅ Success: ${newItems.length} new invoices synced.`);
    } else {
        console.log("No new invoices found. Everything is up to date.");
    }
}

startSync().catch(console.error);