'use strict';
// Fictional sample data for the LAVREON app demo. Figures match the client portal demo (dashboard.html).
// Nothing is connected, live or advice. Dates are offsets in days from today so the demo never sits in the past.
window.LAVREON_APP_DATA = {
  client: {name: 'Alex', fullName: 'Alex Morgan', initials: 'AM', tier: 'Private Office', id: 'AM-001'},
  wealth: {
    total: 12430000, change: '+6.8%',
    classes: [
      {id: 'investments', label: 'Investments', value: 8210000, change: '+7.4%'},
      {id: 'real-estate', label: 'Real Estate', value: 2880000, change: '+5.6%'},
      {id: 'liquid', label: 'Liquid Assets', value: 1340000, change: '+2.1%'}
    ],
    allocation: [
      {label: 'Equities', share: 42.0, color: '#b8a06a'},
      {label: 'Real estate', share: 23.17, color: '#f1ede4'},
      {label: 'Private equity', share: 17.05, color: '#d4c08f'},
      {label: 'Cash', share: 10.78, color: '#7d6c48'},
      {label: 'Alternatives', share: 7.0, color: '#99958c'}
    ],
    sparkline: [6.9, 7.0, 6.95, 7.2, 7.15, 7.4, 7.35, 7.6, 7.7, 7.65, 7.9, 8.05, 8.0, 8.21]
  },
  // Investment value history in € millions. start/mid are [days, months] offsets; the series always ends today.
  performance: {
    '1M': {values: [8.04, 8.06, 8.02, 8.08, 8.10, 8.07, 8.12, 8.16, 8.13, 8.18, 8.21], change: '+2.1%', label: '1 month', start: [-30, 0]},
    '3M': {values: [7.64, 7.70, 7.67, 7.78, 7.73, 7.86, 7.94, 7.89, 8.02, 7.98, 8.10, 8.21], change: '+7.4%', label: '3 months', start: [0, -3]},
    '1Y': {values: [6.94, 7.02, 6.96, 7.16, 7.10, 7.35, 7.30, 7.42, 7.26, 7.61, 7.74, 7.66, 7.90, 7.84, 7.72, 7.95, 7.83, 7.70, 7.92, 8.02, 7.91, 8.10, 8.04, 8.21], change: '+18.3%', label: '1 year', start: [0, -12]},
    'ALL': {values: [6.12, 6.25, 6.17, 6.46, 6.38, 6.72, 6.84, 6.75, 7.10, 7.01, 7.28, 7.39, 7.22, 7.55, 7.48, 7.84, 7.71, 8.02, 7.86, 8.21], change: '+34.2%', label: 'All', start: [0, -36]}
  },
  activity: [
    {icon: 'up', title: 'Investment contribution', detail: 'Global equity fund', day: -5, amount: 250000, kind: 'Transfer in'},
    {icon: 'home', title: 'Property acquisition', detail: 'Example residence', day: -9, amount: -1200000, kind: 'Purchase'},
    {icon: 'diamond', title: 'Dividend received', detail: 'Equity portfolio', day: -12, amount: 42000, kind: 'Income'}
  ],
  markets: [
    {name: 'S&P 500', value: '5,483.00', change: '+0.8%', line: [1, 2, 2, 3, 2, 4, 3, 5, 6, 5, 7]},
    {name: 'Nasdaq', value: '17,421.00', change: '+1.1%', line: [1, 2, 3, 2, 4, 3, 4, 5, 4, 6, 7]},
    {name: 'DAX', value: '18,932.00', change: '+0.6%', line: [1, 2, 1, 3, 2, 4, 3, 5, 4, 6, 7]},
    {name: 'OMX Helsinki 25', value: '4,612.00', change: '−0.4%', line: [7, 6, 7, 5, 6, 4, 5, 3, 4, 2, 1]}
  ],
  currencies: [
    {pair: 'EUR / USD', rate: '1.078', change: '+0.3%'},
    {pair: 'EUR / GBP', rate: '0.861', change: '+0.2%'},
    {pair: 'EUR / SEK', rate: '11.240', change: '+0.1%'},
    {pair: 'EUR / CHF', rate: '0.944', change: '−0.1%'}
  ],
  // Same four scenarios as intelligence-feed.js, so the portal and the app tell one story.
  priorities: [
    {id: 'p1', type: 'Risk', title: 'Property cover may lag the property value', due: 21, area: 'Insurance', feeds: ['priorities'], steps: [
      'The Home / Property policy renews soon, with a sum insured of €2.10M.',
      'The real-estate register values the same property at €2.88M.',
      'A possible gap of about €0.78M between cover and value.',
      'Ask the insurer for an updated valuation and quote before the renewal date.']},
    {id: 'p2', type: 'Deadline', title: 'Holding company accounts and board meeting', due: 45, area: 'Companies', feeds: ['priorities'], steps: [
      'Example Holding Ltd has annual accounts and a board meeting due.',
      'The company holds the sample private-equity positions, 17% of total assets.',
      'Next year’s dividend and cash planning depends on the approved accounts.',
      'Confirm the timetable with your accountant and book the board meeting.']},
    {id: 'p3', type: 'Opportunity', title: 'Liquidity above the sample reserve', area: 'Wealth', feeds: ['priorities', 'opportunities'], steps: [
      'Liquid assets of €1.34M.',
      'The sample reserve target is six months of planned spending, about €0.60M.',
      'Around €0.74M sits above the target without a defined purpose.',
      'A question for your adviser: what should this liquidity be for? No recommendation is made.']},
    {id: 'p4', type: 'Opportunity', title: 'Policies renewing at different times', area: 'Insurance', feeds: ['opportunities'], steps: [
      'Six sample policies renew at different points in the year.',
      'Home, vehicles, liability and business cover each have their own renewal date.',
      'Aligning renewals could give one annual review instead of six separate ones.',
      'Discuss aligning renewal dates at the next planning conversation.']}
  ],
  // Curated from public sources, checked 15 September 2026 (same selection as the portal's AI Signal Brief).
  signals: [
    {id: 's1', title: 'AI forecasting moves into operational infrastructure', summary: 'Google says WeatherNext 3 adds satellite observations, hourly refreshes and higher-resolution forecasts, with integration across its consumer and cloud products.', why: 'More granular forecasts could support energy and property-risk planning; reliability still needs validation in each use case.', source: 'Google DeepMind', date: '2026-09-03', url: 'https://blog.google/innovation-and-ai/models-and-research/google-deepmind/introducing-weathernext-3/'},
    {id: 's2', title: 'Personal AI gains memory and visual assistance', summary: 'Google announced forthcoming Android features that let Gemini remember item locations in Find Hub and provide camera-based Guided vision assistance. Availability depends on device and country.', why: 'AI is becoming part of everyday workflows, making consent, accessibility and useful memory central product questions.', source: 'Google / Android', date: '2026-09-01', url: 'https://blog.google/products-and-platforms/platforms/android/android-drop-september-2026/'},
    {id: 's3', title: 'Agent capability puts containment under scrutiny', summary: 'Anthropic described stronger monitoring and isolation after incidents involving evaluation models running with reduced cyber safeguards. It paused some testing and training while improving controls.', why: 'Organisations adopting autonomous agents need scoped permissions, independent checks and clear accountability alongside model capability.', source: 'Anthropic', date: '2026-08-31', url: 'https://www.anthropic.com/news/improving-alignment-security-efforts'}
  ],
  agenda: [
    {id: 'm1', title: 'Planning conversation', detail: 'Illustrative quarterly check-in', day: 4, time: '10:00', minutes: 60},
    {id: 'm2', title: 'Investment review', detail: 'Sample portfolio discussion', day: 11, time: '14:30', minutes: 45},
    {id: 'm3', title: 'Structure & priorities', detail: 'Illustrative office meeting', day: 24, time: '11:00', minutes: 60}
  ],
  insurance: {policies: 6, premium: 18400, renewal: 21, tags: ['Home / Property', 'Vehicles', 'Travel', 'Liability', 'Life / Health', 'Business']},
  documents: [
    {id: 'd1', kind: 'Policy', title: 'Property policy schedule', day: -14, body: 'Example register: Home / Property policy with an upcoming renewal. This is a text preview, not an issued policy or proof of coverage.'},
    {id: 'd2', kind: 'Mandate', title: 'Office mandate', day: -40, body: 'Sample scope: consolidate priorities, review public information and prepare a quarterly office conversation. No agreement is in force.'}
  ],
  report: {title: 'A moment to take stock.', day: -3, body: [
    'The fictional asset snapshot totals €12.43M. The next sample priority is the upcoming property renewal. The current intelligence brief explores AI forecasting, everyday assistance and agent safeguards.',
    'Prepared for Alex Morgan, a fictional client. All financial values are illustrative and no recommendation is made.']},
  // Research requests to the office. stage: 0 received, 1 scoped, 2 in research, 3 delivered. day = sent (offset), due = needed by.
  requests: {allowance: 8, items: [
    {id: 'r1', question: 'Is the property sum insured in line with the latest valuation?', depth: 'Quick answer', day: -9, due: -2, stage: 3,
      answer: 'The real-estate register values the sample property at €2.88M against a sum insured of €2.10M. Ask the insurer for an updated valuation and renewal quote before the renewal date. This is a fictional answer derived from the sample data.'},
    {id: 'r2', question: 'How could more granular weather forecasts change property-risk planning?', depth: 'Deep brief', day: -4, due: 10, stage: 2},
    {id: 'r3', question: 'Prepare questions for the holding company board meeting.', depth: 'Quick answer', day: -1, due: 14, stage: 1}
  ]},
  messages: [
    {from: 'office', day: -3, time: '09:12', text: 'Good morning, Alex. Your monthly office note is ready under Reports.'},
    {from: 'office', day: -1, time: '16:40', text: 'The property policy renews in three weeks. The schedule is in your documents whenever you want to look at it together.'}
  ]
};
