const mongoose = require("mongoose");

// Mongoose reconnects automatically after a dropped connection,
// so these listeners only log what is happening.
mongoose.connection.on("error", (err) =>
  console.error("MongoDB error:", err.message)
);
mongoose.connection.on("disconnected", () =>
  console.log("MongoDB disconnected")
);

const connectToMongo = async () => {
  const uri = process.env.MONGODB_CONNECTION_LINK;
  if (!uri) {
    console.error("MONGODB_CONNECTION_LINK is missing. Check your .env file.");
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectToMongo;
