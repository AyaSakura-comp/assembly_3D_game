import pkg from '/home/family/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.js'
const { chromium } = pkg

const browser = await chromium.launch()
const page = await browser.newPage()

const errors = []
page.on('console', msg => {
  if (msg.type() === 'error') errors.push(msg.text())
})
page.on('pageerror', err => errors.push('PAGE ERROR: ' + err.message))

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' })
await page.waitForTimeout(3000)

await page.screenshot({ path: '/tmp/debug-screenshot.png', fullPage: true })

const bodyText = await page.evaluate(() => document.body.innerText)
const rootHtml = await page.evaluate(() => document.getElementById('root')?.innerHTML?.slice(0, 500))

console.log('=== Console Errors ===')
errors.forEach(e => console.log(e))

console.log('\n=== Body Text (first 200 chars) ===')
console.log(bodyText.slice(0, 200))

console.log('\n=== #root innerHTML (first 500 chars) ===')
console.log(rootHtml)

await browser.close()
