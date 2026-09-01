import React from 'react';

export function TypingIndicator({ users }: { users: string[] }) {
  if (!users || users.length === 0) return null;
  
  const text = users.length === 1 
    ? `${users[0]} is typing...` 
    : users.length === 2 
      ? `${users[0]} and ${users[1]} are typing...` 
      : 'Several people are typing...';

  return (
    <div className="px-4 py-2 text-xs text-slate-500 flex items-center gap-2 bg-surface-50">
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
      {text}
    </div>
  );
}
