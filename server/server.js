const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { initSocket } = require("./socket");

const startServer = async () => {
  try {
    await connectDB();

    const port = process.env.PORT || 5000;
    const server = http.createServer(app);

    initSocket(server);

    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();