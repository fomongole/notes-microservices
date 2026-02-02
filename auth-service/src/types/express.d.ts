import { IAuthUser } from '../models/user.model';

declare global {
    namespace Express {
        interface Request {
            user?: IAuthUser;
        }
    }
}