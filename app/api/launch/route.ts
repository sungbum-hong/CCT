import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const env = { ...process.env };
  delete env.CLAUDECODE;

  const dir = body.project === 'cpd'
    ? 'C:\\Users\\Sungbeom\\OneDrive\\Desktop\\cpd'
    : body.project === 'cct'
    ? 'C:\\Users\\Sungbeom\\claude-code-team'
    : 'C:\\Users\\Sungbeom\\OneDrive\\Desktop\\cdy';

  const child = spawn('cmd', ['/c', 'start', 'cmd', '/k',
    `cd /d ${dir} && claude`],
    { detached: true, env, stdio: 'ignore' }
  );
  child.unref();

  return NextResponse.json({ ok: true });
}
