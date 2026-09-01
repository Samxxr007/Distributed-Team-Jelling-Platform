import React, { useState } from 'react';
import { useSentiment } from '../hooks/useSentiment';
import { SentimentChart, SentimentDistribution, MetricCard } from '../components/dashboard';
import { Toggle } from '../components/ui/Toggle';
import { Brain, TrendingUp, AlertTriangle } from 'lucide-react';
import { Shield } from 'lucide-react';
import { Card } from '../components/ui/Card';

export default function Sentiment() {
  const [days, setDays] = useState(7);
  const { sentimentSummary, trendData, isLoading } = useSentiment(days);
  const [consent, setConsent] = useState(localStorage.getItem('ai_consent') === 'true');

  const handleConsent = (val: boolean) => {
    setConsent(val);
    localStorage.setItem('ai_consent', val ? 'true' : 'false');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="w-6 h-6 text-brand-600" /> Sentiment Analysis
        </h1>
        <div className="flex gap-2">
          {[7, 30, 90].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${days === d ? 'bg-brand-100 text-brand-700' : 'text-slate-600 hover:bg-surface-100'}`}
            >
              {d}D
            </button>
          ))}
        </div>
      </div>

      <Card padding="md" className="flex items-center gap-4 bg-brand-50 border-brand-200">
        <Shield className="w-8 h-8 text-brand-600 shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">Privacy & Consent</h3>
          <p className="text-sm text-slate-600">Enable AI analysis of team messages to generate these insights. Data is aggregated and anonymized.</p>
        </div>
        <div className="shrink-0 w-32 flex justify-end">
          <Toggle checked={consent} onChange={handleConsent} />
        </div>
      </Card>

      {!consent ? (
        <div className="text-center py-16 bg-surface-50 border border-surface-200 border-dashed rounded-xl">
          <Brain className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">AI Analysis Disabled</h3>
          <p className="text-slate-500 mt-2">Enable consent above to view sentiment insights.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard 
              icon={<Brain />} 
              label="Total Analyzed" 
              value={sentimentSummary?.totalAnalyzed || 0} 
              isLoading={isLoading} 
            />
            <MetricCard 
              icon={<TrendingUp />} 
              label="Positive Ratio" 
              value={`${sentimentSummary?.positiveRatio || 0}%`} 
              isLoading={isLoading} 
            />
            <MetricCard 
              icon={<AlertTriangle />} 
              label="Stress/Frustration" 
              value={`${(sentimentSummary?.stressRatio || 0) + (sentimentSummary?.frustrationRatio || 0)}%`} 
              isLoading={isLoading} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SentimentChart data={trendData || []} height={350} />
            </div>
            <div>
              <SentimentDistribution data={[
                { name: 'Positive', value: sentimentSummary?.positiveRatio || 0 },
                { name: 'Neutral', value: sentimentSummary?.neutralRatio || 0 },
                { name: 'Stressed', value: sentimentSummary?.stressRatio || 0 },
                { name: 'Frustrated', value: sentimentSummary?.frustrationRatio || 0 },
                { name: 'Negative', value: sentimentSummary?.negativeRatio || 0 },
              ].filter(d => d.value > 0)} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
