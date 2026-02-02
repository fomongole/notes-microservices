import { Request } from "express";

declare global {
    namespace Express {
        interface Request {
            // In Notes Service, we don't have the full User model.
            // We only have the ID from the token.
            user?: { _id: string; role?: string };
        }
    }
}