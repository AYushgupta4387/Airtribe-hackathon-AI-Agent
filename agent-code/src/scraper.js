const puppeteer = require("puppeteer");

async function scrapeTextContent(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  const textContent = await page.evaluate(() => document.body.innerText);
  await browser.close();
  return textContent;
}

module.exports = { scrapeTextContent };
