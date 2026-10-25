const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows/ISP querySrv ECONNREFUSED with MongoDB Atlas
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
    // ignore if not supported
}

const DbConnection = async () => {
    const url = process.env.MONGO_URL;
    if (!url) {
        console.error("❌ MONGO_URL is not defined in your .env file!");
        return;
    }

    try {
        await mongoose.connect(url);
        console.log("✅ Database connected successfully to MongoDB Atlas");
    } catch (error) {
        console.error("❌ Database connection error:", error.message);
        if (error.message.includes("whitelist") || error.message.includes("Could not connect to any servers")) {
            console.error("👉 TIP: Make sure your IP address is whitelisted in MongoDB Atlas under Network Access (Allow 0.0.0.0/0).");
        }
    }
};

module.exports = DbConnection;