'use strict';
(async()=>{
  const phase=new URLSearchParams(location.search).get('friendTests')||'owner';
  const report={phase,assertions:[],failures:[],errors:[],startedAt:new Date().toISOString()};
  const check=(name,passed,details)=>{report.assertions.push({name,passed:!!passed,...(details?{details}:{})});if(!passed)report.failures.push(name);};
  const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b), $=id=>document.getElementById(id), click=id=>$(id).click();
  const wait=async(predicate)=>{for(let n=0;n<200;n++){if(predicate())return;await new Promise(resolve=>setTimeout(resolve,10));}throw new Error('Timed out waiting for UI');};
  const rawEncode=value=>btoa(JSON.stringify(value)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  const payloadOf=url=>FriendsQA.decode(new URL(url).hash.slice(8));
  window.addEventListener('error',e=>report.errors.push(e.message));window.addEventListener('unhandledrejection',e=>report.errors.push(String(e.reason)));
  try {
    check('Friend extension initialized',!!window.FriendsQA && !!window.OddlingsMaker);
    if(phase==='owner'){
      click('mode-friends');
      OddlingsQA.configureOddling({body:3,face:1,limbs:2,deco:4,color:'#e25988',name:'Never link this name'});
      click('friend-primary'); report.invite=$('friend-link').value;report.owner=FriendsQA.getRoute();
      check('Owner produces versioned invite containing exact art',payloadOf(report.invite).k==='invite'&&equal(payloadOf(report.invite).me,[3,1,2,4,'#e25988']));
      check('Optional name omitted from URL and payload',!atob(new URL(report.invite).hash.slice(8).replace(/-/g,'+').replace(/_/g,'/')).includes('Never link')&&!location.href.includes('Never'));
      check('Owner reload URL retains exact art and generated-link state',FriendsQA.routeFromHash(location.hash).k==='self'&&FriendsQA.routeFromHash(location.hash).ready&&equal(FriendsQA.routeFromHash(location.hash).me,report.owner.me));
      report.ownerUrl=location.href;
      const first=$('friend-link').value;OddlingsQA.configureOddling({face:5});check('Changing owner art updates invite link',first!==$('friend-link').value&&payloadOf($('friend-link').value).me[1]===5);
      OddlingsQA.configureOddling({face:1});
      let writes=0;FriendsQA.setPlatform({clipboard:async link=>{writes++;check('Clipboard receives only the visible invite',link===$('friend-link').value);}});click('copy-link');await wait(()=>!$('copy-link').disabled);check('Copy success',writes===1&&$('flow-status').textContent.includes('복사했어요'));
      FriendsQA.setPlatform({clipboard:async()=>{throw new Error('denied');}});click('copy-link');await wait(()=>!$('copy-link').disabled);check('Clipboard failure selects full link and gives manual alternative',document.activeElement===$('friend-link')&&$('friend-link').selectionStart===0&&$('friend-link').selectionEnd===$('friend-link').value.length&&$('flow-status').textContent.includes('직접 복사'));
      FriendsQA.setPlatform({share:async()=>{throw new DOMException('canceled','AbortError');}});click('share-link');await wait(()=>!$('share-link').disabled);check('Share cancellation retains usable link and copy button',$('flow-status').textContent.includes('취소')&&$('friend-link').value===report.invite&&!$('copy-link').disabled);
      FriendsQA.setPlatform({share:async()=>{throw new Error('denied');}});click('share-link');await wait(()=>!$('share-link').disabled);check('Share failure explains copy fallback',$('flow-status').textContent.includes('복사해서')&&!$('share-link').disabled);
      FriendsQA.setPlatform(null);
      $('reply-input').value='https://example.com/#friend=x';$('open-reply').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));check('Unrelated reply origin rejected without navigation',FriendsQA.getRoute().k==='self'&&$('flow-status').textContent.includes('답장 링크'));
      report.invite=$('friend-link').value;report.ownerUrl=location.href;
      const returned={v:1,k:'reply',l:'ko',me:payloadOf(report.invite).me,friend:[0,5,3,3,'#37b7be']};$('reply-input').value=FriendsQA.linkFor(returned);$('open-reply').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));check('Owner opens a received reply through the paste control',FriendsQA.getRoute().k==='reply'&&equal(FriendsQA.getRoute().me,returned.me)&&equal(FriendsQA.getRoute().friend,returned.friend));
    } else if(phase==='friend'){
      const incoming=FriendsQA.getRoute();report.original=copyArt(incoming.me);
      check('Fresh recipient sees invite editor',incoming.k==='invite'&&!document.querySelector('.workbench').hidden);
      check('Owner view absent from DOM before friend finishes',$('self-view-art').children.length===0&&$('friend-view-art').children.length===0&&$('comparison').hidden);
      OddlingsQA.configureOddling({body:0,face:5,limbs:3,deco:3,color:'#37b7be',name:'Friend secret name'});
      report.draftUrl=location.href;
      check('Friend draft is represented in current link for reload',equal(FriendsQA.routeFromHash(location.hash).draft,[0,5,3,3,'#37b7be']));
      click('friend-primary');report.reply=$('friend-link').value;report.payload=payloadOf(report.reply);
      check('Reply carries exact original and friend snapshots',report.payload.k==='reply'&&equal(report.payload.me,incoming.me)&&equal(report.payload.friend,[0,5,3,3,'#37b7be']));
      check('Reply reveals exactly two comparison SVGs',$('self-view-art').querySelectorAll('svg').length===1&&$('friend-view-art').querySelectorAll('svg').length===1&&!$('comparison').hidden&&document.querySelector('.workbench').hidden);
      check('Friend name omitted from reply',!atob(new URL(report.reply).hash.slice(8).replace(/-/g,'+').replace(/_/g,'/')).includes('Friend secret'));
      window.history.back();await wait(()=>FriendsQA.getRoute().k==='invite');check('Back restores friend draft and hides original again',OddlingsQA.getState().body===0&&OddlingsQA.getState().color==='#37b7be'&&$('self-view-art').children.length===0);
      window.history.forward();await wait(()=>FriendsQA.getRoute().k==='reply');check('Forward restores exact comparison',equal(FriendsQA.getRoute().friend,[0,5,3,3,'#37b7be']));
      click('edit-friend');check('Edit returns to hidden-original editor',FriendsQA.getRoute().k==='invite'&&$('self-view-art').children.length===0);
      for(let n=0;n<20;n++){click('random');click('friend-primary');check('Repeat reply '+n,FriendsQA.getRoute().k==='reply'&&equal(FriendsQA.getRoute().me,incoming.me));if(n<19)click('edit-friend');}
      FriendsQA.navigate(report.payload);
    } else if(phase==='compare'){
      const r=FriendsQA.getRoute();check('Fresh reply opens comparison with exact art',r.k==='reply'&&$('self-view-art').querySelector('[data-skin]').getAttribute('fill')===r.me[4]&&$('friend-view-art').querySelector('[data-skin]').getAttribute('fill')===r.friend[4]);
      report.payload=r;
      const blob=await FriendsQA.comparisonBlob(r),bitmap=await createImageBitmap(blob),canvas=document.createElement('canvas');canvas.width=bitmap.width;canvas.height=bitmap.height;const ctx=canvas.getContext('2d');ctx.drawImage(bitmap,0,0);
      const bodies=OddlingsQA.getBodies(),pixel=(art,x)=>{const face=bodies[art[0]].face;return [...ctx.getImageData(Math.round(x+face[0]*1.375),Math.round(172+(face[1]+40)*1.375),1,1).data];};
      report.png={bytes:blob.size,width:bitmap.width,height:bitmap.height,leftPixel:pixel(r.me,52),rightPixel:pixel(r.friend,844)};
      const rgb=color=>[1,3,5].map(n=>parseInt(color.slice(n,n+2),16));
      check('Comparison PNG has both independently rendered exact body colors',bitmap.width===1600&&bitmap.height===1000&&blob.size>25000&&equal(report.png.leftPixel.slice(0,3),rgb(r.me[4]))&&equal(report.png.rightPixel.slice(0,3),rgb(r.friend[4])));
      const parsed=new DOMParser().parseFromString(FriendsQA.comparisonSvg(r),'image/svg+xml');check('Comparison SVG is valid XML',!parsed.querySelector('parsererror'));
      bitmap.close();click('language');check('Comparison translates without changing either snapshot',equal(FriendsQA.getRoute().me,r.me)&&equal(FriendsQA.getRoute().friend,r.friend)&&$('comparison-download').textContent==='Save comparison PNG');
      click('language');
      const real=HTMLCanvasElement.prototype.toBlob;try{HTMLCanvasElement.prototype.toBlob=function(callback){callback(null);};click('comparison-download');await wait(()=>!$('comparison-download').disabled);check('Comparison PNG failure explains retry and releases button',$('flow-status').textContent.includes('저장하지 못')&&!$('comparison-download').disabled);}finally{HTMLCanvasElement.prototype.toBlob=real;}
      report.reply=$('friend-link').value;
    } else if(phase==='draft'){
      const r=FriendsQA.getRoute();check('Fresh draft route restores art while original remains hidden',r.k==='invite'&&equal(FriendsQA.snapshot(OddlingsQA.getState()),r.draft)&&$('self-view-art').children.length===0);
    } else if(phase==='self'){
      const r=FriendsQA.getRoute();check('Fresh owner route restores art and invite output',r.k==='self'&&r.ready&&equal(FriendsQA.snapshot(OddlingsQA.getState()),r.me)&&!$('link-result').hidden);
    } else if(phase==='invalid'){
      check('Malformed incoming route shows recovery screen',$('link-error').hidden===false&&document.querySelector('.workbench').hidden&&$('self-view-art').children.length===0);
      click('recover-link');check('Recovery returns to working free maker',FriendsQA.getRoute().k==='free'&&!document.querySelector('.workbench').hidden&&!location.hash);
    } else if(phase==='layout'){
      const params=new URLSearchParams(location.search);if(params.get('lang'))OddlingsMaker.setLanguage(params.get('lang'));if(params.has('zoom'))document.documentElement.classList.add('qa-text-200');
      const width=document.documentElement.clientWidth,height=document.documentElement.clientHeight;
      const elements=[...document.querySelectorAll('header,main,.friend-context,.creation,.parts,.comparison-card,.link-result,button,input,footer')].map(e=>({id:e.id||e.className||e.tagName,tag:e.tagName,r:e.getBoundingClientRect()})).filter(x=>x.r.width>0&&x.r.height>0);
      const outside=elements.filter(x=>x.r.left<-.5||x.r.right>width+.5).map(x=>x.id);const buttons=elements.filter(x=>x.tag==='BUTTON');
      report.layout={lang:document.documentElement.lang,route:FriendsQA.getRoute().k,width,height,scrollWidth:document.documentElement.scrollWidth,outside,minButtonWidth:Math.min(...buttons.map(x=>x.r.width)),minButtonHeight:Math.min(...buttons.map(x=>x.r.height))};
      check('No horizontal scroll or offscreen controls',report.layout.scrollWidth===width&&!outside.length,report.layout);
      check('All visible buttons at least 44px',report.layout.minButtonWidth>=44&&report.layout.minButtonHeight>=44);
      document.querySelector('footer').scrollIntoView({block:'end',behavior:'instant'});await new Promise(resolve=>requestAnimationFrame(resolve));const footer=document.querySelector('footer').getBoundingClientRect();check('Footer fully reachable',footer.top>=0&&footer.bottom<=height+.5,{top:footer.top,bottom:footer.bottom,height});
      if(params.get('shot')!=='bottom')document.documentElement.scrollTop=0;
    } else if(phase==='save'){
      click('comparison-download');await wait(()=>!$('comparison-download').disabled);check('Comparison download action completes without an export error',$('flow-status').textContent.includes('다운로드를 시작')||$('flow-status').textContent.includes('download has started'));
    } else if(phase==='validation'){
      const me=[0,0,0,1,'#ad8bfa'];let rejected=0;
      const bad=[{},[],{v:2,k:'invite',l:'ko',me},{v:1,k:'invite',l:'bad',me},{v:1,k:'bad',l:'ko',me},{v:1,k:'invite',l:'ko',me:[6,0,0,1,'#ad8bfa']},{v:1,k:'invite',l:'ko',me:[0,0,4,1,'#ad8bfa']},{v:1,k:'invite',l:'ko',me:[0,.5,0,1,'#ad8bfa']},{v:1,k:'invite',l:'ko',me:[0,0,0,1,'red']},{v:1,k:'invite',l:'ko',me,name:'Should never pass'},{v:1,k:'reply',l:'ko',me},{v:1,k:'self',l:'ko',me,ready:1},{v:1,k:'invite',l:'ko',me,draft:[0]},{v:1,k:'invite',l:'ko',me,__proto__:null,extra:'x'}];
      for(const value of bad)try{FriendsQA.decode(rawEncode(value));}catch{rejected++;}
      for(const value of ['','!','A','x'.repeat(1025),'eyJ2Ijox'])try{FriendsQA.decode(value);}catch{rejected++;}
      check('Malformed/version/length/part/color/extra-field payloads rejected',rejected===bad.length+5,{rejected,total:bad.length+5});
      let valid=true;for(let body=0;body<6;body++)for(let face=0;face<6;face++)for(let limbs=0;limbs<4;limbs++)for(let deco=0;deco<6;deco++){const payload={v:1,k:'invite',l:'ko',me:[body,face,limbs,deco,'#AaBbCc']};const token=FriendsQA.encode(payload);valid&&=token.length<1024&&FriendsQA.decode(token).me[4]==='#aabbcc';}
      check('All 864 art choices round-trip compact versioned links',valid);
    }
    check('No uncaught browser errors',report.errors.length===0);
  } catch(error){report.failures.push('Harness exception');report.exception=String(error.stack||error);}
  report.passed=report.failures.length===0;const pre=document.createElement('pre');pre.id='friend-test-results';pre.className='qa-report';pre.textContent=JSON.stringify(report);document.body.append(pre);document.documentElement.dataset.qaComplete='true';
  function copyArt(art){return [...art];}
})();
