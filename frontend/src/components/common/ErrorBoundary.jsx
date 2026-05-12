import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('OCR Scanner Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl flex flex-col items-center justify-center text-center min-h-[350px]">
          <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            The document processor encountered an unexpected error. This usually happens with unsupported files or memory limits.
          </p>
          <div className="text-left bg-slate-900 p-4 rounded-xl mb-6 w-full max-w-lg overflow-auto border border-slate-700">
            <code className="text-xs text-red-400 font-mono">
              {this.state.error?.toString() || 'Unknown React rendering error'}
            </code>
          </div>
          <button 
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            className="bg-red-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <RefreshCcw className="w-5 h-5" /> Reload Scanner
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
