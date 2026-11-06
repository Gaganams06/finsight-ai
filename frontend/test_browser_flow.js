import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARTIFACT_DIR = 'C:\\Users\\Pavan\\.gemini\\antigravity\\brain\\4e579ae8-a3fc-4105-942a-2b0ac09bcaef';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runBrowserTest() {
  console.log('🚀 Launching headless Chrome for Finsight AI end-to-end verification...');
  
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1440,900']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Step 1: Visit Landing Page
    console.log('📍 Navigating to http://127.0.0.1:5173...');
    await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle0', timeout: 15000 });

    // Check title
    const title = await page.title();
    console.log(`✅ Page Title: "${title}"`);

    // Screenshot 1: Landing Page
    const landingShot = path.join(ARTIFACT_DIR, 'screenshot_landing.png');
    await page.screenshot({ path: landingShot, fullPage: false });
    console.log(`📸 Saved landing screenshot to ${landingShot}`);

    // Step 2: Test "Try with sample data" flow
    console.log('⚡ Clicking "Try with Sample Data" button...');
    const sampleBtn = await page.waitForSelector('button ::-p-text(Try with Sample Data)', { timeout: 5000 });
    await sampleBtn.click();

    // Wait for dashboard to load (Health score gauge is rendered)
    console.log('⏳ Waiting for analysis dashboard to populate...');
    await page.waitForSelector('h3 ::-p-text(Financial Health Score)', { timeout: 10000 });
    await new Promise((r) => setTimeout(r, 1500)); // allow chart animation to complete

    // Screenshot 2: Sample Dashboard
    const dashShot = path.join(ARTIFACT_DIR, 'screenshot_sample_dashboard.png');
    await page.screenshot({ path: dashShot, fullPage: false });
    console.log(`📸 Saved sample dashboard screenshot to ${dashShot}`);

    // Step 3: Test Report Modal
    console.log('⚡ Opening Print Report Modal...');
    const reportBtn = await page.waitForSelector('button ::-p-text(Download Report)', { timeout: 5000 });
    await reportBtn.click();
    await page.waitForSelector('#printable-report', { timeout: 5000 });
    await new Promise((r) => setTimeout(r, 800));

    // Screenshot 3: Report Modal
    const reportShot = path.join(ARTIFACT_DIR, 'screenshot_report_modal.png');
    await page.screenshot({ path: reportShot, fullPage: false });
    console.log(`📸 Saved report modal screenshot to ${reportShot}`);

    // Close Modal
    console.log('⚡ Closing report modal...');
    const closeBtn = await page.waitForSelector('#printable-report ~ * button, .no-print button:last-child');
    await closeBtn.click();
    await new Promise((r) => setTimeout(r, 500));

    // Step 4: Reset & Upload CSV File
    console.log('⚡ Clicking "Upload Another" / Reset button...');
    const resetBtn = await page.waitForSelector('button ::-p-text(Upload Another)', { timeout: 5000 });
    await resetBtn.click();

    // Upload SBI CSV statement
    console.log('⚡ Uploading SBI CSV Statement from /samples/sample_statement_sbi.csv...');
    const fileInput = await page.waitForSelector('input[type="file"]');
    const sbiCsvPath = path.resolve(__dirname, '..', 'samples', 'sample_statement_sbi.csv');
    await fileInput.uploadFile(sbiCsvPath);

    // Wait for SBI dashboard to appear
    console.log('⏳ Waiting for SBI statement analysis...');
    await page.waitForSelector('h3 ::-p-text(Financial Health Score)', { timeout: 10000 });
    await new Promise((r) => setTimeout(r, 1500));

    // Verify SBI bank badge
    const pageText = await page.evaluate(() => document.body.innerText);
    const detectedSbi = pageText.includes('State Bank of India') || pageText.includes('SBI');
    console.log(`✅ SBI Bank Detected on Dashboard: ${detectedSbi}`);

    // Screenshot 4: SBI CSV Upload Dashboard
    const csvShot = path.join(ARTIFACT_DIR, 'screenshot_csv_upload.png');
    await page.screenshot({ path: csvShot, fullPage: false });
    console.log(`📸 Saved SBI CSV upload screenshot to ${csvShot}`);

    // Step 5: Upload HDFC XLSX statement
    console.log('⚡ Clicking "Upload Another" to test XLSX...');
    const resetBtn2 = await page.waitForSelector('button ::-p-text(Upload Another)', { timeout: 5000 });
    await resetBtn2.click();

    console.log('⚡ Uploading HDFC XLSX Statement from /samples/sample_statement_hdfc.xlsx...');
    const fileInput2 = await page.waitForSelector('input[type="file"]');
    const hdfcXlsxPath = path.resolve(__dirname, '..', 'samples', 'sample_statement_hdfc.xlsx');
    await fileInput2.uploadFile(hdfcXlsxPath);

    // Wait for HDFC dashboard to appear
    console.log('⏳ Waiting for HDFC XLSX analysis...');
    await page.waitForSelector('h3 ::-p-text(Financial Health Score)', { timeout: 10000 });
    await new Promise((r) => setTimeout(r, 1500));

    const pageText2 = await page.evaluate(() => document.body.innerText);
    const detectedHdfc = pageText2.includes('HDFC');
    console.log(`✅ HDFC Bank Detected on Dashboard: ${detectedHdfc}`);

    // Screenshot 5: HDFC XLSX Upload Dashboard
    const xlsxShot = path.join(ARTIFACT_DIR, 'screenshot_xlsx_upload.png');
    await page.screenshot({ path: xlsxShot, fullPage: false });
    console.log(`📸 Saved HDFC XLSX upload screenshot to ${xlsxShot}`);

    console.log('🎉 ALL BROWSER FLOW TESTS COMPLETED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ Browser test failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runBrowserTest();
