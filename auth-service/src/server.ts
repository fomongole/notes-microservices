import mongoose from "mongoose";
import { DB_URI, PORT } from "./config/env";
import app from "./app";

const startSever = async () => {
    try {
        if(!DB_URI) throw new Error("❌ The DB URI is missing!");

        console.log("😊 Connecting to Auth database...");
        await mongoose.connect(DB_URI);
        console.log("✅ Connected to Auth database!");

        app.listen(PORT, () => {
            console.log(`🔐 Auth Service running on http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error(`❌ Error starting Auth Service: ${err}`);
        process.exit(1);
    }
}

startSever();