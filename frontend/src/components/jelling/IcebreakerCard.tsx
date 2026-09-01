import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { RefreshCw } from 'lucide-react';

export function IcebreakerCard({ question, onShuffle }: { question: string, onShuffle: () => void }) {
  return (
    <Card className="bg-gradient-to-r from-brand-600 to-brand-800 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 scale-150">
        <span className="text-9xl">🧊</span>
      </div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">Icebreaker</span>
          <button onClick={onShuffle} className="p-2 hover:bg-white/20 rounded-full transition-colors" title="Shuffle">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        <h3 className="text-2xl font-bold leading-tight mb-8">"{question}"</h3>
        <Button variant="secondary" className="bg-white text-brand-700 hover:bg-surface-50 w-full sm:w-auto">
          Share in Chat
        </Button>
      </div>
    </Card>
  );
}
