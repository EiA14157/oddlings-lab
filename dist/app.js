'use strict';
(() => {
  const INK = '#292638';
  const palette = ['#ad8bfa', '#ffb76b', '#92d6bb', '#86cbed', '#f79caa', '#d3e881', '#ffda79', '#b9b9ed'];
  const text = {
    ko: {
      brand: '엉뚱이 공방', skip: '만들기로 바로 가기', localBadge: '작은 브라우저 놀이터', eyebrow: '평범한 사물, 엉뚱한 친구', headline: '오늘은 어떤 엉뚱이?', intro: '섞고, 바꾸고, 마음에 들면 데려가요.', preview: '내 엉뚱이', random: '랜덤 만들기', download: 'PNG 저장', undo: '되돌리기', reset: '처음으로', share: '파일 공유', parts: '취향대로 조립하기', count: '864가지 조합', color: '몸체 색', nameLabel: '이름을 붙여줄까요? <span class="optional">선택</span>', nameNote: '이름은 이 화면에만 머물러요. 저장한 그림에는 함께 담겨요.', footer: '가입 없이, 업로드 없이. 만드는 동안 모든 작업은 이 브라우저 안에서만 이루어져요.', placeholder: '예: 말랑 주전자', defaultName: '이름 없는 엉뚱이', body: '몸체', face: '표정', limbs: '팔다리', deco: '장식', customColor: '직접 색 고르기', custom: '내 색', colors: ['라일락', '귤빛', '민트', '하늘', '분홍', '연두', '노랑', '연보라'], choose: '선택', randomDone: '새 엉뚱이가 태어났어요!', undoDone: '한 단계 되돌렸어요.', resetDone: '처음 모습으로 돌아왔어요. 되돌리기도 가능해요.', downloadDone: 'PNG 저장을 시작했어요.', saving: '그림을 만드는 중…', saveError: '그림을 저장하지 못했어요. 다시 눌러주세요.', shareError: '공유를 완료하지 못했어요. PNG 저장을 이용해 주세요.', shared: '파일을 공유했어요.', languageDone: '한국어로 바꿨어요.', tabLabel: '파츠 종류', imageLabel: '직접 만든 엉뚱이', home: '엉뚱이 공방 홈', colorChosen: '몸체 색을 바꿨어요.'
    },
    en: {
      brand: 'Oddlings', skip: 'Skip to the maker', localBadge: 'A little browser playground', eyebrow: 'Ordinary things. Odd little friends.', headline: 'Who will you make today?', intro: 'Mix it up. Make it yours. Take it home.', preview: 'Your oddling', random: 'Surprise me', download: 'Save PNG', undo: 'Undo', reset: 'Reset', share: 'Share file', parts: 'Mix your own oddling', count: '864 combinations', color: 'Body color', nameLabel: 'Give it a name? <span class="optional">Optional</span>', nameNote: 'Its name stays on this page and in your saved picture.', footer: 'No sign-up. No uploads. Everything you make stays in this browser while you create.', placeholder: 'e.g. Wobbly Kettle', defaultName: 'An unnamed oddling', body: 'Body', face: 'Face', limbs: 'Limbs', deco: 'Extra', customColor: 'Pick a custom color', custom: 'Custom', colors: ['Lilac', 'Tangerine', 'Mint', 'Sky', 'Pink', 'Lime', 'Yellow', 'Periwinkle'], choose: 'Choose', randomDone: 'A new oddling is born!', undoDone: 'One step back.', resetDone: 'Back to the first oddling. You can undo this too.', downloadDone: 'Your PNG download has started.', saving: 'Making your picture…', saveError: 'Could not save the picture. Please try again.', shareError: 'Could not complete sharing. Use Save PNG instead.', shared: 'Your file was shared.', languageDone: 'Switched to English.', tabLabel: 'Part types', imageLabel: 'Your handmade oddling', home: 'Oddlings home', colorChosen: 'Body color changed.'
    }
  };
  const bodies = [
    { id: 'kettle', name: ['주전자', 'Kettle'], face: [270, 253], top: [270, 158], left: [178, 255], right: [363, 264], feet: [[235, 324], [303, 324]], draw: c => `<path d="M353 205C422 177 424 299 357 289" fill="none" stroke="${INK}" stroke-width="17"/><path d="M353 205C422 177 424 299 357 289" fill="none" stroke="${c}" stroke-width="9"/><path d="M196 245Q162 243 141 195L118 209Q131 263 187 286" fill="${c}"/><path data-skin="true" d="M191 210Q193 190 213 187H327Q352 190 357 214L365 272Q365 326 273 330Q176 328 178 275Z" fill="${c}"/><path d="M215 188Q211 169 237 168H303Q330 169 326 188Z" fill="#fff8e9"/><path d="M259 168V154Q270 144 282 154V168" fill="${c}"/><path d="M198 219Q198 210 213 210" fill="none" stroke="#ffffff" stroke-width="7" opacity=".65"/><path d="M207 302Q270 318 335 299" fill="none" stroke="${INK}" opacity=".15"/>` },
    { id: 'sock', name: ['양말', 'Sock'], face: [282, 230], top: [279, 139], left: [223, 237], right: [336, 241], feet: [[206, 327], [289, 327]], draw: c => `<path data-skin="true" d="M225 149H334V266Q335 290 313 306L265 335Q219 362 176 336Q147 319 175 295L222 265Z" fill="${c}"/><path d="M225 145H334V182H225Z" fill="#fff8e9"/><path d="M236 147V178M252 147V178M269 147V178M286 147V178M304 147V178M322 147V178" opacity=".2" stroke-width="3"/><path d="M175 295Q206 293 216 317Q220 333 210 346" fill="#fff8e9"/><path d="M306 291Q305 314 287 321" fill="none" stroke="${INK}" opacity=".22" stroke-width="3"/><path d="M238 197V209" fill="none" stroke="white" stroke-width="7" opacity=".65"/>` },
    { id: 'mushroom', name: ['버섯', 'Mushroom'], face: [270, 280], top: [270, 136], left: [222, 281], right: [320, 281], feet: [[242, 331], [297, 331]], draw: c => `<path data-skin="true" d="M235 215H305L323 307Q328 339 270 341Q213 339 218 308Z" fill="${c}"/><path d="M154 230Q146 208 193 168Q265 94 340 166Q393 207 386 229Q375 250 270 249Q166 250 154 230Z" fill="${c}"/><path d="M161 229Q269 218 381 229Q363 251 270 249Q177 251 161 229Z" fill="#fff8e9"/><path d="M191 187Q188 174 202 169Q223 164 225 181Q224 195 207 197Q193 199 191 187Z" fill="#fff8e9" stroke="none"/><path d="M257 155Q253 141 271 140Q292 139 291 155Q291 169 274 169Q260 169 257 155Z" fill="#fff8e9" stroke="none"/><path d="M325 192Q318 179 332 174Q351 168 358 183Q363 197 347 202Q331 207 325 192Z" fill="#fff8e9" stroke="none"/>` },
    { id: 'cloud', name: ['구름', 'Cloud'], face: [270, 258], top: [270, 142], left: [155, 258], right: [384, 258], feet: [[229, 317], [311, 317]], draw: c => `<path data-skin="true" d="M177 219Q155 182 189 163Q220 145 240 177Q251 131 292 146Q330 154 328 194Q369 177 387 211Q407 245 381 264Q402 299 371 317Q348 330 320 313Q296 340 268 317Q241 336 218 315Q180 330 162 302Q146 278 165 258Q141 238 177 219Z" fill="${c}"/><path d="M181 213Q174 193 193 184" fill="none" stroke="white" opacity=".7" stroke-width="7"/><path d="M335 291Q349 302 367 291" fill="none" stroke="${INK}" opacity=".2"/>` },
    { id: 'pear', name: ['배', 'Pear'], face: [270, 257], top: [269, 139], left: [182, 266], right: [361, 266], feet: [[235, 330], [305, 330]], draw: c => `<path d="M269 153Q267 126 278 119" fill="none" stroke="${INK}" stroke-width="9"/><path d="M274 138Q295 114 318 126Q307 151 276 149Z" fill="#95cf8f"/><path data-skin="true" d="M244 154Q270 137 296 155Q314 166 314 193Q315 211 342 236Q370 264 360 300Q351 337 269 342Q188 337 179 301Q169 265 198 236Q226 209 226 192Q226 168 244 154Z" fill="${c}"/><path d="M202 259Q195 272 198 283" fill="none" stroke="white" stroke-width="7" opacity=".7"/><circle cx="312" cy="312" r="2" fill="${INK}" stroke="none" opacity=".3"/><circle cx="323" cy="306" r="2" fill="${INK}" stroke="none" opacity=".3"/><circle cx="320" cy="320" r="2" fill="${INK}" stroke="none" opacity=".3"/>` },
    { id: 'pudding', name: ['푸딩', 'Pudding'], face: [270, 257], top: [270, 162], left: [179, 274], right: [362, 274], feet: [[237, 330], [304, 330]], draw: c => `<path data-skin="true" d="M217 178Q271 165 325 178L364 311Q365 340 270 343Q175 340 176 311Z" fill="${c}"/><path d="M217 178Q266 158 325 178L336 216Q320 230 305 212Q289 239 272 216Q255 235 236 212Q219 230 206 216Z" fill="#946145"/><ellipse cx="271" cy="178" rx="54" ry="14" fill="#bf8157"/><path d="M200 268L194 291" fill="none" stroke="white" stroke-width="7" opacity=".6"/><path d="M195 323Q268 344 343 323" fill="none" opacity=".18"/>` }
  ];
  const faces = [
    { name: ['방긋', 'Happy'], draw: () => `<circle cx="-28" cy="-9" r="6"/><circle cx="28" cy="-9" r="6"/><path d="M-15 12Q0 32 16 12" fill="none"/><ellipse cx="-42" cy="10" rx="9" ry="5" fill="#f28f91" stroke="none"/><ellipse cx="42" cy="10" rx="9" ry="5" fill="#f28f91" stroke="none"/>` },
    { name: ['졸림', 'Sleepy'], draw: () => `<path d="M-39-7Q-29 2-19-7M19-7Q29 2 39-7" fill="none"/><ellipse cx="0" cy="18" rx="7" ry="5" fill="none"/><path d="M-45 9H-35M36 9H46" fill="none" stroke="#df7e92" stroke-width="3"/>` },
    { name: ['깜짝', 'Surprised'], draw: () => `<ellipse cx="-28" cy="-7" rx="9" ry="12" fill="white"/><ellipse cx="28" cy="-7" rx="9" ry="12" fill="white"/><circle cx="-28" cy="-5" r="4" stroke="none"/><circle cx="28" cy="-5" r="4" stroke="none"/><ellipse cx="0" cy="21" rx="9" ry="11" fill="#593754"/>` },
    { name: ['메롱', 'Cheeky'], draw: () => `<circle cx="-28" cy="-9" r="6"/><circle cx="28" cy="-9" r="6"/><path d="M-19 10Q0 26 20 10" fill="none"/><path d="M0 18H15V28Q8 38 1 28Z" fill="#f493a5" stroke-width="3"/>` },
    { name: ['뚱함', 'Grumpy'], draw: () => `<path d="M-41-22L-21-16M21-16L41-22" fill="none"/><circle cx="-28" cy="-7" r="5"/><circle cx="28" cy="-7" r="5"/><path d="M-12 23Q0 13 12 23" fill="none"/><ellipse cx="-43" cy="10" rx="8" ry="4" fill="#f28f91" stroke="none"/><ellipse cx="43" cy="10" rx="8" ry="4" fill="#f28f91" stroke="none"/>` },
    { name: ['윙크', 'Wink'], draw: () => `<circle cx="-28" cy="-9" r="6"/><path d="M19-5L31-11L40-4M-14 12Q0 32 16 12" fill="none"/><path d="M-45 8H-36" fill="none" stroke="#df7e92" stroke-width="3"/>` }
  ];
  const limbs = [{ name: ['꼬물꼬물', 'Wobbly'] }, { name: ['춤추기', 'Dancing'] }, { name: ['짧은 발', 'Tiny'] }, { name: ['구불구불', 'Noodles'] }];
  const decorations = [
    { name: ['맨몸', 'None'], draw: () => '' },
    { name: ['새싹', 'Sprout'], draw: () => `<path d="M0 4V-27" fill="none"/><path d="M0-22Q-33-15-32-43Q-7-49 0-22Z" fill="#98d572"/><path d="M0-28Q3-55 32-51Q33-28 0-28Z" fill="#b4e891"/>` },
    { name: ['파티 모자', 'Party hat'], draw: () => `<path d="M-32 4L0-65L32 4Z" fill="#ffce68"/><path d="M-22-16L16-30M-13-38L8-47" stroke="#e780a5" stroke-width="9"/><circle cy="-68" r="9" fill="#ee9ac1"/><path d="M-36 5Q0 14 36 5" fill="none" stroke="#fff8e9" stroke-width="8"/>` },
    { name: ['반짝별', 'Star'], draw: () => `<path d="M0-53L11-32L34-28L17-11L21 12L0 1L-21 12L-17-11L-34-28L-11-32Z" fill="#ffda68"/><circle cx="-8" cy="-23" r="2" stroke="none"/><circle cx="8" cy="-23" r="2" stroke="none"/><path d="M-5-14Q0-9 5-14" fill="none" stroke-width="2"/>` },
    { name: ['리본', 'Bow'], draw: () => `<path d="M-6-13Q-53-47-43-7Q-48 26-7-1M7-13Q53-47 43-7Q48 26 7-1" fill="#f797b3"/><path d="M-9 0L-18 30L0 20L17 30L9 0" fill="#f797b3"/><circle cy="-7" r="10" fill="#ffc2d0"/>` },
    { name: ['헤드폰', 'Headphones'], draw: () => `<path d="M-62 24V-8Q0-65 62-8V24" fill="none" stroke="${INK}" stroke-width="13"/><path d="M-62 23V-6Q0-56 62-6V23" fill="none" stroke="#9290ef" stroke-width="6"/><rect x="-75" y="9" width="24" height="41" rx="10" fill="#a59df4"/><rect x="51" y="9" width="24" height="41" rx="10" fill="#a59df4"/>` }
  ];
  const groups = { body: bodies, face: faces, limbs, deco: decorations };
  const initial = { body: 0, face: 0, limbs: 0, deco: 1, color: palette[0], name: '' };
  let state = { ...initial }, lang = 'ko', active = 'body', history = [], nameEditStart = null, colorEditStart = null, busy = false;
  const $ = id => document.getElementById(id);
  const t = key => text[lang][key];
  const label = item => item.name[lang === 'ko' ? 0 : 1];
  const escapeXML = value => value.replace(/[<>&"']/g, ch => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[ch]));
  const copy = value => ({ ...value });
  function limbArt(body, style) {
    const [lx, ly] = body.left, [rx, ry] = body.right;
    const [[fx, fy], [gx, gy]] = body.feet;
    const skin = '#fff8e9';
    if (style === 0) return `<path d="M${lx} ${ly}Q${lx-28} ${ly-18} ${lx-39} ${ly+3}M${rx} ${ry}Q${rx+23} ${ry+27} ${rx+39} ${ry+1}M${fx} ${fy}L${fx-8} ${fy+39}M${gx} ${gy}L${gx+8} ${gy+39}" fill="none"/><ellipse cx="${fx-16}" cy="${fy+42}" rx="19" ry="10" fill="${skin}"/><ellipse cx="${gx+16}" cy="${gy+42}" rx="19" ry="10" fill="${skin}"/><circle cx="${lx-40}" cy="${ly+5}" r="8" fill="${skin}"/><circle cx="${rx+40}" cy="${ry}" r="8" fill="${skin}"/>`;
    if (style === 1) return `<path d="M${lx} ${ly}L${lx-29} ${ly-14}L${lx-41} ${ly-42}M${rx} ${ry}L${rx+28} ${ry-24}L${rx+47} ${ry-21}M${fx} ${fy}L${fx-20} ${fy+23}L${fx-5} ${fy+47}M${gx} ${gy}L${gx+14} ${gy+22}L${gx+42} ${gy+11}" fill="none"/><ellipse cx="${fx-2}" cy="${fy+47}" rx="17" ry="9" fill="${skin}"/><ellipse cx="${gx+46}" cy="${gy+11}" rx="16" ry="9" fill="${skin}"/><circle cx="${lx-42}" cy="${ly-42}" r="8" fill="${skin}"/><circle cx="${rx+48}" cy="${ry-21}" r="8" fill="${skin}"/>`;
    if (style === 2) return `<ellipse cx="${lx-5}" cy="${ly+8}" rx="14" ry="9" fill="${skin}" transform="rotate(35 ${lx-5} ${ly+8})"/><ellipse cx="${rx+5}" cy="${ry+8}" rx="14" ry="9" fill="${skin}" transform="rotate(-35 ${rx+5} ${ry+8})"/><ellipse cx="${fx}" cy="${fy+11}" rx="19" ry="13" fill="${skin}"/><ellipse cx="${gx}" cy="${gy+11}" rx="19" ry="13" fill="${skin}"/>`;
    return `<path d="M${lx} ${ly}C${lx-50} ${ly-50} ${lx-13} ${ly+40} ${lx-57} ${ly+18}M${rx} ${ry}C${rx+49} ${ry+43} ${rx+16} ${ry-50} ${rx+58} ${ry-22}M${fx} ${fy}C${fx-35} ${fy+34} ${fx+20} ${fy+25} ${fx-16} ${fy+64}M${gx} ${gy}C${gx+35} ${gy+25} ${gx-20} ${gy+33} ${gx+19} ${gy+62}" fill="none"/><circle cx="${lx-58}" cy="${ly+18}" r="8" fill="${skin}"/><circle cx="${rx+58}" cy="${ry-22}" r="8" fill="${skin}"/><ellipse cx="${fx-20}" cy="${fy+65}" rx="17" ry="9" fill="${skin}"/><ellipse cx="${gx+23}" cy="${gy+63}" rx="17" ry="9" fill="${skin}"/>`;
  }
  function creatureArt(s) {
    const b = bodies[s.body];
    return `<g fill="${INK}" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><g data-layer="limbs">${limbArt(b, s.limbs)}</g><g data-layer="body">${b.draw(s.color)}</g><g data-layer="face" transform="translate(${b.face}) scale(${s.body === 2 ? .84 : 1})" stroke-width="4">${faces[s.face].draw()}</g><g data-layer="deco" transform="translate(${b.top})" stroke-width="4">${decorations[s.deco].draw()}</g></g>`;
  }
  function svgFor(s, exporting = false) {
    const description = `${t('imageLabel')}: ${label(bodies[s.body])}, ${label(faces[s.face])}, ${label(limbs[s.limbs])}, ${label(decorations[s.deco])}`;
    const name = s.name.trim();
    return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" role="img" aria-label="${escapeXML(description)}"><title>${escapeXML(description)}</title><rect width="512" height="512" rx="${exporting ? 0 : 20}" fill="#dcf6ef"/><g fill="#9dcdc1" opacity=".35"><circle cx="46" cy="48" r="2"/><circle cx="108" cy="48" r="2"/><circle cx="404" cy="48" r="2"/><circle cx="466" cy="48" r="2"/><circle cx="46" cy="464" r="2"/><circle cx="108" cy="464" r="2"/><circle cx="404" cy="464" r="2"/><circle cx="466" cy="464" r="2"/></g><path d="M75 157v16M67 165h16M424 335v16M416 343h16" fill="none" stroke="#85beb0" stroke-width="3" stroke-linecap="round"/><ellipse cx="270" cy="410" rx="119" ry="13" fill="#8fbead" opacity=".22"/>${creatureArt(s)}${exporting && name ? `<text x="256" y="474" font-family="'Malgun Gothic',Arial,sans-serif" font-size="${name.length > 16 ? 20 : 24}" font-weight="700" text-anchor="middle" fill="${INK}">${escapeXML(name)}</text>` : ''}</svg>`;
  }
  function thumb(kind, index) {
    const s = { ...initial, color: kind === 'body' ? state.color : '#e0dbea', deco: 0 };
    s[kind] = index;
    if (kind === 'face') return `<svg viewBox="-64 -46 128 100" aria-hidden="true"><ellipse rx="62" ry="45" cy="2" fill="#eee9fb"/><g fill="${INK}" stroke="${INK}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${faces[index].draw()}</g></svg>`;
    if (kind === 'deco') return `<svg viewBox="-95 -90 190 155" aria-hidden="true"><path d="M-58 59Q-59 10 0 5Q59 10 58 59" fill="#e7e2f4" stroke="#c6beda" stroke-width="4"/><g fill="${INK}" stroke="${INK}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${decorations[index].draw() || `<path d="M-17 30H17" stroke="#92869e" stroke-width="4"/>`}</g></svg>`;
    return `<svg viewBox="95 105 345 320" aria-hidden="true">${creatureArt(s)}</svg>`;
  }
  function announce(message) { $('status').textContent = message; }
  function pushHistory(previous) {
    if (JSON.stringify(previous) === JSON.stringify(state)) return;
    history.push(copy(previous));
    if (history.length > 100) history.shift();
  }
  function settleEdits() {
    if (nameEditStart) { pushHistory(nameEditStart); nameEditStart = null; }
    if (colorEditStart) { pushHistory(colorEditStart); colorEditStart = null; }
    $('undo').disabled = history.length === 0;
  }
  function change(patch, message) {
    settleEdits();
    const previous = copy(state);
    state = { ...state, ...patch };
    pushHistory(previous);
    render();
    if (message) announce(message);
  }
  function renderPreview() {
    $('stage').innerHTML = svgFor(state);
    $('character-name').textContent = state.name.trim() || t('defaultName');
    $('recipe').textContent = `${label(bodies[state.body])} · ${label(faces[state.face])} · ${label(decorations[state.deco])}`;
    $('undo').disabled = history.length === 0 && !nameEditStart && !colorEditStart;
    window.dispatchEvent(new Event('oddling-render'));
  }
  function renderTabs() {
    $('tabs').setAttribute('aria-label', t('tabLabel'));
    $('tabs').innerHTML = Object.keys(groups).map(key => `<button type="button" role="tab" id="tab-${key}" aria-controls="part-panel" aria-selected="${active === key}" tabindex="${active === key ? 0 : -1}" class="tab" data-tab="${key}">${t(key)}</button>`).join('');
    $('part-panel').setAttribute('aria-labelledby', `tab-${active}`);
  }
  function renderOptions() {
    $('part-panel').innerHTML = `<div class="part-grid">${groups[active].map((item, index) => `<button type="button" class="part-option" aria-pressed="${state[active] === index}" aria-label="${t('choose')} ${t(active)}: ${label(item)}" data-part="${index}">${thumb(active, index)}<span>${label(item)}</span></button>`).join('')}</div>`;
  }
  function renderColors() {
    const selected = palette.indexOf(state.color);
    $('color-label').textContent = selected < 0 ? t('custom') : text[lang].colors[selected];
    $('colors').innerHTML = palette.map((color, index) => `<button type="button" class="swatch" aria-pressed="${state.color === color}" aria-label="${t('color')}: ${text[lang].colors[index]}" data-color="${color}"><svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14" fill="${color}" stroke="${INK}" stroke-opacity=".12"/>${state.color === color ? `<path d="M10 16l4 4 8-8" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>` : ''}</svg></button>`).join('') + `<label class="custom-color" title="${t('customColor')}"><span aria-hidden="true">+</span><input id="custom-color" type="color" value="${state.color}" aria-label="${t('customColor')}"></label>`;
  }
  function render() {
    renderPreview(); renderTabs(); renderOptions(); renderColors();
    if (document.activeElement !== $('name')) $('name').value = state.name;
  }
  function applyLanguage() {
    document.documentElement.lang = lang;
    document.title = lang === 'ko' ? '엉뚱이 공방 · Oddlings' : 'Oddlings · Make a little odd friend';
    document.querySelector('meta[name="description"]').content = lang === 'ko' ? '사물에 표정과 작은 장식을 더해 나만의 엉뚱한 친구를 만들어요. 무료로 만들고 PNG로 저장하는 작은 놀이 공방.' : 'Mix everyday objects, funny faces, and tiny extras to make your own little odd friend. Create and save a PNG for free.';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const value = t(el.dataset.i18n);
      if (el.dataset.i18n === 'nameLabel') el.innerHTML = value;
      else el.textContent = value;
    });
    $('name').placeholder = t('placeholder');
    $('brand').setAttribute('aria-label', t('home'));
    $('language').innerHTML = `${lang === 'ko' ? 'EN' : '한국어'} <span aria-hidden="true">↔</span>`;
    $('language').setAttribute('aria-label', lang === 'ko' ? 'Switch to English' : '한국어로 전환');
    render();
  }
  function focusPart(index) { $('part-panel').querySelector(`[data-part="${index}"]`)?.focus(); }
  $('tabs').addEventListener('click', event => {
    const button = event.target.closest('[data-tab]');
    if (!button) return;
    settleEdits(); active = button.dataset.tab;
    renderTabs(); renderOptions(); $(`tab-${active}`).focus();
  });
  $('tabs').addEventListener('keydown', event => {
    const keys = Object.keys(groups), index = keys.indexOf(active);
    const next = event.key === 'ArrowRight' ? (index + 1) % keys.length : event.key === 'ArrowLeft' ? (index + keys.length - 1) % keys.length : event.key === 'Home' ? 0 : event.key === 'End' ? keys.length - 1 : -1;
    if (next < 0) return;
    event.preventDefault(); settleEdits(); active = keys[next];
    renderTabs(); renderOptions(); $(`tab-${active}`).focus();
  });
  $('part-panel').addEventListener('click', event => {
    const button = event.target.closest('[data-part]');
    if (!button) return;
    const index = Number(button.dataset.part);
    change({ [active]: index }, `${t(active)}: ${label(groups[active][index])}`);
    focusPart(index);
  });
  $('colors').addEventListener('click', event => {
    const button = event.target.closest('[data-color]');
    if (!button) return;
    change({ color: button.dataset.color }, t('colorChosen'));
    $('colors').querySelector(`[data-color="${state.color}"]`).focus();
  });
  $('colors').addEventListener('input', event => {
    if (event.target.id !== 'custom-color') return;
    if (!colorEditStart) { settleEdits(); colorEditStart = copy(state); }
    state.color = event.target.value;
    renderPreview();
    $('color-label').textContent = t('custom');
    $('colors').querySelectorAll('[data-color]').forEach(button => button.setAttribute('aria-pressed', 'false'));
  });
  $('colors').addEventListener('change', event => {
    if (event.target.id !== 'custom-color') return;
    settleEdits(); renderColors(); renderOptions(); announce(t('colorChosen')); $('custom-color').focus();
  });
  $('name').addEventListener('input', event => {
    if (!nameEditStart) { settleEdits(); nameEditStart = copy(state); }
    state.name = event.target.value;
    renderPreview();
  });
  $('name').addEventListener('blur', settleEdits);
  $('random').addEventListener('click', () => {
    let next;
    do { next = Object.fromEntries(Object.keys(groups).map(key => [key, Math.floor(Math.random() * groups[key].length)])); next.color = palette[Math.floor(Math.random() * palette.length)]; }
    while (Object.keys(next).every(key => state[key] === next[key]));
    change(next, t('randomDone'));
  });
  $('undo').addEventListener('click', () => {
    settleEdits();
    if (!history.length) return;
    state = history.pop(); render(); announce(t('undoDone'));
  });
  $('reset').addEventListener('click', () => { change(copy(initial), t('resetDone')); });
  $('language').addEventListener('click', () => {
    settleEdits(); lang = lang === 'ko' ? 'en' : 'ko'; applyLanguage(); announce(t('languageDone'));
  });
  async function pngBlob(snapshot = copy(state)) {
    const svg = svgFor(snapshot, true);
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob), img = new Image();
    try {
      await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = url; });
      const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1024;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas unavailable');
      context.drawImage(img, 0, 0, 1024, 1024);
      return await new Promise((resolve, reject) => canvas.toBlob(result => result ? resolve(result) : reject(new Error('PNG unavailable')), 'image/png'));
    } finally { URL.revokeObjectURL(url); }
  }
  function fileName(snapshot) {
    const name = snapshot.name.trim().replace(/[\u0000-\u001f\u007f/\\:*?"<>|]/g, '').slice(0, 24).replace(/[. ]+$/g, '');
    return `${name || 'oddling'}-${bodies[snapshot.body].id}.png`;
  }
  function setBusy(value) { busy = value; $('download').disabled = value; $('share').disabled = value; }
  $('download').addEventListener('click', async () => {
    if (busy) return;
    settleEdits(); setBusy(true); announce(t('saving'));
    const snapshot = copy(state);
    try {
      const blob = await pngBlob(snapshot), url = URL.createObjectURL(blob), anchor = document.createElement('a');
      anchor.href = url; anchor.download = fileName(snapshot); document.body.append(anchor); anchor.click(); anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000); announce(t('downloadDone'));
    } catch { announce(t('saveError')); }
    finally { setBusy(false); }
  });
  // File sharing is an optional enhancement. Download works independently.
  function fileSharingAvailable() {
    try { return !!(navigator.share && navigator.canShare && navigator.canShare({ files: [new File([''], 'oddling.png', { type: 'image/png' })] })); }
    catch { return false; }
  }
  $('share').hidden = !fileSharingAvailable();
  $('share').addEventListener('click', async () => {
    if (busy) return;
    settleEdits(); setBusy(true); announce(t('saving'));
    const snapshot = copy(state);
    try {
      const blob = await pngBlob(snapshot), file = new File([blob], fileName(snapshot), { type: 'image/png' });
      if (!navigator.canShare({ files: [file] })) throw new Error('File sharing unavailable');
      await navigator.share({ files: [file] }); announce(t('shared'));
    } catch (error) { announce(error?.name === 'AbortError' ? '' : t('shareError')); }
    finally { setBusy(false); }
  });
  applyLanguage();
  // Shared rendering stays in the original maker; links never include its name.
  window.OddlingsMaker = Object.freeze({
    getState: () => copy(state), getLanguage: () => lang,
    getInitial: () => copy(initial), svgFor, pngBlob,
    loadState(input) {
      configureOddling(input);
      history = []; nameEditStart = null; colorEditStart = null; render();
    },
    setLanguage(value) {
      if (!['ko', 'en'].includes(value)) throw new Error('Invalid language');
      settleEdits(); lang = value; applyLanguage();
    }
  });
  // Optional browser-native tooling uses the same local state and undo path.
  const webMCPStatus = { status: 'unsupported' };
  function configureOddling(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Expected a configuration object');
    const allowed = new Set(['body', 'face', 'limbs', 'deco', 'color', 'name']);
    for (const [key, value] of Object.entries(input)) {
      if (!allowed.has(key)) throw new Error('Unknown configuration field');
      if (key in groups && (!Number.isInteger(value) || value < 0 || value >= groups[key].length)) throw new Error('Invalid part index');
      if (key === 'color' && (typeof value !== 'string' || !/^#[0-9a-f]{6}$/i.test(value))) throw new Error('Invalid color');
      if (key === 'name' && (typeof value !== 'string' || value.length > 24 || /[\u0000-\u001f\u007f]/.test(value))) throw new Error('Invalid name');
    }
    change({ ...input, ...(input.color ? { color: input.color.toLowerCase() } : {}) });
    return copy(state);
  }
  if (document.modelContext?.registerTool) {
    const lifecycle = new AbortController();
    window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
    try {
      Promise.resolve(document.modelContext.registerTool({
        name: 'configure_oddling', title: 'Mix an oddling',
        description: 'Choose body, face, limbs, extra, color, or optional name. Updates this browser page and its undo history. No upload or network request.',
        inputSchema: { type: 'object', additionalProperties: false, properties: {
          body: { type: 'integer', minimum: 0, maximum: 5 }, face: { type: 'integer', minimum: 0, maximum: 5 }, limbs: { type: 'integer', minimum: 0, maximum: 3 }, deco: { type: 'integer', minimum: 0, maximum: 5 }, color: { type: 'string', pattern: '^#[0-9a-fA-F]{6}$' }, name: { type: 'string', maxLength: 24 }
        } }, annotations: { readOnlyHint: false, untrustedContentHint: true }, execute: configureOddling
      }, { signal: lifecycle.signal })).then(() => { webMCPStatus.status = 'registered'; }).catch(() => { webMCPStatus.status = 'registration-failed'; });
    } catch { webMCPStatus.status = 'registration-failed'; }
  }
  // Opt-in diagnostics for the local QA harness; no network, storage, or public endpoint.
  if (['127.0.0.1', 'localhost', '::1'].includes(location.hostname) && new URLSearchParams(location.search).has('qa')) {
    window.OddlingsQA = Object.freeze({
      svgFor, creatureArt, pngBlob, configureOddling,
      getWebMCPStatus: () => copy(webMCPStatus),
      getState: () => copy(state),
      historyLength: () => history.length,
      getGroups: () => Object.fromEntries(Object.entries(groups).map(([key, value]) => [key, value.length])),
      getBodies: () => bodies.map(({ id, face, top, left, right, feet }) => ({ id, face, top, left, right, feet }))
    });
  }
})();

