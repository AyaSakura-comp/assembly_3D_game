import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('Navigating to game...');
  await page.goto('http://127.0.0.1:4173');
  
  // Wait for the Monaco editor to finish loading
  console.log('Waiting for Monaco Editor...');
  await page.waitForFunction(() => {
    const el = document.querySelector('.monaco-editor');
    return el && el.offsetHeight > 0;
  }, { timeout: 30000 });

  // Wait for the Canvas to potentially have something drawn (heuristic: wait a bit more)
  console.log('Waiting for 3D Scene...');
  await page.waitForTimeout(5000); 

  console.log('Capturing screenshot...');
  await page.screenshot({ path: 'screenshot_task3_fixed.jpg', fullPage: true });
  
  await browser.close();
  console.log('Verification complete. Saved to screenshot_task3_fixed.jpg');
})();
