'use client';

import dynamic from 'next/dynamic';
import { CHARACTERS } from '@/lib/characters';
import CharCard from '@/components/CharCard';
import GroupChat from '@/components/GroupChat';

const World = dynamic(() => import('@/components/World'), { ssr: false });

export default function Home() {

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
          <World />
        </div>
      </section>

      {/* CHARACTER CARDS */}
      <section id="chars" style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div className="section-header">
            <div className="section-tag">CHARACTERS</div>
            <div className="section-title">세 명의 AI 개발자</div>
          </div>
          <div className="char-grid">
            {CHARACTERS.map((c) => (
              <CharCard key={c.id} char={c} selected={false} onClick={() => {}} />
            ))}
          </div>
        </div>
      </section>

      {/* CHAT */}
      <section id="chat-section" style={{ padding: '5rem 1.5rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div className="section-header" style={{ marginBottom: '2rem' }}>
            <div className="section-tag">GROUP CHAT</div>
            <div className="section-title">캐릭터 토론</div>
            <p className="section-desc">토픽을 입력하면 세 캐릭터가 각자의 관점으로 토론합니다.</p>
          </div>
          <GroupChat />
        </div>
      </section>


      {/* FOOTER */}
      <footer>
        <div className="footer-logo">Claude<span>Code</span> Team</div>
        <p>Powered by Anthropic Claude API · Built with love for developers</p>
      </footer>
    </>
  );
}
