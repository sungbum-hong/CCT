'use client';

import { Character } from '@/lib/characters';

interface CharCardProps {
  char: Character;
  selected: boolean;
  onClick: (char: Character) => void;
}

export default function CharCard({ char, selected, onClick }: CharCardProps) {
  return (
    <div
      className={`ccard ${char.cardClass}${selected ? ' sel' : ''}`}
      onClick={() => onClick(char)}
    >
      <span className={`ctag ${char.tagClass}`}>{char.tag}</span>
      <div dangerouslySetInnerHTML={{ __html: char.svg.replace('width="110"', 'width="90"').replace(/height="\d+"/, '') }} />
      <div className="cname">{char.name}</div>
      <div className={`study-label study-label-${char.id}`}>
        {char.id === 'haiku' ? '청년스터디 코디영' : char.id === 'sonnet' ? '청년 1인가구 청포도' : 'MY Project'}
      </div>
    </div>
  );
}
