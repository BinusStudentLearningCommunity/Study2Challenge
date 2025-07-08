import { Request, Response } from "express";

export const getDashboardData = async (req: Request, res: Response) => {
    const user = req.user;

    res.status(200).json({
        message: `Welcome to your dashboard, ${user?.email}!`,
    });
};

// ^^ hanya template code (untuk implement middleware), logic/schema cuman random