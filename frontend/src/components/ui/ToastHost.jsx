import { useEffect, useRef, useState } from "react";

const TOAST_EVENT = "mama:toast";

export const showToast = (message) => {
  if (typeof window === "undefined" || !message) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, {
      detail: { message }
    })
  );
};

const ToastHost = () => {
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const hideTimerRef = useRef();
  const clearTimerRef = useRef();

  useEffect(() => {
    const handleToast = (event) => {
      const nextMessage = event.detail?.message;
      if (!nextMessage) {
        return;
      }

      window.clearTimeout(hideTimerRef.current);
      window.clearTimeout(clearTimerRef.current);

      setMessage(nextMessage);
      setIsVisible(true);

      hideTimerRef.current = window.setTimeout(() => {
        setIsVisible(false);
      }, 2200);

      clearTimerRef.current = window.setTimeout(() => {
        setMessage("");
      }, 2500);
    };

    window.addEventListener(TOAST_EVENT, handleToast);

    return () => {
      window.removeEventListener(TOAST_EVENT, handleToast);
      window.clearTimeout(hideTimerRef.current);
      window.clearTimeout(clearTimerRef.current);
    };
  }, []);

  if (!message) {
    return null;
  }

  return (
    <div className="toast-root" role="status" aria-live="polite">
      <div className={`toast-card ${isVisible ? "toast-enter" : "toast-exit"}`}>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default ToastHost;
