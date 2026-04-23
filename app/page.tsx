'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useCallback } from 'react';
import { CHARACTERS } from '@/lib/characters';
import { CustomChar, makeTag, regenCharVisuals } from '@/lib/customChar';
import CharCard from '@/components/CharCard';
import FolderUpload from '@/components/FolderUpload';
const World = dynamic(() => import('@/components/World'), { ssr: false });

const LOGIN_CARDS = [
  {
    emoji: '🔐',
    title: '일반 로그인',
    prompt: `이메일 + 비밀번호 로그인 기능 구현해줘.
- NextAuth.js 사용
- JWT 토큰 방식
- 로그인/회원가입 페이지
- 비밀번호 암호화 (bcrypt)
- 세션 유지`,
  },
  {
    emoji: '💬',
    title: '카카오 로그인',
    prompt: `카카오 소셜 로그인 구현해줘.
- NextAuth.js KakaoProvider 사용
- .env.local에 KAKAO_CLIENT_ID, KAKAO_CLIENT_SECRET 추가
- 카카오 로그인 버튼 UI 포함`,
  },
  {
    emoji: '🔵',
    title: '구글 로그인',
    prompt: `구글 소셜 로그인 구현해줘.
- NextAuth.js GoogleProvider 사용
- .env.local에 GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET 추가
- 구글 로그인 버튼 UI 포함`,
  },
  {
    emoji: '🟢',
    title: '네이버 로그인',
    prompt: `네이버 소셜 로그인 구현해줘.
- NextAuth.js NaverProvider 사용
- .env.local에 NAVER_CLIENT_ID, NAVER_CLIENT_SECRET 추가
- 네이버 로그인 버튼 UI 포함`,
  },
];

const STORAGE_KEY = 'cct-custom-chars';

export default function Home() {
  const [customChars, setCustomChars] = useState<CustomChar[]>([]);
  const [toast, setToast] = useState(false);

  const copyPrompt = useCallback((prompt: string) => {
    navigator.clipboard.writeText(prompt).then(() => {
      setToast(true);
      setTimeout(() => setToast(false), 2000);
    });
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const chars: CustomChar[] = JSON.parse(saved);
        // 이름 항상 최신 makeTag 로직으로 재계산
        const migrated = chars.map(c => {
          const baseName = c.projectPath.split('/').filter(Boolean).pop() || '';
          const named = baseName ? { ...c, name: makeTag(baseName) } : c;
          return regenCharVisuals(named);
        });
        setCustomChars(migrated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      }
    } catch {}
  }, []);

  function handleCharsFound(chars: CustomChar[]) {
    setCustomChars(prev => {
      const merged = [...prev.filter(p => !chars.find(c => c.id === p.id)), ...chars];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(merged)); } catch {}
      return merged;
    });
  }

  function removeChar(id: string) {
    setCustomChars(prev => {
      const next = prev.filter(c => c.id !== id);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  function renameChar(id: string, name: string) {
    setCustomChars(prev => {
      const next = prev.map(c => c.id === id ? { ...c, name: name.toUpperCase().slice(0, 4) } : c);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  function reroleChar(id: string, role: string) {
    setCustomChars(prev => {
      const next = prev.map(c => c.id === id ? { ...c, role } : c);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  return (
    <>
      {/* NAV */}
      <nav>
        <a className="logo" href="#">
          <div className="logo-mark">
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 4l5 8 5-8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 8h14" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
            </svg>
          </div>
          <span className="logo-text">Claude<span>Code</span> Team</span>
        </a>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="hero-bg">
          <div className="grid-lines" />
          <div className="hero-glow" />
        </div>
        <div className="hero-content">
          <h1>나만의 Claude Code 캐릭터</h1>
          <p className="hero-sub">캐릭터를 클릭하면 Claude Code를 간편하게 실행 할 수 있습니다.</p>
        </div>

        <div id="world-section">
          <div className="world-label">LIVE WORLD — 실시간으로 움직이는 캐릭터들</div>
          <World extraChars={customChars} />
        </div>
      </section>

      {/* CHARACTER CARDS */}
      <section id="chars" style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '5rem 1.5rem' }}>
        {(() => {
          const total = CHARACTERS.length + customChars.length;
          const maxWidth = Math.max(960, total * 240);
          return (
            <div style={{ maxWidth, margin: '0 auto' }}>
              <div className="section-header">
                <div className="section-tag">CHARACTERS</div>
                <div className="section-title">{total}명의 AI 개발자</div>
              </div>
              <div className="char-grid" style={{ gridTemplateColumns: `repeat(${total}, 1fr)` }}>
                {CHARACTERS.map((c) => (
                  <CharCard key={c.id} char={c} selected={false} onClick={() => {}} />
                ))}
                {customChars.map((c) => (
                  <div key={c.id} className="ccard" style={{ borderColor: c.dimColor, position: 'relative' }}>
<span className="ctag" style={{ background: `${c.color}26`, color: c.color }}>{c.name}</span>
                    <div dangerouslySetInnerHTML={{ __html: c.svg.replace('width="80"', 'width="90"').replace(/height="\d+"/, '') }} />
                    <input
                      className="cname cname-edit"
                      style={{ color: c.color, background: 'transparent', border: 'none', textAlign: 'center', width: '100%', cursor: 'text' }}
                      value={c.name}
                      maxLength={4}
                      onChange={(e) => renameChar(c.id, e.target.value)}
                    />
                    <input
                      className="study-label"
                      style={{ background: `${c.color}1F`, color: c.color, border: `1px solid ${c.color}4D`, textShadow: `0 0 12px ${c.color}66`, textAlign: 'center', width: '100%', cursor: 'text' }}
                      value={c.role}
                      onChange={(e) => reroleChar(c.id, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </section>

      {/* FOLDER UPLOAD */}
      <section id="upload-section" style={{ padding: '5rem 1.5rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div className="section-header" style={{ marginBottom: '2rem' }}>
            <div className="section-tag">PROJECT</div>
            <div className="section-title">프로젝트 폴더 등록</div>
            <p className="section-desc">폴더 안의 CLAUDE.md를 읽어서 캐릭터를 자동으로 만들고 위 World에 추가합니다.</p>
          </div>
          <FolderUpload onCharsFound={handleCharsFound} />
        </div>
      </section>

      {/* PROMPT TEMPLATES */}
      <section id="prompt-section" style={{ padding: '5rem 1.5rem', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div className="section-header" style={{ marginBottom: '2rem' }}>
            <div className="section-tag">TEMPLATES</div>
            <div className="section-title">프롬프트 템플릿</div>
            <p className="section-desc">이미지를 클릭하면 프롬프트가 복사돼요. Claude Code에 바로 붙여넣기 하세요.</p>
          </div>
          <div className="prompt-category-label">🔑 로그인</div>
          <div className="prompt-grid">
            {LOGIN_CARDS.map((card) => (
              <button key={card.title} className="prompt-card" onClick={() => copyPrompt(card.prompt)}>
                <div className="prompt-emoji">{card.emoji}</div>
                <div className="prompt-title">{card.title}</div>
                <div className="prompt-copy-hint">클릭하여 복사</div>
              </button>
            ))}
          </div>
        </div>
        {toast && <div className="prompt-toast">복사됐어요! ✓</div>}
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">Claude<span>Code</span> Team</div>
      </footer>
    </>
  );
}
