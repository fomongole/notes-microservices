import mongoose from "mongoose";
import { DB_URI, PORT } from "./config/env";
import app from "./app";

const startServer = async () => {
    try {
        if(!DB_URI) throw new Error("❌ The DB URI is missing!");

        console.log("😊 Connecting to Notes database...");
        await mongoose.connect(DB_URI);
        console.log("✅ Connected to Notes database!");

        app.listen(PORT, () => {
            console.log(`📒 Notes Service running on http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error(`❌ Error starting Notes Service: ${err}`);
        process.exit(1);
    }
}

startServer();