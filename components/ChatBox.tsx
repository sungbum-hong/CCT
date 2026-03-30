'use client';

import { useState, useRef, useEffect } from 'react';
import { Character } from '@/lib/characters';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBoxProps {
  char: Character;
}

export default function ChatBox({ char }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: char.introMessage },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMsg() {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput('');
    setLoading(true);

    const newMessages: Message[] = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);

    const apiMessages = newMessages.map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: char.model,
          systemPrompt: char.systemPrompt,
          messages: apiMessages,
        }),
      });

      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = '';

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: reply };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: '오류가 발생했어요. 다시 시도해주세요.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chatbox">
      <div className="chat-head">
        <div className="chat-dot" style={{ background: char.dotColor }} />
        <span className="chat-title">{char.tag} — {char.name}</span>
        <span className="chat-status">{char.role}</span>
      </div>
      <div className="msgs" ref={msgsRef}>
        {messages.map((m, i) => (
          <div key={i} className={`m ${m.role === 'user' ? 'mu' : 'mb'}`}>
            {m.content}
          </div>
        ))}
        {loading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="m mt">...</div>
        )}
      </div>
      <div className="irow">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMsg()}
          placeholder={`${char.name}에게 질문하기...`}
          disabled={loading}
        />
        <button className="send-btn" onClick={sendMsg} disabled={loading}>
          전송 ↗
        </button>
      </div>
    </div>
  );
}
