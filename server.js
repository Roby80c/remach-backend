const express = require("express");
const cors = require("cors");
const multer = require("multer");
const nodemailer = require("nodemailer");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());

app.post("/send-report", upload.single("pdf"), async (req, res) => {
  try {
    const { email, cc, subject, text } = req.body;
    const file = req.file;

    console.log("📩 ARRIVATA RICHIESTA");
    console.log(req.body);

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "info@remach-solutions.it",
    pass: "Betulle24033)(*"
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
    res.status(500).json({ error: "Errore invio email" });
  }
});

app.listen(5000, () => {
  console.log("Server attivo http://localhost:5000");
});