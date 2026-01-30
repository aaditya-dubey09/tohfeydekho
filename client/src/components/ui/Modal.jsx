import React from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

const Modal = ({ isOpen, onClose, onConfirm, title, message, type = 'info', confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  if (!isOpen) return null;

  const icons = {
    success: <CheckCircle size={48} className="text-green-600" />,
    error: <AlertCircle size={48} className="text-red-600" />,
    warning: <AlertCircle size={48} className="text-yellow-600" />,
    info: <Info size={48} className="text-blue-600" />
  };

  const bgColors = {
    success: 'bg-green-50',
    error: 'bg-red-50',
    warning: 'bg-yellow-50',
    info: 'bg-blue-50'
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className={`${bgColors[type]} rounded-2xl p-6 mb-6 flex justify-center`}>
          {icons[type]}
        </div>

        {title && <h3 className="text-2xl font-black mb-3 text-center">{title}</h3>}
        <p className="text-gray-600 text-center mb-6">{message}</p>

        <div className="flex gap-3">
          {onConfirm && (
            <>
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gray-200 text-black rounded-xl font-bold hover:bg-gray-300 transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
              >
                {confirmText}
              </button>
            </>
          )}
          {!onConfirm && (
            <button
              onClick={onClose}
              className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;