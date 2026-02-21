import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('Navigating to game...');
  await page.goto('http://127.0.0.1:5174');
  
  await page.waitForTimeout(10000); 
  
  await browser.close();
})();
