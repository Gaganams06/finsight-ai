import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function generatePdf() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Helvetica, Arial, sans-serif; font-size: 11px; color: #1e293b; margin: 30px; }
      .header { border-bottom: 2px solid #003366; padding-bottom: 12px; margin-bottom: 18px; }
      .bank-title { font-size: 18px; font-weight: bold; color: #003366; }
      .meta { font-size: 10px; color: #475569; margin-top: 4px; line-height: 1.4; }
      table { width: 100%; border-collapse: collapse; margin-top: 15px; }
      th { background-color: #003366; color: white; text-align: left; padding: 6px 8px; font-size: 10px; font-weight: bold; }
      td { border-bottom: 1px solid #e2e8f0; padding: 6px 8px; font-size: 10px; }
      .text-right { text-align: right; }
      .text-bold { font-weight: bold; }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="bank-title">CANARA BANK - STATEMENT OF ACCOUNT</div>
      <div class="meta">
        <strong>Account Name:</strong> PRIYA RAMACHANDRAN &nbsp;&nbsp;|&nbsp;&nbsp;
        <strong>Account No:</strong> 0418101089234<br/>
        <strong>Branch:</strong> JAYANAGAR BANGALORE &nbsp;&nbsp;|&nbsp;&nbsp;
        <strong>IFSC:</strong> CNRB0000418<br/>
        <strong>Period:</strong> 01-Jan-2024 to 31-Mar-2024
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th class="text-right">Debit (₹)</th>
          <th class="text-right">Credit (₹)</th>
          <th class="text-right">Balance (₹)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>01/01/2024</td><td>SALARY CREDIT MICROSOFT INDIA JAN24</td><td class="text-right">-</td><td class="text-right">125,000.00</td><td class="text-right">165,000.00</td></tr>
        <tr><td>03/01/2024</td><td>NEFT DR HOUSE RENT JAN24</td><td class="text-right">26,000.00</td><td class="text-right">-</td><td class="text-right">139,000.00</td></tr>
        <tr><td>05/01/2024</td><td>ACH DR ZERODHA BROKING MUTUAL FUND</td><td class="text-right">15,000.00</td><td class="text-right">-</td><td class="text-right">124,000.00</td></tr>
        <tr><td>07/01/2024</td><td>NACH DR CANARA HOME LOAN EMI</td><td class="text-right">18,500.00</td><td class="text-right">-</td><td class="text-right">105,500.00</td></tr>
        <tr><td>10/01/2024</td><td>UPI/DR/BESCOM ELECTRICITY/bescom@sbi</td><td class="text-right">1,650.00</td><td class="text-right">-</td><td class="text-right">103,850.00</td></tr>
        <tr><td>14/01/2024</td><td>UPI/DR/SWIGGY BANGALORE/swiggy@icici</td><td class="text-right">720.00</td><td class="text-right">-</td><td class="text-right">103,130.00</td></tr>
        <tr><td>18/01/2024</td><td>POS DR NETFLIX SERVICES MUMBAI</td><td class="text-right">649.00</td><td class="text-right">-</td><td class="text-right">102,481.00</td></tr>
        <tr><td>22/01/2024</td><td>UPI/DR/BLINKIT GROCERIES/blinkit@axis</td><td class="text-right">1,950.00</td><td class="text-right">-</td><td class="text-right">100,531.00</td></tr>
        <tr><td>01/02/2024</td><td>SALARY CREDIT MICROSOFT INDIA FEB24</td><td class="text-right">-</td><td class="text-right">125,000.00</td><td class="text-right">225,531.00</td></tr>
        <tr><td>03/02/2024</td><td>NEFT DR HOUSE RENT FEB24</td><td class="text-right">26,000.00</td><td class="text-right">-</td><td class="text-right">199,531.00</td></tr>
        <tr><td>05/02/2024</td><td>ACH DR ZERODHA BROKING MUTUAL FUND</td><td class="text-right">15,000.00</td><td class="text-right">-</td><td class="text-right">184,531.00</td></tr>
        <tr><td>07/02/2024</td><td>NACH DR CANARA HOME LOAN EMI</td><td class="text-right">18,500.00</td><td class="text-right">-</td><td class="text-right">166,031.00</td></tr>
        <tr><td>12/02/2024</td><td>POS DR CROMA ELECTRONICS / TV GADGET</td><td class="text-right">38,990.00</td><td class="text-right">-</td><td class="text-right">127,041.00</td></tr>
        <tr><td>18/02/2024</td><td>POS DR NETFLIX SERVICES MUMBAI</td><td class="text-right">649.00</td><td class="text-right">-</td><td class="text-right">126,392.00</td></tr>
        <tr><td>24/02/2024</td><td>UPI/DR/ZEPTO DELIVERY/zepto@icici</td><td class="text-right">1,480.00</td><td class="text-right">-</td><td class="text-right">124,912.00</td></tr>
        <tr><td>01/03/2024</td><td>SALARY CREDIT MICROSOFT INDIA MAR24</td><td class="text-right">-</td><td class="text-right">125,000.00</td><td class="text-right">249,912.00</td></tr>
        <tr><td>03/03/2024</td><td>NEFT DR HOUSE RENT MAR24</td><td class="text-right">26,000.00</td><td class="text-right">-</td><td class="text-right">223,912.00</td></tr>
        <tr><td>05/03/2024</td><td>ACH DR ZERODHA BROKING MUTUAL FUND</td><td class="text-right">15,000.00</td><td class="text-right">-</td><td class="text-right">208,912.00</td></tr>
        <tr><td>07/03/2024</td><td>NACH DR CANARA HOME LOAN EMI</td><td class="text-right">18,500.00</td><td class="text-right">-</td><td class="text-right">190,412.00</td></tr>
        <tr><td>18/03/2024</td><td>POS DR NETFLIX SERVICES MUMBAI</td><td class="text-right">649.00</td><td class="text-right">-</td><td class="text-right">189,763.00</td></tr>
        <tr><td>28/03/2024</td><td>POS DR SHELL PETROL FUEL</td><td class="text-right">2,800.00</td><td class="text-right">-</td><td class="text-right">186,963.00</td></tr>
      </tbody>
    </table>
  </body>
  </html>
  `;

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  const targetPdf = path.resolve(__dirname, '..', 'samples', 'sample_statement_canara.pdf');
  await page.pdf({
    path: targetPdf,
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
  });

  console.log(`✅ Generated sample PDF statement at ${targetPdf}`);
  await browser.close();
}

generatePdf();
