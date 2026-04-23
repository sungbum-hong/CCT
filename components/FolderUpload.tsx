'use client';

import { useState, useCallback, useRef } from 'react';
import { CustomChar, buildProjectChar, extractOverview } from '@/lib/customChar';

interface Props {
  onCharsFound?: (chars: CustomChar[]) => void;
}

const SKIP_DIRS = new Set(['node_modules', '.git', '.expo', '.next', 'dist', 'build', '.cache', '__pycache__', '.turbo', 'out']);

async function readDirEntry(entry: FileSystemDirectoryEntry): Promise<FileSystemEntry[]> {
  const reader = entry.createReader();
  const all: FileSystemEntry[] = [];
  let batch: FileSystemEntry[];
  do {
    batch = await new Promise((res, rej) => reader.readEntries(res, rej));
    all.push(...batch);
  } while (batch.length > 0);
  return all;
}

interface FoundFile { file: File; projectName: string; projectPath: string; }

async function traverseEntry(entry: FileSystemEntry, results: FoundFile[], counter: { n: number }) {
  if (entry.isFile) {
    if (entry.name.toUpperCase() === 'CLAUDE.MD') {
      const file = await new Promise<File>((res, rej) => (entry as FileSystemFileEntry).file(res, rej));
      const parts = entry.fullPath.split('/').filter(Boolean);
      // 폴더 안 파일이어야 유효한 projectPath — 단순 파일 드롭이면 parts.length === 1
      if (parts.length >= 2) {
        const projectName = parts[parts.length - 2];
        const projectPath = parts.slice(0, -1).join('/');
        results.push({ file, projectName, projectPath });
      } else {
        // 단일 파일 드롭: projectPath 미상 → 빈 문자열로 저장 후 UI에서 입력받음
        results.push({ file, projectName: '', projectPath: '' });
      }
    }
    counter.n++;
  } else if (entry.isDirectory) {
    if (SKIP_DIRS.has(entry.name)) return;
    const children = await readDirEntry(entry as FileSystemDirectoryEntry);
    for (const child of children) {
      await traverseEntry(child, results, counter);
    }
  }
}

export default function FolderUpload({ onCharsFound }: Props) {
  const [dragging, setDragging] = useState(false);
  const [folderName, setFolderName] = useState<string | null>(null);
  const [fileCount, setFileCount] = useState(0);
  const [chars, setChars] = useState<CustomChar[]>([]);
  const [hasClaude, setHasClaude] = useState(false);
  const [loading, setLoading] = useState(false);
  const [launching, setLaunching] = useState<string | null>(null);
  const [manualPaths, setManualPaths] = useState<Record<string, string>>({});

  async function launchProject(charId: string, projectPath: string) {
    const path = projectPath || manualPaths[charId] || '';
    if (!path) return;

    // 수동 입력 경로가 있으면 char에 반영 → World에도 동기화
    if (!projectPath && manualPaths[charId]) {
      const newPath = manualPaths[charId];
      const derivedName = newPath.split('/').filter(Boolean).pop() || '';
      const updated = chars.map(c => c.id === charId ? {
        ...c,
        projectPath: newPath,
        name: derivedName ? (derivedName[0].toUpperCase() + (derivedName[Math.ceil(derivedName.length / 2)] ?? '').toUpperCase()) : c.name,
      } : c);
      setChars(updated);
      onCharsFound?.(updated);
    }

    setLaunching(charId);
    await fetch('/api/launch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectPath: path }),
    });
    setTimeout(() => {
      setLaunching(null);
      setFolderName(null);
      setFileCount(0);
      setHasClaude(false);
      setManualPaths({});
      if (inputRef.current) inputRef.current.value = '';
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 800);
  }
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyClaudeFiles = useCallback(async (claudeFiles: FoundFile[], root: string, count: number) => {
    setFolderName(root || '폴더');
    setFileCount(count);
    if (claudeFiles.length > 0) {
      setHasClaude(true);
      const allChars: CustomChar[] = [];
      for (let i = 0; i < claudeFiles.length; i++) {
        const { file, projectName, projectPath } = claudeFiles[i];
        const text = await file.text();
        const overview = extractOverview(text);
        allChars.push(buildProjectChar(projectName, overview, projectPath, i));
      }
      setChars(allChars);
      onCharsFound?.(allChars);
    } else {
      setHasClaude(false);
      setChars([]);
      onCharsFound?.([]);
    }
  }, [onCharsFound]);

  // Drag-and-drop: use FileSystem API to skip node_modules during traversal
  const onDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    setLoading(true);

    const items = Array.from(e.dataTransfer.items);
    const results: FoundFile[] = [];
    const counter = { n: 0 };
    let root = '';

    for (const item of items) {
      const entry = item.webkitGetAsEntry?.();
      if (!entry) continue;
      if (!root) root = entry.name;
      await traverseEntry(entry, results, counter);
    }

    setLoading(false);
    await applyClaudeFiles(results, root, counter.n);
  }, [applyClaudeFiles]);

  // File input (webkitdirectory): iterate FileList
  const processFileList = useCallback(async (fileList: FileList) => {
    setLoading(true);
    let folder = '';
    const claudeFiles: FoundFile[] = [];
    let count = 0;
    const SKIP_RE = /\/(node_modules|\.git|\.expo|\.next|dist|build|\.cache|__pycache__|\.turbo|out)\//;

    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      const rel: string = (f as File & { webkitRelativePath?: string }).webkitRelativePath || f.name;
      if (!folder) folder = rel.split('/')[0];
      if (SKIP_RE.test('/' + rel)) continue;
      count++;
      const parts = rel.split('/');
      if (parts[parts.length - 1].toUpperCase() === 'CLAUDE.MD') {
        const projectName = parts.length >= 2 ? parts[parts.length - 2] : folder;
        const projectPath = parts.length >= 2 ? parts.slice(0, -1).join('/') : folder;
        claudeFiles.push({ file: f, projectName, projectPath });
      }
    }

    setLoading(false);
    await applyClaudeFiles(claudeFiles, folder, count);
  }, [applyClaudeFiles]);

  // Direct CLAUDE.md file pick
  const onFilesPicked = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setLoading(true);
    const results: FoundFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.name.toUpperCase() === 'CLAUDE.MD') {
        // Try to get project name from webkitRelativePath, else use parent folder hint
        const rel = (f as File & { webkitRelativePath?: string }).webkitRelativePath || f.name;
        const parts = rel.split('/');
        const projectName = parts.length >= 2 ? parts[parts.length - 2] : 'project';
        const projectPath = parts.length >= 2 ? parts.slice(0, -1).join('/') : projectName;
        results.push({ file: f, projectName, projectPath });
      }
    }
    setLoading(false);
    await applyClaudeFiles(results, results[0]?.projectName ?? 'CLAUDE.md', results.length);
  }, [applyClaudeFiles]);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const reset = () => {
    setFolderName(null);
    setFileCount(0);
    setChars([]);
    setHasClaude(false);
    setLoading(false);
    onCharsFound?.([]);
    if (inputRef.current) inputRef.current.value = '';
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!folderName) {
    return (
      <div
        className={`drop-zone${dragging ? ' drop-zone--over' : ''}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
      >
        {/* Folder input */}
        <input
          ref={inputRef}
          type="file"
          style={{ display: 'none' }}
          // @ts-expect-error webkitdirectory not in types
          webkitdirectory=""
          multiple
          onChange={(e) => { if (e.target.files?.length) processFileList(e.target.files); }}
        />
        {/* Direct CLAUDE.md file pick */}
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          accept=".md"
          multiple
          onChange={onFilesPicked}
        />
        <div className="drop-icon">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect x="2" y="10" width="36" height="26" rx="4" stroke="currentColor" strokeWidth="1.5" fill="none" opacity=".4"/>
            <path d="M2 16h36" stroke="currentColor" strokeWidth="1.5" opacity=".4"/>
            <path d="M8 10V8a2 2 0 0 1 2-2h8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity=".7"/>
            <path d="M20 22v8M16 26l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {loading ? (
          <p className="drop-title">탐색 중...</p>
        ) : (
          <>
            <p className="drop-title">폴더를 드래그하거나 클릭해서 선택</p>
            <p className="drop-sub">CLAUDE.md가 있으면 캐릭터를 자동으로 만들어서 World에 추가해드려요</p>
            <button
              className="drop-file-btn"
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            >
              CLAUDE.md 파일만 선택
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="fu-result">
      <div className="fu-folder-header">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, color: 'var(--blue)' }}>
          <path d="M2 6a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z" fill="currentColor" opacity=".4" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
        <div style={{ flex: 1 }}>
          <div className="fu-folder-name">{folderName}</div>
          <div className="fu-folder-meta">{fileCount}개 파일</div>
        </div>
        <button className="fu-reset" onClick={reset}>✕ 초기화</button>
      </div>

      {hasClaude ? (
        <>
          <div className="fu-section-label">
            <span style={{ color: 'var(--blue)', marginRight: 6 }}>✓</span>
            CLAUDE.md 발견 — {chars.length}명의 캐릭터를 World에 추가했어요
            {chars.length > 0 && (
              <span style={{ color: 'var(--text2)', marginLeft: 8, fontSize: 11 }}>
                ({[...new Set(chars.map(c => c.role))].length}개 프로젝트)
              </span>
            )}
          </div>
          <div className="fu-char-list">
            {chars.map((c) => (
              <div key={c.id} className="fu-char-card fu-char-card--on" style={{ borderColor: c.dimColor, background: `${c.color}0d` }}>
                <div className="fu-char-top">
                  <div className="fu-char-avatar" dangerouslySetInnerHTML={{ __html: c.svg }} />
                  <div className="fu-char-info">
                    <div className="fu-char-name" style={{ color: c.color }}>{c.name}</div>
                    <div className="fu-char-role">{c.role}</div>
                  </div>
                  {!c.projectPath && (
                    <input
                      className="fu-path-input"
                      placeholder="폴더 경로 입력 (예: np/thinktree)"
                      value={manualPaths[c.id] ?? ''}
                      onChange={(e) => setManualPaths(prev => ({ ...prev, [c.id]: e.target.value }))}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  <button
                    className="fu-launch-btn"
                    style={{ borderColor: c.dimColor, color: c.color, background: `${c.color}18` }}
                    onClick={() => launchProject(c.id, c.projectPath)}
                    disabled={launching === c.id || (!c.projectPath && !manualPaths[c.id])}
                  >
                    {launching === c.id ? '실행 중...' : '+ 추가'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="fu-no-claude">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.2" opacity=".3"/>
            <path d="M10 6v5M10 13v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".6"/>
          </svg>
          <span>CLAUDE.md를 찾지 못했어요. 폴더 안에 CLAUDE.md를 추가하면 캐릭터가 자동 생성됩니다.</span>
        </div>
      )}
    </div>
  );
}
