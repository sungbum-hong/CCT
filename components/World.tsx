'use client';

import { useEffect, useRef, useState } from 'react';
import { CHARACTERS } from '@/lib/characters';

interface WorldChar {
  id: string;
  label: string;
  speed: number;
  zone: { min: number; max: number };
  ext: { min: number; max: number };
  quotes: string[];
  char: Character;
  x: number;
  tx: number;
  y: number;
  ty: number;
  wait: number;
  left: boolean;
}

const SPW = 48;
const SPH = 80;

export default function World() {
  const worldRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState(false);
  const stateRef = useRef<WorldChar[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const el = worldRef.current;
    if (!el) return;

    let ww = el.offsetWidth;
    let wh = el.offsetHeight;

    const wchars: WorldChar[] = [
      { id: 'haiku', label: 'CDY', speed: 2.8, zone: { min: 0.02, max: 0.98 }, ext: { min: 0.02, max: 0.98 }, quotes: CHARACTERS[0].quotes, char: CHARACTERS[0], x: 0, tx: 0, y: 0, ty: 0, wait: 0, left: false },
      { id: 'sonnet', label: 'CPD', speed: 1.5, zone: { min: 0.02, max: 0.98 }, ext: { min: 0.02, max: 0.98 }, quotes: CHARACTERS[1].quotes, char: CHARACTERS[1], x: 0, tx: 0, y: 0, ty: 0, wait: 0, left: false },
      { id: 'opus', label: 'CCT', speed: 0.85, zone: { min: 0.02, max: 0.98 }, ext: { min: 0.02, max: 0.98 }, quotes: CHARACTERS[2].quotes, char: CHARACTERS[2], x: 0, tx: 0, y: 0, ty: 0, wait: 0, left: false },
    ];
    stateRef.current = wchars;

    // Create sprite elements
    const sprites: HTMLDivElement[] = [];
    const svgSizes = ['width="110" height="160"', 'width="110" height="160"', 'width="110" height="168"'];

    wchars.forEach((c, i) => {
      const d = document.createElement('div');
      d.className = 'spr';
      const smallSvg = CHARACTERS[i].svg
        .replace(svgSizes[i], 'width="48"')
        .replace(/height="\d+"/, '');
      d.innerHTML = smallSvg + `<div class="snm">${c.label}</div>`;
      d.addEventListener('click', (e) => {
        e.stopPropagation();
        const project = c.id === 'sonnet' ? 'cpd' : c.id === 'haiku' ? 'cdy' : 'cct';
        fetch('/api/launch', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ characterId: c.id, ...(project && { project }) }) }).then(() => {
          setToast(true);
          setTimeout(() => setToast(false), 3000);
        });
      });
      el.appendChild(d);
      sprites.push(d);
    });

    function pickTarget(c: WorldChar) {
      ww = el!.offsetWidth;
      wh = el!.offsetHeight;
      const z = Math.random() < 0.8 ? c.zone : c.ext;
      const mn = z.min * ww + SPW;
      const mx = z.max * ww - SPW;
      c.tx = mn + Math.random() * Math.max(0, mx - mn);
      c.ty = SPH / 2 + Math.random() * Math.max(0, wh - SPH);
      c.wait = 60 + Math.random() * 120;
    }

    function setPos(c: WorldChar, sprite: HTMLDivElement) {
      sprite.style.left = (c.x - SPW / 2) + 'px';
      sprite.style.top = (c.y - SPH / 2) + 'px';
      if (c.left) {
        sprite.classList.add('flip');
      } else {
        sprite.classList.remove('flip');
      }
    }

    ww = el.offsetWidth;
    wh = el.offsetHeight;
    wchars.forEach((c, i) => {
      c.x = (c.zone.min + c.zone.max) / 2 * ww;
      c.y = wh / 2;
      setPos(c, sprites[i]);
      pickTarget(c);
    });

    function loop() {
      ww = el!.offsetWidth;
      wh = el!.offsetHeight;
      wchars.forEach((c, i) => {
        if (c.wait > 0) { c.wait--; return; }
        const dx = c.tx - c.x;
        const dy = c.ty - c.y;
        if (Math.abs(dx) < 1.5 && Math.abs(dy) < 1.5) { pickTarget(c); return; }
        const dist = Math.sqrt(dx * dx + dy * dy);
        const step = Math.min(c.speed, dist);
        c.x += (dx / dist) * step;
        c.y += (dy / dist) * step;
        c.left = dx < 0;
        c.x = Math.max(SPW / 2 + 8, Math.min(ww - SPW / 2 - 8, c.x));
        c.y = Math.max(SPH / 2 + 8, Math.min(wh - SPH / 2 - 8, c.y));
        setPos(c, sprites[i]);
      });
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    const onResize = () => {
      ww = el!.offsetWidth;
      wh = el!.offsetHeight;
      wchars.forEach((c, i) => {
        if (c.x > ww - 40) c.x = ww - 80;
        if (c.y > wh - 40) c.y = wh - 80;
        setPos(c, sprites[i]);
      });
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      sprites.forEach((s) => s.remove());
    };
  }, []);

  return (
    <div id="world" ref={worldRef}>
      <div className="zone" style={{ left: 0, width: '31%', background: '#050d18' }} />
      <div className="zone" style={{ left: '31%', width: '38%', background: '#07090e' }} />
      <div className="zone" style={{ right: 0, width: '31%', background: '#0d0802' }} />
      <div className="dv" style={{ left: '31%' }} />
      <div className="dv" style={{ left: '69%' }} />
      <div className="zlb" style={{ left: '15.5%', transform: 'translateX(-50%)' }}>CDY</div>
      <div className="zlb" style={{ left: '50%', transform: 'translateX(-50%)' }}>CPD</div>
      <div className="zlb" style={{ left: '84.5%', transform: 'translateX(-50%)' }}>CCT</div>




      {/* CDY zone — monitor + terminal */}
      <svg style={{ position: 'absolute', left: 18, bottom: 60 }} width="72" height="64" viewBox="0 0 72 64">
        {/* desk */}
        <rect x="0" y="46" width="72" height="6" rx="2" fill="#060c18" stroke="#185FA5" strokeWidth=".7"/>
        <rect x="4" y="52" width="6" height="12" rx="1" fill="#060c18" stroke="#185FA5" strokeWidth=".6"/>
        <rect x="62" y="52" width="6" height="12" rx="1" fill="#060c18" stroke="#185FA5" strokeWidth=".6"/>
        {/* monitor */}
        <rect x="12" y="4" width="48" height="34" rx="3" fill="#04090f" stroke="#185FA5" strokeWidth=".8"/>
        <rect x="14" y="6" width="44" height="30" rx="2" fill="#060e1c"/>
        {/* screen glow */}
        <rect x="15" y="7" width="42" height="28" rx="1" fill="url(#scr)" opacity=".9"/>
        {/* code lines */}
        <rect x="18" y="11" width="20" height="2" rx="1" fill="#378ADD" opacity=".7"/>
        <rect x="18" y="16" width="30" height="2" rx="1" fill="#63C175" opacity=".5"/>
        <rect x="18" y="21" width="15" height="2" rx="1" fill="#378ADD" opacity=".4"/>
        <rect x="18" y="26" width="25" height="2" rx="1" fill="#B5D4F4" opacity=".35"/>
        {/* cursor blink */}
        <rect x="18" y="31" width="7" height="2" rx="1" fill="#378ADD" opacity=".9">
          <animate attributeName="opacity" values="0.9;0.1;0.9" dur="1.1s" repeatCount="indefinite"/>
        </rect>
        {/* monitor stand */}
        <rect x="33" y="38" width="6" height="8" rx="1" fill="#060c18" stroke="#185FA5" strokeWidth=".6"/>
        <rect x="27" y="44" width="18" height="3" rx="1" fill="#060c18" stroke="#185FA5" strokeWidth=".6"/>
        <defs>
          <linearGradient id="scr" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1a30"/>
            <stop offset="100%" stopColor="#060e1c"/>
          </linearGradient>
        </defs>
      </svg>

      {/* CDY zone — coffee mug */}
      <svg style={{ position: 'absolute', left: 100, bottom: 60 }} width="22" height="28" viewBox="0 0 22 28">
        <rect x="2" y="8" width="15" height="16" rx="2" fill="#060c18" stroke="#185FA5" strokeWidth=".7"/>
        <path d="M17 12 Q23 12 23 16 Q23 20 17 20" fill="none" stroke="#185FA5" strokeWidth=".7"/>
        <rect x="4" y="4" width="11" height="4" rx="1" fill="#04090f" stroke="#185FA5" strokeWidth=".6"/>
        {/* steam */}
        <path d="M6 3 Q7 1 6 0" fill="none" stroke="#378ADD" strokeWidth=".6" opacity=".5">
          <animate attributeName="opacity" values="0.5;0.1;0.5" dur="1.8s" repeatCount="indefinite"/>
        </path>
        <path d="M10 2 Q11 0 10 -1" fill="none" stroke="#378ADD" strokeWidth=".6" opacity=".4">
          <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2.2s" repeatCount="indefinite"/>
        </path>
        <rect x="2" y="24" width="15" height="4" rx="1" fill="#04090f" stroke="#185FA5" strokeWidth=".6"/>
      </svg>

      {/* CPD zone — plant */}
      <svg style={{ position: 'absolute', left: '48%', bottom: 60 }} width="44" height="72" viewBox="0 0 44 72">
        {/* pot */}
        <path d="M10 52 L34 52 L30 68 L14 68 Z" fill="#0a1208" stroke="#3B6D11" strokeWidth=".8"/>
        <rect x="8" y="48" width="28" height="6" rx="2" fill="#0a1208" stroke="#3B6D11" strokeWidth=".8"/>
        {/* soil */}
        <ellipse cx="22" cy="48" rx="12" ry="3" fill="#08100a"/>
        {/* stem */}
        <line x1="22" y1="48" x2="22" y2="20" stroke="#3B6D11" strokeWidth="1.5"/>
        {/* leaves */}
        <ellipse cx="13" cy="34" rx="10" ry="5" fill="#4A8C20" opacity=".8" transform="rotate(-20 13 34)"/>
        <ellipse cx="31" cy="30" rx="10" ry="5" fill="#63C175" opacity=".7" transform="rotate(20 31 30)"/>
        <ellipse cx="14" cy="22" rx="9" ry="4" fill="#4A8C20" opacity=".75" transform="rotate(-30 14 22)"/>
        <ellipse cx="30" cy="18" rx="9" ry="4" fill="#63C175" opacity=".65" transform="rotate(30 30 18)"/>
        <ellipse cx="22" cy="14" rx="8" ry="4" fill="#4A8C20" opacity=".9" transform="rotate(0 22 14)"/>
        {/* shine on leaves */}
        <ellipse cx="13" cy="33" rx="3" ry="1.5" fill="#C0DD97" opacity=".15" transform="rotate(-20 13 33)"/>
        <ellipse cx="22" cy="13" rx="3" ry="1.5" fill="#C0DD97" opacity=".15"/>
      </svg>

      {/* CPD zone — small desk lamp */}
      <svg style={{ position: 'absolute', left: '36%', bottom: 60 }} width="34" height="50" viewBox="0 0 34 50">
        <rect x="8" y="44" width="18" height="4" rx="2" fill="#080f08" stroke="#3B6D11" strokeWidth=".7"/>
        <rect x="15" y="20" width="4" height="24" rx="1" fill="#080f08" stroke="#3B6D11" strokeWidth=".6"/>
        <line x1="17" y1="20" x2="8" y2="8" stroke="#3B6D11" strokeWidth="1.2"/>
        <path d="M2 4 L14 4 L11 14 L5 14 Z" fill="#080f08" stroke="#3B6D11" strokeWidth=".7"/>
        {/* light cone */}
        <path d="M5 14 L0 28 L16 28 L11 14 Z" fill="#3B6D11" opacity=".12"/>
        {/* bulb glow */}
        <circle cx="8" cy="9" r="2.5" fill="#63C175" opacity=".6">
          <animate attributeName="opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite"/>
        </circle>
      </svg>

      {/* Bookshelf */}
      <svg style={{ position: 'absolute', right: 12, bottom: 60 }} width="74" height="76" viewBox="0 0 74 76">
        <rect width="74" height="74" rx="3" fill="#100800" stroke="#BA7517" strokeWidth=".8"/>
        <rect x="3" y="3" width="68" height="20" rx="1" fill="#0c0500"/>
        <rect x="5" y="5" width="10" height="16" rx="1" fill="#854F0B"/>
        <rect x="17" y="5" width="7" height="16" rx="1" fill="#633806"/>
        <rect x="26" y="5" width="12" height="16" rx="1" fill="#EF9F27" opacity=".6"/>
        <rect x="40" y="5" width="9" height="16" rx="1" fill="#854F0B" opacity=".5"/>
        <rect x="51" y="5" width="15" height="16" rx="1" fill="#BA7517" opacity=".75"/>
        <rect x="3" y="27" width="68" height="20" rx="1" fill="#0c0500"/>
        <rect x="5" y="29" width="14" height="16" rx="1" fill="#633806"/>
        <rect x="21" y="29" width="9" height="16" rx="1" fill="#EF9F27" opacity=".45"/>
        <rect x="32" y="29" width="13" height="16" rx="1" fill="#854F0B" opacity=".65"/>
        <rect x="47" y="29" width="20" height="16" rx="1" fill="#BA7517" opacity=".5"/>
        <rect x="3" y="51" width="68" height="20" rx="1" fill="#0c0500"/>
        <rect x="5" y="53" width="9" height="15" rx="1" fill="#EF9F27" opacity=".55"/>
        <rect x="16" y="53" width="13" height="15" rx="1" fill="#633806"/>
        <rect x="31" y="53" width="11" height="15" rx="1" fill="#854F0B" opacity=".75"/>
        <rect x="44" y="53" width="10" height="15" rx="1" fill="#BA7517" opacity=".45"/>
        <rect x="56" y="53" width="14" height="15" rx="1" fill="#EF9F27" opacity=".65"/>
      </svg>

      {/* CCT zone — tea cup */}
      <svg style={{ position: 'absolute', right: 96, bottom: 60 }} width="26" height="30" viewBox="0 0 26 30">
        <path d="M4 8 L22 8 L20 22 L6 22 Z" fill="#100800" stroke="#BA7517" strokeWidth=".7"/>
        <path d="M20 12 Q26 12 26 16 Q26 20 20 20" fill="none" stroke="#BA7517" strokeWidth=".7"/>
        <rect x="2" y="5" width="20" height="4" rx="1" fill="#100800" stroke="#BA7517" strokeWidth=".6"/>
        <rect x="2" y="22" width="20" height="4" rx="1" fill="#100800" stroke="#BA7517" strokeWidth=".6"/>
        {/* tea */}
        <path d="M6 14 Q13 12 20 14" fill="none" stroke="#EF9F27" strokeWidth=".8" opacity=".5"/>
        {/* steam */}
        <path d="M9 4 Q10 2 9 0" fill="none" stroke="#BA7517" strokeWidth=".6" opacity=".4">
          <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite"/>
        </path>
        <path d="M14 3 Q15 1 14 -1" fill="none" stroke="#BA7517" strokeWidth=".6" opacity=".35">
          <animate attributeName="opacity" values="0.35;0.1;0.35" dur="2.5s" repeatCount="indefinite"/>
        </path>
      </svg>

      {/* hint */}
      <div id="whint">캐릭터를 클릭하면 Claude Code를 실행합니다</div>


{toast && (
        <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', background: '#1a2a1a', border: '1px solid #3a7a3a', color: '#63C175', padding: '8px 18px', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 12, zIndex: 100, pointerEvents: 'none' }}>
          실행됐어요! ✓
        </div>
      )}
    </div>
  );
}
