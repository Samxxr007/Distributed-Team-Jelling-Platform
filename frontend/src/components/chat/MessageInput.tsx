import React, { useState } from 'react';
import { Send, Smile } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export function MessageInput({ onSend, onTyping }: { onSend: (text: string) => void, onTyping: (isTyping: boolean) => void }) {
  const [text, setText] = useState('');
  const consentEnabled = localStorage.getItem('ai_consent') === 'true';

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
    onTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-white border-t border-surface-200">
      <div className="relative flex items-end gap-2">
        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-surface-100 mb-1 transition-colors">
          <Smile className="w-5 h-5" />
        </button>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onTyping(e.target.value.length > 0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="w-full max-h-32 min-h-[44px] bg-surface-50 border border-surface-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none transition-all"
          rows={1}
        />
        <button 
          onClick={handleSend}
          disabled={!text.trim()}
          className="p-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 mb-0.5"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      {consentEnabled && (
        <p className="text-xs text-slate-400 mt-2 text-center flex items-center justify-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 inline-block animate-pulse"></span>
          AI analyzing messages for team health insights
        </p>
      )}
    </div>
  );
}
