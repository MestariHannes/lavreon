'use strict';
// Stylised side-view car renders for AJOURA. Each picture is built from real-world proportions
// (length, height, wheelbase, overhang, wheel size) of a typical car of that body style and size
// class, and the model year shifts the styling era. A model's character trait (long bonnet of a
// rear-wheel-drive saloon, fastback roof, coupé-SUV, boxy off-roader, rounded retro, rear engine)
// bends the silhouette further so the picture matches the real model. No manufacturer branding;
// the body colour drives every shade so one model can be repainted live. All cars face right
// (driving direction) and stand on y = 150.
(() => {
  const clamp = n => Math.max(0, Math.min(255, Math.round(n)));
  const rgb = hex => { const v = parseInt(hex.slice(1), 16); return [v >> 16 & 255, v >> 8 & 255, v & 255]; };
  const hex = c => '#' + c.map(n => clamp(n).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, t) => hex(rgb(a).map((n, i) => n + (rgb(b)[i] - n) * t));
  const luminance = c => { const [r, g, b] = rgb(c); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };

  // Reference dimensions in metres: [length, height, wheelbase, front overhang, wheel diameter].
  // Size classes: a mini · b small · c compact · d mid-size · e executive/large · f luxury/full-size.
  const dims = {
    sedan: { b: [4.35, 1.50, 2.63, 0.82, 0.62], c: [4.55, 1.44, 2.70, 0.86, 0.65], d: [4.71, 1.44, 2.85, 0.80, 0.67], e: [4.94, 1.47, 2.94, 0.84, 0.69], f: [5.18, 1.50, 3.11, 0.90, 0.71] },
    hatchback: { a: [3.60, 1.50, 2.42, 0.62, 0.58], b: [4.06, 1.46, 2.55, 0.80, 0.61], c: [4.28, 1.46, 2.64, 0.88, 0.63], d: [4.75, 1.40, 2.83, 0.88, 0.67], e: [4.98, 1.42, 2.95, 0.90, 0.70] },
    wagon: { b: [4.26, 1.49, 2.56, 0.83, 0.62], c: [4.65, 1.47, 2.69, 0.88, 0.64], d: [4.75, 1.45, 2.85, 0.82, 0.67], e: [4.95, 1.48, 2.94, 0.84, 0.69] },
    suv: { a: [3.65, 1.72, 2.25, 0.62, 0.68], b: [4.12, 1.56, 2.55, 0.82, 0.66], c: [4.50, 1.62, 2.68, 0.88, 0.70], d: [4.72, 1.67, 2.86, 0.88, 0.73], e: [4.94, 1.76, 2.98, 0.95, 0.77], f: [5.15, 1.84, 3.10, 0.95, 0.80] },
    coupe: { a: [3.70, 1.45, 2.30, 0.68, 0.58], b: [4.20, 1.30, 2.47, 0.84, 0.64], c: [4.54, 1.39, 2.74, 0.82, 0.66], d: [4.70, 1.38, 2.84, 0.84, 0.67], e: [4.98, 1.36, 2.94, 0.90, 0.70] },
    van: { b: [4.40, 1.80, 2.78, 0.86, 0.64], c: [4.53, 1.66, 2.79, 0.88, 0.66], d: [5.14, 1.90, 3.20, 0.95, 0.68], e: [5.93, 2.60, 3.66, 0.98, 0.72] },
    pickup: { d: [5.33, 1.82, 3.09, 0.90, 0.78] }
  };
  const order = ['a', 'b', 'c', 'd', 'e', 'f'];
  const defaultSize = { sedan: 'd', hatchback: 'c', wagon: 'd', suv: 'd', coupe: 'c', van: 'c', pickup: 'd' };
  const pickDims = (type, size) => {
    const table = dims[type];
    if (table[size]) return table[size];
    const i = order.indexOf(size), keys = Object.keys(table);
    if (i < 0) return table[defaultSize[type]];
    return table[keys.reduce((best, k) => Math.abs(order.indexOf(k) - i) < Math.abs(order.indexOf(best) - i) ? k : best, keys[0])];
  };
  // Styling eras: 0 before 1990 (square, chrome bumpers), 1 1990–1999 (boxy, low waist, big glass),
  // 2 2000–2011, 3 from 2012 (high waist, raked glass).
  const eraOf = year => !year ? 3 : year < 1990 ? 0 : year < 2000 ? 1 : year < 2012 ? 2 : 3;

  function profile(type, size, era, trait, real) {
    // trait: named traits and/or spec letters (r rear-drive, f fastback, b boxy, m mid/rear engine, t tall small car).
    const tr = String(trait || ''), named = { rwd: 'r', fast: 'f', csuv: 'f', box: 'b', round: 'o', rear: 'm' }[tr], letters = named || tr;
    const has = c => letters.includes(c), old = era === 0, e = Math.max(1, era);
    let [L, H, WB, FO, D0] = pickDims(type, size);
    if (real) { const k = real[0] / L; [L, H, WB] = real; FO = Math.min(FO * k, (L - WB) * 0.55); }
    if (has('r')) FO -= 0.08;
    if (has('m')) FO -= 0.05;
    if (has('b')) { if (!real) H += type === 'suv' ? 0.12 : 0.04; FO -= 0.12; }
    if (!real && (has('o') || has('t')) && (type === 'hatchback' || type === 'coupe')) H += 0.04;
    const D = D0 * (old ? 0.88 : e === 1 ? 0.92 : e === 2 ? 0.96 : 1) * (has('b') ? 1.06 : 1), xf = FO, xr = FO + WB;
    const tall = type === 'suv' || type === 'van' || type === 'pickup';
    const yb = type === 'pickup' ? 0.30 : type === 'suv' ? 0.24 : type === 'van' ? 0.22 : 0.18;
    const belt = H * (type === 'van' ? 0.55 : type === 'pickup' ? 0.66 : (old ? 0.57 : e === 1 ? 0.60 : e === 2 ? 0.635 : 0.665)) + (type === 'suv' ? 0.02 : 0) - (has('b') ? 0.04 : 0);
    const hood = { sedan: 0.88, hatchback: 0.58, wagon: 0.80, suv: 0.62, coupe: 0.98, van: 0.18, pickup: 0.60 }[type] + (size === 'f' || size === 'e' ? 0.1 : 0) - (size === 'a' ? 0.15 : 0)
      + (has('r') ? (type === 'coupe' ? 0.08 : 0.2) : 0) + (has('m') ? 0.1 : 0) - ((has('o') || has('t')) ? 0.08 : 0) + (old && type !== 'van' ? 0.08 : 0);
    const hf = has('m') ? 0.62 : has('b') ? belt - 0.04 : tall ? belt - 0.16 : belt - (old ? 0.08 : e === 1 ? 0.12 : 0.18);
    const rake = type === 'van' ? 1.25 : has('b') ? 0.55 : type === 'pickup' ? 1.05 : old ? 1.0 : (e === 1 ? 1.05 : e === 2 ? 1.45 : 1.7) * (tall ? 0.85 : 1) * (has('m') || (has('o') || has('t')) ? 1.15 : 1);
    const xc = xf + hood * (e === 1 ? 0.95 : 1), xa = xc + (H - belt) * rake;
    const round = has('b') ? 0.04 : (has('o') || has('t')) ? 0.55 : old ? 0.06 : e === 1 ? 0.1 : e === 2 ? 0.22 : 0.32, tail = yb + (tall ? 0.38 : 0.30);
    const nose = has('b') || old ? 0.04 : (has('o') || has('t')) ? 0.22 : 0.1;
    const front = [[0.10, yb + 0.03, 0], [0, has('m') ? 0.44 : (tall ? 0.62 : 0.5) - (e === 1 ? 0.04 : 0), nose], [has('b') ? 0.02 : 0.05, hf, nose], [xc, belt, 0.12], [xa, H - 0.015, round]];
    let rear, dlo, pillar = xf + WB * 0.6, doors = 4;
    if (type === 'sedan') {
      const re = xr - (old ? 0.08 : 0.28 - (e === 1 ? 0.1 : 0)), deck = L - (old ? 0.6 : size === 'f' ? 0.62 : 0.56);
      rear = [[(xa + re) / 2, H, 0.5], [re, H - 0.05, round], [deck, belt + 0.08, 0.12], [L - 0.03, belt + 0.04, 0.05], [L, tail, 0.08]];
      dlo = [[re - 0.06, H - 0.09], [xr - 0.12, belt + 0.04]];
    } else if (type === 'hatchback' && (size === 'd' || size === 'e')) {
      const re = xr - 0.5;
      rear = [[(xa + re) / 2, H, 0.5], [re, H - 0.06, 0.4], [L - 0.14, belt + 0.11, 0.12], [L - 0.02, belt + 0.07, 0.05], [L, tail, 0.08]];
      dlo = [[re - 0.05, H - 0.1], [xr - 0.15, belt + 0.06]];
    } else if (type === 'hatchback') {
      rear = [[(xa + L) / 2, H, 0.4], [L - 0.28, H - 0.03, 0.15], [L - 0.1, H - 0.1, 0.06], [L - 0.005, belt - 0.02, 0.1], [L, tail, 0.06]];
      dlo = [[L - 0.42, H - 0.08], [L - 0.5, belt + 0.03]];
    } else if (type === 'wagon') {
      rear = [[(xa + L) / 2, H, 0.6], [L - 0.2, H - 0.04, 0.12], [L - 0.06, H - 0.15, 0.06], [L - 0.005, belt - 0.04, 0.1], [L, tail, 0.06]];
      dlo = [[L - 0.26, H - 0.09], [L - 0.3, belt + 0.03]];
    } else if (type === 'suv') {
      rear = [[(xa + L) / 2, H, 0.6], [L - 0.22, H - 0.03, 0.12], [L - 0.07, H - 0.14, 0.06], [L - 0.005, belt - 0.06, 0.1], [L, tail, 0.06]];
      dlo = [[L - 0.28, H - 0.08], [L - 0.34, belt + 0.03]];
    } else if (type === 'coupe') {
      const re = xa + (size === 'a' ? 0.75 : size === 'b' ? 0.45 : size === 'c' ? 0.65 : 0.8);
      rear = [[re, H - 0.01, 0.35], [L - 0.55, belt + 0.1, 0.18], [L - 0.03, belt + 0.06, 0.05], [L, tail, 0.08]];
      dlo = [[re + 0.02, H - 0.08], [xa + (size === 'b' ? 0.8 : 1.35), belt + 0.04]]; doors = 1; pillar = xa + (size === 'b' ? 0.75 : 1.05);
    } else if (type === 'van') {
      rear = [[(xa + L) / 2, H, 0.8], [L - 0.08, H - 0.02, 0.12], [L, H - 0.3, 0.1], [L, tail, 0.05]];
      dlo = [[L - 0.22, H - 0.08], [L - 0.24, belt + 0.03]]; pillar = xc + 0.95;
    } else {
      const cab = xf + WB * 0.75;
      rear = [[(xa + cab) / 2, H, 0.3], [cab, H - 0.03, 0.08], [cab + 0.03, belt + 0.02, 0.03], [L - 0.03, belt + 0.02, 0.02], [L, tail, 0.04]];
      dlo = [[cab - 0.08, H - 0.08], [cab - 0.1, belt + 0.03]]; doors = 2; pillar = xf + WB * 0.47;
    }
    // Character traits that change the rear: fastback roofs, coupé-SUVs, rear engines and boxy off-roaders.
    if (has('f') && (type === 'sedan' || type === 'hatchback')) {
      const re = xa + (L - xa) * 0.3;
      rear = [[(xa + re) / 2, H, 0.6], [re, H - 0.05, 0.6], [L - 0.1, belt + 0.12, 0.25], [L - 0.01, belt + 0.06, 0.05], [L, tail, 0.08]];
      dlo = [[re - 0.02, H - 0.1], [xr - 0.08, belt + 0.06]];
    } else if (has('f') && type === 'suv') {
      const re = xa + (L - xa) * 0.32;
      rear = [[(xa + re) / 2, H, 0.6], [re, H - 0.03, 0.5], [L - 0.2, belt + 0.2, 0.3], [L - 0.02, belt + 0.04, 0.06], [L, tail, 0.06]];
      dlo = [[re + 0.15, H - 0.12], [xr - 0.05, belt + 0.04]];
    } else if (has('m')) {
      const re = xa + 0.45;
      rear = [[re, H, 0.4], [L - 0.35, belt + 0.12, 0.45], [L - 0.02, belt - 0.02, 0.1], [L, tail, 0.08]];
      dlo = [[re + 0.1, H - 0.08], [xa + 1.05, belt + 0.04]];
    } else if (has('b') && (type === 'suv' || type === 'wagon')) {
      rear = [[(xa + L) / 2, H, 0.05], [L - 0.04, H - 0.01, 0.05], [L, belt, 0.03], [L, tail, 0.03]];
      dlo = [[L - 0.2, H - 0.07], [L - 0.2, belt + 0.03]];
    } else if ((has('o') || has('t')) && type === 'hatchback') {
      rear = [[(xa + L) / 2, H, 0.6], [L - 0.2, H - 0.06, 0.4], [L - 0.02, belt - 0.02, 0.2], [L, tail, 0.08]];
      dlo = [[L - 0.36, H - 0.09], [L - 0.42, belt + 0.03]];
    }
    const top = [...front, ...rear, [L - 0.08, yb + 0.03, 0]];
    const glass = [[xc + 0.1, belt + 0.03, 0.04], [xa + 0.04, H - 0.08, round * 0.6], [dlo[0][0], dlo[0][1], 0.12], [dlo[1][0], dlo[1][1], 0.04]];
    return { L, H, D, xf, xr, yb, belt, hf, xc, top, glass, pillar, doors, tall, old };
  }

  // Model-specific outline traced from the real car: key points of the side profile in metres
  // (x from the front bumper, y from the ground). See car-shapes.js for the field order.
  function fromForm(f, era) {
    const P = (x, y, r) => [x, y, r];
    const { L, H, fo, wd, sill } = f, xf = fo, xr = fo + f.WB, round = f.round, old = era === 0;
    const peak = f.peak || H - 0.005, mid = [(f.ws[0] + f.roof[0]) / 2, peak];
    const top = [P(0.1, sill + 0.05, 0), P(0, f.bump, 0.06 + round * 0.12), P(f.nose[0], f.nose[1], 0.06 + round * 0.2),
      P(f.cowl[0], f.cowl[1], 0.08), P(f.ws[0], f.ws[1], 0.08 + round * 0.3), P(mid[0], mid[1], 0.5),
      P(f.roof[0], f.roof[1], 0.06 + round * 0.35), P(f.back[0], f.back[1], 0.04 + round * 0.12)];
    if (f.deck[0] - f.back[0] > 0.04 || Math.abs(f.deck[1] - f.back[1]) > 0.04) top.push(P(f.deck[0], f.deck[1], 0.04 + round * 0.06));
    if (L - f.deck[0] > 0.02) top.push(P(L, f.deck[1] - 0.04, 0.04));
    top.push(P(L, f.tail, 0.05 + round * 0.08), P(L - 0.08, sill + 0.03, 0));
    // Height of the top outline at x, used to fit the side windows under the roof.
    const outline = top.slice(3, -2), roofAt = x => {
      for (let i = 1; i < outline.length; i++) {
        const [x1, y1] = outline[i - 1], [x2, y2] = outline[i];
        if (x >= x1 && x <= x2) return y1 + (y2 - y1) * (x - x1) / ((x2 - x1) || 1);
      }
      return H;
    };
    const [bf, br] = f.belt, beltAt = x => bf + (br - bf) * (x - f.cowl[0]) / ((f.dlo - f.cowl[0]) || 1);
    const gx = f.gx || Math.min(f.roof[0], f.dlo) - 0.1, g0 = f.cowl[0] + 0.08;
    const glass = [[g0, beltAt(g0) + 0.02, 0.03], [f.ws[0] + 0.03, f.ws[1] - 0.06, 0.04 + round * 0.12],
      [gx, roofAt(gx) - 0.065, 0.06 + round * 0.12], [f.dlo, beltAt(f.dlo) + 0.025, 0.04]];
    const tall = f.body === 'suv' || f.body === 'van' || f.body === 'pickup';
    return { L, H, D: wd, xf, xr, yb: sill, belt: (bf + br) / 2, beltAt, xc: f.cowl[0], top, glass,
      pillar: f.bp, doors: f.doors, tall, old, spare: f.spare, clad: f.clad, tailY: (f.deck[1] + f.tail) / 2 + 0.03,
      hf: f.bump + (f.nose[1] - f.bump) * 0.72, lampX: Math.max(0.03, f.nose[0] * 0.45), lamp: f.lamp,
      tallTail: f.tl === 'tall' ? [[f.roof[0] + (f.back[0] - f.roof[0]) * 0.25, roofAt(f.roof[0] + (f.back[0] - f.roof[0]) * 0.25)], f.back, [L, f.deck[1] - 0.04], [L, Math.max(f.tail, f.deck[1] - 0.3)]] : null };
  }

  // Polyline with rounded corners (quadratic) through points [x, y, radius] in pixels.
  function rounded(points, closed) {
    const n = points.length, out = [];
    for (let i = 0; i < n; i++) {
      const [x, y, r] = points[i], prev = points[(i - 1 + n) % n], next = points[(i + 1) % n];
      if ((!closed && (i === 0 || i === n - 1)) || !r) { out.push(`${out.length ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`); continue; }
      const d1 = Math.hypot(prev[0] - x, prev[1] - y), d2 = Math.hypot(next[0] - x, next[1] - y), c = Math.min(r, d1 / 2, d2 / 2);
      const a = [x + (prev[0] - x) / d1 * c, y + (prev[1] - y) / d1 * c], b = [x + (next[0] - x) / d2 * c, y + (next[1] - y) / d2 * c];
      out.push(`${out.length ? 'L' : 'M'}${a[0].toFixed(1)} ${a[1].toFixed(1)}Q${x.toFixed(1)} ${y.toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`);
    }
    return out.join('') + (closed ? 'Z' : '');
  }

  function wheel(x, y, r, id) {
    const R = r * 0.68, f = n => n.toFixed(1);
    return `<g class="wheel" transform="translate(${f(x)} ${f(y)})"><circle r="${f(r)}" fill="#20262d" stroke="#14181d" stroke-width="1.2"/><circle r="${f(r - 2.2)}" fill="none" stroke="#3a424c" stroke-width="1"/><circle r="${f(R)}" fill="url(#rim${id})" stroke="#3f4852" stroke-width="1.2"/><g class="spokes">` +
      [0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map(a => `<path d="M${f(r * 0.17)} -1.1L${f(R - 1.5)} -2.4M${f(r * 0.17)} 1.1L${f(R - 1.5)} 2.4" stroke="#56606b" stroke-width=".9" transform="rotate(${a})"/>`).join('') +
      `</g><circle r="${f(R - 1.8)}" fill="none" stroke="#8792a0" stroke-width=".7"/><circle r="${f(r * 0.17)}" fill="#e3e8ed" stroke="#3f4852" stroke-width="1"/><circle r="${f(r * 0.06)}" fill="#56606b"/></g>`;
  }

  let uid = 0;
  // shape: optional { size: 'a'…'f', year, trait, dims: [length, height, wheelbase] in metres } from the car's
  // make, model and model year.
  function render(type, color, label, shape) {
    if (!dims[type]) type = 'sedan';
    const s = shape || {}, era = eraOf(Number(s.year)), p = s.form ? fromForm(s.form, era) :
      profile(type, s.size || defaultSize[type], era, s.trait, Array.isArray(s.dims) && s.dims.length === 3 && s.dims.every(n => n > 0.5 && n < 8) ? s.dims : null);
    const beltAt = p.beltAt || (() => p.belt);
    const id = ++uid, c = /^#[0-9a-f]{6}$/i.test(color) ? color : '#c9d0d8', groundY = 150;
    const k = Math.min(356 / p.L, 122 / p.H), x0 = 200 - p.L * k / 2;
    const X = x => x0 + x * k, Y = y => groundY - y * k, pt = ([x, y, r]) => [X(x), Y(y), (r || 0) * k];
    const dark = luminance(c) < 0.25, light = mix(c, '#ffffff', dark ? 0.32 : 0.45), shade = mix(c, '#000000', dark ? 0.35 : 0.42);
    const ink = '#262c33', line = mix(c, '#000000', dark ? 0.55 : 0.3), r = p.D / 2 * k, arch = r + 0.055 * k, wy = groundY - r;
    // Body outline: rounded top profile, then the sill with both wheel arches cut out.
    const sill = Y(p.yb), archX = Math.sqrt(Math.max(0, arch * arch - (sill - wy) ** 2));
    const big = sill > wy ? 1 : 0, body = rounded(p.top.map(pt), false) +
      `L${(X(p.xr) + archX).toFixed(1)} ${sill.toFixed(1)}A${arch.toFixed(1)} ${arch.toFixed(1)} 0 ${big} 0 ${(X(p.xr) - archX).toFixed(1)} ${sill.toFixed(1)}` +
      `L${(X(p.xf) + archX).toFixed(1)} ${sill.toFixed(1)}A${arch.toFixed(1)} ${arch.toFixed(1)} 0 ${big} 0 ${(X(p.xf) - archX).toFixed(1)} ${sill.toFixed(1)}Z`;
    const glass = rounded(p.glass.map(pt), true);
    const beltY = Y(p.belt), bp = X(p.pillar), by = x => Y(beltAt(x)), sh = x => by(x) + 0.07 * k;
    const frontDoor = X(p.xf) + arch + 0.05 * k, rearDoor = X(p.xr) - arch - 0.02 * k;
    const fdY = Y(beltAt(p.xf + p.D / 2 + 0.1)), rdY = Y(beltAt(p.xr - p.D / 2 - 0.05)), bpY = Y(beltAt(p.pillar));
    const doorLines = `M${frontDoor.toFixed(1)} ${(fdY + 2).toFixed(1)}C${(frontDoor - 3).toFixed(1)} ${(fdY + 20).toFixed(1)} ${(frontDoor - 2).toFixed(1)} ${(sill - 12).toFixed(1)} ${(frontDoor + 3).toFixed(1)} ${(sill - 2).toFixed(1)}` +
      (p.doors === 1 ? '' : `M${bp.toFixed(1)} ${(bpY + 1).toFixed(1)}V${(sill - 2).toFixed(1)}`) +
      (p.doors === 4 ? `M${rearDoor.toFixed(1)} ${(rdY + 1).toFixed(1)}C${(rearDoor + 3).toFixed(1)} ${(rdY + 18).toFixed(1)} ${(rearDoor + 2).toFixed(1)} ${(sill - 16).toFixed(1)} ${(rearDoor - 2).toFixed(1)} ${(sill - 6).toFixed(1)}` : '');
    const handle = x => `<rect x="${(x - 7).toFixed(1)}" y="${(Y(beltAt((x - x0) / k)) + 0.1 * k).toFixed(1)}" width="13" height="3.2" rx="1.6" fill="${mix(c, '#000000', 0.12)}" stroke="${ink}" stroke-width=".9"/>`;
    const hx = X(p.lampX || 0.04), hy = Y(p.hf) + 2, lamp = p.lamp === 'round' ? `M${(hx + 0.12 * k).toFixed(1)} ${hy.toFixed(1)}m-${(0.085 * k).toFixed(1)} 0a${(0.085 * k).toFixed(1)} ${(0.085 * k).toFixed(1)} 0 1 0 ${(0.17 * k).toFixed(1)} 0a${(0.085 * k).toFixed(1)} ${(0.085 * k).toFixed(1)} 0 1 0 -${(0.17 * k).toFixed(1)} 0Z` : p.lamp === 'square' ? `M${(hx - 1).toFixed(1)} ${(hy - 0.04 * k).toFixed(1)}h${(0.3 * k).toFixed(1)}v${(0.13 * k).toFixed(1)}h-${(0.3 * k).toFixed(1)}Z` : `M${hx.toFixed(1)} ${(hy + 2).toFixed(1)}Q${(hx + 2).toFixed(1)} ${(hy - 1).toFixed(1)} ${(hx + 0.42 * k).toFixed(1)} ${(hy + 1).toFixed(1)}L${(hx + 0.36 * k).toFixed(1)} ${(hy + 0.08 * k).toFixed(1)}Q${(hx + 4).toFixed(1)} ${(hy + 0.09 * k).toFixed(1)} ${(hx - 1).toFixed(1)} ${(hy + 0.07 * k).toFixed(1)}Z`;
    const tx = X(p.L), ty = Y(p.tailY || (p.tall ? p.belt - 0.02 : p.belt + 0.02)), tail = `M${(tx - 0.16 * k).toFixed(1)} ${ty.toFixed(1)}H${(tx - 0.5).toFixed(1)}V${(ty + 0.1 * k).toFixed(1)}H${(tx - 0.12 * k).toFixed(1)}Z`;
    const mx = X(p.xc + 0.12), my = by(p.xc + 0.12) - 1, mirror = `M${mx.toFixed(1)} ${my.toFixed(1)}l${(0.16 * k).toFixed(1)} -2l2 ${(0.07 * k).toFixed(1)}l${(-0.15 * k).toFixed(1)} 2z`;
    return `<svg class="car-render" viewBox="0 0 400 170" role="img" aria-label="${label || 'Tyylitelty automalli'}" xmlns="http://www.w3.org/2000/svg">` +
      `<defs><linearGradient id="paint${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${light}"/><stop offset=".3" stop-color="${c}"/><stop offset=".75" stop-color="${mix(c, '#000000', 0.06)}"/><stop offset="1" stop-color="${mix(c, '#000000', 0.2)}"/></linearGradient>` +
      `<linearGradient id="sheen${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".35" stop-color="#fff" stop-opacity="${dark ? 0.1 : 0.22}"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></linearGradient>` +
      `<linearGradient id="glass${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7d93a8"/><stop offset=".55" stop-color="#3a4d61"/><stop offset="1" stop-color="#4f6478"/></linearGradient>` +
      `<radialGradient id="rim${id}" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#f4f6f8"/><stop offset=".7" stop-color="#cfd6dd"/><stop offset="1" stop-color="#a3adb8"/></radialGradient>` +
      `<radialGradient id="shadow${id}"><stop offset="0" stop-color="#0d1b2a" stop-opacity=".34"/><stop offset="1" stop-color="#0d1b2a" stop-opacity="0"/></radialGradient>` +
      `<clipPath id="clip${id}"><path d="${body}"/></clipPath><clipPath id="glassclip${id}"><path d="${glass}"/></clipPath></defs>` +
      `<g class="car-own" transform="matrix(-1 0 0 1 400 0)">` +
      `<ellipse cx="200" cy="${groundY + 2}" rx="${(p.L * k / 2 + 10).toFixed(1)}" ry="10" fill="url(#shadow${id})"/>` +
      `<circle cx="${X(p.xf).toFixed(1)}" cy="${wy.toFixed(1)}" r="${(arch - 1).toFixed(1)}" fill="#0f141a"/><circle cx="${X(p.xr).toFixed(1)}" cy="${wy.toFixed(1)}" r="${(arch - 1).toFixed(1)}" fill="#0f141a"/>` +
      `<path d="${body}" fill="url(#paint${id})"/>` +
      `<g clip-path="url(#clip${id})">` +
        `<path d="${glass}" fill="url(#glass${id})"/>` +
        `<g clip-path="url(#glassclip${id})"><rect x="${(bp - 3.5).toFixed(1)}" y="0" width="7" height="${bpY.toFixed(1)}" fill="${p.doors === 1 ? line : shade}" fill-opacity="${p.doors === 1 ? 0.6 : 1}"/><path d="M${(bp - 70).toFixed(1)} ${bpY.toFixed(1)}L${(bp - 40).toFixed(1)} 0" stroke="#fff" stroke-opacity=".14" stroke-width="12"/></g>` +
        `<path d="${glass}" fill="none" stroke="${ink}" stroke-width="2"/>` +
        `<path d="M0 ${sh(-x0 / k).toFixed(1)}L400 ${sh((400 - x0) / k).toFixed(1)}" stroke="#fff" stroke-opacity="${dark ? 0.3 : 0.55}" stroke-width="1.6"/><path d="M0 ${(sh(-x0 / k) + 3).toFixed(1)}L400 ${(sh((400 - x0) / k) + 3).toFixed(1)}" stroke="${line}" stroke-opacity=".3" stroke-width="1"/>` +
        `<path d="M0 ${by(-x0 / k).toFixed(1)}L400 ${by((400 - x0) / k).toFixed(1)}V${sill.toFixed(1)}H0Z" fill="url(#sheen${id})"/>` +
        `<path d="${doorLines}" fill="none" stroke="${ink}" stroke-opacity=".75" stroke-width="1.1"/>` +
        `<path d="M0 ${(sill - 0.07 * k).toFixed(1)}H400" stroke="${ink}" stroke-opacity=".45" stroke-width=".9"/>` +
        (p.tallTail ? `<path d="${p.tallTail.map(([x, y], i) => (i ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(y).toFixed(1)).join('')}" fill="none" stroke="#c4323d" stroke-width="${(0.13 * k).toFixed(1)}" stroke-linejoin="round"/>` : '') +
        handle(bp - 0.28 * k) + (p.doors === 4 ? handle(rearDoor - 0.3 * k) : '') +
        `<path d="M0 ${(sill - 0.07 * k).toFixed(1)}H400V170H0Z" fill="#0d1b2a" fill-opacity=".1"/>` +
        (p.clad ? `<path d="M0 ${(sill - 0.15 * k).toFixed(1)}H400V170H0Z" fill="#262b31"/><circle cx="${X(p.xf).toFixed(1)}" cy="${wy.toFixed(1)}" r="${(arch + 0.075 * k).toFixed(1)}" fill="#262b31"/><circle cx="${X(p.xr).toFixed(1)}" cy="${wy.toFixed(1)}" r="${(arch + 0.075 * k).toFixed(1)}" fill="#262b31"/>` : '') +
        `<circle cx="${X(p.xf).toFixed(1)}" cy="${wy.toFixed(1)}" r="${(arch + 0.035 * k).toFixed(1)}" fill="none" stroke="${ink}" stroke-opacity=".55" stroke-width="1"/><circle cx="${X(p.xr).toFixed(1)}" cy="${wy.toFixed(1)}" r="${(arch + 0.035 * k).toFixed(1)}" fill="none" stroke="${ink}" stroke-opacity=".55" stroke-width="1"/>` +
      `</g>` +
      `<path d="${body}" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linejoin="round"/>` +
      `<path d="${lamp}" fill="#eef6fc" stroke="${ink}" stroke-width="1.1"/>` +
      (p.tallTail ? '' : `<path d="${tail}" fill="#c4323d" stroke="${ink}" stroke-width="1"/>`) +
      `<path d="${mirror}" fill="${c}" stroke="${ink}" stroke-width="1"/>` +
      (p.old ? `<rect x="${(X(0) - 2).toFixed(1)}" y="${(Y(p.yb + 0.22) - 2).toFixed(1)}" width="${(0.42 * k).toFixed(1)}" height="5" rx="2" fill="#d9dee4" stroke="#8b95a0" stroke-width=".8"/><rect x="${(X(p.L) - 0.42 * k + 2).toFixed(1)}" y="${(Y(p.yb + 0.22) - 2).toFixed(1)}" width="${(0.42 * k).toFixed(1)}" height="5" rx="2" fill="#d9dee4" stroke="#8b95a0" stroke-width=".8"/>` : '') +
      (p.spare ? `<rect x="${(X(p.L) - 1).toFixed(1)}" y="${(Y(p.tailY + 0.38)).toFixed(1)}" width="${(0.2 * k).toFixed(1)}" height="${(0.62 * k).toFixed(1)}" rx="${(0.08 * k).toFixed(1)}" fill="#1d232a"/>` : '') +
      wheel(X(p.xf), wy, r, id) + wheel(X(p.xr), wy, r, id) +
      `</g>` + (s.img && (s.dimsOf || s.form) ? photo(s.img, c, s.dimsOf || s.form) : '') + `</svg>`;
  }

  // Model drawings made with an image generator (white car on white, facing right). The drawn car stays as the
  // fallback until the drawing has loaded; then the background is cut out and the body tinted to the chosen colour.
  const photo = (url, c, f) => `<image class="car-model-img" x="16" y="22" width="368" height="130" preserveAspectRatio="xMidYMax meet" opacity="0" ` +
    `data-src="${String(url).replace(/"/g, '')}" data-c="${c}" data-d="${[f.L, f.WB, f.fo, f.wd].join(',')}"/>`;
  const bases = new Map(), tints = new Map();
  const load = url => new Promise((ok, fail) => { const im = new Image(); im.crossOrigin = 'anonymous'; im.onload = () => ok(im); im.onerror = fail; im.src = url; });
  // Removes the white background, finds the wheels and works out how strongly each pixel takes the paint colour.
  const prepare = (url, d) => {
    if (!bases.has(url)) bases.set(url, load(url).then(im => {
      const w = Math.min(840, im.naturalWidth), h = Math.round(im.naturalHeight * w / im.naturalWidth), cv = document.createElement('canvas');
      cv.width = w; cv.height = h;
      const cx = cv.getContext('2d', { willReadFrequently: true });
      cx.drawImage(im, 0, 0, w, h);
      const img = cx.getImageData(0, 0, w, h), px = img.data, n = w * h;
      const light = i => { const r = px[i * 4], g = px[i * 4 + 1], b = px[i * 4 + 2], mn = Math.min(r, g, b); return mn >= 232 && Math.max(r, g, b) - mn < 14; };
      const seen = new Uint8Array(n), q = new Int32Array(n);
      let head = 0, tail = 0;
      const push = i => { if (!seen[i] && light(i)) { seen[i] = 1; q[tail++] = i; } };
      for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x); }
      for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }
      while (head < tail) {
        const i = q[head++], x = i % w;
        px[i * 4 + 3] = 0;
        if (x > 0) push(i - 1);
        if (x < w - 1) push(i + 1);
        if (i >= w) push(i - w);
        if (i < n - w) push(i + w);
      }
      // Soften the cut-out edge: light pixels next to the removed background become partly transparent.
      for (let i = 0; i < n; i++) {
        if (seen[i]) continue;
        const x = i % w;
        if (!((x > 0 && seen[i - 1]) || (x < w - 1 && seen[i + 1]) || (i >= w && seen[i - w]) || (i < n - w && seen[i + w]))) continue;
        const mn = Math.min(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]);
        if (mn > 170) px[i * 4 + 3] = Math.round(255 * Math.max(0.15, (245 - mn) / 75));
      }
      let x0 = w, y0 = h, x1 = -1, y1 = -1;
      for (let i = 0; i < n; i++) if (px[i * 4 + 3]) { const x = i % w, y = (i - x) / w; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      if (x1 - x0 < w * 0.4) throw new Error('no car');
      // Wheels: best-fitting dark tyre circle near where the model's wheelbase and overhang put them.
      const [L, WB, fo, wd] = String(d).split(',').map(Number), cw = x1 - x0, wheels = [];
      const dark = (x, y) => { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= w || y >= h) return 0; const i = (y * w + x) * 4; return px[i + 3] && Math.min(px[i], px[i + 1], px[i + 2]) < 110 ? 1 : 0; };
      if (L > 0 && WB > 0 && wd > 0) for (const c0 of [x1 - fo / L * cw, x1 - (fo + WB) / L * cw]) {
        let best = null;
        for (let dr = -8; dr <= 8; dr++) {
          const r = wd / 2 / L * cw * (1 + dr * 0.025);
          for (let dx = -12; dx <= 12; dx += 2) {
            const cx2 = c0 + dx * cw / 600, cy = y1 - r;
            let sc = 0;
            for (let t = 0; t < 48; t++) sc += dark(cx2 + r * 0.96 * Math.cos(t * Math.PI / 24), cy + r * 0.96 * Math.sin(t * Math.PI / 24));
            if (!best || sc > best[0]) best = [sc, cx2, cy, r * 0.93];
          }
        }
        wheels.push(best);
      }
      const weight = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        if (!px[i * 4 + 3]) continue;
        const r = px[i * 4], g = px[i * 4 + 1], b = px[i * 4 + 2], mn = Math.min(r, g, b);
        if (Math.max(r, g, b) - mn >= 22 || mn <= 175) continue;
        const x = i % w, y = (i - x) / w;
        if (wheels.some(([, a, bb, rr]) => (x - a) ** 2 + (y - bb) ** 2 < rr * rr)) continue;
        weight[i] = Math.round(Math.min(1, (mn - 175) / 55) * 255);
      }
      return { img, weight, box: [x0, y0, x1 - x0 + 1, y1 - y0 + 1], w, h };
    }));
    return bases.get(url);
  };
  const tinted = (url, d, c) => {
    const key = url + c;
    if (!tints.has(key)) tints.set(key, prepare(url, d).then(({ img, weight, box, w, h }) => {
      const out = new ImageData(new Uint8ClampedArray(img.data), w, h), px = out.data;
      const cr = parseInt(c.slice(1, 3), 16) / 255, cg = parseInt(c.slice(3, 5), 16) / 255, cb = parseInt(c.slice(5, 7), 16) / 255;
      for (let i = 0; i < weight.length; i++) if (weight[i]) {
        const t = weight[i] / 255;
        px[i * 4] *= 1 - t + t * cr; px[i * 4 + 1] *= 1 - t + t * cg; px[i * 4 + 2] *= 1 - t + t * cb;
      }
      const cv = document.createElement('canvas');
      cv.width = box[2]; cv.height = box[3];
      cv.getContext('2d').putImageData(out, -box[0], -box[1]);
      return cv.toDataURL('image/png');
    }));
    return tints.get(key);
  };
  const hydrate = root => {
    if (!root.querySelectorAll) return;
    root.querySelectorAll('image.car-model-img[data-src]:not([data-done])').forEach(el => {
      el.setAttribute('data-done', '1');
      tinted(el.dataset.src, el.dataset.d, el.dataset.c).then(src => {
        el.setAttribute('href', src);
        el.setAttribute('opacity', '1');
        const own = el.parentNode && el.parentNode.querySelector('.car-own');
        if (own) own.setAttribute('display', 'none');
      }, () => {});
    });
  };
  if (window.MutationObserver) new MutationObserver(list => { for (const m of list) m.addedNodes.forEach(n => { if (n.nodeType === 1) hydrate(n.parentNode || n); }); })
    .observe(document.documentElement, { childList: true, subtree: true });

  const names = { sedan: 'Sedan', hatchback: 'Viistoperä', wagon: 'Farmari', suv: 'Maastoauto / SUV', coupe: 'Coupé', van: 'Tila-auto', pickup: 'Avolava' };
  // Muted, real-world paint shades rather than pure UI colours.
  const colors = [
    ['Valkoinen', '#eef1f4'], ['Hopea', '#b9c1ca'], ['Harmaa', '#6b737c'], ['Musta', '#1f2329'],
    ['Sininen', '#1e4f9c'], ['Punainen', '#a8232d'], ['Vihreä', '#2f5b45'], ['Beige', '#c8b79a']
  ];
  window.AjouraCar = { render, hydrate, bodies: Object.keys(dims), names, colors };
  document.querySelectorAll('[data-car-render]').forEach(el => {
    const d = String(el.dataset.d || '').split(',').map(Number), form = d.length === 4 && d.every(n => n > 0) ? { L: d[0], WB: d[1], fo: d[2], wd: d[3] } : undefined;
    el.innerHTML = render(el.dataset.carRender, el.dataset.color, el.dataset.label, { size: el.dataset.size, year: el.dataset.year, img: form && el.dataset.img, dimsOf: form });
  });
})();
