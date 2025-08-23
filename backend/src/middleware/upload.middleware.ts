// File: src/middleware/upload.middleware.ts

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// --- START OF VALIDATION ---
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error("!!!!!! FATAL ERROR: Cloudinary environment variables are missing.");
  console.error("Please ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set in your .env file.");
  process.exit(1); // Stop the server from starting if keys are missing
}
// --- END OF VALIDATION ---

console.log("Cloudinary configuration loaded successfully.");

// Configure Cloudinary with validated variables
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 's2c-registrations',
      public_id: `${file.fieldname}-${Date.now()}`,
      allowed_formats: ['jpg', 'png', 'jpeg'],
    };
  },
});

const upload = multer({ storage: storage });

export default upload;