import puppeteer from 'puppeteer';

async function capture() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Light Mode Events Page with ?skipIntro=true
  await page.goto('http://127.0.0.1:5173/events?skipIntro=true', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
    localStorage.setItem('bawarchi_theme', 'light');
    sessionStorage.setItem('codechef_intro_seen', 'true');
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: 'screenshot_solari_board_light.png', fullPage: false });

  // 2. Dark Mode Events Page
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
    localStorage.setItem('bawarchi_theme', 'dark');
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: 'screenshot_solari_board_dark.png', fullPage: false });

  // 3. Mobile Viewport (Dark)
  await page.setViewport({ width: 390, height: 844 });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: 'screenshot_solari_board_mobile.png', fullPage: false });

  await browser.close();
  console.log('Solari board screenshots captured successfully!');
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
