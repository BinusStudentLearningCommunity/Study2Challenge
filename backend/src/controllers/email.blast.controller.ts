import { Request, Response } from "express";
import { EmailBlast } from "../models/email.blast.model";
import nodemailer from "nodemailer";

// Configure nodemailer with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // you'll need to set this in .env
    pass: process.env.GMAIL_APP_PASSWORD, // you'll need to set this in .env
  },
});

export const getAllEmails = async (req: Request, res: Response) => {
  try {
    const emails = await EmailBlast.find();
    res.status(200).json({
      success: true,
      message: "Emails fetched successfully",
      emailBlasts: emails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch emails",
    });
  }
};

export const addEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const newEmail = new EmailBlast({
      email,
      isEmailSent: false,
    });
    await newEmail.save();

    res.status(201).json({
      success: true,
      message: "Email added successfully",
      emailBlast: newEmail,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add email",
    });
  }
};

export const sendBlastEmail = async (req: Request, res: Response) => {
  try {
    // Get all unsent emails
    const unsentEmails = await EmailBlast.find({ isEmailSent: false });

    // Email content from request body
    const { subject, content } = req.body;

    // Send emails
    for (const emailDoc of unsentEmails) {
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: emailDoc.email,
        subject,
        html: content,
      });

      // Update email status
      await EmailBlast.findByIdAndUpdate(emailDoc._id, { isEmailSent: true });
    }

    res.status(200).json({
      success: true,
      message: `Successfully sent emails to ${unsentEmails.length} recipients`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send blast emails",
    });
  }
};
