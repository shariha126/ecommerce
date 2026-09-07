import { useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

function Toast({
  message,
  type = "success",
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const icons = {
    success: <CheckCircle size={22} />,
    error: <XCircle size={22} />,
    warning: <AlertTriangle size={22} />,
    info: <Info size={22} />,
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {icons[type]}
      </div>

      <div className="toast-message">
        {message}
      </div>

      <button
        className="toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={18} />
      </button>
    </div>
  );
}

export default Toast;