export interface Character {
  id: 'haiku' | 'sonnet' | 'opus';
  tag: string;
  tagClass: string;
  cardClass: string;
  selClass: string;
  dotColor: string;
  name: string;
  role: string;
  model: string;
  systemPrompt: string;
  quotes: string[];
  svg: string;
  introMessage: string;
}

export const CHARACTERS: Character[] = [
  {
    id: 'haiku',
    tag: 'CDY',
    tagClass: 'ctag-h',
    cardClass: 'haiku',
    selClass: 'active-h',
    dotColor: '#378ADD',
    name: 'CDY',
    role: 'Speed Demon / 초고속 러너',
    model: 'claude-haiku-4-5',
    systemPrompt: `당신은 Claude Haiku 캐릭터입니다. 빠르고 에너지 넘치는 개발자 캐릭터예요.
규칙: 한국어로 2-3문장 이내로만. ⚡ 이모지 자주 사용. 빠름/속도 비유. 코드는 영어.

[청년 스터디 전문 지식]
당신은 청년 스터디 프로그램에 대해 깊이 알고 있습니다. 아래 내용을 바탕으로 답변하세요.

좋은 점:
- 또래 학습으로 이해도 향상, 서로 가르치며 개념 확실히 정착
- 네트워킹 효과 — 스터디 멤버가 미래의 동료/레퍼런스가 됨
- 자기주도 학습 습관 형성, 혼자 공부보다 꾸준히 지속 가능
- 다양한 관점에서 문제를 바라보는 시각 확장

개선안:
- 목표와 커리큘럼을 미리 명확히 설정해야 방향성 유지
- 무임승차 방지를 위한 역할 분담 및 기여도 체크 필요
- 온/오프라인 병행 운영으로 참여 장벽 낮추기
- 발표 및 피드백 세션 정례화로 실력 측정 기회 확보

정책/지원:
- 정부 청년 지원 사업(고용노동부 청년내일채움공제 등)과 연계 가능
- 대학·기관의 스터디룸 공간 지원 활용 권장
- 스터디 결과물을 포트폴리오화하여 취업 연계 전략 수립
- 멘토-멘티 구조 도입으로 선배 개발자와의 연결 강화`,
    quotes: ['⚡ 빠르게 뭐 해?', '⚡ 8ms 만에 끝냄!', '⚡ 속도가 진리야!'],
    introMessage: '⚡ 하이! 나야 하이쿠. 빠르게 뭐든 해결해줄게! 뭐가 필요해?',
    svg: `<svg viewBox="0 0 110 160" width="110" height="160" xmlns="http://www.w3.org/2000/svg"><line x1="76" y1="10" x2="109" y2="5" stroke="#85B7EB" stroke-width="2" opacity=".65" stroke-linecap="round"/><line x1="78" y1="20" x2="109" y2="16" stroke="#85B7EB" stroke-width="1.5" opacity=".45" stroke-linecap="round"/><line x1="77" y1="30" x2="107" y2="28" stroke="#85B7EB" stroke-width="1" opacity=".25" stroke-linecap="round"/><path d="M33 44 Q30 14 55 10 Q80 14 77 44" fill="#122849"/><path d="M73 22 Q90 11 100 6 L85 25Z" fill="#122849"/><path d="M75 32 Q94 21 104 18 L88 36Z" fill="#122849"/><path d="M75 41 Q96 35 106 33 L90 45Z" fill="#122849"/><path d="M33 26 Q55 20 77 26 L77 35 Q55 29 33 35Z" fill="#185FA5"/><path d="M35 27 Q55 22 75 27 L75 31 Q55 25 35 31Z" fill="#378ADD" opacity=".5"/><ellipse cx="55" cy="49" rx="22" ry="24" fill="#FFD5A8"/><ellipse cx="32" cy="49" rx="3.5" ry="4.5" fill="#FFD5A8" stroke="#e0b080" stroke-width=".8"/><ellipse cx="78" cy="49" rx="3.5" ry="4.5" fill="#FFD5A8" stroke="#e0b080" stroke-width=".8"/><ellipse cx="44" cy="47" rx="6" ry="5.5" fill="white"/><ellipse cx="44" cy="48" rx="4.5" ry="4.2" fill="#1B5AA0"/><ellipse cx="44" cy="49" rx="2.8" ry="2.8" fill="#07182C"/><circle cx="45.8" cy="46" r="1.3" fill="white"/><ellipse cx="66" cy="47" rx="6" ry="5.5" fill="white"/><ellipse cx="66" cy="48" rx="4.5" ry="4.2" fill="#1B5AA0"/><ellipse cx="66" cy="49" rx="2.8" ry="2.8" fill="#07182C"/><circle cx="67.8" cy="46" r="1.3" fill="white"/><path d="M37 40 Q44 37.5 50 39.5" stroke="#122849" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M60 39.5 Q66 37.5 73 40" stroke="#122849" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M52 56 Q55 58.5 58 56" fill="none" stroke="#c49060" stroke-width="1.2" stroke-linecap="round"/><path d="M40 64 Q55 76 70 64 Q70 70 55 72 Q40 70 40 64Z" fill="#c49060"/><path d="M42 65 Q55 74 68 65 Q68 68 55 70 Q42 68 42 65Z" fill="white"/><path d="M35 32 Q37 42 40 47" stroke="#122849" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M42 24 Q44 35 46 43" stroke="#122849" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M68 25 Q67 36 65 43" stroke="#122849" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="49" y="71" width="12" height="11" fill="#FFD5A8"/><path d="M20 90 L30 82 L55 80 L80 82 L90 90 L88 140 L22 140Z" fill="#378ADD"/><path d="M20 90 L30 82 L32 140 L22 140Z" fill="#185FA5"/><path d="M90 90 L80 82 L78 140 L88 140Z" fill="#185FA5"/><line x1="55" y1="80" x2="55" y2="140" stroke="#0C447C" stroke-width="1.5"/><path d="M41 80 L48 90 L55 83 L62 90 L69 80" fill="#185FA5"/><path d="M47 95 L57 95 L52 108 L61 108 L43 128 L50 113 L41 113Z" fill="#EF9F27" stroke="#BA7517" stroke-width=".8"/><path d="M20 90 L11 93 L7 120 L18 122 L22 106 L20 90Z" fill="#378ADD" stroke="#185FA5" stroke-width=".8"/><path d="M90 90 L99 93 L103 120 L92 122 L88 106 L90 90Z" fill="#378ADD" stroke="#185FA5" stroke-width=".8"/><ellipse cx="12" cy="124" rx="6" ry="5" fill="#FFD5A8" stroke="#e0b080" stroke-width=".8"/><ellipse cx="98" cy="124" rx="6" ry="5" fill="#FFD5A8" stroke="#e0b080" stroke-width=".8"/></svg>`,
  },
  {
    id: 'sonnet',
    tag: 'CPD',
    tagClass: 'ctag-s',
    cardClass: 'sonnet',
    selClass: 'active-s',
    dotColor: '#639922',
    name: 'CPD',
    role: 'Balanced Dev / 만능 개발자',
    model: 'claude-sonnet-4-6',
    systemPrompt: `당신은 Claude Sonnet 캐릭터입니다. 균형잡힌 베테랑 개발자 캐릭터예요.
규칙: 한국어로 3-5문장으로 답변. 🎵 이모지 사용. 사려깊고 균형잡힌 답변. 코드는 영어.

[청년 1인가구 전문 지식]
당신은 청년 1인가구 자취, 집 구하기, 주거 지원 정책에 대해 깊이 알고 있습니다.

자취 꿀팁:
- 식비 절약: 저녁 마트 마감 할인(30~50%), 밀프렙(주 1회 일괄 조리), 식재료 소분 냉동 보관
- 에어프라이어는 1인가구 필수 가전 — 간편하고 기름 없이 조리 가능
- 공과금: 에너지 캐시백 제도(한국전력) 신청, 에어컨 필터 2주 1회 청소로 전기세 절감
- 인테리어: 이케아 칼락스 + 패브릭 박스, 붙이는 벽지/포인트 필름으로 보증금 걱정 없이 꾸미기
- 중고 거래(당근마켓, 번개장터)로 초기 가전·가구 비용 절반 이하로 절감
- 가계부 앱(뱅크샐러드, 토스) 연동으로 지출 관리

집 구하는 방법:
- 앱: 직방(허위매물 신고 강화), 다방(원룸 특화), 네이버 부동산(실거래가), 피터팬의 좋은방(직거래·복비 절약)
- 계약 전 반드시: 등기부등본 확인(인터넷등기소, 700원), 근저당 확인 — 보증금+대출이 집값 70% 초과 시 위험
- 계약 후 즉시: 전입신고(14일 이내) + 확정일자(주민센터 600원) 받기
- 전세보증보험(HUG/SGI) 가입 필수 — 전세사기 예방
- 반전세(보증부 월세)가 목돈 없는 청년에게 현실적인 선택

청년 주거 지원 정책:
- 청년 버팀목 전세자금 대출: 만 19~34세, 수도권 3억/지방 2억, 연 1.5~2.7% 저금리
- 청년 월세 한시 특별지원: 월 최대 20만 원 × 12개월, 복지로(bokjiro.go.kr) 신청
- 청년 주택드림 청약통장: 만 19~34세, 금리 최대 4.5%, 납입액 40% 소득공제
- LH 청년 매입임대: 시세 40~50% 수준, LH 청약센터(apply.lh.or.kr) 공고 확인
- LH 청년 전세임대: 전세금의 5% 내외 보증금만 부담, LH가 나머지 부담
- 서울 청년 월세 지원: 월 최대 20만 원 × 10개월, 서울주거포털(housing.seoul.go.kr)
- 마이홈포털(myhome.go.kr)에서 본인 조건에 맞는 정책 한번에 조회 가능`,
    quotes: ['🎵 같이 코딩해요!', '🎵 균형이 중요해요', '🎵 흥미롭네요!'],
    introMessage: '🎵 안녕하세요, 저는 소네트예요. 코드든 설명이든 균형 있게 도와드릴게요. 어떤 걸 같이 만들어볼까요?',
    svg: `<svg viewBox="0 0 110 160" width="110" height="160" xmlns="http://www.w3.org/2000/svg"><text x="90" y="22" font-size="14" fill="#97C459" opacity=".75" font-family="serif">♪</text><text x="98" y="38" font-size="10" fill="#97C459" opacity=".5" font-family="serif">♫</text><path d="M33 46 Q30 16 55 12 Q80 16 77 46" fill="#2A4218"/><path d="M33 46 Q26 58 28 70 Q32 56 36 48" fill="#2A4218"/><path d="M77 46 Q84 58 82 70 Q78 56 74 48" fill="#2A4218"/><ellipse cx="55" cy="50" rx="22" ry="25" fill="#FFE0B8"/><ellipse cx="32" cy="50" rx="3.5" ry="4.5" fill="#FFE0B8" stroke="#e8c090" stroke-width=".8"/><ellipse cx="78" cy="50" rx="3.5" ry="4.5" fill="#FFE0B8" stroke="#e8c090" stroke-width=".8"/><rect x="36" y="42" width="14" height="12" rx="5" fill="none" stroke="#3B6D11" stroke-width="2"/><rect x="60" y="42" width="14" height="12" rx="5" fill="none" stroke="#3B6D11" stroke-width="2"/><line x1="50" y1="48" x2="60" y2="48" stroke="#3B6D11" stroke-width="1.5"/><line x1="34" y1="48" x2="36" y2="48" stroke="#3B6D11" stroke-width="1.5"/><line x1="74" y1="48" x2="76" y2="48" stroke="#3B6D11" stroke-width="1.5"/><rect x="37" y="43" width="12" height="10" rx="4" fill="#C0DD97" opacity=".2"/><rect x="61" y="43" width="12" height="10" rx="4" fill="#C0DD97" opacity=".2"/><ellipse cx="43" cy="48" rx="4.2" ry="4" fill="white"/><ellipse cx="43" cy="49" rx="3" ry="3" fill="#3B6D11"/><ellipse cx="43" cy="49.5" rx="1.9" ry="1.9" fill="#142808"/><circle cx="44.3" cy="47.5" r="1.1" fill="white"/><ellipse cx="67" cy="48" rx="4.2" ry="4" fill="white"/><ellipse cx="67" cy="49" rx="3" ry="3" fill="#3B6D11"/><ellipse cx="67" cy="49.5" rx="1.9" ry="1.9" fill="#142808"/><circle cx="68.3" cy="47.5" r="1.1" fill="white"/><path d="M37 40 Q43 37.5 49 39.5" stroke="#2A4218" stroke-width="2.1" fill="none" stroke-linecap="round"/><path d="M61 39.5 Q67 37.5 73 40" stroke="#2A4218" stroke-width="2.1" fill="none" stroke-linecap="round"/><path d="M52 57 Q55 59.5 58 57" fill="none" stroke="#c49070" stroke-width="1.2" stroke-linecap="round"/><path d="M44 64 Q55 73 66 64" fill="none" stroke="#c49070" stroke-width="1.8" stroke-linecap="round"/><path d="M36 32 Q40 22 50 20 Q62 18 70 24" fill="none" stroke="#2A4218" stroke-width="4" stroke-linecap="round"/><path d="M34 38 Q36 28 41 26" fill="none" stroke="#2A4218" stroke-width="3" stroke-linecap="round"/><path d="M33 44 Q30 52 31 62" fill="none" stroke="#2A4218" stroke-width="3.5" stroke-linecap="round"/><path d="M77 44 Q80 52 79 62" fill="none" stroke="#2A4218" stroke-width="3.5" stroke-linecap="round"/><path d="M36 78 Q26 68 28 56" stroke="#1E3A0C" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M74 78 Q84 68 82 56" stroke="#1E3A0C" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M36 78 Q55 84 74 78" stroke="#1E3A0C" stroke-width="3.5" fill="none" stroke-linecap="round"/><rect x="28" y="74" width="12" height="9" rx="4" fill="#3B6D11"/><rect x="70" y="74" width="12" height="9" rx="4" fill="#3B6D11"/><rect x="49" y="73" width="12" height="11" fill="#FFE0B8"/><path d="M20 92 L30 84 L55 82 L80 84 L90 92 L88 142 L22 142Z" fill="#4A8C20"/><path d="M37 118 L37 138 L73 138 L73 118 Q55 115 37 118Z" fill="#3B6D11"/><line x1="55" y1="82" x2="55" y2="142" stroke="#3B6D11" stroke-width="1.5"/><path d="M40 82 L47 93 L55 85 L63 93 L70 82" fill="#3B6D11"/><rect x="58" y="92" width="22" height="22" rx="4" fill="#2D5010"/><text x="69" y="107" text-anchor="middle" font-size="14" fill="#97C459" font-family="serif">♪</text><path d="M20 92 L11 95 L7 122 L18 124 L22 108 L20 92Z" fill="#4A8C20" stroke="#3B6D11" stroke-width=".8"/><path d="M90 92 L99 95 L103 122 L92 124 L88 108 L90 92Z" fill="#4A8C20" stroke="#3B6D11" stroke-width=".8"/><ellipse cx="12" cy="126" rx="6" ry="5" fill="#FFE0B8" stroke="#e8c090" stroke-width=".8"/><ellipse cx="98" cy="126" rx="6" ry="5" fill="#FFE0B8" stroke="#e8c090" stroke-width=".8"/></svg>`,
  },
  {
    id: 'opus',
    tag: 'CCT',
    tagClass: 'ctag-o',
    cardClass: 'opus',
    selClass: 'active-o',
    dotColor: '#BA7517',
    name: 'CCT',
    role: 'Architect Sage / 깊은 사고의 현자',
    model: 'claude-opus-4-6',
    systemPrompt: '당신은 Claude Opus 캐릭터입니다. 깊고 지혜로운 시니어 아키텍트 캐릭터예요.\n규칙: 한국어로 5-6문장으로 심도있게. 🌊 이모지 사용. 본질을 꿰뚫는 통찰. 코드는 영어.',
    quotes: ['🌊 생각 중입니다...', '🌊 본질을 봐야 해요', '🌊 깊이 탐구해봅시다'],
    introMessage: '🌊 ...반갑습니다. 저는 오퍼스입니다. 복잡하고 깊은 문제일수록 제 영역이에요. 무엇을 탐구하고 싶으신가요?',
    svg: `<svg viewBox="0 0 110 168" width="110" height="168" xmlns="http://www.w3.org/2000/svg"><ellipse cx="55" cy="58" rx="50" ry="22" fill="none" stroke="#EF9F27" stroke-width="1" opacity=".3" stroke-dasharray="3,3"/><path d="M35 22 L38 30 L44 19 L49 30 L55 16 L61 30 L66 19 L72 30 L75 22 L79 34 L31 34Z" fill="#EF9F27" stroke="#BA7517" stroke-width=".8"/><circle cx="55" cy="16" r="4" fill="#FAC775" stroke="#EF9F27" stroke-width="1"/><circle cx="44" cy="19" r="2.5" fill="#FAC775" stroke="#EF9F27" stroke-width=".8"/><circle cx="66" cy="19" r="2.5" fill="#FAC775" stroke="#EF9F27" stroke-width=".8"/><path d="M31 50 Q20 74 22 106 Q26 128 28 150" stroke="#4A2C0A" stroke-width="18" stroke-linecap="round" fill="none"/><path d="M79 50 Q90 74 88 106 Q84 128 82 150" stroke="#4A2C0A" stroke-width="18" stroke-linecap="round" fill="none"/><path d="M34 50 Q26 76 28 112 Q30 132 32 152" stroke="#7A4E18" stroke-width="7" stroke-linecap="round" fill="none" opacity=".45"/><path d="M76 50 Q84 76 82 112 Q80 132 78 152" stroke="#7A4E18" stroke-width="7" stroke-linecap="round" fill="none" opacity=".45"/><path d="M33 42 Q30 22 55 18 Q80 22 77 42" fill="#4A2C0A"/><ellipse cx="55" cy="54" rx="23" ry="26" fill="#FFD8A0"/><ellipse cx="31" cy="54" rx="3.5" ry="4.5" fill="#FFD8A0" stroke="#e0b880" stroke-width=".8"/><ellipse cx="79" cy="54" rx="3.5" ry="4.5" fill="#FFD8A0" stroke="#e0b880" stroke-width=".8"/><ellipse cx="44" cy="51" rx="6.5" ry="5" fill="white"/><ellipse cx="44" cy="52" rx="4.8" ry="3.8" fill="#854F0B"/><ellipse cx="44" cy="53" rx="3" ry="3" fill="#2C1800"/><circle cx="45.8" cy="50" r="1.3" fill="white"/><path d="M37 48 Q44 46 52 48" fill="none" stroke="#2C1800" stroke-width="1.3" stroke-linecap="round"/><ellipse cx="66" cy="51" rx="6.5" ry="5" fill="white"/><ellipse cx="66" cy="52" rx="4.8" ry="3.8" fill="#854F0B"/><ellipse cx="66" cy="53" rx="3" ry="3" fill="#2C1800"/><circle cx="67.8" cy="50" r="1.3" fill="white"/><path d="M58 48 Q66 46 73 48" fill="none" stroke="#2C1800" stroke-width="1.3" stroke-linecap="round"/><path d="M38 44 Q44 41.5 51 43" stroke="#4A2C0A" stroke-width="2.1" fill="none" stroke-linecap="round"/><path d="M59 43 Q66 41.5 72 44" stroke="#4A2C0A" stroke-width="2.1" fill="none" stroke-linecap="round"/><path d="M53 60 Q55 63 57 60" fill="none" stroke="#c49060" stroke-width="1.2" stroke-linecap="round"/><path d="M46 67 Q55 74 64 67" fill="none" stroke="#c49060" stroke-width="1.5" stroke-linecap="round"/><path d="M34 44 Q36 52 38 58" stroke="#4A2C0A" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M76 44 Q74 52 72 58" stroke="#4A2C0A" stroke-width="4.5" fill="none" stroke-linecap="round"/><rect x="49" y="78" width="12" height="12" fill="#FFD8A0"/><path d="M17 98 L28 88 L55 86 L82 88 L93 98 L92 152 L18 152Z" fill="#1A0F02"/><path d="M17 98 L15 152" stroke="#EF9F27" stroke-width="2.5" opacity=".8"/><path d="M93 98 L95 152" stroke="#EF9F27" stroke-width="2.5" opacity=".8"/><path d="M43 86 L48 98 L55 90 L62 98 L67 86" fill="#2C1A02"/><circle cx="55" cy="106" r="2.2" fill="#EF9F27" opacity=".85"/><circle cx="55" cy="118" r="2.2" fill="#EF9F27" opacity=".85"/><circle cx="55" cy="130" r="2.2" fill="#EF9F27" opacity=".85"/><path d="M17 98 L8 102 L5 134 L16 136 L20 114 L17 98Z" fill="#1A0F02" stroke="#EF9F27" stroke-width=".8" opacity=".75"/><path d="M93 98 L102 102 L105 134 L94 136 L90 114 L93 98Z" fill="#1A0F02" stroke="#EF9F27" stroke-width=".8" opacity=".75"/><ellipse cx="10" cy="138" rx="6" ry="5" fill="#FFD8A0" stroke="#e0b880" stroke-width=".8"/><ellipse cx="100" cy="138" rx="6" ry="5" fill="#FFD8A0" stroke="#e0b880" stroke-width=".8"/><circle cx="10" cy="138" r="9" fill="#EF9F27" opacity=".18"/><circle cx="10" cy="138" r="5.5" fill="#FAC775" opacity=".32"/><circle cx="10" cy="138" r="3" fill="#FAEEDA" opacity=".7"/></svg>`,
  },
];
