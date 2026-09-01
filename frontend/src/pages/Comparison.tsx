import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Check, X, Sparkles, Brain, Heart, Lightbulb, TrendingUp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Comparison() {
  const features = [
    { name: 'Real-time Messaging', standard: 'check', jelling: 'check' },
    { name: 'Video Calls', standard: 'check', jelling: 'limited', note: 'Coming Soon' },
    { name: 'Real-time Sentiment Analysis', standard: 'cross', jelling: 'check', note: 'AI-powered' },
    { name: 'Team Health Dashboard', standard: 'cross', jelling: 'check' },
    { name: 'Team Bonding Activities', standard: 'limited', jelling: 'check', note: 'Full suite' },
    { name: 'Smart Manager Nudges', standard: 'cross', jelling: 'check' },
    { name: 'Productivity Insights', standard: 'limited', jelling: 'check' },
    { name: 'Consent-based Analysis', standard: 'cross', jelling: 'check', note: 'Privacy-first' },
    { name: 'Burnout Early Signals', standard: 'cross', jelling: 'check', note: 'Team-level' },
  ];

  const renderIcon = (status: string, note?: string) => {
    if (status === 'check') return <div className="flex flex-col items-center"><Check className="w-5 h-5 text-green-500" />{note && <span className="text-[10px] text-green-600 mt-1">{note}</span>}</div>;
    if (status === 'cross') return <X className="w-5 h-5 text-red-500 mx-auto" />;
    if (status === 'limited') return <div className="flex flex-col items-center"><span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Limited</span>{note && <span className="text-[10px] text-amber-600 mt-1">{note}</span>}</div>;
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Jelling vs Standard Communication Tools
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Beyond messaging — building real team cohesion and preventing burnout before it happens.
        </p>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-50 border-b border-surface-200">
                <th className="p-4 font-semibold text-slate-900 w-1/3">Feature</th>
                <th className="p-4 font-semibold text-slate-500 text-center w-1/3 border-l border-surface-200">Slack / Teams</th>
                <th className="p-4 font-bold text-brand-600 text-center w-1/3 border-l border-brand-100 bg-brand-50/50">Jelling Environment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {features.map((f, i) => (
                <tr key={i} className="hover:bg-surface-50/50 transition-colors">
                  <td className="p-4 font-medium text-slate-700">{f.name}</td>
                  <td className="p-4 border-l border-surface-200 align-middle">
                    {renderIcon(f.standard)}
                  </td>
                  <td className="p-4 border-l border-brand-100 bg-brand-50/20 align-middle">
                    {renderIcon(f.jelling, f.note)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center hover:-translate-y-1 transition-transform border-t-4 border-t-brand-500">
          <Brain className="w-10 h-10 text-brand-500 mx-auto mb-4" />
          <h3 className="font-bold text-lg mb-2">AI Sentiment</h3>
          <p className="text-sm text-slate-600">Understand the emotional pulse of your team without intrusive surveys.</p>
        </Card>
        <Card className="text-center hover:-translate-y-1 transition-transform border-t-4 border-t-green-500">
          <Heart className="w-10 h-10 text-green-500 mx-auto mb-4" />
          <h3 className="font-bold text-lg mb-2">Team Health</h3>
          <p className="text-sm text-slate-600">Quantify qualitative interactions into actionable health metrics.</p>
        </Card>
        <Card className="text-center hover:-translate-y-1 transition-transform border-t-4 border-t-amber-500">
          <Lightbulb className="w-10 h-10 text-amber-500 mx-auto mb-4" />
          <h3 className="font-bold text-lg mb-2">Smart Nudges</h3>
          <p className="text-sm text-slate-600">Automated suggestions for managers when intervention is needed.</p>
        </Card>
      </div>

      <div className="text-center pt-8">
        <Link to="/register">
          <Button size="lg" className="text-lg px-8 py-4 shadow-lg shadow-brand-500/30">Get Started with Jelling</Button>
        </Link>
      </div>
    </div>
  );
}
