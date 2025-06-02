import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';

// 1. Konfigurasi dotenv untuk memuat variabel dari .env file
// Pastikan .env ada di root folder 'backend/'
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import connectDB from './config/database';
const app: Application = express();
connectDB();

// 2. Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 3. Rute Dasar (Contoh)
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Selamat datang di API Event Management!' });
});

// TODO: Tambahkan rute API utama di sini nanti
// import mainApiRoutes from './routes';
// app.use('/api/v1', mainApiRoutes);

// 4. Middleware Penanganan Error (Contoh Sederhana)
// Harus diletakkan setelah semua rute
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan pada server!', error: err.message });
});

// 5. Jalankan Server
const PORT: string | number = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server backend berjalan pada port ${PORT}`);
});

export default app;