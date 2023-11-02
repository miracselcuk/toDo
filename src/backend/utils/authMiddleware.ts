import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { secret_key } from "./secret_key";

export interface UserPayload {
    id: string;
    username: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: "Authentication required. 2" });
    }
    token = token.split(' ')[1];

    jwt.verify(token, secret_key, (err, user) => {
        if (!err) {
            req.user = user as UserPayload;
            next();
        } else {
            return res.status(401).json({ message: 'User not authenticated' });
        }
    })
}

export default authenticateUser;
