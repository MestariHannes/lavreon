'use strict';
// First-run getting-started guide: a short animated walkthrough (about 30 s) with its own synthesized
// soundtrack. Plays inside the phone screen, advances by itself and can be skipped at any moment.
// The music is generated live with the Web Audio API (no audio file), so nothing is downloaded.
(() => {
  const BPM = 96, BAR = 60 / BPM * 4, SCENE = BAR * 2; // two bars per scene keeps the cuts on the beat
  const text = {
    fi: {
      skip: 'Ohita', mute: 'Mykistä', unmute: 'Äänet päälle', start: 'Aloita käyttö', label: 'Käyttöönoton opas', step: 'Vaihe',
      scenes: [
        ['Tervetuloa AJOURAan', 'Autosi oma huoltokirja aina taskussa.'],
        ['Lisää autosi', 'Rekisteritunnuksella tai käsin. Valitse malli, korimalli ja väri.'],
        ['Kirjaa huollot', 'Öljynvaihdot, katsastukset ja korjaukset kuitteineen talteen.'],
        ['Seuraa tankkauksia', 'Keskikulutus ja ajon hinta lasketaan puolestasi.'],
        ['Muistutus ajoissa', 'Näet heti, milloin seuraava huolto on edessä.'],
        ['Raportti myyntiin', 'Koko historia siistinä PDF-raporttina ostajalle.']
      ],
      rows: ['Moottoriöljyn vaihto', 'Katsastus', 'Renkaiden vaihto'], dates: ['23.9.2026 · 184 320 km', '15.2.2026 · 181 120 km', '5.4.2026 · 181 900 km'],
      cons: 'Keskikulutus', reminder: 'SEURAAVA HUOLTO', due: 'Viimeistään 23.9.2027', report: 'Huoltohistoriaraportti'
    },
    en: {
      skip: 'Skip', mute: 'Mute', unmute: 'Sound on', start: 'Get started', label: 'Getting-started guide', step: 'Step',
      scenes: [
        ['Welcome to AJOURA', 'Your car’s own service book, always in your pocket.'],
        ['Add your car', 'By registration plate or by hand. Pick the model, body style and colour.'],
        ['Log services', 'Oil changes, inspections and repairs, receipts included.'],
        ['Track fill-ups', 'Average consumption and cost of driving, worked out for you.'],
        ['Reminders in time', 'See at a glance when the next service is due.'],
        ['Report for selling', 'The whole history as a tidy PDF report for the buyer.']
      ],
      rows: ['Oil change', 'Inspection', 'Tyre change'], dates: ['23/09/2026 · 184,320 km', '15/02/2026 · 181,120 km', '05/04/2026 · 181,900 km'],
      cons: 'Average consumption', reminder: 'NEXT SERVICE', due: 'Due by 23/09/2027', report: 'Service history report'
    }
  };

  // Soundtrack: B minor, 96 BPM. Soft pad, plucked arpeggio, sub bass, then a light kick and hats build in.
  function music() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    let ctx;
    try { ctx = new AC(); } catch (e) { return null; }
    const out = ctx.createGain(), master = ctx.createGain();
    out.gain.value = 1; master.gain.value = 0.0001; master.connect(out); out.connect(ctx.destination);
    // Small feedback delay for space.
    const delay = ctx.createDelay(1), fb = ctx.createGain(), wet = ctx.createGain();
    delay.delayTime.value = 60 / BPM * 0.75; fb.gain.value = 0.28; wet.gain.value = 0.22;
    delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(master);
    const hz = n => 440 * Math.pow(2, (n - 69) / 12);
    // Bm, G, D, A (with added colour tones), then Em, G, D, F#.
    const chords = [[47, 50, 54, 61], [43, 50, 55, 59], [50, 54, 57, 64], [45, 52, 57, 61], [40, 52, 55, 59], [43, 50, 55, 62], [50, 54, 57, 62], [42, 49, 54, 58]];
    const t0 = ctx.currentTime + 0.12, bars = 12, end = t0 + bars * BAR;
    const pad = (notes, at, dur) => {
      const f = ctx.createBiquadFilter(), g = ctx.createGain();
      f.type = 'lowpass'; f.frequency.setValueAtTime(700, at); f.frequency.linearRampToValueAtTime(1500, at + dur * 0.6); f.Q.value = 0.6;
      g.gain.setValueAtTime(0.0001, at); g.gain.linearRampToValueAtTime(0.05, at + 0.5); g.gain.setValueAtTime(0.05, at + dur - 0.4); g.gain.linearRampToValueAtTime(0.0001, at + dur + 0.3);
      f.connect(g); g.connect(master); g.connect(delay);
      for (const n of notes.slice(1)) for (const d of [-6, 6]) {
        const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = hz(n + 12); o.detune.value = d;
        o.connect(f); o.start(at); o.stop(at + dur + 0.4);
      }
    };
    const pluck = (n, at, vel) => {
      const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
      o.type = 'triangle'; o.frequency.value = hz(n); f.type = 'lowpass'; f.frequency.value = 2600;
      g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(vel, at + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, at + 0.4);
      o.connect(f); f.connect(g); g.connect(master); g.connect(delay); o.start(at); o.stop(at + 0.45);
    };
    const bass = (n, at, dur) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = hz(n - 12);
      g.gain.setValueAtTime(0.0001, at); g.gain.linearRampToValueAtTime(0.16, at + 0.04); g.gain.setTargetAtTime(0.0001, at + dur * 0.8, 0.12);
      o.connect(g); g.connect(master); o.start(at); o.stop(at + dur + 0.3);
    };
    const kick = at => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(130, at); o.frequency.exponentialRampToValueAtTime(42, at + 0.14);
      g.gain.setValueAtTime(0.3, at); g.gain.exponentialRampToValueAtTime(0.0001, at + 0.28);
      o.connect(g); g.connect(master); o.start(at); o.stop(at + 0.3);
    };
    const noise = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate), ch = noise.getChannelData(0);
    for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
    const hat = (at, vel) => {
      const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      s.buffer = noise; f.type = 'highpass'; f.frequency.value = 7500;
      g.gain.setValueAtTime(vel, at); g.gain.exponentialRampToValueAtTime(0.0001, at + 0.06);
      s.connect(f); f.connect(g); g.connect(master); s.start(at); s.stop(at + 0.08);
    };
    const beat = 60 / BPM, arp = [0, 1, 2, 3, 2, 1, 2, 3];
    for (let b = 0; b < bars; b++) {
      const at = t0 + b * BAR, c = chords[b % chords.length], last = b === bars - 1;
      pad(c, at, BAR);
      bass(c[0], at, beat * 2.5); if (!last) bass(c[0], at + beat * 2.5, beat * 1.5);
      if (b >= 1) for (let i = 0; i < 8; i++) pluck(c[arp[i]] + 24, at + i * beat / 2, i % 2 ? 0.035 : 0.055);
      if (b >= 2 && !last) for (let i = 0; i < 4; i++) kick(at + i * beat);
      if (b >= 4 && !last) for (let i = 0; i < 4; i++) hat(at + i * beat + beat / 2, 0.05);
    }
    master.gain.setValueAtTime(0.0001, t0); master.gain.exponentialRampToValueAtTime(0.9, t0 + 1.2);
    master.gain.setValueAtTime(0.9, end - BAR); master.gain.exponentialRampToValueAtTime(0.0001, end + 0.6);
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return {
      setMuted: m => { out.gain.setTargetAtTime(m ? 0 : 1, ctx.currentTime, 0.05); },
      stop: () => { try { out.gain.setTargetAtTime(0, ctx.currentTime, 0.08); setTimeout(() => ctx.close().catch(() => {}), 400); } catch (e) {} }
    };
  }

  const svg = p => `<svg viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
  const ico = {
    on: svg('<path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 9.5a3.5 3.5 0 0 1 0 5M18.5 7a7 7 0 0 1 0 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'),
    off: svg('<path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="m16 9.5 5 5m0-5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'),
    oil: svg('<path d="M12 3.5s5.5 6 5.5 10a5.5 5.5 0 0 1-11 0c0-4 5.5-10 5.5-10z" fill="none" stroke="currentColor" stroke-width="1.8"/>'),
    shield: svg('<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m9 12 2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.8"/>'),
    tyre: svg('<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/>'),
    bell: svg('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 20.5h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>')
  };

  function art(i, T) {
    const Car = window.AjouraCar;
    const car = (body, color, size, year) => Car ? Car.render(body, color, '', { size, year }) : '';
    switch (i) {
      case 0: return `<img class="tut-logo" src="logo.svg" alt="AJOURA" width="640" height="198"><div class="tut-road"><span class="tut-drive">${car('sedan', '#1464e8', 'd', 2022)}</span></div>`;
      case 1: return `<div class="tut-plate"><span class="tut-fi">FIN</span><b data-type="ABC-123"></b></div><div class="tut-cars"><span>${car('wagon', '#eef1f4', 'd', 2021)}</span><span>${car('wagon', '#1e4f9c', 'd', 2021)}</span><span>${car('wagon', '#a8232d', 'd', 2021)}</span></div><div class="tut-swatches"><i style="--c:#eef1f4"></i><i style="--c:#1e4f9c"></i><i style="--c:#a8232d"></i></div>`;
      case 2: return `<ul class="tut-rows">${[ico.oil, ico.shield, ico.tyre].map((s, n) => `<li style="--d:${0.35 + n * 0.55}s"><span>${s}</span><div><strong>${T.rows[n]}</strong><small>${T.dates[n]}</small></div></li>`).join('')}</ul>`;
      case 3: return `<div class="tut-gauge"><svg viewBox="0 0 120 70" aria-hidden="true"><path d="M10 64a50 50 0 0 1 100 0" class="tut-arc-bg"/><path d="M10 64a50 50 0 0 1 100 0" class="tut-arc"/></svg><strong><b data-count="6.8">0,0</b> <small>l/100 km</small></strong><span>${T.cons}</span></div>`;
      case 4: return `<div class="tut-reminder"><span class="tut-bell">${ico.bell}</span><div><small>${T.reminder}</small><strong>Volvo XC60</strong><span>${T.due}</span></div></div>`;
      default: return `<div class="tut-sheet"><img class="tut-logo" src="logo.svg" alt="" width="640" height="198"><strong>${T.report}</strong><i></i><i></i><i class="short"></i><div class="tut-bars"><span style="--h:40%"></span><span style="--h:70%"></span><span style="--h:55%"></span><span style="--h:90%"></span></div><i></i><i class="short"></i><em>PDF</em></div>`;
    }
  }

  let current = null;
  function open(opts = {}) {
    if (current) return;
    const host = opts.host || document.querySelector('.device-glass') || document.body;
    const lang = window.AjouraI18n && window.AjouraI18n.lang === 'en' ? 'en' : 'fi', T = text[lang];
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = document.createElement('div');
    el.className = 'tutorial'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', T.label);
    el.innerHTML = `<div class="tut-top"><div class="tut-progress">${T.scenes.map(() => '<span><i></i></span>').join('')}</div><button type="button" class="tut-btn tut-mute"></button><button type="button" class="tut-btn tut-skip">${T.skip} <span aria-hidden="true">›</span></button></div>
      <div class="tut-stage">${T.scenes.map(([h, p], i) => `<section class="tut-scene" aria-hidden="true"><div class="tut-art">${art(i, T)}</div><p class="tut-step">${T.step} ${i + 1} / ${T.scenes.length}</p><h2>${h}</h2><p>${p}</p></section>`).join('')}</div>
      <div class="tut-bottom"><button type="button" class="app-button tut-start">${T.start} <span aria-hidden="true">→</span></button></div>`;
    host.appendChild(el);
    const scenes = [...el.querySelectorAll('.tut-scene')], bars = [...el.querySelectorAll('.tut-progress i')];
    const snd = music(); let muted = false, idx = -1, timer = 0, typer = 0, counter = 0;
    const muteBtn = el.querySelector('.tut-mute');
    const setMuteUi = () => { muteBtn.innerHTML = muted ? ico.off : ico.on; muteBtn.setAttribute('aria-label', muted ? T.unmute : T.mute); };
    if (!snd) muteBtn.hidden = true; setMuteUi();
    const animate = s => {
      clearInterval(typer); clearInterval(counter);
      const type = s.querySelector('[data-type]');
      if (type) { const full = type.dataset.type; let n = 0; type.textContent = ''; typer = setInterval(() => { type.textContent = full.slice(0, ++n); if (n >= full.length) clearInterval(typer); }, reduce ? 0 : 140); }
      const count = s.querySelector('[data-count]');
      if (count) { const to = Number(count.dataset.count), t0 = performance.now(), dur = reduce ? 1 : 1600, fmt = v => v.toLocaleString(lang === 'en' ? 'en-GB' : 'fi-FI', { minimumFractionDigits: 1, maximumFractionDigits: 1 }); counter = setInterval(() => { const k = Math.min(1, (performance.now() - t0) / dur); count.textContent = fmt(to * (1 - Math.pow(1 - k, 3))); if (k >= 1) clearInterval(counter); }, 40); }
    };
    const show = i => {
      idx = i; scenes.forEach((s, n) => { s.classList.toggle('on', n === i); s.setAttribute('aria-hidden', String(n !== i)); });
      bars.forEach((b, n) => { b.style.transition = 'none'; b.style.width = n < i ? '100%' : '0%'; });
      const bar = bars[i]; void bar.offsetWidth; bar.style.transition = `width ${SCENE}s linear`; bar.style.width = '100%';
      animate(scenes[i]); el.classList.toggle('last', i === scenes.length - 1);
      clearTimeout(timer); if (i < scenes.length - 1) timer = setTimeout(() => show(i + 1), SCENE * 1000);
    };
    const close = () => {
      if (!el.isConnected) return; clearTimeout(timer); clearInterval(typer); clearInterval(counter);
      if (snd) snd.stop(); el.classList.add('done'); current = null;
      setTimeout(() => el.remove(), reduce ? 0 : 350); if (opts.onClose) opts.onClose();
    };
    muteBtn.addEventListener('click', () => { muted = !muted; if (snd) snd.setMuted(muted); setMuteUi(); });
    el.querySelector('.tut-skip').addEventListener('click', close);
    el.querySelector('.tut-start').addEventListener('click', close);
    el.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    current = { close };
    show(0); el.querySelector('.tut-skip').focus({ preventScroll: true });
  }

  window.AjouraTutorial = { open, close: () => current && current.close(), duration: SCENE * 6 };
})();
