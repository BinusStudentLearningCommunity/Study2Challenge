import { Request, Response } from 'express';
import User from '../models/user.model';

export const updateUserProfile = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const userId = req.user?.userId;

  if (!name || !email) {
    res.status(400).json({ message: 'Name and email are required' });
    return;
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser && String(existingUser._id) !== userId) {
        res.status(409).json({ message: 'Email is already in use by another account.' });
        return;
    }

    const user = await User.findById(userId);

    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    user.name = name;
    user.email = email;

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating profile', error });
  }
};