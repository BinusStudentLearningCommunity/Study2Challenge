// File: src/app.ts

import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

dotenv.config();

import authRoutes from './routes/auth.route';
import dashboardRoutes from './routes/dashboard.route';
import eventRoutes from './routes/event.route';
import userRoutes from './routes/user.route';
import connectDB from './config/database';

const app: Application = express();
connectDB();

app.use(cors());
app.use(morgan('dev'));

// Route for file uploads. It uses multer, so no JSON parser.
app.use('/api/event', eventRoutes); 

// For all other routes, use the JSON body parser.
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Berhasil masuk API BSLC' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {  
  console.error("GLOBAL ERROR HANDLER:", err.stack || err);
  res.status(500).json({ message: 'Terjadi kesalahan pada server!', error: err.message });
});

const PORT: string | number = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server backend berjalan pada port ${PORT}`);
});

export default app;