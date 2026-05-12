const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const auth = require('../middleware/auth');

const imageOCRService = require('../services/imageOCRService');
const pdfTextService = require('../services/pdfTextService');
const csvParserService = require('../services/csvParserService');
const excelParserService = require('../services/excelParserService');
const { normalize } = require('../services/transactionNormalizer');
const { categorize } = require('../services/aiCategorizer');

const upload = multer({ dest: 'uploads/' });

// @route   POST api/ocr/scan
// @desc    Process various financial documents using isolated parser services
// @access  Private
router.post('/scan', auth, upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const { mimetype, path: filePath, size, originalname } = req.file;
    const nameLower = originalname.toLowerCase();
    
    console.log(`\n[OCR Engine] Request initiated by user ${req.user.id}`);
    console.log(`[OCR Engine] Processing file: ${originalname} (${(size/1024/1024).toFixed(2)} MB) - MIME: ${mimetype}`);

    let rawTransactions = [];
    let parserUsed = 'none';

    try {
        // STEP 2 & 3: Detect Type & Route
        if (mimetype.includes('image')) {
            parserUsed = 'image-ocr';
            rawTransactions = await imageOCRService.parse(filePath);
        } 
        else if (mimetype.includes('pdf')) {
            parserUsed = 'pdf-parser';
            rawTransactions = await pdfTextService.parse(filePath);
        } 
        else if (mimetype.includes('csv') || mimetype.includes('text/csv') || nameLower.endsWith('.csv')) {
            parserUsed = 'csv-parser';
            rawTransactions = await csvParserService.parse(filePath);
        } 
        else if (mimetype.includes('excel') || mimetype.includes('spreadsheetml') || nameLower.endsWith('.xlsx') || nameLower.endsWith('.xls')) {
            parserUsed = 'excel-parser';
            rawTransactions = await excelParserService.parse(filePath);
        } 
        else {
            throw new Error(`Unsupported file type: ${mimetype}. Please upload JPG, PNG, PDF, CSV, or XLSX.`);
        }

        // STEP 4 & 5: Normalize and Categorize
        let finalTransactions = normalize(rawTransactions);
        finalTransactions = categorize(finalTransactions);

        // CLEANUP
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        console.log(`[OCR Success] Parsed ${finalTransactions.length} transactions using ${parserUsed}.\n`);

        res.json({
            success: true,
            parser: parserUsed,
            summary: {
                title: `${parserUsed.toUpperCase()} Import`,
                count: finalTransactions.length,
                message: `Successfully extracted ${finalTransactions.length} transactions.`
            },
            transactions: finalTransactions
        });

    } catch (err) {
        console.error(`[OCR Error] Parser: ${parserUsed} | File: ${originalname} | Error:`, err.message, '\n');
        
        // CLEANUP
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        res.status(500).json({
            success: false,
            parser: parserUsed,
            error: err.message || 'An unexpected error occurred during document processing.'
        });
    }
});

module.exports = router;
