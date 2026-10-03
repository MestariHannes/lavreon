'use strict';
// Fictional demo dates are relative to today, so sample renewals and meetings never sit in the past.
// Usage: <time data-demo-day="21" data-demo-format="date"></time>. Real publication dates stay static in the HTML.
(() => {
  const DAY = 86400000;
  const locale = () => (window.LavreonLanguage?.language === 'fi' ? 'fi-FI' : 'en-GB');
  const shift = (days = 0, months = 0) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    if (months) date.setMonth(date.getMonth() + months);
    return new Date(date.getTime() + days * DAY);
  };
  const part = (date, options) => new Intl.DateTimeFormat(locale(), options).format(date);
  // Fixed English abbreviations: some engines print "Sept" for en-GB.
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fi = () => locale() === 'fi-FI';
  const monthShort = date => fi() ? part(date, {month: 'short'}).replace('.', '') : monthsEn[date.getMonth()];
  const formats = {
    date: date => fi() ? `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}` : `${date.getDate()} ${monthShort(date)} ${date.getFullYear()}`,
    'day-month': date => fi() ? `${date.getDate()}.${date.getMonth() + 1}.` : `${String(date.getDate()).padStart(2, '0')} ${monthShort(date)}`,
    'month-year': date => part(date, {month: 'long', year: 'numeric'}),
    'month-short-year': date => `${monthShort(date)} '${String(date.getFullYear()).slice(2)}`
  };
  const format = (date, name = 'date') => (formats[name] || formats.date)(date);
  const iso = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  function render(root = document) {
    for (const element of root.querySelectorAll('[data-demo-day]')) {
      const date = shift(Number(element.dataset.demoDay));
      if (element.matches('time')) element.dateTime = iso(date);
      if (element.dataset.demoFormat === 'agenda') {
        const month = document.createElement('small');
        month.textContent = monthShort(date).toUpperCase();
        element.replaceChildren(String(date.getDate()).padStart(2, '0'), month);
      } else {
        element.textContent = format(date, element.dataset.demoFormat);
      }
    }
  }
  window.LavreonDemoDate = {shift, format, render};
  render();
  document.addEventListener('lavreon-languagechange', () => render());
})();
