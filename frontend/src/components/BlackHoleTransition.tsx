import { motion, AnimatePresence } from 'framer-motion';

interface BlackHoleTransitionProps {
  isExiting: boolean;
  onFinished?: () => void;
}

export default function BlackHoleTransition({ isExiting, onFinished }: BlackHoleTransitionProps) {
  return (
    <AnimatePresence>
      {isExiting && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* The Black Hole Center */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.5, 60],
              opacity: [0, 1, 1],
            }}
            transition={{ 
              duration: 1.2, 
              times: [0, 0.3, 1],
              ease: "easeInOut" 
            }}
            onAnimationComplete={() => {
              if (onFinished) onFinished();
            }}
            className="w-20 h-20 bg-black rounded-full shadow-[0_0_100px_40px_rgba(0,0,0,1)] relative"
          >
            {/* Event Horizon Glow */}
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/30 blur-sm animate-pulse" />
            <div className="absolute inset-0 rounded-full border border-white/20 blur-md" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
