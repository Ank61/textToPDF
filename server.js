const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/generate-pdf", (req, res) => {
  const { text } = req.body;
  const doc = new PDFDocument();
  const filePath = `${__dirname}/output.pdf`;
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=output.pdf");
  doc.pipe(fs.createWriteStream(filePath));
  doc.text(text);
  doc.end();
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
