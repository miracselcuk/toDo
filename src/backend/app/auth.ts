import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { secret_key } from "../utils/secret_key";
import { UserPayload } from "../utils/authMiddleware";

const prisma = new PrismaClient()

const signup = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const hashedPw = await bcrypt.hash(password, 10);

        if (!username || !email || !password) {
            throw Error('All fields are required.');
        }

        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format.' })
        }

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPw,
            },
        });
        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({ error: 'Failed to create user' });
    }
}

const signin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        const accessToken = jwt.sign({
            id: user.id,
            username: user.username,
            email: user.email
        }, secret_key, { expiresIn: '1h' });

        return res.status(200).json({
            accessToken
        });
    } catch (error) {
        return res.status(400).json({ error: 'Internal server error.' });
    }
}

const me = (req: Request, res: Response) => {
    let token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: "Authentication required. 1" });
    }
    token = token.split(' ')[1];

    jwt.verify(token, secret_key, (err, user) => {
        if (!err) {
            req.user = user as UserPayload;
            res.status(200).json({ id: req.user.id, username: req.user.username })
        } else {
            return res.status(403).json({ message: 'User not authenticated' });
        }
    })
}

export { signup, signin, me }

