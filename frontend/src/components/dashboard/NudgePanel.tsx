import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, X, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';

interface Nudge {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'alert';
}

interface NudgePanelProps {
  nudges: Nudge[];
  onDismiss: (id: string) => void;
}

export function NudgePanel({ nudges, onDismiss }: NudgePanelProps) {
  const colors = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    alert: 'bg-red-50 border-red-200 text-red-800'
  };

  const iconColors = {
    info: 'text-blue-500',
    warning: 'text-amber-500',
    alert: 'text-red-500'
  };

  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-brand-500" />
        <h3 className="text-lg font-semibold text-slate-700">Smart Nudges</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3">
        <AnimatePresence>
          {nudges.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-center h-32 text-slate-500"
            >
              <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
              <p>No nudges — your team appears to be doing well!</p>
            </motion.div>
          ) : (
            nudges.map(nudge => (
              <motion.div
                key={nudge.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`relative p-4 rounded-xl border ${colors[nudge.severity]}`}
              >
                <div className="flex items-start gap-3 pr-6">
                  <Lightbulb className={`w-5 h-5 shrink-0 mt-0.5 ${iconColors[nudge.severity]}`} />
                  <p className="text-sm font-medium leading-relaxed">{nudge.message}</p>
                </div>
                <button
                  onClick={() => onDismiss(nudge.id)}
                  className="absolute top-3 right-3 p-1 rounded-md hover:bg-black/5 transition-colors"
                >
                  <X className="w-4 h-4 opacity-50 hover:opacity-100" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
      
      <p className="text-xs text-slate-400 mt-4 text-center">
        AI-generated team-level suggestion — not a personal assessment
      </p>
    </Card>
  );
}
