import { useState, useEffect } from 'react';
import { X, Shield } from 'lucide-react';

export default function ConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('ai_consent');
    if (hasConsented === null) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('ai_consent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('ai_consent', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="mb-6 bg-brand-50 border border-brand-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative shadow-sm">
      <button 
        onClick={handleDecline}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 sm:hidden"
      >
        <X className="h-5 w-5" />
      </button>
      
      <div className="h-10 w-10 bg-brand-100 rounded-full flex items-center justify-center shrink-0">
        <Shield className="h-5 w-5 text-brand-600" />
      </div>
      
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-dark">Data Privacy & AI Analysis</h4>
        <p className="text-sm text-slate-600 mt-1 pr-6 sm:pr-0">
          We use AI to analyze messages and team interactions to provide team health insights. 
          Your data is processed securely and is not used to train public models.
        </p>
      </div>
      
      <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
        <button 
          onClick={handleDecline}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
        >
          Disable
        </button>
        <button 
          onClick={handleAccept}
          className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors whitespace-nowrap"
        >
          Enable AI Insights
        </button>
      </div>
    </div>
  );
}
