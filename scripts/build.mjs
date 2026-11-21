// Builds the profile SVGs (IT + EN) from templates. Usage: node build.mjs <profileDir>
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(process.argv[2], 'assets');
const img = 'data:image/webp;base64,' + readFileSync(join(out, 'andrii.webp')).toString('base64');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fill = (tpl, vars) => tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => (k === 'IMG' ? vars[k] : esc(vars[k])));

const copy = {
  it: {
    hero: {
      EYEBROW: 'ANDRII DYSHKANTIUK · ANALYTICS ENGINEER',
      FS: '72',
      H1A: 'Dati in tempo reale.',
      H1EM: 'Decisioni',
      H1B: ' senza attesa.',
      LEAD1: 'Data analytics, analytics engineering e real-time analytics',
      LEAD2: 'per team che non possono aspettare il report di domani.',
    },
    specs: [
      ['ESPERIENZA', '15+ anni', 'tra dati, marketing e prodotto'],
      ['CERTIFICAZIONE', 'ClickHouse · Confluent', 'Developer · Data Streaming Eng.'],
      ['SPECIALIZZAZIONE', 'Real-time', 'streaming, OLAP, aggregazioni'],
      ['STACK', 'Kafka · dbt', 'ClickHouse, SQL, Python, Iceberg'],
    ],
    certs: {
      chMeta: 'CLICKHOUSE, INC.', chDate: 'NOV 2026',
      chLines: ['Esame pratico ufficiale: modellazione', 'MergeTree, performance delle query,', 'ingestion ad alto throughput,', 'OLAP in tempo reale.'],
      cfMeta: 'CONFLUENT, AN IBM COMPANY', cfDate: 'GEN 2026',
    },
    flow: [
      ['01 · SORGENTI', 'Eventi', 'App, web, CRM, CDC', 'dai database operativi'],
      ['02 · STREAM', 'Kafka', 'Schemi versionati,', 'garanzie di consegna'],
      ['03 · OLAP', 'ClickHouse', 'MergeTree e materialized', 'view progettate sulle query'],
      ['04 · MODELLI', 'dbt', 'Trasformazioni testate,', 'semantic layer'],
      ['05 · AZIONE', 'Decisione', 'Dashboard, alert, reverse', 'ETL verso i team'],
    ],
  },
  en: {
    hero: {
      EYEBROW: 'ANDRII DYSHKANTIUK · ANALYTICS ENGINEER',
      FS: '60',
      H1A: 'Real-time data.',
      H1EM: 'Decisions',
      H1B: ' without the wait.',
      LEAD1: 'Data analytics, analytics engineering and real-time analytics',
      LEAD2: "for teams that can't wait for tomorrow's report.",
    },
    specs: [
      ['EXPERIENCE', '15+ years', 'across data, marketing and product'],
      ['CERTIFICATION', 'ClickHouse · Confluent', 'Developer · Data Streaming Eng.'],
      ['SPECIALTY', 'Real-time', 'streaming, OLAP, continuous aggs'],
      ['STACK', 'Kafka · dbt', 'ClickHouse, SQL, Python, Iceberg'],
    ],
    certs: {
      chMeta: 'CLICKHOUSE, INC.', chDate: 'NOV 2026',
      chLines: ['Official hands-on exam: MergeTree', 'modeling, query performance,', 'high-throughput ingestion,', 'real-time OLAP.'],
      cfMeta: 'CONFLUENT, AN IBM COMPANY', cfDate: 'JAN 2026',
    },
    flow: [
      ['01 · SOURCES', 'Events', 'App, web, CRM, CDC', 'from operational DBs'],
      ['02 · STREAM', 'Kafka', 'Versioned schemas,', 'delivery guarantees'],
      ['03 · OLAP', 'ClickHouse', 'MergeTree and materialized', 'views built around queries'],
      ['04 · MODELS', 'dbt', 'Tested transformations,', 'semantic layer'],
      ['05 · ACTION', 'Decision', 'Dashboards, alerts, reverse', 'ETL to the teams'],
    ],
  },
};

const STYLE = `<style>
    .mono { font-family: 'Geist Mono', 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
    .serif { font-family: 'Instrument Serif', Georgia, 'Times New Roman', serif; }
    .sans { font-family: Geist, Inter, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif; }
    @keyframes flow { from { stroke-dashoffset: 48 } to { stroke-dashoffset: 0 } }
    .flow { animation: flow 1.4s linear infinite; }
    @keyframes grow { from { transform: scaleX(0) } to { transform: scaleX(1) } }
    .bar { transform-box: fill-box; transform-origin: left; animation: grow 1.1s cubic-bezier(.2,.7,.2,1) both; }
  </style>`;

function specsSvg(specs) {
  const w = 300;
  const cols = specs
    .map(([label, value, note], i) => {
      const x = i * w;
      const sep = i ? `<line x1="${x}" y1="24" x2="${x}" y2="116" stroke="#22242a"/>` : '';
      return `${sep}
  <text x="${x + 28}" y="44" class="mono" font-size="11" letter-spacing="1.1" fill="#8d8e87">${esc(label)}</text>
  <text x="${x + 28}" y="82" class="serif" font-size="${value.length > 14 ? 22 : 32}" fill="#ecebe4">${esc(value)}</text>
  <text x="${x + 28}" y="106" class="sans" font-size="13" fill="#a4a59e">${esc(note)}</text>`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 140" width="1200" height="140" role="img" aria-label="${esc(specs.map((s) => `${s[0]}: ${s[1]}`).join(' · '))}">
  ${STYLE}
  <rect width="1200" height="140" rx="16" fill="#121316"/>
  <rect x="0.5" y="0.5" width="1199" height="139" rx="16" fill="none" stroke="#22242a"/>${cols}
</svg>
`;
}

function flowSvg(flow) {
  const nodes = flow
    .map(([step, name, l1, l2], i) => {
      const hl = i === 2;
      const last = i === 4;
      return `
  <g transform="translate(${40 + i * 228} 64)">
    <rect width="208" height="140" rx="10" fill="${hl ? '#d9f26a' : '#17181c'}"${hl ? '' : ' stroke="#2a2c32"'}/>
    <text x="18" y="30" class="mono" font-size="12" letter-spacing="1" fill="${hl ? '#3b4214' : '#8d8e87'}">${esc(step)}</text>
    <text x="18" y="72" class="serif" font-size="32"${last ? ' font-style="italic"' : ''} fill="${hl ? '#0d0e10' : last ? '#d9f26a' : '#ecebe4'}">${esc(name)}</text>
    <text x="18" y="102" class="sans" font-size="13" fill="${hl ? '#2a2f10' : '#a4a59e'}">${esc(l1)}</text>
    <text x="18" y="120" class="sans" font-size="13" fill="${hl ? '#2a2f10' : '#a4a59e'}">${esc(l2)}</text>
  </g>`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 230" width="1200" height="230" role="img" aria-label="${esc(flow.map((f) => f[1]).join(' → '))}">
  ${STYLE}
  <rect width="1200" height="230" rx="16" fill="#121316"/>
  <rect x="0.5" y="0.5" width="1199" height="229" rx="16" fill="none" stroke="#22242a"/>
  <line x1="40" y1="40" x2="1160" y2="40" stroke="#2a2c32" stroke-width="2"/>
  <line class="flow" x1="40" y1="40" x2="1160" y2="40" stroke="#d9f26a" stroke-width="2" stroke-dasharray="10 38"/>${nodes}
</svg>
`;
}

function certsSvg(c) {
  const scores = [
    ['Apache Kafka', 100],
    ['Kafka Connect', 100],
    ['Kafka Streams', 100],
    ['Schema Registry', 100],
    ['Apache Flink', 88],
  ];
  const bars = scores
    .map(([t, s], i) => {
      const y = 132 + i * 34;
      return `
    <text x="32" y="${y}" class="sans" font-size="15" fill="#c3c3bb">${t}</text>
    <rect x="196" y="${y - 9}" width="270" height="6" rx="3" fill="#2a2c32"/>
    <rect class="bar" style="animation-delay:${0.15 * i}s" x="196" y="${y - 9}" width="${2.7 * s}" height="6" rx="3" fill="${s === 100 ? '#d9f26a' : '#a4a59e'}"/>
    <text x="548" y="${y}" text-anchor="end" class="mono" font-size="13" fill="${s === 100 ? '#d9f26a' : '#a4a59e'}">${s}%</text>`;
    })
    .join('');
  const chText = c.chLines.map((l, i) => `<text x="32" y="${150 + i * 26}" class="sans" font-size="16" fill="#a4a59e">${esc(l)}</text>`).join('\n    ');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 330" width="1200" height="330" role="img" aria-label="ClickHouse Certified Developer · Confluent Data Streaming Engineer">
  ${STYLE}
  <g>
    <rect x="0.5" y="0.5" width="589" height="329" rx="14" fill="#121316" stroke="#22242a"/>
    <text x="32" y="44" class="mono" font-size="11" letter-spacing="1.1" fill="#8d8e87">${c.chMeta}</text>
    <text x="558" y="44" text-anchor="end" class="mono" font-size="12" fill="#d9f26a">${c.chDate}</text>
    <text x="32" y="100" class="serif" font-size="34" fill="#ecebe4">ClickHouse Certified Developer</text>
    ${chText}
  </g>
  <g transform="translate(610 0)">
    <rect x="0.5" y="0.5" width="589" height="329" rx="14" fill="#121316" stroke="#22242a"/>
    <text x="32" y="44" class="mono" font-size="11" letter-spacing="1.1" fill="#8d8e87">${c.cfMeta}</text>
    <text x="558" y="44" text-anchor="end" class="mono" font-size="12" fill="#d9f26a">${c.cfDate}</text>
    <text x="32" y="90" class="serif" font-size="34" fill="#ecebe4">Data Streaming Engineer</text>${bars}
  </g>
</svg>
`;
}

const heroTpl = readFileSync(join(here, 'hero.tpl.svg'), 'utf8');
for (const [lang, c] of Object.entries(copy)) {
  const h = c.hero;
  const aria = `${h.EYEBROW} — ${h.H1A} ${h.H1EM}${h.H1B}`;
  writeFileSync(join(out, `hero-${lang}.svg`), fill(heroTpl, { ...h, ARIA: aria, IMG: img }));
  writeFileSync(join(out, `specs-${lang}.svg`), specsSvg(c.specs));
  writeFileSync(join(out, `flow-${lang}.svg`), flowSvg(c.flow));
  writeFileSync(join(out, `certs-${lang}.svg`), certsSvg(c.certs));
}
console.log('ok');
