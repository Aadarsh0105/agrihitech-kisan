const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      "mongodb://127.0.0.1:27017/agrihytech";

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000
    });

    console.log("MongoDB connected");
  } catch (error) {
    console.error("DB Error:", error.message);

    if (
      error.message.includes("querySrv") ||
      error.message.includes("ENOTFOUND") ||
      error.message.includes("ECONNREFUSED")
    ) {
      console.error(
        "MongoDB Atlas DNS/connection lookup failed. Check your network, Atlas IP allowlist, and the MONGO_URI hostname."
      );
    }

    process.exit(1);
  }
};

module.exports = connectDB;
