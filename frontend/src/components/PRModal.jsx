import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export default function PRModal({ isOpen, onClose, prUrl }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-gray-800 rounded-xl p-8 text-center max-w-sm w-full border border-gray-700 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col items-center"
          >
            {/* Glowing Success Icon */}
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              <CheckCircle className="w-10 h-10 text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
            </div>

            {/* Modal Title */}
            <h2 className="text-xl font-bold text-white mt-4 mb-2">
              Pull Request Created Successfully!
            </h2>

            {/* Call to Actions */}
            <div className="flex flex-col w-full gap-3 mt-6">
              {prUrl ? (
                <a
                  href={prUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-300 hover:to-blue-400 text-white font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  View PR on GitHub
                </a>
              ) : (
                <button
                  disabled
                  className="w-full py-3 px-4 rounded-xl bg-gray-700 text-gray-400 font-bold cursor-not-allowed"
                >
                  Generating PR...
                </button>
              )}
              
              <button
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl text-gray-400 hover:text-white font-semibold transition-colors bg-transparent hover:bg-white/5"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
