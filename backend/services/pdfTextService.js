const fs = require('fs');
const pdfParse = require('pdf-parse');
const scannedPdfOCRService = require('./scannedPdfOCRService');

exports.parse = async (filePath) => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        
        const text = data.text;
        
        if (!text || text.trim().length < 50) {
            console.log("[PDFService] PDF appears to be a scanned image. Triggering scanned PDF fallback...");
            return await scannedPdfOCRService.parse(filePath);
        }

        console.log(`[PDFService] Extracted ${text.length} characters of text. Pages: ${data.numpages}`);

        const lines = text.split('\n');
        let transactions = [];
        
        for (let line of lines) {
            const amountMatches = line.match(/[₹$]?\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})/g);
            if (amountMatches && line.trim().length > 10) {
                let amounts = amountMatches.map(m => parseFloat(m.replace(/[₹$,\s]/g, '')));
                const maxAmount = amounts.length > 0 ? Math.max(...amounts) : 0;
                if (maxAmount > 0) {
                    transactions.push({
                        date: new Date().toISOString(),
                        title: line.replace(/[₹$]?\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})/g, '').substring(0, 50).trim() || 'PDF Transaction',
                        amount: maxAmount,
                        type: 'expense',
                        sourceType: 'pdf-text'
                    });
                }
            }
        }

        if (transactions.length === 0) {
            const allAmountMatches = text.match(/[₹$]?\s?\d+\.\d{2}/g);
            let amounts = allAmountMatches ? allAmountMatches.map(m => parseFloat(m.replace(/[₹$\s]/g, ''))) : [];
            const maxAmount = amounts.length > 0 ? Math.max(...amounts) : 0;
            
            const title = lines.find(l => l.trim().length > 4)?.substring(0, 40) || 'PDF Document';

            transactions.push({
                date: new Date().toISOString(),
                title: title.replace(/[^a-zA-Z0-9\s]/g, '').trim(),
                amount: maxAmount,
                type: 'expense',
                sourceType: 'pdf-text'
            });
        }

        return transactions;
    } catch (err) {
        throw new Error(`PDF Parsing failed: ${err.message}`);
    }
};
