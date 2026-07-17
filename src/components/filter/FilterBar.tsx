import { memo, useEffect, useMemo, useState, type CSSProperties } from 'react'
import type { Track } from '../../types/manifest'

export interface FilterBarProps {
  tracks: Track[]
  onFilter: (filtered: Track[]) => void
}

export const FilterBar = memo(function FilterBar({ tracks, onFilter }: FilterBarProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const allTags = useMemo(() => {
    const set = new Set<string>()
    for (const t of tracks) { if (t.tags) for (const tag of t.tags) set.add(tag) }
    return Array.from(set)
  }, [tracks])

  useEffect(() => {
    if (selectedTags.length === 0) { onFilter(tracks); return }
    const filtered = tracks.filter((t) => t.tags && t.tags.some((tag) => selectedTags.includes(tag)))
    onFilter(filtered)
  }, [selectedTags, tracks, onFilter])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag])
  }
  const clearAll = () => setSelectedTags([])

  const chipBase: CSSProperties = {
    padding: 'var(--space-1) var(--space-3)',
    borderRadius: 'var(--radius-pill)',
    fontSize: 'var(--text-xs)', fontWeight: 500,
    cursor: 'pointer', border: '1px solid var(--glass-border)',
    transition: 'all var(--duration-fast) var(--ease-out)',
    whiteSpace: 'nowrap', userSelect: 'none',
  }

  return (
    <div className="no-scrollbar" style={{
      display: 'flex', gap: 'var(--space-2)', overflowX: 'auto',
      paddingBottom: 'var(--space-1)', marginBottom: 'var(--space-4)',
    }}>
      <button type="button" onClick={clearAll} style={{
        ...chipBase,
        background: selectedTags.length === 0
          ? 'linear-gradient(135deg, var(--accent), var(--accent-dark))'
          : 'rgba(168,85,247,0.08)',
        color: selectedTags.length === 0 ? 'var(--text-inverse)' : 'var(--text-secondary)',
        borderColor: selectedTags.length === 0 ? 'transparent' : 'var(--glass-border)',
      }}>
        全部
      </button>
      {allTags.map((tag) => {
        const selected = selectedTags.includes(tag)
        return (
          <button key={tag} type="button" onClick={() => toggleTag(tag)} style={{
            ...chipBase,
            background: selected
              ? 'linear-gradient(135deg, var(--accent), var(--accent-dark))'
              : 'rgba(168,85,247,0.08)',
            color: selected ? 'var(--text-inverse)' : 'var(--text-secondary)',
            borderColor: selected ? 'transparent' : 'var(--glass-border)',
          }}>
            {tag}
          </button>
        )
      })}
    </div>
  )
})
