const QRCode = require("qrcode");
const path = require("path");
const puppeteer = require("puppeteer");
const fs = require("fs");

/* ---------------- QR CODE (SVG STRING) ---------------- */
exports.generateQRCode = async (verificationUrl, certificateId) => {

  const fileName = `qr-${certificateId}.png`;

  const filePath = path.join(
    __dirname,
    `../../uploads/${fileName}`
  );

  await QRCode.toFile(filePath, verificationUrl, {
    margin: 1,
    width: 300,
  });

  // RETURN PUBLIC URL
  return `/uploads/${fileName}`;
};

exports.generateCertificateImage = async ({
  product,
  certificateId,
  qrPath,
}) => {
  const SCALE = 4;
  const WIDTH_MM = 87 * SCALE;
  const HEIGHT_MM = 52 * SCALE;

  const logoUrl = "http://localhost:5000/uploads/logo.png";
  const productImage = product.image ? `http://localhost:5000/${product.image}` : null;

  const html = `
<!DOCTYPE html>
<html>
<head>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Inter:wght@400;600;700&display=swap');

  body {
    margin: 0;
    padding: 0;
    background: #fff;
    font-family: 'Inter', sans-serif;
  }

  .card {
    width: ${WIDTH_MM}mm;
    height: ${HEIGHT_MM}mm;
    box-sizing: border-box;
    background: #FDFBFA;
    border: 5px solid #0F172A; /* Thick Navy Outer */
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* Thin Gold Inner Border */
  .card::after {
    content: '';
    position: absolute;
    top: 5px; left: 5px; right: 5px; bottom: 5px;
    border: 1.5px solid #C5A059;
    pointer-events: none;
  }

  /* ================= HEADER ================= */
  .header {
    display: flex;
    align-items: center; 
    justify-content: space-between;
    padding: 20px 30px;
    background: #fff;
    border-bottom: 2px solid #C5A059;
    z-index: 2;
    height: 110px; /* Fixed height keeps the center point consistent */
  }

  .logo {
    width: 105px;
    height: 105px;
    object-fit: contain;
    margin-right: 20px;
  }

  .brand-text {
    flex-grow: 1;
  }

  .brand-name {
    font-family: 'Cinzel', serif;
    font-size: 32px;
    color: #0F172A;
    letter-spacing: 1px;
    margin-bottom: 2px;
  }

  .brand-sub {
    font-size: 14px;
    color: #64748B;
    text-transform: uppercase;
    font-weight: 600;
  }

  .cert-badge {
    text-align: right;
    border-left: 2px solid #E2E8F0;
    padding-left: 25px;
    min-width: 200px; /* This "locks" the border in place */
    display: flex;
    flex-direction: column;
    justify-content: center; /* Vertically centers the text inside the badge */
    height: 70px; /* Height of the vertical line */
  }

  .cert-label {
    font-size: 11px; /* Slightly smaller looks more "luxury" */
    color: #C5A059;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 2px;
  }

  .cert-number {
    font-size: 20px;
    font-weight: 800;
    color: #0F172A;
    line-height: 1;
  }

  /* ================= MAIN BODY ================= */
  .main {
    display: flex;
    flex: 1;
    padding: 20px;
    gap: 20px;
    z-index: 2;
  }

  /* LEFT SIDE: Image & QR */
  .sidebar {
    width: 260px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start; /* Keeps them aligned to top */
    gap: 40px; /* Adjust this value (e.g., 50px, 60px) to increase/decrease the gap */
  }

  .product-image-container {
    width: 220px;
    height: 220px;
    background: #fff;
    border: 1px solid #C5A059;
    box-shadow: 0 10px 25px rgba(0,0,0,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0px;
    overflow: hidden;
  }

  .product-image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .qr-container {
    text-align: center;
  }

  .qr-container img {
    width: 120px;
    height: 120px;
    border: 1px solid #0F172A;
    padding: 5px;
    background: #fff;
  }

  .qr-hint {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    margin-top: 5px;
    color: #0F172A;
  }

  /* RIGHT SIDE: All Data Fields */
  .data-grid {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: min-content;
    gap: 18px 20px;
  }

  .field {
    border-bottom: 1px solid #E2E8F0;
    padding-bottom: 4px;
  }

  .label {
    display: block;
    font-size: 12px;
    text-transform: uppercase;
    color: #C5A059;
    font-weight: 800;
    margin-bottom: 2px;
  }

  .value {
    font-size: 18px;
    font-weight: 600;
    color: #0F172A;
  }

  /* Full width fields */
  .full-width {
    grid-column: span 2;
  }

  .comment-box {
    margin-top: 10px;
    background: rgba(197, 160, 89, 0.08);
    padding: 10px;
    border-radius: 4px;
    border-left: 3px solid #C5A059;
  }

  /* ================= FOOTER ================= */
  .footer {
    background: #0F172A;
    padding: 15px;
    text-align: center;
    color: #C5A059;
  }

  .conclusion {
    font-family: 'Cinzel', serif;
    font-size: 20px;
    letter-spacing: 1px;
  }

</style>
</head>
<body>
  <div class="card">
    <div class="header">
      <img src="${logoUrl}" class="logo" />
      <div class="brand-text">
        <div class="brand-name">GEMS & RUDRAKSH TESTING LAB</div>
        <div class="brand-sub">ISO 9001:2015 Certified • Rishikesh, UK</div>
      </div>
      <div class="cert-badge">
        <div class="cert-label">Report Number</div>
        <div class="cert-number">${certificateId}</div>
      </div>
    </div>

    <div class="main">
      <div class="sidebar">
        <div class="product-image-container">
          ${productImage ? `<img src="${productImage}" />` : '<span style="color:#ccc">NO IMAGE</span>'}
        </div>
        <div class="qr-container">
          <img src="http://localhost:5000${qrPath}" />
          <div class="qr-hint">Scan to Verify Report</div>
        </div>
      </div>

      <div class="data-grid">
        <div class="field"><span class="label">Weight</span><span class="value">${product.weightGrams}</span></div>
        <div class="field"><span class="label">Shape</span><span class="value">${product.shape || "-"}</span></div>
        <div class="field"><span class="label">Color</span><span class="value">${product.color || "-"}</span></div>
        <div class="field"><span class="label">Measurement</span><span class="value">${product.measurement || "N/A"}</span></div>
        
        <div class="field"><span class="label">Mounted Status</span><span class="value">${product.mounted ? "Mounted in Metal" : "Loose Specimen"}</span></div>
        
        <div class="field"><span class="label">Faces (Mukhi)</span><span class="value">${product.faces || "-"}</span></div>
        <div class="field"><span class="label">X-Ray Analysis</span><span class="value">${product.xRays || "-"}</span></div>
        <div class="field"><span class="label">Test Type</span><span class="value">${product.test || "Standard Lab Test"}</span></div>
        
        <div class="field full-width"><span class="label">Created Faces</span><span class="value">${product.createdFace || "None Detected"}</span></div>

        <div class="comment-box full-width">
          <span class="label">Expert Comments</span>
          <span class="value" style="font-size: 14px; font-style: italic;">${product.comments || "All beads are confirmed natural."}</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="conclusion">IDENTIFIED AS: ${product.identification || "N/A"}</div>
    </div>
  </div>
</body>
</html>
`;

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  
  // Set high resolution viewport
  await page.setViewport({
    width: 1400,
    height: 900,
    deviceScaleFactor: 2,
  });

  await page.setContent(html, { waitUntil: "networkidle0" });

  const outputPath = path.join(__dirname, `../../uploads/cert-${certificateId}.png`);
  
  // Take screenshot of only the card
  const element = await page.$('.card');
  await element.screenshot({ path: outputPath });

  await browser.close();
  return `/uploads/cert-${certificateId}.png`;
};