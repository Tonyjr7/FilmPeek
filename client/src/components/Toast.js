import { useState, useEffect } from 'react';

export default function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose && onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const colors = {
    info: 'border-blue-400 text-blue-700',
    success: 'border-green-400 text-green-700',
    error: 'border-red-400 text-red-700',
  };

  return (
    <div
      className={`fixed bottom-5 right-5 px-4 py-3 rounded border-2 bg-white bg-opacity-30 backdrop-blur-md shadow-md ${colors[type]} animate-fade-in`}
      style={{ minWidth: '200px', zIndex: 9999 }}
      role="alert"
      aria-live="assertive"
    >
      {message}
    </div>
  );
}
