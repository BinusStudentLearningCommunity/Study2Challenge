import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';

export const register = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body; 

  try {
    const existingUser = await User.findOne({ email }); 
    if (existingUser) {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }
    const hashedPassword = await bcrypt.hash(password, 10); 
    const newUser = new User({ 
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    await newUser.save();

    res.status(201).json({ message: 'Registrasi berhasil' });
  } catch (err) {
    res.status(500).json({ message: 'Registrasi gagal', error: err });
  }
};