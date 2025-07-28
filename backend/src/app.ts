import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import authRoutes from './routes/auth.route';
import dashboardRoutes from './routes/dashboard.route';
import eventRoutes from './routes/event.route';
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // 1. Konfigurasi dotenv untuk memuat variabel dari .env file

import connectDB from './config/database';
const app: Application = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


app.use('/api', authRoutes);

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/event', eventRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Berhasil masuk API BSLC' });
});


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {  
  console.error(err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan pada server!', error: err.message });
});

const PORT: string | number = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server backend berjalan pada port ${PORT}`);
});

export default app;