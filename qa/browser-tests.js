'use strict';
(async () => {
  const report = { startedAt: new Date().toISOString(), browser: navigator.userAgent, assertions: [], failures: [], unverified: ['Native file-share chooser on physical iOS/Android.', 'Physical screen reader speech. Names, roles and focus are inspected separately.'] };
  const errors = [];
  window.addEventListener('error', event => errors.push(event.message));
  window.addEventListener('unhandledrejection', event => errors.push(String(event.reason)));
  const equal = (left, right) => JSON.stringify(left) === JSON.stringify(right);
  const check = (name, condition, details) => { report.assertions.push({ name, passed: !!condition, ...(details ? { details } : {}) }); if (!condition) report.failures.push(name); };
  const click = id => document.getElementById(id).click();
  const choose = (kind, index) => { document.querySelector('[data-tab="' + kind + '"]').click(); document.querySelector('[data-part="' + index + '"]').click(); };
  const initial = OddlingsQA.getState();
  try {
    check('Six bodies / six faces / four limb styles / six decorations', equal(OddlingsQA.getGroups(), { body: 6, face: 6, limbs: 4, deco: 6 }));
    let partChecks = true;
    for (const [kind, count] of Object.entries(OddlingsQA.getGroups())) for (let index = 0; index < count; index++) {
      const before = OddlingsQA.getState(); choose(kind, index);
      partChecks &&= OddlingsQA.getState()[kind] === index;
      if (!equal(before, OddlingsQA.getState())) { click('undo'); partChecks &&= equal(before, OddlingsQA.getState()); }
    }
    check('Every individual part selects correctly and undoes to the exact state', partChecks && equal(initial, OddlingsQA.getState()));
    let randomChecks = true;
    const seen = new Set();
    for (let i = 0; i < 100; i++) {
      const before = OddlingsQA.getState(); click('random'); const after = OddlingsQA.getState(); seen.add(JSON.stringify(after));
      randomChecks &&= !equal(before, after);
      for (const [key, count] of Object.entries(OddlingsQA.getGroups())) randomChecks &&= after[key] >= 0 && after[key] < count;
    }
    check('100 random generations change the creation and stay in range', randomChecks, { unique: seen.size });
    check('History is capped at 100 entries', OddlingsQA.historyLength() === 100);
    const randomState = OddlingsQA.getState(); click('reset');
    check('Reset restores every field', equal(OddlingsQA.getState(), initial)); click('undo');
    check('Reset is undoable', equal(OddlingsQA.getState(), randomState));
    let paletteChecks = true;
    for (const color of [...document.querySelectorAll('[data-color]')].map(button => button.dataset.color)) {
      const before = OddlingsQA.getState(); document.querySelector('[data-color="' + color + '"]').click(); paletteChecks &&= OddlingsQA.getState().color === color;
      if (!equal(before, OddlingsQA.getState())) { click('undo'); paletteChecks &&= equal(before, OddlingsQA.getState()); }
    }
    check('All eight palette colors select and undo', paletteChecks);
    const beforeCustom = OddlingsQA.getState(), custom = document.getElementById('custom-color');
    for (const color of ['#123456', '#abcdef', '#bc2345']) { custom.value = color; custom.dispatchEvent(new Event('input', { bubbles: true })); }
    custom.dispatchEvent(new Event('change', { bubbles: true }));
    check('Custom color commits correctly', OddlingsQA.getState().color === '#bc2345'); click('undo');
    check('A custom color editing session is one undo step', equal(OddlingsQA.getState(), beforeCustom));
    const url = location.href, name = document.getElementById('name');
    name.focus(); name.value = '말랑 <&> 친구'; name.dispatchEvent(new Event('input', { bubbles: true })); name.blur();
    check('Optional name is literal text and never enters the URL', document.getElementById('character-name').textContent === '말랑 <&> 친구' && location.href === url);
    const beforeLanguage = OddlingsQA.getState(); click('language');
    check('English labels, metadata and optional-name label translate', document.documentElement.lang === 'en' && document.getElementById('download').textContent.trim() === 'Save PNG' && document.querySelector('label[for="name"]').textContent.trim() === 'Give it a name? Optional');
    check('Language switching preserves the exact creation', equal(OddlingsQA.getState(), beforeLanguage)); click('language');
    check('Korean labels return', document.documentElement.lang === 'ko');
    const beforeTool = OddlingsQA.getState();
    OddlingsQA.configureOddling({ body: 2, face: 1, color: '#AABBCC', name: 'Tool test' });
    check('Browser-native configuration uses the visible app state', document.getElementById('name').value === 'Tool test' && OddlingsQA.getState().body === 2 && OddlingsQA.getState().face === 1 && OddlingsQA.getState().color === '#aabbcc');
    const validToolState = OddlingsQA.getState(); let invalidRejected = 0;
    for (const input of [{ body: 99 }, { color: 'red' }, { name: 'x'.repeat(25) }, { unknown: true }, { name: '\u0001' }]) try { OddlingsQA.configureOddling(input); } catch { invalidRejected++; }
    check('Invalid browser-native configuration cannot corrupt state', invalidRejected === 5 && equal(validToolState, OddlingsQA.getState())); click('undo');
    check('Browser-native configuration is undoable', equal(beforeTool, OddlingsQA.getState()));
    report.webMCP = OddlingsQA.getWebMCPStatus();
    if (report.webMCP.status !== 'registered') report.unverified.push('Native WebMCP registration context is unavailable; shared configuration behavior and validation pass.');
    const holder = document.createElement('div'); document.body.append(holder);
    const geometryFailures = [], faceFailures = [];
    let checked = 0, minX = 512, minY = 512, maxX = 0, maxY = 0;
    for (let body = 0; body < 6; body++) for (let face = 0; face < 6; face++) for (let limbs = 0; limbs < 4; limbs++) for (let deco = 0; deco < 6; deco++) {
      holder.innerHTML = OddlingsQA.svgFor({ body, face, limbs, deco, color: '#ad8bfa', name: '' }); const svg = holder.querySelector('svg');
      for (const layer of svg.querySelectorAll('[data-layer]')) {
        if (!layer.children.length) continue;
        const box = layer.getBBox(), matrix = layer.getCTM();
        const points = [[box.x, box.y], [box.x + box.width, box.y + box.height]].map(([x, y]) => new DOMPoint(x, y).matrixTransform(matrix));
        // Convert back from document coordinates to the outer SVG's user space.
        const inverse = svg.getCTM().inverse(), [first, last] = points.map(point => point.matrixTransform(inverse));
        const bounds = { x: first.x, y: first.y, right: last.x, bottom: last.y };
        minX = Math.min(minX, bounds.x); minY = Math.min(minY, bounds.y); maxX = Math.max(maxX, bounds.right); maxY = Math.max(maxY, bounds.bottom);
        if (bounds.x < 32 || bounds.y < 32 || bounds.right > 480 || bounds.bottom > 440) geometryFailures.push({ body, face, limbs, deco, layer: layer.dataset.layer, bounds });
      }
      if (limbs === 0 && deco === 0) {
        const skin = svg.querySelector('[data-skin]'), inverse = skin.getCTM().inverse();
        for (const mark of svg.querySelector('[data-layer="face"]').children) {
          const box = mark.getBBox(), matrix = mark.getCTM();
          const points = [[box.x+box.width/2,box.y+box.height/2],[box.x,box.y+box.height/2],[box.x+box.width,box.y+box.height/2],[box.x+box.width/2,box.y],[box.x+box.width/2,box.y+box.height]];
          for (const [x,y] of points) { const point = new DOMPoint(x,y).matrixTransform(matrix).matrixTransform(inverse); if (!skin.isPointInFill(point)) faceFailures.push({ body, face, mark: mark.tagName, x: point.x, y: point.y }); }
        }
      }
      checked++;
    }
    holder.remove();
    report.combinations = { checked, geometryFailures, faceFailures, bounds: { minX, minY, maxX, maxY } };
    check('All 864 combinations keep every core layer inside the export safe region', checked === 864 && !geometryFailures.length);
    check('All face marks remain inside their body silhouette', !faceFailures.length);
    const sampleSvg = OddlingsQA.svgFor({ body: 0, face: 0, limbs: 0, deco: 0, color: '#ad8bfa', name: '말랑 <&> 친구' }, true);
    const parsed = new DOMParser().parseFromString(sampleSvg, 'image/svg+xml');
    report.svgParserError = parsed.querySelector('parsererror')?.textContent || null;
    check('Exported SVG is valid XML', !report.svgParserError);
    const pngChecks = [];
    for (let body = 0; body < 6; body++) for (let face = 0; face < 6; face++) {
      const blob = await OddlingsQA.pngBlob({ body, face, limbs: face % 4, deco: face, color: '#ad8bfa', name: '말랑 <&> 친구' });
      const bitmap = await createImageBitmap(blob), canvas = document.createElement('canvas'); canvas.width = canvas.height = 1024;
      const ctx = canvas.getContext('2d'); ctx.drawImage(bitmap,0,0); const pixel = ctx.getImageData(512,520,1,1).data;
      pngChecks.push({ body, face, bytes: blob.size, width: bitmap.width, height: bitmap.height, pixel: [...pixel] }); bitmap.close();
    }
    report.pngChecks = pngChecks;
    check('36 PNG regenerations produce nonempty 1024 × 1024 images', pngChecks.every(png => png.width === 1024 && png.height === 1024 && png.bytes > 15000 && png.pixel[3] === 255));
    const realToBlob = HTMLCanvasElement.prototype.toBlob;
    try {
      HTMLCanvasElement.prototype.toBlob = function(callback) { callback(null); };
      click('download');
      for (let i=0;i<100&&document.getElementById('download').disabled;i++) await new Promise(resolve => setTimeout(resolve,10));
      check('Failed PNG output shows a helpful message and releases the save control', document.getElementById('status').textContent === '그림을 저장하지 못했어요. 다시 눌러주세요.' && !document.getElementById('download').disabled);
    } finally { HTMLCanvasElement.prototype.toBlob = realToBlob; }
    // Test the guarded share button without opening the OS chooser or sending a file.
    let shareSupported = false;
    try { shareSupported = !!(navigator.share && navigator.canShare && navigator.canShare({ files: [new File([''], 'oddling.png', { type: 'image/png' })] })); } catch {}
    check('Optional sharing matches native feature detection', document.getElementById('share').hidden === !shareSupported, { shareSupported });
    check('No account, upload, iframe, or remote asset in the app', !document.querySelector('iframe,input[type="file"],input[type="password"],input[type="email"]') && [...document.querySelectorAll('[src],[href]')].every(element => { const value = element.getAttribute('src') || element.getAttribute('href'); return value.startsWith('./') || value.startsWith('#') || value.startsWith('/') || value.startsWith('data:'); }));
    const resources = performance.getEntriesByType('resource').map(entry => entry.name); report.resourceRequests = resources;
    check('Only loopback assets and browser-local blob resources requested', resources.every(url => url.startsWith('http://127.0.0.1:4176/') || url.startsWith('blob:http://127.0.0.1:4176/')));
    check('App processing explicitly forbids outgoing connections', document.querySelector('meta[http-equiv="Content-Security-Policy"]').content.includes("connect-src 'none'"));
    check('No runtime errors during tests', !errors.length, errors);
    click('reset');
  } catch (error) { report.failures.push('Unexpected test exception'); report.exception = error.stack || String(error); report.exceptionType = error?.constructor?.name; report.failedImage = error?.target?.src || null; }
  report.status = report.failures.length ? 'failed' : 'passed'; report.finishedAt = new Date().toISOString();
  const heading = document.createElement('h2'); heading.className = 'qa-summary'; heading.textContent = 'Local QA: ' + report.status + ' · ' + report.assertions.filter(item => item.passed).length + '/' + report.assertions.length;
  const output = document.createElement('pre'); output.id = 'qa-report'; output.className = 'qa-report'; output.textContent = JSON.stringify(report, null, 2);
  document.body.append(heading, output);
})();
