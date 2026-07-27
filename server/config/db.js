const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer = null;

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    // Use MongoMemoryServer if MONGO_URI is not set or equals "memory" or if it is empty
    if (!uri || uri === "memory" || uri === "undefined" || uri.trim() === "") {
      console.log("No MONGO_URI provided or set to memory. Starting MongoMemoryServer...");
      mongoServer = await MongoMemoryServer.create({
        instance: {
          dbName: "smart-canteen"
        }
      });
      uri = mongoServer.getUri();
      process.env.MONGO_URI = uri; // Set it back so other scripts can access it via process.env if needed
      console.log(`MongoMemoryServer started on: ${uri}`);
    }

    const connection = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
      console.log("MongoMemoryServer stopped.");
    }
  } catch (error) {
    console.error("MongoDB disconnect failed:", error.message);
  }
};

module.exports = { connectDB, disconnectDB };