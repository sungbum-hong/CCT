// 앱인토스는 서버리스이므로, API 호출은 외부 서버를 통해 처리합니다.
// 기존 Next.js API 라우트 대신 외부 엔드포인트를 사용합니다.
// TODO: 실제 배포 시 API_BASE_URL을 본인의 백엔드 서버 주소로 변경하세요.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function streamChat(
  model: string,
  systemPrompt: string,
  messages: ChatMessage[],
  onChunk: (text: string) => void
): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, systemPrompt, messages }),
  });

  if (!res.body) throw new Error('No response body');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let fullReply = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    fullReply += decoder.decode(value, { stream: true });
    onChunk(fullReply);
  }

  return fullReply;
}
