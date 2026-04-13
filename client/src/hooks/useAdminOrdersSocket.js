import { useEffect } from "react";
import { socket } from "../services/socket";

export function useAdminOrdersSocket(setOrders) {
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handleOrderUpdated = ({ order }) => {
      if (!order?._id) return;

      setOrders((prev) => {
        const exists = prev.some((item) => item._id === order._id);

        if (!exists) {
          return [order, ...prev];
        }

        return prev.map((item) => (item._id === order._id ? order : item));
      });
    };

    socket.on("order:updated", handleOrderUpdated);

    return () => {
      socket.off("order:updated", handleOrderUpdated);
    };
  }, [setOrders]);
}