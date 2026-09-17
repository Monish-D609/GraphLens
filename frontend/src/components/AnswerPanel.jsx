import { motion, AnimatePresence } from 'framer-motion'
import { FileText, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import CitationChip from './CitationChip'

const SCORE_COLORS = {
  high:   { bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)',  text: '#4ADE80' },
  medium: { bg: 'rgba(0,212,255,0.12)', border: 'rgba(0,212,255,0.3)', text: '#00D4FF' },
  low:    { bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)', text: '#94A3B8' },
}

function scoreLevel(score) {
  if (score > 0.75) return 'high'
  if (score > 0.45) return 'medium'
  return 'low'
}

function AnswerText({ text }) {
  // Render citation markers inline
  const parts = text.split(/(\[Source:[^\]]+\])/g)
  return (
    <p style={{ lineHeight: 1.8, color: 'var(--fg-primary)', fontSize: '15px' }}>
      {parts.map((part, i) => {
        const match = part.match(/\[Source:\s*([^\]]+)\]/)
        if (match) {
          return (
            <span key={i} className="citation-chip" style={{ verticalAlign: 'middle', margin: '0 3px' }}>
              {match[1].split('/').pop()}
            </span>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </p>
  )
}

function ChunkCard({ chunk, index }) {
  const level = scoreLevel(chunk.score)
  const colors = SCORE_COLORS[level]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      style={{
        padding: '12px 14px',
        background: 'var(--bg-muted)',
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FileText size={12} style={{ color: 'var(--fg-muted)', flexShrink: 0 }} />
          <span className="mono" style={{ fontSize: '11px', color: 'var(--fg-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {chunk.source || chunk.metadata?.relative_path || 'unknown'}
          </span>
        </div>
        {chunk.score > 0 && (
          <span style={{
            padding: '1px 7px',
            borderRadius: 'var(--radius-full)',
            fontSize: '10px',
            fontWeight: 600,
            fontFamily: 'var(--font-mono)',
            background: colors.bg,
            color: colors.text,
            border: `1px solid ${colors.border}`,
          }}>
            {(chunk.score * 100).toFixed(0)}%
          </span>
        )}
        {chunk.score === 0 && (
          <span className="score-badge graph">graph</span>
        )}
      </div>
      <p style={{ fontSize: '12px', color: 'var(--fg-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {chunk.text}
      </p>
    </motion.div>
  )
}

export default function AnswerPanel({ result, isLoading, mode }) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass"
        style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <div className="skeleton" style={{ height: '20px', width: '40%' }} />
        <div className="skeleton" style={{ height: '16px', width: '100%' }} />
        <div className="skeleton" style={{ height: '16px', width: '90%' }} />
        <div className="skeleton" style={{ height: '16px', width: '75%' }} />
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <div className="skeleton" style={{ height: '24px', width: '120px', borderRadius: '999px' }} />
          <div className="skeleton" style={{ height: '24px', width: '80px', borderRadius: '999px' }} />
        </div>
      </motion.div>
    )
  }

  if (!result) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={result.question}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
      >
        {/* Answer */}
        <div className="glass" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '11px',
                fontWeight: 600,
                background: mode === 'graph' ? 'rgba(0,212,255,0.12)' : 'rgba(124,58,237,0.12)',
                color: mode === 'graph' ? 'var(--accent-cyan)' : '#A78BFA',
                border: `1px solid ${mode === 'graph' ? 'rgba(0,212,255,0.3)' : 'rgba(124,58,237,0.3)'}`,
              }}>
                {mode === 'graph' ? '🕸️ Graph-Augmented' : mode === 'vanilla' ? '⚡ Vanilla' : '⚖️ Graph'}
              </span>
              <span className="text-xs text-muted mono">{result.model?.split('/').pop()}</span>
            </div>
            {result.citations?.length > 0 && (
              <span className="text-xs text-muted">{result.citations.length} source{result.citations.length !== 1 ? 's' : ''}</span>
            )}
          </div>

          <AnswerText text={result.answer} />

          {/* Citations row */}
          {result.citations?.length > 0 && (
            <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {result.citations.map((c, i) => (
                <CitationChip key={i} citation={c} />
              ))}
            </div>
          )}
        </div>

        {/* Context Chunks */}
        {result.context_chunks?.length > 0 && (
          <div>
            <p style={{ fontSize: '12px', color: 'var(--fg-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Retrieved Context ({result.context_chunks.length} chunks)
            </p>
            <div style={{ display: 'grid', gap: '8px' }}>
              {result.context_chunks.map((chunk, i) => (
                <ChunkCard key={chunk.chunk_id || i} chunk={chunk} index={i} />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
