import {chromium} from '@playwright/test';
const browser=await chromium.launch({headless:true});
for(const cfg of [{width:1440,height:900,lang:'en'},{width:390,height:844,lang:'fa'}]){
 const page=await browser.newPage({viewport:{width:cfg.width,height:cfg.height},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(lang=>localStorage.setItem('archvanta:language',lang),cfg.lang);
 const response=await page.goto('https://archvanta.github.io/',{waitUntil:'networkidle'});
 await page.locator('#lab').scrollIntoViewIfNeeded();await page.locator('.frontier-preview img').evaluate(i=>i.decode());
 console.log(JSON.stringify({status:response.status(),title:await page.title(),lang:await page.locator('html').getAttribute('lang'),width:cfg.width,overflow:await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),model:await page.locator('.hero .model-svg').count(),concepts:await page.locator('.project-card').count(),frontierLink:await page.locator('.frontier-info a').getAttribute('href'),errors}));
 await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`/tmp/archvanta-live-${cfg.lang}.png`});await page.close();
}
const p=await browser.newPage();const frontier=await p.goto('https://archvanta.github.io/frontier/#/',{waitUntil:'networkidle'});console.log(JSON.stringify({frontierStatus:frontier.status(),frontierTitle:await p.title()}));await browser.close();
