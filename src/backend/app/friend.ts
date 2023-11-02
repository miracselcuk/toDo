import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const friendList = async (req: Request, res: Response) => {
    const currentUser = req.user;
    try {
        if (!currentUser) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const friends = await prisma.user.findMany({
            where: {
                friends: {
                    some: {
                        id: currentUser.id,
                    },
                },
            },
            select: {
                username: true,
            },
        });
        return res.status(200).json({ friends: friends });
    } catch (error) {
        return res.status(500).json({ error: 'This service is not working for an unknown reason.' });
    }
}

const addFriend = async (req: Request, res: Response) => {
    const currentUser = req.user;
    const username = req.params.username;
    try {
        if (!currentUser) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const user = await prisma.user.findFirst({
            where: {
                username: username,
            },
        });
        if (!user) {
            return res.status(402).json({ error: 'There is no such user.' });
        } else {
            if (username === currentUser.username) {
                return res.status(402).json({ error: "You can't send yourself a friend request." });
            }
            const isFriend = await prisma.user.findFirst({
                where: {
                    id: currentUser.id,
                    friends: {
                        some: {
                            username: user.username,
                        },
                    },
                },
            });
            if (isFriend) {
                return res.status(400).json({ error: 'You are already friends with this user.' });
            }
            const isRequested = await prisma.friendRequest.findFirst({
                where: {
                    fromID: currentUser.id,
                    toID: user.id,
                },
            });
            if (isRequested) {
                return res.status(400).json({ error: 'You have already sent a friend request to this user.' });
            }

            const request = await prisma.friendRequest.create({
                data: {
                    fromID: currentUser.id,
                    toID: user.id,
                    status: "PENDING",
                    fromUsername: currentUser.username,
                },
            });
            return res.status(201).json({ message: "Friend request sent", request: request });
        }
    } catch (error) {
        return res.status(500).json({ error: `Unknown error` });
    }
}

const rejectFriendRequest = async (req: Request, res: Response) => {
    const currentUser = req.user;
    const requestID = parseInt(req.params.requestID);
    try {
        if (!currentUser) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const request = await prisma.friendRequest.findUnique({
            where: {
                id: requestID,
            }
        })
        if (!request) {
            return res.status(404).json({ error: 'Friend request not found.' });
        }
        if (request.toID !== currentUser.id) {
            return res.status(403).json({ error: 'You are not authorized to reject this request.' });
        }
        const updatedRequest = await prisma.friendRequest.update({
            where: {
                id: requestID
            },
            data: {
                status: "REJECTED"
            }
        })
        const deletedRequest = await prisma.friendRequest.delete({
            where: {
                id: requestID
            },
            include: {
                from: {
                    select: {
                        id: true,
                        username: true,
                    }
                },
                to: {
                    select: {
                        id: true,
                        username: true,
                    }
                }
            }
        })
        return res.status(200).json({ message: "Friend request rejected and deleted" })
    } catch (error) {
        return res.status(500).json({ error: `Unknown error` });
    }
}

const acceptFriendRequest = async (req: Request, res: Response) => {
    const currentUser = req.user;
    const requestID = parseInt(req.params.requestID);
    try {
        if (!currentUser) {
            return res.status(401).json({ error: "Authentication required" });
        }
        const request = await prisma.friendRequest.findUnique({
            where: {
                id: requestID,
            },
        });
        if (!request) {
            return res.status(404).json({ error: "Friend request not found" });
        }
        if (request.toID !== currentUser.id) {
            return res.status(403).json({ error: "You are not authorized to accept this request" });
        }
        const updatedRequest = await prisma.friendRequest.update({
            where: {
                id: requestID,
            },
            data: {
                status: "ACCEPTED",
            },
        });
        const friend = await prisma.user.findUnique({
            where: {
                id: request.fromID,
            },
        });
        const updatedUser = await prisma.user.update({
            where: {
                id: currentUser.id,
            },
            data: {
                friends: {
                    connect: {
                        id: friend?.id,
                    },
                },
                friendOf: {
                    connect: {
                        id: friend?.id,
                    },
                },
            },
        });
        const deletedRequest = await prisma.friendRequest.delete({
            where: {
                id: requestID,
            },
            include: {
                from: {
                    include: {
                        friends: true,
                        friendOf: true,
                    },
                },
                to: {
                    include: {
                        friends: true,
                        friendOf: true,
                    },
                },
            },
        });
        return res.status(200).json({ message: "Friend request accepted and user added to friend list, request and related data deleted" });
    } catch (error) {
        return res.status(500).json({ error: `Unknown error` });
    }
};

const requestsList = async (req: Request, res: Response) => {
    const currentUser = req.user;
    try {
        if (!currentUser) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const requests = await prisma.user.findUnique({
            where: {
                id: currentUser.id,
            },
            include: {
                receivedRequests: {
                    where: {
                        toID: currentUser.id,
                    }
                },
            },
        });
        return res.status(200).json({ requests: requests?.receivedRequests });
    } catch (error) {
        return res.status(500).json({ error: `Unknown error` });
    }
}

export { friendList, addFriend, rejectFriendRequest, acceptFriendRequest, requestsList }