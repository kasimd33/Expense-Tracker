const Papa = require('papaparse');
const fs = require('fs');

exports.parse = async (filePath) => {
    try {
        const csvData = fs.readFileSync(filePath, 'utf8');
        const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });
        
        if (parsed.errors.length > 0) {
            console.warn("[CSV Parser] Warnings:", parsed.errors);
        }

        const rawTransactions = parsed.data.map((row, index) => {
            const keys = Object.keys(row);
            const dateKey = keys.find(k => k.toLowerCase().includes('date')) || keys[0];
            const descKey = keys.find(k => k.toLowerCase().includes('desc') || k.toLowerCase().includes('narration') || k.toLowerCase().includes('merchant') || k.toLowerCase().includes('particular')) || keys[1];
            const amtKey = keys.find(k => k.toLowerCase().includes('amount') || k.toLowerCase().includes('debit') || k.toLowerCase().includes('value') || k.toLowerCase().includes('withdrawal')) || keys[2];
            
            const amountStr = String(row[amtKey] || '0').replace(/[^0-9.-]+/g, "");
            const amount = parseFloat(amountStr) || 0;
            
            let parsedDate = new Date(row[dateKey]);
            if (isNaN(parsedDate.getTime())) parsedDate = new Date();

            return {
                date: parsedDate.toISOString(),
                title: row[descKey] || 'CSV Transaction',
                amount: Math.abs(amount),
                type: amount < 0 ? 'expense' : 'income',
                sourceType: 'csv'
            };
        });

        return rawTransactions;
    } catch (err) {
        throw new Error(`CSV Parsing failed: ${err.message}`);
    }
};
