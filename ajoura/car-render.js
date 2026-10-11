'use strict';
// Stylised side-view car renders for AJOURA. Each picture is built from real-world proportions
// (length, height, wheelbase, overhang, wheel size) of a typical car of that body style and size
// class, and the model year shifts the styling era. No manufacturer branding; the body colour
// drives every shade so one model can be repainted live. All cars face left and stand on y = 150.
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
  // Styling eras: 1 before 2000 (boxy, low waist, big glass), 2 2000–2011, 3 from 2012 (high waist, raked glass).
  const eraOf = year => !year ? 3 : year < 2000 ? 1 : year < 2012 ? 2 : 3;

  function profile(type, size, era) {
    const [L, H, WB, FO, D0] = pickDims(type, size), e = era;
    const D = D0 * (e === 1 ? 0.92 : e === 2 ? 0.96 : 1), xf = FO, xr = FO + WB;
    const tall = type === 'suv' || type === 'van' || type === 'pickup';
    const yb = type === 'pickup' ? 0.30 : type === 'suv' ? 0.24 : type === 'van' ? 0.22 : 0.18;
    const belt = H * (type === 'van' ? 0.55 : type === 'pickup' ? 0.66 : (e === 1 ? 0.60 : e === 2 ? 0.635 : 0.665)) + (type === 'suv' ? 0.02 : 0);
    const hood = { sedan: 0.88, hatchback: 0.58, wagon: 0.80, suv: 0.62, coupe: 0.98, van: 0.18, pickup: 0.60 }[type] + (size === 'f' || size === 'e' ? 0.1 : 0) - (size === 'a' ? 0.15 : 0);
    const hf = tall ? belt - 0.16 : belt - (e === 1 ? 0.12 : 0.18);
    const xc = xf + hood * (e === 1 ? 0.95 : 1), rake = type === 'van' ? 1.25 : type === 'pickup' ? 1.05 : (e === 1 ? 1.05 : e === 2 ? 1.45 : 1.7) * (tall ? 0.85 : 1);
    const xa = xc + (H - belt) * rake, round = e === 1 ? 0.1 : e === 2 ? 0.22 : 0.32, tail = yb + (tall ? 0.38 : 0.30);
    const front = [[0.10, yb + 0.03, 0], [0, (tall ? 0.62 : 0.5) - (e === 1 ? 0.04 : 0), 0.1], [0.05, hf, 0.1], [xc, belt, 0.12], [xa, H - 0.015, round]];
    let rear, dlo, pillar = xf + WB * 0.6, doors = 4;
    if (type === 'sedan') {
      const re = xr - 0.28 + (e === 1 ? 0.1 : 0), deck = L - (size === 'f' ? 0.62 : 0.56);
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
      const re = xa + (size === 'a' ? 0.75 : size === 'b' ? 0.35 : 0.5);
      rear = [[re, H, 0.3], [L - 0.5, belt + 0.08, 0.2], [L - 0.03, belt + 0.05, 0.05], [L, tail, 0.08]];
      dlo = [[re + 0.05, H - 0.08], [xa + (size === 'b' ? 0.75 : 1.25), belt + 0.04]]; doors = 1; pillar = xa + (size === 'b' ? 0.7 : 0.95);
    } else if (type === 'van') {
      rear = [[(xa + L) / 2, H, 0.8], [L - 0.08, H - 0.02, 0.12], [L, H - 0.3, 0.1], [L, tail, 0.05]];
      dlo = [[L - 0.22, H - 0.08], [L - 0.24, belt + 0.03]]; pillar = xc + 0.95;
    } else {
      const cab = xf + WB * 0.75;
      rear = [[(xa + cab) / 2, H, 0.3], [cab, H - 0.03, 0.08], [cab + 0.03, belt + 0.02, 0.03], [L - 0.03, belt + 0.02, 0.02], [L, tail, 0.04]];
      dlo = [[cab - 0.08, H - 0.08], [cab - 0.1, belt + 0.03]]; doors = 2; pillar = xf + WB * 0.47;
    }
    const top = [...front, ...rear, [L - 0.08, yb + 0.03, 0]];
    const glass = [[xc + 0.1, belt + 0.03, 0.04], [xa + 0.04, H - 0.08, round * 0.6], [dlo[0][0], dlo[0][1], 0.12], [dlo[1][0], dlo[1][1], 0.04]];
    return { L, H, D, xf, xr, yb, belt, hf, xc, top, glass, pillar, doors, tall };
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
    return `<g class="wheel" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle r="${r.toFixed(1)}" fill="#171c22"/><circle r="${(r - 2.5).toFixed(1)}" fill="none" stroke="#2a313a" stroke-width="2"/><circle r="${(r * 0.64).toFixed(1)}" fill="url(#rim${id})"/><g class="spokes">` +
      [0, 72, 144, 216, 288].map(a => `<path d="M0 0L${(r * 0.58).toFixed(1)} -3.2L${(r * 0.58).toFixed(1)} 3.2Z" fill="#9aa6b2" transform="rotate(${a})"/>`).join('') +
      `</g><circle r="${(r * 0.17).toFixed(1)}" fill="#56616d"/><circle r="${(r * 0.64).toFixed(1)}" fill="none" stroke="#6d7884" stroke-width="1.2"/></g>`;
  }

  let uid = 0;
  // shape: optional { size: 'a'…'f', year } from the car's make, model and model year.
  function render(type, color, label, shape) {
    if (!dims[type]) type = 'sedan';
    const s = shape || {}, p = profile(type, s.size || defaultSize[type], eraOf(Number(s.year)));
    const id = ++uid, c = /^#[0-9a-f]{6}$/i.test(color) ? color : '#c9d0d8', groundY = 150;
    const k = Math.min(356 / p.L, 122 / p.H), x0 = 200 - p.L * k / 2;
    const X = x => x0 + x * k, Y = y => groundY - y * k, pt = ([x, y, r]) => [X(x), Y(y), (r || 0) * k];
    const dark = luminance(c) < 0.25, light = mix(c, '#ffffff', dark ? 0.32 : 0.45), shade = mix(c, '#000000', dark ? 0.35 : 0.42);
    const line = mix(c, '#000000', dark ? 0.55 : 0.3), r = p.D / 2 * k, arch = r + 0.055 * k, wy = groundY - r;
    // Body outline: rounded top profile, then the sill with both wheel arches cut out.
    const sill = Y(p.yb), archX = Math.sqrt(Math.max(0, arch * arch - (sill - wy) ** 2));
    const body = rounded(p.top.map(pt), false) +
      `L${(X(p.xr) + archX).toFixed(1)} ${sill.toFixed(1)}A${arch.toFixed(1)} ${arch.toFixed(1)} 0 1 0 ${(X(p.xr) - archX).toFixed(1)} ${sill.toFixed(1)}` +
      `L${(X(p.xf) + archX).toFixed(1)} ${sill.toFixed(1)}A${arch.toFixed(1)} ${arch.toFixed(1)} 0 1 0 ${(X(p.xf) - archX).toFixed(1)} ${sill.toFixed(1)}Z`;
    const glass = rounded(p.glass.map(pt), true);
    const beltY = Y(p.belt), shoulderY = beltY + 0.07 * k, bp = X(p.pillar);
    const frontDoor = X(p.xf) + arch + 0.05 * k, rearDoor = X(p.xr) - arch - 0.02 * k;
    const doorLines = `M${frontDoor.toFixed(1)} ${(beltY + 2).toFixed(1)}C${(frontDoor - 3).toFixed(1)} ${(beltY + 20).toFixed(1)} ${(frontDoor - 2).toFixed(1)} ${(sill - 12).toFixed(1)} ${(frontDoor + 3).toFixed(1)} ${(sill - 2).toFixed(1)}` +
      (p.doors === 1 ? '' : `M${bp.toFixed(1)} ${(beltY + 1).toFixed(1)}V${(sill - 2).toFixed(1)}`) +
      (p.doors === 4 ? `M${rearDoor.toFixed(1)} ${(beltY + 1).toFixed(1)}C${(rearDoor + 3).toFixed(1)} ${(beltY + 18).toFixed(1)} ${(rearDoor + 2).toFixed(1)} ${(sill - 16).toFixed(1)} ${(rearDoor - 2).toFixed(1)} ${(sill - 6).toFixed(1)}` : '');
    const handle = x => `<rect x="${(x - 7).toFixed(1)}" y="${(beltY + 0.1 * k).toFixed(1)}" width="13" height="3.2" rx="1.6" fill="${line}" fill-opacity=".55"/>`;
    const hx = X(0.04), hy = Y(p.hf) + 2, lamp = `M${hx.toFixed(1)} ${(hy + 2).toFixed(1)}Q${(hx + 2).toFixed(1)} ${(hy - 1).toFixed(1)} ${(hx + 0.42 * k).toFixed(1)} ${(hy + 1).toFixed(1)}L${(hx + 0.36 * k).toFixed(1)} ${(hy + 0.08 * k).toFixed(1)}Q${(hx + 4).toFixed(1)} ${(hy + 0.09 * k).toFixed(1)} ${(hx - 1).toFixed(1)} ${(hy + 0.07 * k).toFixed(1)}Z`;
    const tx = X(p.L), ty = Y(p.tall ? p.belt - 0.02 : p.belt + 0.02), tail = `M${(tx - 0.16 * k).toFixed(1)} ${ty.toFixed(1)}H${(tx - 0.5).toFixed(1)}V${(ty + 0.1 * k).toFixed(1)}H${(tx - 0.12 * k).toFixed(1)}Z`;
    const mx = X(p.xc + 0.12), my = beltY - 1, mirror = `M${mx.toFixed(1)} ${my.toFixed(1)}l${(0.16 * k).toFixed(1)} -2l2 ${(0.07 * k).toFixed(1)}l${(-0.15 * k).toFixed(1)} 2z`;
    return `<svg class="car-render" viewBox="0 0 400 170" role="img" aria-label="${label || 'Tyylitelty automalli'}" xmlns="http://www.w3.org/2000/svg">` +
      `<defs><linearGradient id="paint${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${light}"/><stop offset=".38" stop-color="${c}"/><stop offset=".6" stop-color="${mix(c, '#000000', 0.12)}"/><stop offset="1" stop-color="${shade}"/></linearGradient>` +
      `<linearGradient id="sheen${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".35" stop-color="#fff" stop-opacity="${dark ? 0.1 : 0.22}"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></linearGradient>` +
      `<linearGradient id="glass${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a6075"/><stop offset=".55" stop-color="#1b2836"/><stop offset="1" stop-color="#2c3e50"/></linearGradient>` +
      `<radialGradient id="rim${id}" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#eef2f6"/><stop offset=".6" stop-color="#b7c1cb"/><stop offset="1" stop-color="#7d8894"/></radialGradient>` +
      `<radialGradient id="shadow${id}"><stop offset="0" stop-color="#0d1b2a" stop-opacity=".34"/><stop offset="1" stop-color="#0d1b2a" stop-opacity="0"/></radialGradient>` +
      `<clipPath id="clip${id}"><path d="${body}"/></clipPath><clipPath id="glassclip${id}"><path d="${glass}"/></clipPath></defs>` +
      `<ellipse cx="200" cy="${groundY + 2}" rx="${(p.L * k / 2 + 10).toFixed(1)}" ry="10" fill="url(#shadow${id})"/>` +
      `<circle cx="${X(p.xf).toFixed(1)}" cy="${wy.toFixed(1)}" r="${(arch - 1).toFixed(1)}" fill="#0f141a"/><circle cx="${X(p.xr).toFixed(1)}" cy="${wy.toFixed(1)}" r="${(arch - 1).toFixed(1)}" fill="#0f141a"/>` +
      `<path d="${body}" fill="url(#paint${id})"/>` +
      `<g clip-path="url(#clip${id})">` +
        `<path d="${glass}" fill="url(#glass${id})"/>` +
        `<g clip-path="url(#glassclip${id})"><rect x="${(bp - 3.5).toFixed(1)}" y="0" width="7" height="${beltY.toFixed(1)}" fill="${p.doors === 1 ? line : shade}" fill-opacity="${p.doors === 1 ? 0.6 : 1}"/><path d="M${(bp - 70).toFixed(1)} ${beltY.toFixed(1)}L${(bp - 40).toFixed(1)} 0" stroke="#fff" stroke-opacity=".14" stroke-width="12"/></g>` +
        `<path d="${glass}" fill="none" stroke="${line}" stroke-width="2.2"/>` +
        `<path d="M0 ${shoulderY.toFixed(1)}H400" stroke="#fff" stroke-opacity="${dark ? 0.3 : 0.55}" stroke-width="1.6"/><path d="M0 ${(shoulderY + 3).toFixed(1)}H400" stroke="${line}" stroke-opacity=".3" stroke-width="1"/>` +
        `<rect x="0" y="0" width="400" height="${beltY.toFixed(1)}" fill="url(#sheen${id})" opacity=".0"/><rect x="0" y="${beltY.toFixed(1)}" width="400" height="${(sill - beltY).toFixed(1)}" fill="url(#sheen${id})"/>` +
        `<path d="${doorLines}" fill="none" stroke="${line}" stroke-opacity=".45" stroke-width="1.2"/>` +
        handle(bp - 0.28 * k) + (p.doors === 4 ? handle(rearDoor - 0.3 * k) : '') +
        `<path d="M0 ${(sill - 0.13 * k).toFixed(1)}H400V170H0Z" fill="#0d1b2a" fill-opacity=".2"/>` +
      `</g>` +
      `<path d="${lamp}" fill="#eaf6ff" stroke="${line}" stroke-opacity=".5"/>` +
      `<path d="${tail}" fill="#c4323d" opacity=".92"/>` +
      `<path d="${mirror}" fill="${shade}"/>` +
      wheel(X(p.xf), wy, r, id) + wheel(X(p.xr), wy, r, id) +
      `</svg>`;
  }

  const names = { sedan: 'Sedan', hatchback: 'Viistoperä', wagon: 'Farmari', suv: 'Maastoauto / SUV', coupe: 'Coupé', van: 'Tila-auto', pickup: 'Avolava' };
  // Muted, real-world paint shades rather than pure UI colours.
  const colors = [
    ['Valkoinen', '#eef1f4'], ['Hopea', '#b9c1ca'], ['Harmaa', '#6b737c'], ['Musta', '#1f2329'],
    ['Sininen', '#1e4f9c'], ['Punainen', '#a8232d'], ['Vihreä', '#2f5b45'], ['Beige', '#c8b79a']
  ];
  window.AjouraCar = { render, bodies: Object.keys(dims), names, colors };
  document.querySelectorAll('[data-car-render]').forEach(el => { el.innerHTML = render(el.dataset.carRender, el.dataset.color, el.dataset.label, { size: el.dataset.size, year: el.dataset.year }); });
})();
