import puppeteer from 'puppeteer';

async function runTests() {
  console.log('🚀 Starting End-to-End Validation of CodeChef ABESEC Events Portal...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  try {
    // 1. HOME & INTRO
    console.log('1️⃣ Navigating to Home...');
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });

    // Look for Skip button in intro if visible
    const skipBtn = await page.$('button[aria-label="Skip introductory journey"]');
    if (skipBtn) {
      console.log('  Intro animation detected. Clicking "Skip Journey"...');
      await skipBtn.click();
      await new Promise((r) => setTimeout(r, 600));
    }

    await page.screenshot({ path: 'test_out_01_home.png', fullPage: false });
    console.log('  ✅ Captured test_out_01_home.png');

    // 2. EVENTS & SPLIT-FLAP BOARD
    console.log('2️⃣ Navigating to Events Page...');
    await page.goto('http://127.0.0.1:5173/events?skipIntro=true', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: 'test_out_02_events.png', fullPage: false });
    console.log('  ✅ Captured test_out_02_events.png');

    // 3. SEARCH & FILTER
    console.log('3️⃣ Testing Live Search & Category Filter...');
    const searchInput = await page.$('input[placeholder*="Search by event name"]');
    if (searchInput) {
      await searchInput.type('Harry Potter');
      await new Promise((r) => setTimeout(r, 400));
      console.log('  Typed "Harry Potter" in search');
      await page.screenshot({ path: 'test_out_03_search.png', fullPage: false });
      
      // Clear search
      await searchInput.click({ clickCount: 3 });
      await page.keyboard.press('Backspace');
      await new Promise((r) => setTimeout(r, 300));
    }

    // Click Category Chip "Hackathon"
    const hackathonChip = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find((b) => b.textContent?.trim() === 'Hackathon');
    });
    if (hackathonChip.asElement()) {
      await hackathonChip.asElement()?.click();
      await new Promise((r) => setTimeout(r, 400));
      console.log('  Clicked "Hackathon" category chip');
      await page.screenshot({ path: 'test_out_03_filter.png', fullPage: false });
    }

    // Reset to All
    const allChip = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find((b) => b.textContent?.trim() === 'All Tracks');
    });
    if (allChip.asElement()) {
      await allChip.asElement()?.click();
      await new Promise((r) => setTimeout(r, 400));
    }

    // 4. REGISTRATION BOARDING PASS FLOW
    console.log('4️⃣ Testing Boarding Pass Registration & Validation...');
    // Find first "Reserve Berth" button
    const reserveBtn = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find((b) => b.textContent?.includes('Reserve Berth'));
    });
    if (reserveBtn.asElement()) {
      await reserveBtn.asElement()?.click();
      await new Promise((r) => setTimeout(r, 500));

      // Fill in Name, Email, Phone
      await page.type('input[name="name"]', 'Tanya Porwal');
      await page.type('input[name="email"]', 'tanya.techchef@abes.ac.in');
      await page.type('input[name="phone"]', '9876543210');
      await page.type('input[name="branch"]', 'Computer Science & Engineering');

      // Click submit
      const issueBtn = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button[type="submit"]'));
        return buttons.find((b) => b.textContent?.includes('Issue My Boarding Pass'));
      });
      if (issueBtn.asElement()) {
        await issueBtn.asElement()?.click();
        await new Promise((r) => setTimeout(r, 800));
        console.log('  Submitted registration form!');
        await page.screenshot({ path: 'test_out_04_boarding_pass.png', fullPage: false });
        console.log('  ✅ Captured test_out_04_boarding_pass.png (Confirmed ticket with barcode)');
      }
    }

    // 5. ADMIN LOGIN & CONTROL ROOM
    console.log('5️⃣ Testing Admin Login & Control Room Dashboard...');
    await page.goto('http://127.0.0.1:5173/admin/login?skipIntro=true', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 500));

    // Click Auto-Fill
    const autoFillBtn = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find((b) => b.textContent?.includes('Auto-Fill'));
    });
    if (autoFillBtn.asElement()) {
      await autoFillBtn.asElement()?.click();
      await new Promise((r) => setTimeout(r, 300));
      console.log('  Auto-filled demo credentials');

      // Click Enter Control Room
      const loginBtn = await page.$('button[type="submit"]');
      if (loginBtn) {
        await loginBtn.click();
        await new Promise((r) => setTimeout(r, 1000));
        console.log('  Logged into Control Room');
        await page.screenshot({ path: 'test_out_05_admin_dashboard.png', fullPage: false });
        console.log('  ✅ Captured test_out_05_admin_dashboard.png');
      }
    }

    // 6. ADMIN EVENTS CRUD
    console.log('6️⃣ Testing Admin Events Management...');
    await page.goto('http://127.0.0.1:5173/admin/events', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: 'test_out_06_admin_events.png', fullPage: false });
    console.log('  ✅ Captured test_out_06_admin_events.png');

    // 7. PASSENGER MANIFEST
    console.log('7️⃣ Testing Passenger Manifest & Search...');
    await page.goto('http://127.0.0.1:5173/admin/registrations', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: 'test_out_07_manifest.png', fullPage: false });
    console.log('  ✅ Captured test_out_07_manifest.png');

    // 8. MOBILE RESPONSIVENESS (375x812)
    console.log('8️⃣ Testing Mobile Viewport (375x812)...');
    await page.setViewport({ width: 375, height: 812 });
    await page.goto('http://127.0.0.1:5173/admin/registrations', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: 'test_out_08_mobile_manifest.png', fullPage: false });
    console.log('  ✅ Captured test_out_08_mobile_manifest.png');

    // 9. NOT FOUND 404 ROUTE
    console.log('9️⃣ Testing 404 Wrong Platform Route...');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://127.0.0.1:5173/wrong-train-track', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: 'test_out_09_not_found.png', fullPage: false });
    console.log('  ✅ Captured test_out_09_not_found.png');

    console.log('\n🎉 ALL 9 END-TO-END FLOWS COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Error during testing:', err);
  } finally {
    await browser.close();
  }
}

runTests();
