import { config } from 'dotenv';

// Load environment variables
config({
    path: `.env.${process.env.NODE_ENV || 'development'}.local`
});

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || '3002'; // User Service Port
export const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/notes-user-db';

// Must match the Auth Service secret to verify tokens
export const JWT_SECRET = process.env.JWT_SECRET as string;

export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';