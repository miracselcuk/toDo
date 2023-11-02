import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const createTask = async (req: Request, res: Response) => {
    const { title, description } = req.body;
    const currentUser = req.user;
    try {
        if (!currentUser) {
            return res.status(401).json({ error: 'Authentication required.' });
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                owner: {
                    connect: { id: currentUser.id },
                },
            },
        });

        const tasks = await prisma.task.findMany({
            where: {
                ownerId: currentUser?.id,
            },
            orderBy: [
                { completed: 'asc' },
                { createdAt: 'desc' },
            ],
        });

        res.status(201).json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task.' });
    }
}

const showOwnTasks = async (req: Request, res: Response) => {
    const currentUser = req.user;
    try {
        if (!currentUser) {
            return res.status(401).json({ error: 'Authentication required.' });
        }

        const tasks = await prisma.task.findMany({
            where: {
                ownerId: currentUser?.id,
            },
            orderBy: [
                { completed: 'asc' },
                { createdAt: 'desc' },
            ],
        });
        res.status(201).json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'A problem has been encountered.' });
    }
}

const editTask = async (req: Request, res: Response) => {
    const currentUser = req.user;
    const taskId = parseInt(req.params.taskId);

    try {
        if (isNaN(taskId)) {
            return res.status(400).json({ error: 'Invalid task id format.' });
        }

        if (!currentUser) {
            return res.status(401).json({ error: 'Authentication required.' });
        }

        const task = await prisma.task.findUnique({
            where: {
                id: taskId,
            },
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found.' });
        }

        if (task.ownerId !== currentUser.id) {
            return res.status(403).json({ error: 'You do not have permission to update this task.' });
        }

        let updatedTask;
        let updatedTaskData = {};

        if (!req.body || Object.keys(req.body).length === 0) {
            updatedTaskData = {
                completed: !task.completed,
                completedAt: !task.completed ? new Date() : null,
            };
        } else {
            updatedTaskData = {
                title: req.body.title,
                description: req.body.description,
            };
        }

        updatedTask = await prisma.task.update({
            where: {
                id: taskId,
            },
            data: updatedTaskData,
        });

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'A problem has been encountered.' });
    }
};

const showTasks = async (req: Request, res: Response) => {
    const currentUser = req.user;
    const username_ = req.params.username;
    try {
        if (!currentUser) {
            return res.status(401).json({ error: 'Authentication required.' });
        }
        if (username_ === currentUser.username) {
            const tasks = await prisma.task.findMany({
                where: {
                    ownerId: currentUser?.id,
                },
                orderBy: [
                    { completed: 'asc' },
                    { createdAt: 'desc' },
                ],
            });
            return res.status(200).json({ tasks })
        }
        const user = await prisma.user.findFirst({
            where: {
                username: username_,
            },
        });
        if (!user) {
            return res.status(402).json({ error: 'There is no such user.' });
        }
        const isFriend = await prisma.user.findFirst({
            where: {
                id: currentUser.id,
                friends: {
                    some: {
                        username: username_,
                    },
                },
            },
        });
        if (!isFriend) {
            return res.status(403).json({ error: "The person you're looking at is not your friend." });
        }
        const tasks = await prisma.user.findFirst({
            where: {
                username: username_,
            },
            select: {
                tasks: {
                    orderBy: [
                        { completed: 'asc' },
                        { createdAt: 'desc' },
                    ],
                },
            },
        });
        return res.status(200).json(tasks)
    } catch (error) {
        res.status(500).json({ error: 'A problem has been encountered.' });
    }
}


export { createTask, showOwnTasks, editTask, showTasks }