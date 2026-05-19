import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({ title, message, onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div
        className="relative z-10 w-full max-w-[400px] mx-4 p-8 rounded-[20px] text-center"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          animation: 'modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(239,68,68,0.15)' }}
        >
          <AlertTriangle size={28} color="#EF4444" />
        </div>

        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h3>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          {message}
        </p>

        <div className="flex justify-center gap-3">
          <button onClick={onCancel} className="ghost-btn py-2.5 px-5 text-sm">Bekor qilish</button>
          <button onClick={onConfirm} className="danger-btn py-2.5 px-5 text-sm">O'chirish</button>
        </div>
      </div>
    </div>
  );
}
