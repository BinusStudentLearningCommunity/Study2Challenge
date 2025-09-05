import { EmailBlast } from "../models/email.blast.model";
import dotenv from "dotenv";
import connectDB from "../config/database";

dotenv.config();

const addB27Emails = async () => {
  try {
    // Connect to database
    await connectDB();

    // B27 emails
    const b27Emails = [
      { email: "example1@binus.ac.id", binusianAngkatan: 27 },
      { email: "example2@binus.ac.id", binusianAngkatan: 27 },
      // Tambahkan email B27 lainnya di sini
    ];

    // Add to database
    const result = await EmailBlast.insertMany(b27Emails);

    console.log("✅ Successfully added B27 emails:");
    console.log(result);

    // Show total count
    const totalB27 = await EmailBlast.countDocuments({ binusianAngkatan: 27 });
    console.log(`\nTotal B27 emails in database: ${totalB27}`);
  } catch (error) {
    console.error("❌ Error adding B27 emails:", error);
  } finally {
    process.exit(0);
  }
};

// Run the script
addB27Emails();
