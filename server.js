const express = require("express");
const cors = require("cors");
const multer = require("multer");
const nodemailer = require("nodemailer");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

app.post("/send-report", upload.single("pdf"), async (req, res) => {
  try {
    const { email, cc, subject, text } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        error: "File mancante"
      });
    }

    console.log("📩 ARRIVATA RICHIESTA");

    const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 587,
  secure: false,
  auth: {
    user: "info@remach-solutions.it",
    pass: "Betulle24033)(*"
  },
  tls: {
    rejectUnauthorized: false
  }
});

    await transporter.sendMail({
      from: "info@remach-solutions.it",
      to: email,
      cc: cc,
      subject: subject,
      text: text,
      attachments: [
        {
          filename: file.originalname,
          path: file.path
        }
      ]
    });

    fs.unlinkSync(file.path);

    res.json({ ok: true });

  } catch (err) {

    console.log("❌ ERRORE:", err);

    res.status(500).json({
      error: "Errore invio email"
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server attivo su", PORT);
});