'use client';

import { useState, useRef, useEffect } from 'react';
import { CHARACTERS } from '@/lib/characters';

interface GroupMessage {
  charId: string;
  content: string;
}

export default function GroupChat() {
  const [topic, setTopic] = useState('');
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [running, setRunning] = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [messages]);

  async function startDiscussion() {
    if (!topic.trim() || running) return;
    setMessages([]);
    setRunning(true);

    const history: { role: 'user' | 'assistant'; content: string }[] = [
      { role: 'user', content: topic.trim() },
    ];

    for (const char of CHARACTERS) {
      const systemPrompt =
        char.systemPrompt +
        `\n\n지금 CDY, CPD, CCT 세 캐릭터가 함께 토론 중입니다. 당신은 ${char.name}입니다. 앞선 발언을 참고해 자신의 관점으로 3문장 이내로 답하세요.`;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: char.model, systemPrompt, messages: history }),
      });

      if (!res.body) continue;

      setMessages((prev) => [...prev, { charId: char.id, content: '' }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { charId: char.id, content: reply };
          return updated;
        });
      }

      history.push({ role: 'assistant', content: `${char.name}: ${reply}` });
      history.push({ role: 'user', content: '계속해줘' });
    }

    setRunning(false);
  }

  return (
    <div className="chatbox">
      <div className="chat-head">
        <div className="chat-dot" style={{ background: '#378ADD' }} />
        <span className="chat-title">GROUP DISCUSSION</span>
        <span className="chat-status">캐릭터 토론</span>
      </div>
      <div className="msgs" ref={msgsRef}>
        {messages.length === 0 && !running && (
          <div className="no-sel">토픽을 입력하면 캐릭터들이 토론합니다</div>
        )}
        {messages.map((m, i) => {
          const char = CHARACTERS.find((c) => c.id === m.charId);
          return (
            <div key={i} className="m mb" style={{ borderLeft: `2px solid ${char?.dotColor}`, paddingLeft: '8px' }}>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: char?.dotColor, marginBottom: 4 }}>
                {char?.tag} {char?.name}
              </div>
              {m.content || '...'}
            </div>
          );
        })}
      </div>
      <div className="irow">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && startDiscussion()}
          placeholder="토론 주제를 입력하세요..."
          disabled={running}
        />
        <button className="send-btn" onClick={startDiscussion} disabled={running}>
          {running ? '토론 중...' : '시작 ↗'}
        </button>
      </div>
    </div>
  );
}
