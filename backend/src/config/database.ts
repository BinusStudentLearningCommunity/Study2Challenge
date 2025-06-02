// src/config/database.ts
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.error('Error: MONGODB_URI tidak ditemukan di .env file.');
      process.exit(1);
    }

    await mongoose.connect(mongoURI);

    console.log('MongoDB terhubung berhasil!');

    // Event listener untuk koneksi error setelah koneksi awal berhasil
    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error setelah initial connect: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB terputus.');
    });

  } catch (error: any) {
    console.error(`Error koneksi MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;