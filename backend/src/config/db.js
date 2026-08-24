const mongoose = require("mongoose");
const dns = require("dns");

const connectDB = async ({ attempts = 3, retryDelayMs = 3000 } = {}) => {
  const mongoUri =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017/agrihytech";

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000
      });
      console.log("MongoDB connected");
      return;
    } catch (error) {
      console.error(`DB connection attempt ${attempt}/${attempts} failed:`, error.message);

      if (attempt === 1 && /querySrv|ENOTFOUND|ECONNREFUSED/i.test(error.message)) {
        const dnsServers = (process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1")
          .split(",")
          .map((server) => server.trim())
          .filter(Boolean);
        dns.setServers(dnsServers);
        console.log(`Retrying MongoDB SRV lookup with DNS servers: ${dnsServers.join(", ")}`);
      }

      if (attempt === attempts) {
        if (/querySrv|ENOTFOUND|ECONNREFUSED/i.test(error.message)) {
          console.error(
            "MongoDB Atlas SRV DNS lookup failed. Verify DNS access, the MONGO_URI hostname, and Atlas Network Access."
          );
        }
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    }
  }
};

module.exports = connectDB;
