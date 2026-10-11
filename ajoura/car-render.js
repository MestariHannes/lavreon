'use strict';
// Stylised side-view car renders for the Ajoura concept. Shapes are generic (no manufacturer
// branding); the body colour drives every shade so one model can be repainted live.
(() => {
  const clamp = n => Math.max(0, Math.min(255, Math.round(n)));
  const rgb = hex => { const v = parseInt(hex.slice(1), 16); return [v >> 16 & 255, v >> 8 & 255, v & 255]; };
  const hex = c => '#' + c.map(n => clamp(n).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, t) => hex(rgb(a).map((n, i) => n + (rgb(b)[i] - n) * t));
  const luminance = c => { const [r, g, b] = rgb(c); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };

  // All bodies share a 400 x 170 canvas, face left and stand on y = 150.
  // body: outer silhouette, wheel arches included. glass: side window area. pillar: B-pillar x.
  const bodies = {
    sedan: {
      wheels: [96, 300], r: 25,
      body: 'M24 124C22 110 28 101 42 98L88 90C112 86 128 84 148 82L184 58C196 51 214 48 240 48C262 48 278 51 292 60L322 80L362 86C374 88 380 96 380 108L380 126C380 132 376 134 370 134L333 134A37 37 0 0 0 267 134L129 134A37 37 0 0 0 63 134L32 134C27 134 24 131 24 124Z',
      glass: 'M156 82L188 60C200 54 214 52 238 52C258 52 272 55 286 63L310 80Z',
      tail: [378, 96], pillar: 236, shoulder: 'M46 100C120 92 250 88 372 94', doorTop: 82
    },
    hatchback: {
      wheels: [96, 290], r: 25,
      body: 'M26 124C24 110 30 101 44 98L88 90C112 86 128 84 146 82L184 56C196 49 214 46 238 46C262 46 284 48 302 54C318 60 330 72 340 88C346 98 348 110 348 126C348 131 345 134 340 134L323 134A37 37 0 0 0 257 134L129 134A37 37 0 0 0 63 134L34 134C29 134 26 131 26 124Z',
      glass: 'M154 82L188 58C200 52 214 50 236 50C258 50 278 52 296 58C308 63 318 72 326 82Z',
      tail: [345, 94], pillar: 232, shoulder: 'M48 100C120 92 240 88 342 94', doorTop: 82
    },
    wagon: {
      wheels: [96, 306], r: 25,
      body: 'M24 124C22 110 28 101 42 98L88 90C112 86 128 84 146 82L182 56C194 49 212 46 236 46L340 47C352 47 360 52 364 62L374 90C378 98 380 108 380 126C380 131 377 134 372 134L339 134A37 37 0 0 0 273 134L129 134A37 37 0 0 0 63 134L32 134C27 134 24 131 24 124Z',
      glass: 'M154 82L186 58C198 52 212 50 234 50L336 51C344 51 350 55 353 62L361 82Z',
      tail: [377, 92], pillar: 232, shoulder: 'M46 100C120 92 260 88 374 94', doorTop: 82
    },
    suv: {
      wheels: [98, 302], r: 28,
      body: 'M24 120C22 104 28 94 42 91L86 82C108 78 124 76 140 74L176 46C188 38 206 35 232 35L332 36C346 36 354 42 358 52L370 82C376 94 378 104 378 122C378 129 374 132 368 132L342 132A41 41 0 0 0 262 132L138 132A41 41 0 0 0 58 132L32 132C27 132 24 128 24 120Z',
      glass: 'M150 74L182 49C194 42 208 40 230 40L328 41C338 41 344 45 347 52L356 74Z',
      tail: [375, 86], pillar: 228, shoulder: 'M46 93C120 85 260 80 372 87', doorTop: 74
    }
  };
  const names = { sedan: 'Sedan', hatchback: 'Viistoperä', wagon: 'Farmari', suv: 'Maastoauto / SUV' };
  let uid = 0;

  function wheel(x, y, r, id) {
    return `<g transform="translate(${x} ${y})"><circle r="${r}" fill="#171c22"/><circle r="${r - 3}" fill="none" stroke="#2a313a" stroke-width="2"/><circle r="${r * 0.62}" fill="url(#rim${id})"/>` +
      [0, 72, 144, 216, 288].map(a => `<path d="M0 0L${(r * 0.56).toFixed(1)} -3.5L${(r * 0.56).toFixed(1)} 3.5Z" fill="#9aa6b2" transform="rotate(${a})"/>`).join('') +
      `<circle r="${r * 0.18}" fill="#56616d"/><circle r="${r * 0.62}" fill="none" stroke="#6d7884" stroke-width="1.2"/></g>`;
  }

  function render(type, color, label) {
    const b = bodies[type] || bodies.sedan, id = ++uid, c = /^#[0-9a-f]{6}$/i.test(color) ? color : '#c9d0d8';
    const dark = luminance(c) < 0.25, light = mix(c, '#ffffff', dark ? 0.32 : 0.45), shade = mix(c, '#000000', dark ? 0.35 : 0.42);
    const line = mix(c, '#000000', dark ? 0.55 : 0.3), groundY = 150, wy = groundY - b.r;
    const [fx, rx] = b.wheels;
    return `<svg class="car-render" viewBox="0 0 400 170" role="img" aria-label="${label || 'Tyylitelty automalli'}" xmlns="http://www.w3.org/2000/svg">` +
      `<defs><linearGradient id="paint${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${light}"/><stop offset=".42" stop-color="${c}"/><stop offset=".62" stop-color="${mix(c, '#000000', 0.12)}"/><stop offset="1" stop-color="${shade}"/></linearGradient>` +
      `<linearGradient id="glass${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3f5468"/><stop offset=".55" stop-color="#1b2836"/><stop offset="1" stop-color="#2c3e50"/></linearGradient>` +
      `<radialGradient id="rim${id}" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#eef2f6"/><stop offset=".6" stop-color="#b7c1cb"/><stop offset="1" stop-color="#7d8894"/></radialGradient>` +
      `<radialGradient id="shadow${id}"><stop offset="0" stop-color="#0d1b2a" stop-opacity=".32"/><stop offset="1" stop-color="#0d1b2a" stop-opacity="0"/></radialGradient>` +
      `<clipPath id="clip${id}"><path d="${b.body}"/></clipPath><clipPath id="glassclip${id}"><path d="${b.glass}"/></clipPath></defs>` +
      `<ellipse cx="200" cy="${groundY + 2}" rx="190" ry="11" fill="url(#shadow${id})"/>` +
      `<circle cx="${fx}" cy="${wy}" r="${b.r + 6}" fill="#0f141a"/><circle cx="${rx}" cy="${wy}" r="${b.r + 6}" fill="#0f141a"/>` +
      `<path d="${b.body}" fill="url(#paint${id})"/>` +
      `<g clip-path="url(#clip${id})">` +
        `<path d="${b.glass}" fill="url(#glass${id})"/>` +
        `<path d="M${b.pillar - 4} ${b.doorTop - 40}h8v40h-8z" fill="${shade}" clip-path="url(#glassclip${id})"/>` +
        `<path d="${b.glass}" fill="none" stroke="${line}" stroke-width="2.5"/>` +
        `<path d="M${b.pillar - 50} ${b.doorTop - 4}L${b.pillar - 28} ${b.doorTop - 26}" stroke="#ffffff" stroke-opacity=".18" stroke-width="7"/>` +
        `<path d="${b.shoulder}" fill="none" stroke="#ffffff" stroke-opacity="${dark ? 0.28 : 0.55}" stroke-width="2"/>` +
        `<path d="${b.shoulder}" fill="none" stroke="${line}" stroke-opacity=".35" stroke-width="1" transform="translate(0 4)"/>` +
        `<path d="M${b.pillar} ${b.doorTop}V${groundY - 22}M${b.pillar - 82} ${b.doorTop + 2}C${b.pillar - 86} ${b.doorTop + 20} ${b.pillar - 84} ${groundY - 34} ${b.pillar - 78} ${groundY - 22}M${b.pillar + 84} ${b.doorTop - 1}C${b.pillar + 88} ${b.doorTop + 18} ${b.pillar + 86} ${groundY - 34} ${b.pillar + 80} ${groundY - 26}" fill="none" stroke="${line}" stroke-opacity=".45" stroke-width="1.2"/>` +
        `<rect x="${b.pillar - 32}" y="${b.doorTop + 12}" width="14" height="3.5" rx="1.75" fill="${line}" fill-opacity=".55"/><rect x="${b.pillar + 44}" y="${b.doorTop + 12}" width="14" height="3.5" rx="1.75" fill="${line}" fill-opacity=".55"/>` +
        `<path d="M0 ${groundY - 30}H400V170H0Z" fill="#0d1b2a" fill-opacity=".16"/>` +
      `</g>` +
      `<path d="M28 ${groundY - 46}c10-6 24-9 38-9l-4 9c-12 0-24 2-34 6z" fill="#eaf6ff" stroke="${line}" stroke-opacity=".5"/>` +
      `<path d="M${b.tail[0] - 9} ${b.tail[1]}h7c1.5 4 2 9 2 14h-9z" fill="#c4323d" opacity=".9"/>` +
      `<path d="M${b.pillar - 66} ${b.doorTop - 2}h12v6h-12z" fill="${shade}"/>` +
      wheel(fx, wy, b.r, id) + wheel(rx, wy, b.r, id) +
      `</svg>`;
  }

  // Muted, real-world paint shades rather than pure UI colours.
  const colors = [
    ['Valkoinen', '#eef1f4'], ['Hopea', '#b9c1ca'], ['Harmaa', '#6b737c'], ['Musta', '#1f2329'],
    ['Sininen', '#1e4f9c'], ['Punainen', '#a8232d'], ['Vihreä', '#2f5b45'], ['Beige', '#c8b79a']
  ];
  window.AjouraCar = { render, bodies: Object.keys(bodies), names, colors };
  document.querySelectorAll('[data-car-render]').forEach(el => { el.innerHTML = render(el.dataset.carRender, el.dataset.color, el.dataset.label); });
})();
