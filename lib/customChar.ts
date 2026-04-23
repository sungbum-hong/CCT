export interface CustomChar {
  id: string;
  name: string;
  role: string;
  color: string;
  dimColor: string;
  svg: string;
  quotes: string[];
  projectPath: string;
}

interface Theme {
  color: string;
  dim: string;
  hair: number;   // 0-5
  acc: number;    // 0-4
  mouth: number;  // 0-2
  body: number;   // 0-3
  keys: string[];
}

// 키워드 → 테마 매핑 (순서 중요: 앞쪽이 우선)
const THEMES: Theme[] = [
  { color: '#F0C040', dim: '#A07810', hair: 3, acc: 1, mouth: 1, body: 1,
    keys: ['wallet','finance','money','pay','bank','coin','crypto','billing','payment','invest','fund','stock'] },
  { color: '#7BC67E', dim: '#2E7D32', hair: 2, acc: 0, mouth: 0, body: 2,
    keys: ['tree','nature','plant','garden','leaf','eco','forest','farm','grow','think','green'] },
  { color: '#E879A0', dim: '#880E4F', hair: 1, acc: 4, mouth: 0, body: 0,
    keys: ['social','chat','community','friend','talk','message','sns','forum','dating','love','share'] },
  { color: '#4ECDC4', dim: '#00695C', hair: 0, acc: 1, mouth: 1, body: 3,
    keys: ['data','analytics','dashboard','chart','report','metric','stat','log','monitor','insight','bi'] },
  { color: '#FF8C42', dim: '#BF360C', hair: 4, acc: 0, mouth: 2, body: 0,
    keys: ['game','play','quest','level','score','arcade','rpg','puzzle','casual'] },
  { color: '#B39DDB', dim: '#512DA8', hair: 3, acc: 3, mouth: 1, body: 1,
    keys: ['shop','store','commerce','market','sell','buy','cart','ecommerce','retail'] },
  { color: '#FF7043', dim: '#BF360C', hair: 2, acc: 2, mouth: 0, body: 0,
    keys: ['photo','image','media','video','camera','film','visual','art','design','creative'] },
  { color: '#7986CB', dim: '#283593', hair: 1, acc: 2, mouth: 0, body: 0,
    keys: ['music','audio','sound','beat','melody','song','podcast','stream'] },
  { color: '#CE93D8', dim: '#6A1B9A', hair: 5, acc: 1, mouth: 2, body: 3,
    keys: ['ai','ml','model','neural','bot','gpt','llm','nlp','vision','diffusion'] },
  { color: '#FFB74D', dim: '#E65100', hair: 4, acc: 3, mouth: 0, body: 2,
    keys: ['travel','map','location','geo','place','trip','tour','route','navigate'] },
  { color: '#4DB6AC', dim: '#004D40', hair: 5, acc: 0, mouth: 0, body: 2,
    keys: ['health','medical','doctor','care','fit','gym','sport','diet','wellness','mental'] },
  { color: '#64B5F6', dim: '#0D47A1', hair: 0, acc: 1, mouth: 1, body: 3,
    keys: ['edu','learn','study','school','course','book','teach','tutor','quiz','exam'] },
  { color: '#EF5350', dim: '#B71C1C', hair: 4, acc: 1, mouth: 2, body: 1,
    keys: ['auth','security','login','password','encrypt','token','safe','protect','shield'] },
  { color: '#A1887F', dim: '#4E342E', hair: 0, acc: 0, mouth: 1, body: 0,
    keys: ['news','blog','article','post','content','write','journal','magazine','cms'] },
  { color: '#78909C', dim: '#263238', hair: 3, acc: 2, mouth: 2, body: 1,
    keys: ['tool','cli','terminal','script','util','plugin','extension','sdk','devtool'] },
  { color: '#AED581', dim: '#33691E', hair: 1, acc: 0, mouth: 0, body: 2,
    keys: ['api','backend','server','rest','graphql','grpc','endpoint','gateway','service'] },
  { color: '#F48FB1', dim: '#880E4F', hair: 5, acc: 4, mouth: 0, body: 0,
    keys: ['todo','task','note','memo','calendar','schedule','reminder','planner','board'] },
  { color: '#80CBC4', dim: '#004D40', hair: 2, acc: 0, mouth: 1, body: 3,
    keys: ['home','smart','iot','device','sensor','hardware','embedded','firmware'] },
];

// 해시 기반 폴백 팔레트 (키워드 미매칭 시 사용)
const FALLBACK_PALETTES = [
  { color: '#B06BC1', dim: '#7B3A8B', hair: 0, acc: 0, mouth: 0, body: 0 },
  { color: '#C15A6B', dim: '#8B2A3B', hair: 1, acc: 1, mouth: 1, body: 1 },
  { color: '#5A8BC1', dim: '#2A5B8B', hair: 2, acc: 2, mouth: 2, body: 2 },
  { color: '#C18A5A', dim: '#8B5A2A', hair: 3, acc: 3, mouth: 0, body: 3 },
  { color: '#5AC18A', dim: '#2A8B5A', hair: 4, acc: 4, mouth: 1, body: 0 },
  { color: '#C1A85A', dim: '#8B782A', hair: 5, acc: 0, mouth: 2, body: 1 },
  { color: '#5AB5C1', dim: '#2A858B', hair: 0, acc: 2, mouth: 0, body: 2 },
  { color: '#C16B5A', dim: '#8B3B2A', hair: 1, acc: 3, mouth: 1, body: 3 },
  { color: '#8BC15A', dim: '#5B8B2A', hair: 2, acc: 4, mouth: 2, body: 0 },
  { color: '#6B5AC1', dim: '#3B2A8B', hair: 3, acc: 1, mouth: 0, body: 1 },
  { color: '#C15AA8', dim: '#8B2A78', hair: 4, acc: 2, mouth: 1, body: 2 },
  { color: '#5AC1B0', dim: '#2A8B80', hair: 5, acc: 3, mouth: 2, body: 3 },
];

function hashStr(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (((h << 5) + h) ^ s.charCodeAt(i)) >>> 0;
  return h;
}

/** 프로젝트 이름 + 설명 키워드 분석 → 테마 결정 */
function detectTheme(name: string, overview: string): { color: string; dim: string; hair: number; acc: number; mouth: number; body: number } {
  const text = (name + ' ' + overview).toLowerCase();
  for (const t of THEMES) {
    if (t.keys.some(k => text.includes(k))) return t;
  }
  // 키워드 없으면 해시 기반 폴백
  const h = hashStr(name || overview || 'x');
  return FALLBACK_PALETTES[h % FALLBACK_PALETTES.length];
}

// ── SVG 파트 생성 ─────────────────────────────────────────────

function hairSvg(style: number, dim: string): string {
  switch (style % 6) {
    case 0: // 단발 평범
      return `<path d="M27 16 Q40 8 53 16 L53 20 Q40 11 27 20Z" fill="${dim}"/>`;
    case 1: // 뾰족 스파이크
      return `<path d="M28 17 L31 5 L34 15 L38 2 L40 12 L42 2 L46 15 L49 5 L52 17 Q40 13 28 17Z" fill="${dim}"/>`;
    case 2: // 긴 웨이브 (옆머리)
      return `<path d="M26 15 Q25 7 31 8 Q36 4 40 7 Q44 4 49 8 Q55 7 54 15 L53 19 Q40 11 27 19Z" fill="${dim}"/>
<path d="M23 23 Q20 31 23 38" stroke="${dim}" stroke-width="4" fill="none" stroke-linecap="round"/>
<path d="M57 23 Q60 31 57 38" stroke="${dim}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    case 3: // 올백
      return `<ellipse cx="40" cy="13" rx="14" ry="7" fill="${dim}"/>
<path d="M27 15 Q40 9 53 15 L53 21 Q40 13 27 21Z" fill="${dim}"/>`;
    case 4: // 모히칸 (중앙 스파이크)
      return `<path d="M36 16 L38 3 L40 0 L42 3 L44 16 Q40 14 36 16Z" fill="${dim}"/>
<path d="M27 18 Q33 16 36 16 Q40 14 44 16 Q47 16 53 18 L53 21 Q40 14 27 21Z" fill="${dim}"/>`;
    case 5: // 번 (위 묶음)
      return `<path d="M27 17 Q40 10 53 17 L53 21 Q40 13 27 21Z" fill="${dim}"/>
<circle cx="40" cy="9" r="6" fill="${dim}"/>
<path d="M36 13 Q40 15 44 13" stroke="${dim}" stroke-width="1.5" fill="none"/>`;
    default: return '';
  }
}

function accessorySvg(style: number, color: string, dim: string): string {
  switch (style % 5) {
    case 0: // 없음
      return '';
    case 1: // 둥근 안경
      return `<circle cx="33" cy="24" r="5" fill="none" stroke="${dim}" stroke-width="1.3" opacity=".85"/>
<circle cx="47" cy="24" r="5" fill="none" stroke="${dim}" stroke-width="1.3" opacity=".85"/>
<path d="M38 24 L42 24" stroke="${dim}" stroke-width="1" opacity=".85"/>
<path d="M28 24 L25 23" stroke="${dim}" stroke-width="1" opacity=".85"/>`;
    case 2: // 헤드폰
      return `<path d="M27 23 Q27 11 40 11 Q53 11 53 23" fill="none" stroke="${dim}" stroke-width="2.5" stroke-linecap="round"/>
<rect x="23" y="21" width="6" height="9" rx="2.5" fill="${color}"/>
<rect x="51" y="21" width="6" height="9" rx="2.5" fill="${color}"/>`;
    case 3: // 야구 모자
      return `<rect x="27" y="9" width="26" height="11" rx="4" fill="${dim}"/>
<ellipse cx="40" cy="20" rx="17" ry="3.5" fill="${dim}"/>
<rect x="40" y="18" width="14" height="3" rx="1" fill="${dim}" opacity=".7"/>`;
    case 4: // 리본
      return `<path d="M34 11 Q40 8 46 11" stroke="${dim}" stroke-width="2" fill="none" stroke-linecap="round"/>
<ellipse cx="36" cy="10" rx="3.5" ry="2.5" fill="${color}"/>
<ellipse cx="44" cy="10" rx="3.5" ry="2.5" fill="${color}"/>
<circle cx="40" cy="10" r="2" fill="${dim}"/>`;
    default: return '';
  }
}

function mouthSvg(style: number): string {
  switch (style % 3) {
    case 0: return `<path d="M35 33 Q40 37 45 33" fill="none" stroke="#c49060" stroke-width="1.3" stroke-linecap="round"/>`;
    case 1: return `<path d="M36 34 Q40 36.5 44 34" fill="none" stroke="#c49060" stroke-width="1.3" stroke-linecap="round"/>`;
    case 2: return `<line x1="36" y1="34" x2="44" y2="34" stroke="#c49060" stroke-width="1.3" stroke-linecap="round"/>`;
    default: return '';
  }
}

function bodyDetailSvg(style: number, dim: string): string {
  switch (style % 4) {
    case 0: return '';
    case 1: // 넥타이
      return `<polygon points="39,63 41,63 42,72 40,74 38,72" fill="${dim}" opacity=".6"/>
<polygon points="38,61 42,61 41,64 39,64" fill="${dim}" opacity=".7"/>`;
    case 2: // 가슴 포켓 + 배지
      return `<rect x="34" y="69" width="12" height="8" rx="2" fill="${dim}" opacity=".35"/>
<circle cx="40" cy="73" r="2.5" fill="${dim}" opacity=".6"/>`;
    case 3: // 스카프/칼라
      return `<path d="M30 62 Q40 58 50 62 Q45 68 40 66 Q35 68 30 62Z" fill="${dim}" opacity=".5"/>`;
    default: return '';
  }
}

export function makeSvg(color: string, dim: string, hair: number, acc: number, mouth: number, body: number): string {
  return `<svg viewBox="0 0 80 120" width="80" height="120" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="40" cy="26" rx="14" ry="15" fill="#FFD5A8"/>
${hairSvg(hair, dim)}
${accessorySvg(acc, color, dim)}
<ellipse cx="33" cy="24" rx="5" ry="4.5" fill="white"/>
<ellipse cx="33" cy="25" rx="3.5" ry="3.5" fill="${color}"/>
<ellipse cx="33" cy="26" rx="2.2" ry="2.2" fill="#07182C"/>
<circle cx="34.5" cy="23.5" r="1" fill="white"/>
<ellipse cx="47" cy="24" rx="5" ry="4.5" fill="white"/>
<ellipse cx="47" cy="25" rx="3.5" ry="3.5" fill="${color}"/>
<ellipse cx="47" cy="26" rx="2.2" ry="2.2" fill="#07182C"/>
<circle cx="48.5" cy="23.5" r="1" fill="white"/>
${mouthSvg(mouth)}
<rect x="36" y="40" width="8" height="18" fill="#FFD5A8"/>
<path d="M16 68 L26 60 L40 58 L54 60 L64 68 L62 110 L18 110Z" fill="${color}"/>
${bodyDetailSvg(body, dim)}
<path d="M16 68 L8 72 L6 96 L16 98 L18 76 L16 68Z" fill="${color}" stroke="${dim}" stroke-width=".8"/>
<path d="M64 68 L72 72 L74 96 L64 98 L62 76 L64 68Z" fill="${color}" stroke="${dim}" stroke-width=".8"/>
<ellipse cx="10" cy="100" rx="6" ry="5" fill="#FFD5A8" stroke="#e0b080" stroke-width=".8"/>
<ellipse cx="70" cy="100" rx="6" ry="5" fill="#FFD5A8" stroke="#e0b080" stroke-width=".8"/>
</svg>`;
}

/** Extract first meaningful description from CLAUDE.md */
export function extractOverview(content: string): string {
  const lines = content.split('\n');
  let inOverview = false;
  for (const line of lines) {
    const t = line.trim();
    if (/^##\s+.*(개요|overview|about|description)/i.test(t)) { inOverview = true; continue; }
    if (inOverview && t && !t.startsWith('#') && !t.startsWith('```')) return t;
    if (!inOverview && t && !t.startsWith('#') && !t.startsWith('```') && t.length > 10) return t;
  }
  return '';
}

export function makeTag(name: string): string {
  if (!name) return '??';
  const parts = name.split(/[-_\s]|(?=[A-Z])/).filter(Boolean);
  if (parts.length >= 2) return parts.map(p => p[0].toUpperCase()).join('').slice(0, 3);
  const n = name.toLowerCase();
  if (n.length === 1) return n.toUpperCase();
  const mid = Math.ceil(n.length / 2);
  return (n[0] + n[mid]).toUpperCase();
}

/** One character per project */
export function buildProjectChar(projectName: string, overview: string, projectPath: string, index: number): CustomChar {
  const resolvedName = projectName || projectPath.split('/').filter(Boolean).pop() || 'project';
  const { color, dim, hair, acc, mouth, body } = detectTheme(resolvedName, overview);
  const shortName = makeTag(resolvedName);
  return {
    id: `custom-${projectPath.replace(/\//g, '-') || index}`,
    name: shortName,
    role: overview || projectName,
    color,
    dimColor: dim,
    svg: makeSvg(color, dim, hair, acc, mouth, body),
    quotes: [`[${shortName}] 작업 중...`, `[${shortName}] Claude Code 실행!`, `[${shortName}] 준비됐어요`],
    projectPath,
  };
}

/** 기존 저장 캐릭터의 SVG·색상을 최신 로직으로 재생성 */
export function regenCharVisuals(c: CustomChar): CustomChar {
  const baseName = c.projectPath.split('/').filter(Boolean).pop() || c.name;
  const { color, dim, hair, acc, mouth, body } = detectTheme(baseName, c.role);
  return { ...c, color, dimColor: dim, svg: makeSvg(color, dim, hair, acc, mouth, body) };
}

// Keep for backwards compat
export function parseClaudeMd(content: string): Array<{ name: string; role: string }> {
  return [{ name: content.split('\n')[0].replace(/^#\s*/, '').trim() || 'Project', role: extractOverview(content) }];
}
export function buildCustomChars(parsed: Array<{ name: string; role: string }>, projectName: string): CustomChar[] {
  return parsed.slice(0, 1).map((p, i) => buildProjectChar(projectName, p.role, projectName, i));
}
