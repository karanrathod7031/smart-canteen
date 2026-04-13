import { createContext, useContext, useEffect, useMemo, useState } from "react";

const NotificationContext = createContext(null);

const STORAGE_KEY = "admin_notifications_silent";

export function NotificationProvider({ children }) {
  const [silentMode, setSilentMode] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === "true";
  });

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(silentMode));
  }, [silentMode]);

  function toggleSilentMode() {
    setSilentMode((prev) => !prev);
  }

  function showToast({ title, message }) {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, title, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }

  const value = useMemo(
    () => ({
      silentMode,
      toggleSilentMode,
      showToast,
    }),
    [silentMode]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}

      {/* Toast UI */}
      <div className="fixed right-4 top-4 z-[9999] flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-white border shadow-lg rounded-xl p-4 w-80"
          >
            <p className="font-semibold text-slate-900">{toast.title}</p>
            <p className="text-sm text-slate-600 mt-1">{toast.message}</p>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}