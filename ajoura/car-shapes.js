'use strict';
// Side-profile outlines of real car models, one row per generation and body style, so the car picture
// resembles the actual model. Traced key points in centimetres (x from the front bumper, y from the ground):
// [from, to, body, length, height, wheelbase, front overhang, wheel diameter, sill height, bumper-tip height,
//  bonnet front x, y, windscreen base x, y, windscreen top x, y, roof end x, y, rear glass bottom x, y,
//  boot end x, y, rear bumper top y, beltline front y, rear y, side windows end x, B-pillar x,
//  doors (1 = coupé, 2, 4), roundness %, roof peak y, rear window top x, flags]
// Flags: S spare wheel on the tailgate, C black wheel-arch cladding, R round headlamps, Q square headlamps,
// T tall tail lights up the rear pillars.
window.AjouraShapes = (() => {
  const data = {
  "Mercedes-Benz":{
   "E-sarja":[[2017,2023,"c",483,143,287,86,67,20,48,18,72,180,100,255,138,325,136,415,98,478,95,50,93,100,395,295,1,45]],
   "G-sarja":[[2018,2025,"u",462,197,289,80,79,40,70,12,110,130,124,168,194,445,195,450,130,452,124,55,122,122,438,245,4,5,0,0,"SR"]]},
  "Volvo":{
   "XC60":[[2017,2025,"u",469,166,287,92,74,32,62,12,88,145,113,225,160,435,156,462,118,466,112,62,108,117,440,270,4,30,0,0,"CT"]]},
  "Volkswagen":{
   "Golf":[[1984,1991,"h",399,142,248,70,57,20,45,5,74,95,88,162,138,325,136,392,92,395,90,45,86,88,370,220,4,12,0,0,"Q"]]},
  "Porsche":{
   "911":[[2019,2025,"c",452,130,245,100,68,17,42,25,66,140,92,215,127,270,127,420,92,445,88,55,88,92,355,275,1,70,0,0,"R"]]},
  "Ford":{
   "Ranger":[[2023,2025,"p",537,188,327,92,80,45,80,12,115,140,130,215,186,345,185,350,125,530,125,70,127,127,340,260,4,10]]}
  };
  const bodies = { s: 'sedan', h: 'hatchback', w: 'wagon', u: 'suv', c: 'coupe', v: 'van', p: 'pickup' };
  const decode = r => {
    const m = i => (r[i] || 0) / 100, pt = i => [m(i), m(i + 1)], f = String(r[31] || '');
    return { years: [r[0], r[1]], body: bodies[r[2]], L: m(3), H: m(4), WB: m(5), fo: m(6), wd: m(7), sill: m(8), bump: m(9),
      nose: pt(10), cowl: pt(12), ws: pt(14), roof: pt(16), back: pt(18), deck: pt(20), tail: m(22), belt: pt(23), dlo: m(25), bp: m(26),
      doors: r[27], round: m(28), peak: m(29) || 0, gx: m(30) || 0, spare: f.includes('S'), clad: f.includes('C'),
      lamp: f.includes('R') ? 'round' : f.includes('Q') ? 'square' : '', tl: f.includes('T') ? 'tall' : '' };
  };
  // The generation that was built in the given year with the chosen body style; without a year, the newest.
  const form = (brand, model, body, year) => {
    const list = data[brand] && data[brand][model];
    if (!list) return null;
    const rows = body ? list.filter(r => bodies[r[2]] === body) : list;
    if (!rows.length) return null;
    const y = Number(year) || 9999, dist = r => y < r[0] ? r[0] - y : y > r[1] ? y - r[1] : 0;
    return decode(rows.slice().sort((a, b) => dist(a) - dist(b) || b[0] - a[0])[0]);
  };
  return { form, has: (brand, model) => !!(data[brand] && data[brand][model]) };
})();
