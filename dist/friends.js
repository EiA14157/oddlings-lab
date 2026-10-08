'use strict';
(() => {
  const maker = window.OddlingsMaker;
  const $ = id => document.getElementById(id);
  const workbench = document.querySelector('.workbench');
  const copy = value => JSON.parse(JSON.stringify(value));
  const LIMIT = 1024;
  const words = {
    ko: {
      modes: '놀이 선택', free: '자유 만들기', friends: '친구와 비교',
      selfHeading: '내가 보는 나를 만들어요', selfNote: '나를 닮은 엉뚱이를 만들고 친구에게 초대 링크를 보내세요.',
      inviteHeading: '친구가 어떤 엉뚱이로 보이나요?', inviteNote: '초대한 친구를 떠올리며 만들어 주세요. 완성하면 두 모습을 함께 볼 수 있어요.',
      replyHeading: '두 시선, 같은 엉뚱이', replyNote: '두 모습을 비교하고 PNG로 저장해 보세요. 같은 링크를 보내면 이 비교를 함께 볼 수 있어요.',
      step1: '1 / 3 · 나 만들기', step2: '2 / 3 · 친구 만들기', step3: '3 / 3 · 비교하기',
      makeInvite: '초대 링크 만들기', remakeInvite: '초대 링크 다시 만들기', makeReply: '완성하고 답장 링크 만들기',
      hiddenSelf: '내 결과는 친구가 답장 링크를 만들기 전까지 화면에서 숨겨요.', hiddenFriend: '본인이 만든 모습은 아직 숨겨져 있어요. 답장 링크를 만들면 공개돼요.',
      selfView: '내가 보는 나', friendView: '친구가 보는 나', compareTitle: '나란히 보니 어떤가요?', comparisonPng: '비교 PNG 저장', editFriend: '친구 모습 다시 만들기',
      inviteReady: '친구에게 물어볼 준비 끝!', inviteInstruction: '초대 링크를 복사해서 친구에게 직접 보내세요. 그림을 바꾸면 링크도 갱신돼요.', inviteLink: '보낼 초대 링크',
      replyReady: '답장을 돌려보내 주세요', replyInstruction: '답장 링크를 직접 보내세요. 링크를 여는 사람은 두 그림을 함께 볼 수 있어요.', replyLink: '보낼 답장 링크',
      privacy: '링크에는 그림 정보만 담겨요. 이름은 넣지 않아요. 링크를 받은 사람은 그림 정보를 볼 수 있어요.',
      copy: '링크 복사', share: '링크 공유', select: '링크 선택', copied: '링크를 복사했어요. 친구에게 직접 보내주세요.',
      copyFailed: '자동 복사를 못 했어요. 선택된 링크를 직접 복사해 주세요.', selected: '링크를 선택했어요. 복사해서 직접 보내주세요.',
      shareCanceled: '공유를 취소했어요. 링크 복사로 보낼 수도 있어요.', shareFailed: '공유를 열지 못했어요. 링크를 복사해서 보내주세요.', shared: '공유를 마쳤어요.',
      replyLabel: '받은 답장 링크', replyPlaceholder: '친구에게 받은 답장 링크를 붙여넣으세요', openReply: '비교 열기', wrongReply: '이 공방에서 만든 답장 링크를 붙여넣어 주세요.',
      errorTitle: '이 링크를 열 수 없어요', errorInvalid: '링크가 잘렸거나 그림 정보가 올바르지 않아요. 보낸 사람에게 새 링크를 부탁해 주세요.', errorLong: '링크가 너무 길어요. 보낸 사람에게 새 링크를 부탁해 주세요.', errorVersion: '이 링크의 버전을 지원하지 않아요. 보낸 사람에게 새 링크를 부탁해 주세요.', recover: '자유 만들기로 돌아가기',
      creating: '두 그림을 하나로 만드는 중…', saved: '비교 PNG 다운로드를 시작했어요.', saveError: '비교 그림을 저장하지 못했어요. 다시 눌러주세요.', footer: '가입 없이, 서버 저장 없이. 링크는 직접 보내고, 그림은 브라우저에서 만들어요.'
    },
    en: {
      modes: 'Choose a playground', free: 'Free maker', friends: 'Compare with a friend',
      selfHeading: 'Make the you that you see', selfNote: 'Make an oddling that feels like you, then send an invite link to a friend.',
      inviteHeading: 'What oddling does your friend remind you of?', inviteNote: 'Think of the friend who invited you. Finish your oddling to see both views together.',
      replyHeading: 'One oddling. Two points of view.', replyNote: 'Compare both views and save them as a PNG. Share this link to see the same comparison together.',
      step1: '1 / 3 · Your view', step2: "2 / 3 · Friend's view", step3: '3 / 3 · Compare',
      makeInvite: 'Make invite link', remakeInvite: 'Make invite link again', makeReply: 'Finish and make reply link',
      hiddenSelf: 'Your result stays hidden on screen until your friend makes a reply link.', hiddenFriend: 'Their own view is still hidden. Making a reply link reveals it.',
      selfView: 'My own view', friendView: "My friend's view", compareTitle: 'How do the two views compare?', comparisonPng: 'Save comparison PNG', editFriend: 'Edit the friend’s view',
      inviteReady: 'Ready to ask a friend!', inviteInstruction: 'Copy the invite link and send it yourself. Editing your oddling updates the link too.', inviteLink: 'Invite link to send',
      replyReady: 'Send a reply back', replyInstruction: 'Send the reply link yourself. Anyone opening it can see both pictures together.', replyLink: 'Reply link to send',
      privacy: 'Links contain picture details only. Names are left out. Anyone with a link can read its picture details.',
      copy: 'Copy link', share: 'Share link', select: 'Select link', copied: 'Link copied. Send it directly to your friend.',
      copyFailed: 'Could not copy automatically. Copy the selected link yourself.', selected: 'Link selected. Copy it and send it yourself.',
      shareCanceled: 'Sharing canceled. You can still copy the link.', shareFailed: 'Could not open sharing. Copy the link instead.', shared: 'Sharing completed.',
      replyLabel: 'Reply link you received', replyPlaceholder: 'Paste the reply link from your friend', openReply: 'Open comparison', wrongReply: 'Paste a reply link made in this Oddlings playground.',
      errorTitle: 'This link cannot be opened', errorInvalid: 'The link is incomplete or its picture details are invalid. Ask the sender for a new link.', errorLong: 'This link is too long. Ask the sender for a new link.', errorVersion: 'This link version is not supported. Ask the sender for a new link.', recover: 'Return to the free maker',
      creating: 'Putting both pictures together…', saved: 'Your comparison PNG download has started.', saveError: 'Could not save the comparison. Please try again.', footer: 'No sign-up or server storage. You send the links. This browser makes the pictures.'
    }
  };
  let route = { k: 'free' }, loading = false, pngBusy = false, platformOverride = null;
  const text = key => words[maker.getLanguage()][key];
  const say = message => { $('flow-status').textContent = message; };
  function snapshot(s) { return [s.body, s.face, s.limbs, s.deco, s.color.toLowerCase()]; }
  function validateArt(art) {
    if (!Array.isArray(art) || art.length !== 5 || ![6,6,4,6].every((limit,i)=>Number.isInteger(art[i]) && art[i]>=0 && art[i]<limit) || typeof art[4] !== 'string' || !/^#[0-9a-f]{6}$/i.test(art[4])) throw new Error('invalid');
    return [...art.slice(0,4), art[4].toLowerCase()];
  }
  function stateFor(art) { const [body,face,limbs,deco,color] = validateArt(art); return {body,face,limbs,deco,color,name:''}; }
  function validatePayload(input) {
    if (!input || typeof input!=='object' || Array.isArray(input)) throw new Error('invalid');
    if (input.v!==1) throw new Error('version');
    if (!['self','invite','reply'].includes(input.k) || !['ko','en'].includes(input.l)) throw new Error('invalid');
    const allowed = input.k==='self' ? ['v','k','l','me','ready'] : input.k==='reply' ? ['v','k','l','me','friend'] : ['v','k','l','me','draft'];
    if (Object.keys(input).some(key=>!allowed.includes(key))) throw new Error('invalid');
    const result={v:1,k:input.k,l:input.l,me:validateArt(input.me)};
    if (input.k==='self') { if(typeof input.ready!=='boolean') throw new Error('invalid'); result.ready=input.ready; }
    if (input.k==='reply') result.friend=validateArt(input.friend);
    if (input.k==='invite' && input.draft!==undefined) result.draft=validateArt(input.draft);
    return result;
  }
  function encode(input) { return btoa(JSON.stringify(validatePayload(input))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); }
  function decode(token) {
    if (typeof token!=='string' || token.length>LIMIT) throw new Error('long');
    if (!token.length || !/^[A-Za-z0-9_-]+$/.test(token) || token.length%4===1) throw new Error('invalid');
    try { const decoded=atob(token.replace(/-/g,'+').replace(/_/g,'/')); if(decoded.length>768) throw new Error('long'); return validatePayload(JSON.parse(decoded)); }
    catch(error) { throw new Error(['version','long'].includes(error.message)?error.message:'invalid'); }
  }
  function routeFromHash(hash) {
    if (hash.length>LIMIT+8) throw new Error('long');
    if (hash.startsWith('#friend=')) return decode(hash.slice(8));
    if (!hash || hash==='#workbench') return {k:'free'};
    if (hash==='#friends') return {v:1,k:'self',l:maker.getLanguage(),me:snapshot(maker.getState()),ready:false};
    throw new Error('invalid');
  }
  function linkFor(payload) { const url=new URL(location.pathname,location.origin); url.hash='friend='+encode(payload); return url.href; }
  function updateHash(payload, replace) { const url=linkFor(payload); window.history[replace?'replaceState':'pushState'](null,'',url); }
  function go(next,{replace=false,keepName=false}={}) {
    if(next.k==='free') window.history[replace?'replaceState':'pushState'](null,'',location.pathname);
    else updateHash(next,replace);
    applyRoute(next,keepName);
  }
  function applyRoute(next,keepName=false) {
    loading=true; route=copy(next); say('');
    if (['self','invite','reply'].includes(next.k)) maker.setLanguage(next.l);
    if (next.k==='self') maker.loadState({...stateFor(next.me),name:keepName?maker.getState().name:''});
    if (next.k==='invite') maker.loadState(stateFor(next.draft||snapshot(maker.getInitial())));
    loading=false; paint();
  }
  function openCurrentRoute() {
    try { applyRoute(routeFromHash(location.hash)); }
    catch(error) { loading=false; route={k:'error',reason:['long','version'].includes(error.message)?error.message:'invalid'}; paint(); }
  }
  function shareAvailable() {
    if(platformOverride) return typeof platformOverride.share==='function';
    try { return typeof navigator.share==='function' && (!navigator.canShare||navigator.canShare({url:location.origin+location.pathname})); } catch {return false;}
  }
  function paint() {
    const mode=route.k;
    $('play-modes').setAttribute('aria-label',text('modes'));
    $('mode-free').textContent=text('free'); $('mode-friends').textContent=text('friends');
    $('mode-free').setAttribute('aria-pressed',String(mode==='free'));
    $('mode-friends').setAttribute('aria-pressed',String(['self','invite','reply'].includes(mode)));
    workbench.hidden=['reply','error'].includes(mode);
    $('friend-context').hidden=!['self','invite','reply'].includes(mode);
    $('friend-actions').hidden=!['self','invite'].includes(mode);
    $('comparison').hidden=mode!=='reply'; $('link-error').hidden=mode!=='error';
    $('link-result').hidden=!(mode==='reply'||mode==='self'&&route.ready);
    $('open-reply').hidden=mode!=='self';
    $('share-link').hidden=!shareAvailable();
    for (const [id,key] of Object.entries({'copy-link':'copy','share-link':'share','select-link':'select','reply-label':'replyLabel','open-reply-button':'openReply','link-privacy':'privacy','comparison-download':'comparisonPng','edit-friend':'editFriend','comparison-title':'compareTitle','self-view-label':'selfView','friend-view-label':'friendView','recover-link':'recover','link-error-title':'errorTitle'})) $(id).textContent=text(key);
    $('reply-input').placeholder=text('replyPlaceholder');
    $('friend-actions').setAttribute('aria-label',text('friends'));
    // Clear both comparison containers before the friend starts, including history navigation.
    if (mode!=='reply') { $('self-view-art').replaceChildren(); $('friend-view-art').replaceChildren(); }
    if (['self','invite','reply'].includes(mode)) {
      const key=mode==='self'?'self':mode==='invite'?'invite':'reply';
      $('friend-heading').textContent=text(key+'Heading'); $('friend-instruction').textContent=text(key+'Note');
      $('flow-step').textContent=text(mode==='self'?'step1':mode==='invite'?'step2':'step3');
      document.querySelector('.intro').hidden=true;
      document.querySelector('footer p').textContent=text('footer');
    } else document.querySelector('.intro').hidden=mode==='error';
    if (mode==='self'||mode==='invite') {
      $('friend-primary').textContent=text(mode==='invite'?'makeReply':route.ready?'remakeInvite':'makeInvite');
      $('hidden-note').textContent=text(mode==='invite'?'hiddenFriend':'hiddenSelf');
      $('preview-heading').textContent=text(mode==='invite'?'friendView':'selfView');
    }
    if (mode==='reply') {
      $('self-view-art').innerHTML=maker.svgFor(stateFor(route.me));
      $('friend-view-art').innerHTML=maker.svgFor(stateFor(route.friend));
    }
    if (!$('link-result').hidden) {
      const isReply=mode==='reply';
      $('link-heading').textContent=text(isReply?'replyReady':'inviteReady');
      $('link-instruction').textContent=text(isReply?'replyInstruction':'inviteInstruction');
      $('link-label').textContent=text(isReply?'replyLink':'inviteLink');
      const payload=isReply?route:{v:1,k:'invite',l:maker.getLanguage(),me:route.me};
      const next=linkFor(payload); if($('friend-link').value!==next) $('friend-link').value=next;
    }
    if(mode==='error') $('link-error-note').textContent=text(route.reason==='long'?'errorLong':route.reason==='version'?'errorVersion':'errorInvalid');
  }
  window.addEventListener('oddling-render',()=>{
    if(loading) return;
    if(route.k==='self') route={...route,l:maker.getLanguage(),me:snapshot(maker.getState())};
    if(route.k==='invite') route={...route,l:maker.getLanguage(),draft:snapshot(maker.getState())};
    if(route.k==='reply') route={...route,l:maker.getLanguage()};
    if(['self','invite','reply'].includes(route.k)) {
      try { if(location.href!==linkFor(route)) updateHash(route,true); } catch { say(text('errorInvalid')); }
    }
    paint();
  });
  window.addEventListener('popstate',openCurrentRoute); window.addEventListener('hashchange',openCurrentRoute);
  $('mode-free').addEventListener('click',()=>{go({k:'free'});maker.setLanguage(maker.getLanguage());$('mode-free').focus();});
  $('mode-friends').addEventListener('click',()=>{go({v:1,k:'self',l:maker.getLanguage(),me:snapshot(maker.getState()),ready:false},{keepName:true});$('friend-heading').focus();});
  $('friend-primary').addEventListener('click',()=>{
    if(route.k==='self') {go({...route,ready:true,me:snapshot(maker.getState())},{keepName:true});$('friend-link').focus();}
    else if(route.k==='invite') {go({v:1,k:'reply',l:maker.getLanguage(),me:route.me,friend:snapshot(maker.getState())});$('comparison-title').focus();}
  });
  $('edit-friend').addEventListener('click',()=>{if(route.k!=='reply')return;go({v:1,k:'invite',l:maker.getLanguage(),me:route.me,draft:route.friend});$('friend-heading').focus();});
  $('recover-link').addEventListener('click',()=>{go({k:'free'});maker.setLanguage(maker.getLanguage());$('mode-free').focus();});
  function selectLink(){ $('friend-link').focus(); $('friend-link').select(); }
  $('select-link').addEventListener('click',()=>{selectLink();say(text('selected'));});
  $('copy-link').addEventListener('click',async()=>{
    const link=$('friend-link').value; if(!link)return; $('copy-link').disabled=true;
    try {if(platformOverride?.clipboard) await platformOverride.clipboard(link); else {if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(link);}say(text('copied'));}
    catch {selectLink();say(text('copyFailed'));}
    finally {$('copy-link').disabled=false;}
  });
  $('share-link').addEventListener('click',async()=>{
    const link=$('friend-link').value; if(!link)return; $('share-link').disabled=true;
    try {const action=platformOverride?.share||navigator.share?.bind(navigator);if(!action)throw new Error('Sharing unavailable');await action({title:maker.getLanguage()==='ko'?'엉뚱이 공방':'Oddlings',url:link});say(text('shared'));}
    catch(error){say(text(error?.name==='AbortError'?'shareCanceled':'shareFailed'));}
    finally {$('share-link').disabled=false;}
  });
  $('open-reply').addEventListener('submit',event=>{
    event.preventDefault(); const value=$('reply-input').value.trim();
    try {if(value.length>2048)throw new Error('long');const url=new URL(value);if(url.origin!==location.origin||url.pathname!==location.pathname||url.search)throw new Error('invalid');const payload=routeFromHash(url.hash);if(payload.k!=='reply')throw new Error('invalid');go(payload);$('comparison-title').focus();}
    catch {say(text('wrongReply'));$('reply-input').focus();}
  });
  function comparisonSvg(payload=route) {
    const valid=validatePayload(payload);if(valid.k!=='reply')throw new Error('invalid');
    const langWords=words[valid.l];
    const nested=(art,x)=>maker.svgFor(stateFor(art),true).replace('width="512" height="512"',`x="${x}" y="172" width="704" height="704"`);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000"><title>${langWords.replyHeading}</title><rect width="1600" height="1000" fill="#faf9fe"/><g font-family="'Malgun Gothic',Arial,sans-serif" fill="#252335"><text x="48" y="68" font-size="40" font-weight="700">${langWords.replyHeading}</text><rect x="40" y="104" width="728" height="806" rx="24" fill="white" stroke="#e1dfeb" stroke-width="2"/><rect x="832" y="104" width="728" height="806" rx="24" fill="#f6f2ff" stroke="#c7b4fa" stroke-width="2"/><text x="64" y="148" font-size="28" font-weight="700">${langWords.selfView}</text><text x="856" y="148" font-size="28" font-weight="700">${langWords.friendView}</text>${nested(valid.me,52)}${nested(valid.friend,844)}<text x="48" y="960" font-size="24" fill="#625f74">ODDLINGS · ${valid.l==='ko'?'두 시선으로 만든 친구':'A friend made from two points of view'}</text></g></svg>`;
  }
  async function comparisonBlob(payload=copy(route)) {
    const url=URL.createObjectURL(new Blob([comparisonSvg(payload)],{type:'image/svg+xml;charset=utf-8'}));const img=new Image();
    try {await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url;});const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=1000;const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas unavailable');ctx.drawImage(img,0,0);return await new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('PNG unavailable')),'image/png'));}
    finally {URL.revokeObjectURL(url);}
  }
  $('comparison-download').addEventListener('click',async()=>{
    if(pngBusy||route.k!=='reply')return;pngBusy=true;$('comparison-download').disabled=true;say(text('creating'));const payload=copy(route);
    try {const blob=await comparisonBlob(payload),url=URL.createObjectURL(blob),anchor=document.createElement('a');anchor.href=url;anchor.download='oddlings-two-views.png';document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);say(text('saved'));}
    catch {say(text('saveError'));}
    finally {pngBusy=false;$('comparison-download').disabled=false;}
  });
  openCurrentRoute();
  if(['127.0.0.1','localhost','::1'].includes(location.hostname)&&new URLSearchParams(location.search).has('qa')) window.FriendsQA=Object.freeze({encode,decode,routeFromHash,linkFor,stateFor,snapshot,comparisonSvg,comparisonBlob,getRoute:()=>copy(route),navigate:go,setPlatform(value){platformOverride=value;paint();}});
})();
