let ioInstance = null;

function initSocket(httpServer) {
  const { Server } = require("socket.io");

  ioInstance = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    },
  });

  ioInstance.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join:student", (studentId) => {
      if (!studentId) return;
      socket.join(`student:${studentId}`);
    });

    socket.on("leave:student", (studentId) => {
      if (!studentId) return;
      socket.leave(`student:${studentId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return ioInstance;
}

function getIO() {
  if (!ioInstance) {
    throw new Error("Socket.IO not initialized");
  }
  return ioInstance;
}

module.exports = {
  initSocket,
  getIO,
};