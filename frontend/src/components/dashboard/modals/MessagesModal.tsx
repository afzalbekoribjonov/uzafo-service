import { motion } from 'framer-motion';
import { X, Mail, Trash2, CheckCircle, Clock } from 'lucide-react';
import { useDataStore } from '@/stores/dataStore';
import { formatDate } from '@/lib/utils';

interface MessagesModalProps {
  onClose: () => void;
}

export default function MessagesModal({ onClose }: MessagesModalProps) {
  const messages = useDataStore((s) => s.messages);
  const markAsRead = useDataStore((s) => s.markMessageAsRead);
  const deleteMessage = useDataStore((s) => s.deleteMessage);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl max-h-full flex flex-col glass-panel overflow-hidden shadow-2xl"
        style={{ background: 'var(--bg-surface)', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-500/10">
              <Mail size={20} color="#818CF8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Xabarlar</h3>
              <p className="text-xs text-gray-400">{messages.length} ta xabar mavjud</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {messages.length > 0 ? (
            <div className="flex flex-col gap-3">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`p-5 rounded-2xl border transition-all ${msg.isRead ? 'bg-white/[0.02] border-white/5' : 'bg-indigo-500/[0.03] border-indigo-500/20'}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-white">{msg.email}</span>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500">
                        <Clock size={10} />
                        {formatDate(msg.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!msg.isRead && (
                        <button 
                          onClick={() => markAsRead(msg.id)}
                          className="p-1.5 rounded-md hover:bg-indigo-500/10 text-indigo-400 transition-colors"
                          title="O'qilgan deb belgilash"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteMessage(msg.id)}
                        className="p-1.5 rounded-md hover:bg-red-500/10 text-red-400 transition-colors"
                        title="O'chirish"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-60 flex flex-col items-center justify-center text-center opacity-40">
              <Mail size={40} className="mb-3" />
              <p className="text-sm">Hozircha xabarlar yo'q</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
