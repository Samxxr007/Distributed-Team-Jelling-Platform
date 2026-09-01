import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function PollWidget({ poll, onVote }: { poll: any, onVote: (optionIndex: number) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  
  const totalVotes = poll.options.reduce((sum: number, opt: any) => sum + opt.votes, 0);

  return (
    <Card className="bg-surface-50 border-surface-200 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-brand-500" />
      <div className="flex justify-between items-start mb-4">
        <span className="bg-brand-100 text-brand-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">Poll</span>
        <span className="text-xs text-slate-500">Ends in 2 days</span>
      </div>
      <h4 className="font-bold text-slate-900 mb-4">{poll.question}</h4>
      
      <div className="space-y-3">
        {poll.options.map((opt: any, idx: number) => {
          const percent = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
          return (
            <div 
              key={idx}
              className="relative rounded-lg border border-surface-200 p-3 overflow-hidden cursor-pointer hover:border-brand-300 transition-colors bg-white z-10"
              onClick={() => !poll.hasVoted && setSelected(idx)}
            >
              {(poll.hasVoted || selected !== null) && (
                <div 
                  className="absolute top-0 left-0 h-full bg-brand-50 -z-10 transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              )}
              <div className="flex justify-between relative z-20 text-sm">
                <div className="flex items-center gap-2">
                  {!poll.hasVoted && (
                    <input type="radio" checked={selected === idx} readOnly className="text-brand-600 focus:ring-brand-500" />
                  )}
                  <span className="font-medium text-slate-700">{opt.text}</span>
                </div>
                {(poll.hasVoted || selected !== null) && (
                  <span className="font-bold text-brand-700">{percent}%</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!poll.hasVoted && (
        <Button 
          className="w-full mt-4" 
          disabled={selected === null}
          onClick={() => selected !== null && onVote(selected)}
        >
          Vote
        </Button>
      )}
      
      {(poll.hasVoted || selected !== null) && (
        <p className="text-center text-xs text-slate-500 mt-4">{totalVotes} total votes</p>
      )}
    </Card>
  );
}
