'use strict';
// Fictional priority intelligence for the demo client. Every figure derives from the sample data on the page;
// nothing is connected, live or advice. Each item follows DATA -> CONTEXT -> INTELLIGENCE -> ACTION.
(() => {
  const items = [
    {
      type: 'Risk', title: 'Property cover may lag the property value', due: 21, module: 'insurance', link: 'Review insurance',
      feeds: ['priorities'],
      steps: [
        'The Home / Property policy renews soon, with a sum insured of €2.10M.',
        'The real-estate register values the same property at €2.88M.',
        'A possible gap of about €0.78M between cover and value.',
        'Ask the insurer for an updated valuation and quote before the renewal date.'
      ]
    },
    {
      type: 'Deadline', title: 'Holding company accounts and board meeting', due: 45, module: 'agenda', link: 'Open agenda',
      feeds: ['priorities'],
      steps: [
        'Example Holding Ltd has annual accounts and a board meeting due.',
        'The company holds the sample private-equity positions, 17% of total assets.',
        'Next year’s dividend and cash planning depends on the approved accounts.',
        'Confirm the timetable with your accountant and book the board meeting.'
      ]
    },
    {
      type: 'Opportunity', title: 'Liquidity above the sample reserve', module: 'wealth', link: 'Open wealth',
      feeds: ['priorities', 'opportunities'],
      steps: [
        'Liquid assets of €1.34M.',
        'The sample reserve target is six months of planned spending, about €0.60M.',
        'Around €0.74M sits above the target without a defined purpose.',
        'A question for your adviser: what should this liquidity be for? No recommendation is made.'
      ]
    },
    {
      type: 'Opportunity', title: 'Policies renewing at different times', module: 'insurance', link: 'Review insurance',
      feeds: ['opportunities'],
      steps: [
        'Six sample policies renew at different points in the year.',
        'Home, vehicles, liability and business cover each have their own renewal date.',
        'Aligning renewals could give one annual review instead of six separate ones.',
        'Discuss aligning renewal dates at the next planning conversation.'
      ]
    }
  ];
  const stages = ['Data', 'Context', 'Intelligence', 'Action'];
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function render(feed) {
    const root = document.querySelector(`#${feed}-items`);
    if (!root) return;
    for (const item of items.filter(entry => entry.feeds.includes(feed))) {
      const article = element('article', 'priority-item');
      const head = element('div', 'priority-head');
      head.append(element('span', `priority-type priority-${item.type.toLowerCase()}`, item.type));
      if (item.due) {
        const due = element('span', 'priority-due', 'Act by ');
        const time = element('time');
        time.dataset.demoDay = String(item.due);
        time.dataset.demoFormat = 'date';
        due.append(time);
        head.append(due);
      }
      const steps = element('ol', 'priority-steps');
      item.steps.forEach((text, index) => {
        const step = element('li');
        step.append(element('span', 'priority-stage', stages[index]), element('p', '', text));
        steps.append(step);
      });
      const link = element('a', 'priority-link', `${item.link} ↗`);
      link.href = `#${item.module === 'agenda' ? 'upcoming' : item.module}`;
      link.dataset.module = item.module;
      article.append(head, element('h3', '', item.title), steps, link);
      root.append(article);
    }
  }
  render('priorities');
  render('opportunities');
  window.LavreonDemoDate?.render(document.querySelector('#priorities'));
})();
