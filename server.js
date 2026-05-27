const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const { Resend } = require("resend");

const resend = new Resend("re_YhLtn64f_64AkKg46vX3mmcriWwqXqKNF");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

app.post("/send-report", upload.single("pdf"), async (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);
  try {
    const email = req.body?.email;
const cc = req.body?.cc;
const subject = req.body?.subject;
const text = req.body?.text;
if (!email) {
  console.log("Email mancante:", req.body);
  return res.status(400).json({ error: "Email mancante" });
}
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "File mancante" });
    }

    const fileBuffer = fs.readFileSync(file.path);

    await resend.emails.send({
      from: "Remach <info@remach-solutions.it>",
      to: email,
      cc: cc,
      subject: subject,
      text: text,
      attachments: [
        {
          filename: file.originalname,
          content: fileBuffer
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server attivo su", PORT);
});