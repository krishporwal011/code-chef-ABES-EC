import puppeteer from 'puppeteer';

async function testThemeToggle() {
  console.log('Testing dark/light theme conversion button...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Clear any existing theme preference in localStorage first
  await page.goto('http://127.0.0.1:5173/?skipIntro=true');
  await page.evaluate(() => {
    localStorage.setItem('codechef_theme', 'light');
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
  });
  await page.reload({ waitUntil: 'networkidle0' });

  // 1. Check Light Mode State
  const initialClass = await page.evaluate(() => document.documentElement.className);
  const initialBg = await page.evaluate(() => {
    return window.getComputedStyle(document.body).backgroundColor;
  });
  console.log('Initial documentElement class:', initialClass, 'Body background:', initialBg);

  await page.screenshot({ path: 'test_theme_light.png' });
  console.log('Captured test_theme_light.png');

  // 2. Click Theme Toggle Button
  const toggleBtn = await page.$('button[aria-label*="Switch to"]');
  if (!toggleBtn) {
    console.error('Theme toggle button not found!');
  } else {
    console.log('Clicking theme toggle button...');
    await toggleBtn.click();
    await new Promise((r) => setTimeout(r, 600));

    const toggledClass = await page.evaluate(() => document.documentElement.className);
    const toggledBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    console.log('After toggle documentElement class:', toggledClass, 'Body background:', toggledBg);

    await page.screenshot({ path: 'test_theme_dark.png' });
    console.log('Captured test_theme_dark.png');

    // 3. Click again to toggle back
    console.log('Clicking theme toggle button again to switch back...');
    await toggleBtn.click();
    await new Promise((r) => setTimeout(r, 600));

    const revertedClass = await page.evaluate(() => document.documentElement.className);
    const revertedBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    console.log('After 2nd toggle documentElement class:', revertedClass, 'Body background:', revertedBg);

    await page.screenshot({ path: 'test_theme_back_to_light.png' });
    console.log('Captured test_theme_back_to_light.png');
  }

  await browser.close();
}

testThemeToggle();
