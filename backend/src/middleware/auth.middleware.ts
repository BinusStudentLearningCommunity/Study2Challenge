import { Response, Request, NextFunction } from "express";
import jwt from 'jsonwebtoken';

interface JwtPayload {
    userId: string;
    email: string;
    iat?: number;
    exp?: number;
}

declare global {
    namespace Express {
        interface Request {
              user?: { userId: string; email: string; };
          }
    }
}

export const authenticationToken = (req: Request, res: Response, next: NextFunction) => {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        return res.status(500).json({ message: 'Server error: Konfigurasi JWT secret tidak ditemukan.' });
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'Unauthorized: Bearer token tidak disediakan.' });
    }

    jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Unauthorized: Token sudah kadaluarsa. Silakan login kembali.' });
            }
            if (err.name === 'JsonWebTokenError') {
                return res.status(403).json({ message: 'Forbidden: Token tidak valid.', error: err.message });
            }
            console.error('JWT verification failed with unexpected error:', err);
            return res.status(500).json({ message: 'Server error: Verifikasi token gagal.', error: err.message });
        }

        const isJwtPayload = (payload: any): payload is JwtPayload => {
            return typeof payload === 'object' && payload !== null && 'userId' in payload && 'email' in payload;
        };

        if (!isJwtPayload(decodedUser)) {
            return res.status(403).json({ message: 'Forbidden: Payload token tidak valid atau tidak lengkap.' });
        }

        req.user = {
            userId: decodedUser.userId,
            email: decodedUser.email,
        };

        next();
    });
};