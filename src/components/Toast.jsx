import React, { useState, useEffect } from 'react';

// Contexte pour gérer les toasts globalement
export const ToastContext = React.createContext();

// Hook pour utiliser les toasts
export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Provider pour les toasts
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (message, duration) => addToast(message, 'success', duration);
  const error = (message, duration) => addToast(message, 'error', duration);
  const warning = (message, duration) => addToast(message, 'warning', duration);
  const info = (message, duration) => addToast(message, 'info', duration);

  return (
    <ToastContext.Provider value={{ success, error, warning, info, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

// Conteneur des toasts
function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
      
      <style jsx>{`
        .toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 400px;
        }

        @media (max-width: 480px) {
          .toast-container {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
}

// Composant Toast individuel
function Toast({ toast, onRemove }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation d'entrée
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(toast.id), 200);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <div 
      className={`toast toast-${toast.type} ${isVisible ? 'toast-visible' : ''}`}
      onClick={handleClose}
    >
      <div className="toast-content">
        <span className="toast-icon">{getIcon()}</span>
        <span className="toast-message">{toast.message}</span>
        <button className="toast-close" onClick={handleClose}>×</button>
      </div>

      <style jsx>{`
        .toast {
          background: ${getBackgroundColor()};
          color: white;
          padding: 16px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          transform: translateX(100%);
          opacity: 0;
          transition: all 0.3s ease;
          max-width: 100%;
          position: relative;
          overflow: hidden;
        }

        .toast-visible {
          transform: translateX(0);
          opacity: 1;
        }

        .toast:hover {
          transform: translateX(-5px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .toast-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .toast-icon {
          font-size: 16px;
          flex-shrink: 0;
        }

        .toast-message {
          flex: 1;
          font-size: 14px;
          line-height: 1.4;
        }

        .toast-close {
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.2s;
          flex-shrink: 0;
        }

        .toast-close:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        /* Barre de progression pour l'auto-dismiss */
        .toast::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background: rgba(255, 255, 255, 0.3);
          animation: progress ${toast.duration}ms linear;
        }

        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
