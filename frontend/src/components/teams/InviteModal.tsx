import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Copy, Check } from 'lucide-react';

export function InviteModal({ isOpen, onClose, inviteCode, teamId }: { isOpen: boolean, onClose: () => void, inviteCode: string, teamId: string }) {
  const [copied, setCopied] = useState(false);
  const inviteUrl = `${window.location.origin}/register?invite=${inviteCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Team Members">
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Share this link with your team members so they can join.</p>
        <div className="flex gap-2">
          <Input value={inviteUrl} readOnly className="font-mono text-sm" />
          <Button variant="secondary" onClick={handleCopy} className="shrink-0 w-12">
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
        <div className="text-center mt-6">
          <span className="text-sm text-slate-500">Or they can use code: <strong>{inviteCode}</strong></span>
        </div>
      </div>
    </Modal>
  );
}
