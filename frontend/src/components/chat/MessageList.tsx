import React, { useRef, useEffect } from 'react';

export function MessageList({ messages, currentUserId }: { messages: any[], currentUserId: string }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-surface-50">
      {messages.map((msg, index) => {
        const isMe = msg.senderId === currentUserId;
        const showAvatar = !isMe && (index === 0 || messages[index - 1].senderId !== msg.senderId);
        
        return (
          <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
            {showAvatar ? (
              <div className="w-8 h-8 rounded-full bg-brand-200 shrink-0" />
            ) : (
              !isMe && <div className="w-8 h-8 shrink-0" />
            )}
            <div className={`flex flex-col ${isMe ? 'items-end' : ''} max-w-[70%]`}>
              {showAvatar && <div className="text-sm font-bold text-slate-700">{msg.senderName}</div>}
              <div className={`p-3 rounded-2xl text-sm mt-1 relative group ${
                isMe 
                  ? 'bg-brand-600 text-white rounded-tr-sm' 
                  : 'bg-white border border-surface-200 text-slate-900 rounded-tl-sm'
              }`}>
                {msg.content}
                {msg.sentiment && (
                  <span className={`absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                    msg.sentiment === 'positive' ? 'bg-green-500' :
                    msg.sentiment === 'negative' ? 'bg-red-500' :
                    msg.sentiment === 'stressed' ? 'bg-orange-500' :
                    msg.sentiment === 'frustrated' ? 'bg-red-400' : 'bg-slate-400'
                  }`} title={`AI Sentiment: ${msg.sentiment}`} />
                )}
              </div>
              <span className="text-xs text-slate-400 mt-1">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
