const tesseract = require('tesseract.js');

exports.parse = async (filePath) => {
    try {
        const { data: { text, confidence } } = await tesseract.recognize(filePath, 'eng');
        
        console.log(`[ImageOCR] Extraction Confidence: ${confidence}%`);
        
        const amountMatches = text.match(/[₹$]?\s?\d+\.\d{2}/g);
        let amounts = amountMatches ? amountMatches.map(m => parseFloat(m.replace(/[₹$\s]/g, ''))) : [];
        const maxAmount = amounts.length > 0 ? Math.max(...amounts) : 0;
        
        const title = text.split('\n').find(l => l.trim().length > 4)?.substring(0, 40) || 'Scanned Receipt';

        return [{
            date: new Date().toISOString(),
            title: title.replace(/[^a-zA-Z0-9\s]/g, '').trim(),
            amount: maxAmount,
            type: 'expense',
            sourceType: 'image-ocr'
        }];
    } catch (err) {
        throw new Error(`Image OCR failed: ${err.message}`);
    }
};
