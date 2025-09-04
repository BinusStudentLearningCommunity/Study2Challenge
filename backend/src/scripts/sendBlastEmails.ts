import nodemailer from "nodemailer";
import { EmailBlast } from "../models/email.blast.model";
import dotenv from "dotenv";
import connectDB from "../config/database";

dotenv.config();

const sendBlastEmails = async () => {
  try {
    // Connect to database
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected successfully!");

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Get limit from env or use default 800
    const emailLimit = parseInt(process.env.EMAIL_BLAST_LIMIT || "800");
    console.log(`Email limit set to: ${emailLimit}`);

    // Get limited number of unsent emails
    const unsentEmails = await EmailBlast.find({ isEmailSent: false }).limit(
      emailLimit
    );
    console.log(
      `Found ${unsentEmails.length} unsent emails (limited to ${emailLimit})`
    );

    // Email content with embedded image
    const emailContent = {
      subject: "🚀 BSLC Study2Challenge Hackathon 2025 - Open Registration!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <!-- Poster Image -->
          <img src="cid:posterImage" alt="Study2Challenge Poster" style="width: 100%; height: auto; margin-bottom: 20px;">

          <h1 style="color: #1a237e;">🚨 STUDY2CHALLENGE NOW OPEN REGISTRATION!!</h1>

          <p>Hi IT Hunters 👋 Bosan rutinitas yang gitu-gitu aja?<br/>
          Saatnya upgrade skill & buktiin ide brilianmu di Study2Challenge Hackathon 2025! 🌍💡</p>

          <p>Kompetisi ini mengusung tema <strong>"Bridging Global Problems: Tech for a Better Tomorrow"</strong>, mengajak generasi muda menjawab tantangan global lewat teknologi inovatif.</p>

          <h2 style="color: #1a237e;">⚡ WHY YOU SHOULD JOIN??</h2>

          <ul>
            <li>🏆 Total hadiah spektakuler hingga Rp24.000.000</li>
            <li>🎁 Voucher kelas bahasa senilai Rp150.000 (TERBATAS untuk seluruh peserta)</li>
            <li>📜 Sertifikat partisipasi untuk semua peserta</li>
            <li>🧑‍💻 Pengalaman membangun website nyata dari ide timmu</li>
          </ul>

          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p>📅 <strong>Pendaftaran:</strong> 25 Agustus - 21 September 2025<br/>
            👥 <strong>Peserta:</strong> SMA/SMK & Mahasiswa/i seluruh Indonesia<br/>
            💻 100% Online - bisa ikut dari mana aja!<br/>
            💰 <strong>Registrasi:</strong> Rp100.000/tim (1-3 orang)</p>
          </div>

          <p>👉 Jangan cuma baca, ayo share ke temanmu & daftar sekarang sebelum kuota voucher habis!<br/>
          Kamu bisa langsung scan QR code di poster atau daftar melalui link berikut: <a href="https://www.study2challenge.bslc.or.id/" style="color: #1a237e;">https://www.study2challenge.bslc.or.id/</a></p>

          <h3 style="color: #1a237e;">📱Contact Person:</h3>

          <p><strong>👩‍💻Stefani Gifta Ganda (Gifta)</strong><br/>
          WA: 082225295807<br/>
          Line: stefanigifta<br/>
          Email: stefanigiftaganda@gmail.com</p>

          <p><strong>👩‍💻Michele Graciela Dharma (Michele)</strong><br/>
          WA: 087875426871<br/>
          Line: mgrclaa<br/>
          Email: micheledharma9@gmail.com</p>

          <p>✨Follow @study2challenge & @bslc_binus for more info & updates!</p>
        </div>
      `,
      attachments: [
        {
          filename: "study2challenge-poster.jpg",
          path: "src/assets/poster s2c.jpg",
          cid: "posterImage", // This is referenced in the HTML above using cid:posterImage
        },
      ],
    };

    // Send emails
    let successCount = 0;
    let failCount = 0;

    for (const emailDoc of unsentEmails) {
      try {
        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: emailDoc.email,
          subject: emailContent.subject,
          html: emailContent.html,
          attachments: emailContent.attachments,
        });

        // Update email status
        await EmailBlast.findByIdAndUpdate(emailDoc._id, { isEmailSent: true });
        successCount++;
        console.log(`✅ Email sent successfully to ${emailDoc.email}`);
      } catch (error) {
        failCount++;
        console.error(`❌ Failed to send email to ${emailDoc.email}:`, error);
      }
    }

    console.log("\nEmail Blast Summary:");
    console.log(`Total emails processed: ${unsentEmails.length}`);
    console.log(`Successfully sent: ${successCount}`);
    console.log(`Failed: ${failCount}`);
  } catch (error) {
    console.error("Error in email blast process:", error);
  } finally {
    // Disconnect from database
    process.exit(0);
  }
};

// Run the script
sendBlastEmails();
