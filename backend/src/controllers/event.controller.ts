import { Request, Response } from "express";

export const registerForEvent = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    
    const { teamName, paymentProof } = req.body;

    console.log(`User with ID ${userId} is registering team "${teamName}".`);

    res.status(201).json({ message: "Successfully registered for the event!" });
};

// ^^ hanya template code (untuk implement middleware), logic/schema cuman random