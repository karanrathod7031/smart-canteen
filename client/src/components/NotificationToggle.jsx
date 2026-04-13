import { useNotifications } from "../context/NotificationContext";

export default function NotificationToggle() {
  const { silentMode, toggleSilentMode } = useNotifications();

  return (
    <button
      onClick={toggleSilentMode}
      className={`px-4 py-2 rounded-xl text-sm ${
        silentMode
          ? "bg-yellow-100 text-yellow-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      {silentMode ? "Silent ON 🔕" : "Sound ON 🔔"}
    </button>
  );
}