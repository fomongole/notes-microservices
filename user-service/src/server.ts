import mongoose from "mongoose";
import { DB_URI, PORT } from "./config/env";
import app from "./app";

const startServer = async () => {
    try {
        if(!DB_URI) throw new Error("❌ The DB URI is missing!");

        console.log("😊 Connecting to User database...");
        await mongoose.connect(DB_URI);
        console.log("✅ Connected to User database!");

        app.listen(PORT, () => {
            console.log(`👤 User Service running on http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error(`❌ Error starting User Service: ${err}`);
        process.exit(1);
    }
}

startServer();