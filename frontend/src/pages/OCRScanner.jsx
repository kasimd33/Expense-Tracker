import React, { useState, useRef } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle, FileText, Loader2, RefreshCcw, FileImage, FileSpreadsheet, File, AlertTriangle, Save, Trash2, Edit2, X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function OCRScannerContent() {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('');
  const [preview, setPreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    setError('');
    
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`File size exceeds 10MB limit. Uploaded file is ${(selectedFile.size/1024/1024).toFixed(2)}MB`);
      return;
    }

    setFile(selectedFile);
    setTransactions([]);
    setSummary(null);
    
    const type = selectedFile.type;
    const name = selectedFile.name.toLowerCase();
    
    if (type.includes('image')) setFileType('image');
    else if (type.includes('pdf')) setFileType('pdf');
    else if (name.endsWith('.csv')) setFileType('csv');
    else if (name.endsWith('.xlsx') || name.endsWith('.xls')) setFileType('excel');
    else setFileType('unknown');

    if (type.includes('image')) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.onerror = () => setError("Failed to read image preview.");
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleScan = async () => {
    if (!file) return;
    setScanning(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/ocr/scan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000 // allow up to 60 seconds for heavy PDFs
      });
      
      // Safety limits on huge parsed files
      let parsedTx = res.data.transactions || [];
      if (parsedTx.length > 500) {
        parsedTx = parsedTx.slice(0, 500);
        setError('Warning: Over 500 transactions found. Results have been truncated to prevent browser crash.');
      }
      
      setTransactions(parsedTx);
      setSummary({ title: res.data.summary.title, count: parsedTx.length, msg: res.data.message });
    } catch (err) {
      console.error('Scan API Error:', err);
      setError(err.response?.data?.error || 'Failed to process document. The file might be corrupted or unsupported.');
    } finally {
      setScanning(false);
    }
  };

  const handleTransactionChange = (index, field, value) => {
    const updated = [...transactions];
    updated[index][field] = value;
    setTransactions(updated);
  };

  const handleDeleteTransaction = (index) => {
    setTransactions(transactions.filter((_, i) => i !== index));
  };

  const handleSaveAll = async () => {
    if (transactions.length === 0) return;
    setSaving(true);
    
    try {
      const promises = transactions.map(t => api.post('/expenses', {
        title: t.title || 'Unknown',
        amount: Number(t.amount) || 0,
        category: t.category || 'Other',
        type: t.type || 'expense',
        paymentMethod: t.paymentMethod || 'Bank',
        date: t.date || new Date().toISOString()
      }));
      
      await Promise.all(promises);
      
      alert(`Successfully saved ${transactions.length} transactions!`);
      navigate('/expenses');
    } catch (err) {
      console.error(err);
      alert('Failed to save some transactions.');
    } finally {
      setSaving(false);
    }
  };

  const renderFileIcon = () => {
    if (fileType === 'image') return <FileImage className="w-16 h-16 text-cyan-500 mb-4" />;
    if (fileType === 'pdf') return <FileText className="w-16 h-16 text-red-500 mb-4" />;
    if (fileType === 'csv' || fileType === 'excel') return <FileSpreadsheet className="w-16 h-16 text-green-500 mb-4" />;
    return <File className="w-16 h-16 text-slate-500 mb-4" />;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Upload Area */}
      <div className="xl:col-span-1 space-y-6">
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`bg-card/80 backdrop-blur-xl border-2 border-dashed ${file ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-border'} p-10 rounded-3xl flex flex-col items-center justify-center text-center transition-all hover:border-primary/50 min-h-[350px] shadow-sm relative overflow-hidden`}
        >
          {file ? (
            <div className="w-full flex flex-col items-center">
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-xl shadow-lg object-contain mb-6" />
              ) : (
                renderFileIcon()
              )}
              <p className="font-bold text-foreground break-all">{file.name}</p>
              <p className="text-sm text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              
              <button 
                onClick={() => { setFile(null); setPreview(null); setTransactions([]); setSummary(null); setError(''); }}
                className="absolute top-4 right-4 p-2 bg-slate-800 text-slate-400 rounded-full hover:bg-slate-700 hover:text-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 text-cyan-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <UploadCloud className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Drag & Drop File</h3>
              <p className="text-sm text-muted-foreground mb-8">JPG, PNG, PDF, CSV, XLSX supported<br/><span className="text-xs opacity-70">Max size: 10MB</span></p>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors shadow-sm"
              >
                Browse Files
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept=".jpg,.jpeg,.png,.pdf,.csv,.xlsx,.xls" onChange={(e) => { if(e.target.files[0]) handleFileSelect(e.target.files[0]); }} />
            </>
          )}
        </div>

        {file && !scanning && transactions.length === 0 && !error && (
          <motion.button 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={handleScan}
            className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex justify-center items-center gap-2"
          >
            <Sparkles className="w-5 h-5" /> Extract Data with AI
          </motion.button>
        )}

        {scanning && (
          <div className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl p-8 flex flex-col items-center justify-center shadow-sm">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
            <p className="font-bold text-foreground text-lg">Analyzing Document...</p>
            <p className="text-sm text-muted-foreground mt-2 text-center">Using advanced NLP to securely extract financial records asynchronously.</p>
            <div className="w-full h-2 bg-slate-800 rounded-full mt-6 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 animate-pulse w-full"></div>
            </div>
          </div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-400 break-words flex-1">{error}</p>
          </motion.div>
        )}
      </div>

      {/* Results Area */}
      <div className="xl:col-span-2">
        <div className="bg-card/80 backdrop-blur-xl border border-border p-6 rounded-3xl shadow-sm min-h-[350px] flex flex-col">
          
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <FileText className="text-cyan-500 w-6 h-6" /> Extracted Transactions
            </h3>
            {summary && (
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-xs font-bold flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5"/> {summary.count} Found</span>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-x-auto">
            {!summary && transactions.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground italic mt-20 text-sm">
                Upload and process a document to preview transactions.
              </div>
            ) : transactions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground mt-20">
                <AlertTriangle className="w-8 h-8 mb-2 opacity-50" />
                <p>No valid transactions were found in this document.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-muted/50 rounded-lg min-w-[600px]">
                  <div className="col-span-4">Description</div>
                  <div className="col-span-2">Amount (₹)</div>
                  <div className="col-span-3">Category</div>
                  <div className="col-span-2">Type</div>
                  <div className="col-span-1 text-right">Act</div>
                </div>
                
                {transactions.map((t, index) => (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(index * 0.02, 1) }} key={index} className="grid grid-cols-12 gap-4 items-center bg-background border border-border p-3 rounded-xl hover:border-cyan-500/50 transition-colors min-w-[600px]">
                    <div className="col-span-4">
                      <input type="text" value={t.title} onChange={e => handleTransactionChange(index, 'title', e.target.value)} className="w-full bg-transparent outline-none font-medium text-sm text-foreground" />
                    </div>
                    <div className="col-span-2">
                      <input type="number" value={t.amount} onChange={e => handleTransactionChange(index, 'amount', e.target.value)} className="w-full bg-transparent outline-none font-bold text-sm text-cyan-400" />
                    </div>
                    <div className="col-span-3">
                      <select value={t.category} onChange={e => handleTransactionChange(index, 'category', e.target.value)} className="w-full bg-muted/50 border border-border rounded-lg px-2 py-1 outline-none text-sm text-slate-300 focus:ring-1 focus:ring-cyan-500">
                        <option>Food</option><option>Transport</option><option>Shopping</option><option>Bills</option><option>Entertainment</option><option>Salary</option><option>Other</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <select value={t.type} onChange={e => handleTransactionChange(index, 'type', e.target.value)} className={`w-full bg-muted/50 border border-border rounded-lg px-2 py-1 outline-none text-sm font-semibold focus:ring-1 focus:ring-cyan-500 ${t.type === 'income' ? 'text-green-500' : 'text-red-400'}`}>
                        <option value="expense">Expense</option><option value="income">Income</option>
                      </select>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button onClick={() => handleDeleteTransaction(index)} className="p-1.5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {transactions.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">Total Value: <strong className="text-foreground text-lg ml-2">₹{transactions.reduce((s,t) => s + Number(t.amount), 0).toFixed(2)}</strong></p>
              <button 
                onClick={handleSaveAll}
                disabled={saving}
                className="w-full md:w-auto bg-cyan-500 text-slate-900 px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Import {transactions.length} Records</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OCRScanner() {
  return (
    <PageLayout title="Smart Document Ingestion" description="Upload Receipts (JPG/PNG), Bank Statements (PDF/CSV), or Expense Sheets (Excel) to extract data automatically.">
      <ErrorBoundary>
        <OCRScannerContent />
      </ErrorBoundary>
    </PageLayout>
  );
}
