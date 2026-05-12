const xlsx = require('xlsx');

exports.parse = async (filePath) => {
    try {
        const workbook = xlsx.readFile(filePath);
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
            throw new Error("No sheets found in Excel file");
        }
        
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = xlsx.utils.sheet_to_json(sheet);

        const rawTransactions = parsedData.map((row, index) => {
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
                title: row[descKey] || 'Excel Transaction',
                amount: Math.abs(amount),
                type: amount < 0 ? 'expense' : 'income',
                sourceType: 'excel'
            };
        });

        return rawTransactions;
    } catch (err) {
        throw new Error(`Excel Parsing failed: ${err.message}`);
    }
};
