import fs from 'fs/promises';
import path from 'path';

// File ka rasta (Path) set karna
const filePath = path.resolve('data/invoices.json');

/**
 * 1. Load Invoices: Purana data disk se parhna
 */
export const loadInvoices = async () => {
    try {
        // Pehle check karo ke kya file maujood hai?
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        // Agar file nahi milti (pehli baar), toh khali list [] bhej do
        return [];
    }
};

/**
 * 2. Save Invoices: Naya data disk par likhna
 */
export const saveInvoices = async (newInvoices) => {
    try {
        // Pehle purana data load karo
        const existingData = await loadInvoices();

        // Puranay data mein naya data shamil karo (Merge)
        const updatedData = [...existingData, ...newInvoices];

        // Ensure karo ke 'data' folder maujood hai
        const folderPath = path.dirname(filePath);
        await fs.mkdir(folderPath, { recursive: true });

        // Final list ko JSON file mein save karo
        // JSON.stringify(data, null, 2) is liye taake file parhnay mein asan ho
        await fs.writeFile(filePath, JSON.stringify(updatedData, null, 2));
        
        console.log(`💾 Disk Update: ${newInvoices.length} nayi invoices save ho gayin.`);
    } catch (err) {
        console.error("❌ File save karne mein masla aya:", err);
    }
};