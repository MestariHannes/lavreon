'use strict';
// Side-view drawings of real car models made with the Higgsfield image generator, one per generation and body
// style: "brand|model|body|first year" → file under base. Models without a drawing use the drawn outline.
window.AjouraImages = (() => {
  const base = 'https://d8j0ntlcm91z4.cloudfront.net/user_3KLO7sd44ZlhjzL21Y0wVlpDTKr/';
  const files = {};
  const get = (brand, model, body, from) => {
    const f = files[[brand, model, body, from].join('|')];
    return f ? (/^https?:|^\//.test(f) ? f : base + f) : undefined;
  };
  return { get, files };
})();
