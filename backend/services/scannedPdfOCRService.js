const fs = require('fs');
const imageOCRService = require('./imageOCRService');
const pdfPoppler = require('pdf-poppler');
const path = require('path');

exports.parse = async (filePath) => {
    try {
        console.log("[ScannedPDFService] Attempting to convert PDF to image...");
        const outputDir = path.dirname(filePath);
        const opts = {
            format: 'jpeg',
            out_dir: outputDir,
            out_prefix: path.basename(filePath, path.extname(filePath)),
            page: 1
        };
        
        await pdfPoppler.convert(filePath, opts);
        const imagePath = path.join(outputDir, `${opts.out_prefix}-1.jpg`);
        
        if (fs.existsSync(imagePath)) {
            console.log("[ScannedPDFService] Image conversion successful. Running OCR...");
            const result = await imageOCRService.parse(imagePath);
            fs.unlinkSync(imagePath); // cleanup
            return result.map(t => ({...t, sourceType: 'pdf-scanned'}));
        } else {
            throw new Error('Image conversion failed. No output file generated.');
        }
    } catch (popplerErr) {
        console.error("[ScannedPDFService] Error:", popplerErr.message);
        throw new Error('This PDF is a scanned image, but the server lacks the required utilities to extract it. Please upload as JPG/PNG instead.');
    }
};
