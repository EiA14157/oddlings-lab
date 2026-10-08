import {mkdir,writeFile,readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright-core';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'deliverables','friends-qa');await mkdir(out,{recursive:true});
const chrome=process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const results=[];
const downloads=path.join(out,'downloads');await mkdir(downloads,{recursive:true});
const browser=await chromium.launch({executablePath:chrome,headless:true,args:['--disable-background-networking','--disable-component-update','--disable-sync','--disable-extensions']});
async function run(name,url,width=1440,height=1200,screenshot=false){
  const context=await browser.newContext({viewport:{width,height},acceptDownloads:true});const page=await context.newPage();
  const errors=[];page.on('pageerror',error=>errors.push(String(error)));
  const downloadPromise=name==='comparison-save'?page.waitForEvent('download',{timeout:30000}):null;
  try{
    await page.goto(url,{waitUntil:'load'});await page.locator('#friend-test-results, #qa-report').waitFor({state:'attached',timeout:30000});
    const report=JSON.parse(await page.locator('#friend-test-results, #qa-report').textContent());if(report.passed===undefined)report.passed=report.status==='passed';report.externalRunnerErrors=errors;
    if(downloadPromise){const download=await downloadPromise;await download.saveAs(path.join(downloads,'comparison-'+Date.now()+'.png'));}
    await writeFile(path.join(out,name+'.json'),JSON.stringify(report,null,2));results.push({name,passed:report.passed&&!errors.length,checks:report.assertions.length,failures:report.failures});
    await page.locator('#friend-test-results, #qa-report').evaluateAll(elements=>elements.forEach(e=>e.style.display='none'));
    if(screenshot)await page.screenshot({path:path.join(out,name+'.png'),fullPage:true});
    console.log(JSON.stringify(results.at(-1)));if(!report.passed||errors.length)throw new Error(`${name}: ${JSON.stringify(report)}`);return report;
  }finally{await context.close();}
}
const base='http://127.0.0.1:4176/';
const testUrl=(phase,url=base)=>{const value=new URL(url);value.searchParams.set('qa','');value.searchParams.set('friendTests',phase);return value.href;};
try{
  const owner=await run('owner',testUrl('owner'));
  await run('owner-reload',testUrl('self',owner.ownerUrl));
  const friend=await run('friend-fresh-session',testUrl('friend',owner.invite));
  await run('friend-draft-reload',testUrl('draft',friend.draftUrl));
  const compare=await run('compare-fresh-session',testUrl('compare',friend.reply),1440,1200,true);
  await run('validation',testUrl('validation'));
  for(const [name,hash] of [['truncated','#friend=abc'],['too-long','#friend='+'x'.repeat(1100)],['unknown-version','#friend='+Buffer.from(JSON.stringify({v:2,k:'invite',l:'ko',me:[0,0,0,1,'#ad8bfa']})).toString('base64url')]])await run(name,testUrl('invalid',base+hash));
  await writeFile(path.join(out,'flow-links.json'),JSON.stringify({invite:owner.invite,owner:owner.ownerUrl,draft:friend.draftUrl,reply:compare.reply},null,2));
  await run('maker-regression',base+'?qa&tests');
  for(const [mode,url] of [['self',owner.ownerUrl],['invite',owner.invite],['reply',compare.reply]])for(const [width,height] of [[320,640],[390,844]])for(const lang of ['ko','en']){
    const value=new URL(testUrl('layout',url));value.searchParams.set('lang',lang);const name=`${mode}-${width}-${lang}`;
    const report=await run(name,value.href,width,height,true);
    if(report.layout.width!==width)throw new Error(`${name}: actual content width ${report.layout.width}, requested ${width}`);
  }
  for(const mode of ['self','invite','reply'])for(const lang of ['ko','en']){
    const url=mode==='self'?owner.ownerUrl:mode==='invite'?owner.invite:compare.reply;const value=new URL(testUrl('layout',url));value.searchParams.set('lang',lang);value.searchParams.set('zoom','');await run(`${mode}-320-${lang}-200`,value.href,320,640);
  }
  const before=new Set(await readdir(downloads));await run('comparison-save',testUrl('save',compare.reply));
  const saved=(await readdir(downloads)).filter(name=>!before.has(name)&&name.endsWith('.png'));if(!saved.length)throw new Error('No actual comparison PNG download file confirmed');
  const file=await readFile(path.join(downloads,saved[0]));const png={file:path.join(downloads,saved[0]),bytes:file.length,width:file.readUInt32BE(16),height:file.readUInt32BE(20),signature:file.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))};if(!png.signature||png.width!==1600||png.height!==1000)throw new Error('Downloaded comparison PNG invalid');await writeFile(path.join(out,'download-result.json'),JSON.stringify(png,null,2));console.log(JSON.stringify(png));
}finally{await writeFile(path.join(out,'run-results.json'),JSON.stringify(results,null,2));await browser.close();}
