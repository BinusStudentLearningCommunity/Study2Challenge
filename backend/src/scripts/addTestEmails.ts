import { EmailBlast } from "../models/email.blast.model";
import dotenv from "dotenv";
import connectDB from "../config/database";

dotenv.config();

const addTestEmails = async () => {
  try {
    // Connect to database
    await connectDB();

    // Test emails
    const testEmails = [
      { email: "keziameylani.t2005@gmail.com", isEmailSent: false },
      { email: "kezia.tandapai@binus.ac.id", isEmailSent: false },
    ];

    // Add to database
    const result = await EmailBlast.insertMany(testEmails);

    console.log("✅ Successfully added test emails:");
    console.log(result);
  } catch (error) {
    console.error("❌ Error adding test emails:", error);
  } finally {
    process.exit(0);
  }
};

// Run the script
addTestEmails();
