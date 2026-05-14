const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const imageOCRService = require('./imageOCRService');

exports.parse = async (filePath) => {
    let imagePath = null;
    try {
        console.log("[ScannedPDFService] Rendering PDF page to image via pdfjs-dist...");
        const data = new Uint8Array(fs.readFileSync(filePath));
        const pdfDoc = await pdfjsLib.getDocument({ data }).promise;
        const page = await pdfDoc.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 });

        const canvas = createCanvas(viewport.width, viewport.height);
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;

        imagePath = path.join(path.dirname(filePath), `${path.basename(filePath, path.extname(filePath))}-1.png`);
        fs.writeFileSync(imagePath, canvas.toBuffer('image/png'));

        console.log("[ScannedPDFService] Image render successful. Running OCR...");
        const result = await imageOCRService.parse(imagePath);
        return result.map(t => ({ ...t, sourceType: 'pdf-scanned' }));
    } catch (err) {
        console.error("[ScannedPDFService] Error:", err.message);
        throw new Error('This PDF is a scanned image but could not be processed. Please upload as JPG/PNG instead.');
    } finally {
        if (imagePath && fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }
};
