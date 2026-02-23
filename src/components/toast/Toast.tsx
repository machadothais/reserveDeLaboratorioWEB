import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
}

export default function Toast({ message, type }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setVisible(false), 2700);
    const removeTimer = setTimeout(() => {
      const el = document.getElementById('toast-container');
      if (el) el.remove();
    }, 3200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <div
      id="toast-container"
      className={`toast-container ${type} ${visible ? 'fade-in' : 'fade-out'} animate-slideIn`}
    >
      {message}

      <style>
        {`
          .toast-container {
            position: fixed;
            top: 20px;
            right: 20px; /* ✅ canto superior direito */
            background-color: var(--cor-card);
            color: var(--cor-texto);
            border-left: 6px solid transparent;
            border-radius: 8px;
            padding: 14px 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-size: 0.95rem;
            font-weight: 500;
            z-index: 9999;
            opacity: 0;
            transform: translateY(-10px);
            transition: opacity 0.5s ease, transform 0.5s ease;
          }

          /* ✅ Cores baseadas no tema */
          .toast-container.success {
            border-left-color: #4CAF50;
            color: #2e7d32;
          }

          .toast-container.error {
            border-left-color: #F44336;
            color: #b71c1c;
          }

          .toast-container.fade-in {
            opacity: 1;
            transform: translateY(0);
          }

          .toast-container.fade-out {
            opacity: 0;
            transform: translateY(-10px);
          }

          /* ✨ Animação de entrada */
          @keyframes slideIn {
            0% {
              transform: translateY(-20px);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }

          .animate-slideIn {
            animation: slideIn 0.3s ease-out;
          }
        `}
      </style>
    </div>
  );
}
