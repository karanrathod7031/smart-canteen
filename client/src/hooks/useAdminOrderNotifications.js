import { useEffect, useRef } from "react";
import { socket } from "../services/socket";
import { useNotifications } from "../context/NotificationContext";

export function useAdminOrderNotifications() {
  const { silentMode, showToast } = useNotifications();
  const audioRef = useRef(null);
  const audioUnlockedRef = useRef(false);

  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
    audioRef.current.preload = "auto";

    const unlockAudio = () => {
      if (!audioRef.current || audioUnlockedRef.current) return;

      audioRef.current
        .play()
        .then(() => {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioUnlockedRef.current = true;
        })
        .catch(() => {});

      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);
    window.addEventListener("keydown", unlockAudio);

    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handleOrderUpdated = ({ type, order }) => {
      if (!order?._id) return;

      if (type === "created") {
        showToast({
          title: "New Order",
          message: `${order.studentName || "Student"} ordered ₹${order.totalAmount}`,
        });

        if (!silentMode && audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch((error) => {
            console.error("Notification sound blocked:", error);
          });
        }
      }

      if (type === "cancelled") {
        showToast({
          title: "Order Cancelled",
          message: `Order #${String(order._id).slice(-6).toUpperCase()} was cancelled`,
        });
      }
    };

    socket.on("order:updated", handleOrderUpdated);

    return () => {
      socket.off("order:updated", handleOrderUpdated);
    };
  }, [silentMode, showToast]);
}