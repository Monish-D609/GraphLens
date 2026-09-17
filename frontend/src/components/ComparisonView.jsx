import { motion, AnimatePresence } from 'framer-motion'
import AnswerPanel from './AnswerPanel'

export default function ComparisonView({ result, isLoading }) {
  if (isLoading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {[0, 1].map(i => (
          <div key={i} className="glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="skeleton" style={{ height: '18px', width: '50%' }} />
            <div className="skeleton" style={{ height: '14px', width: '100%' }} />
            <div className="skeleton" style={{ height: '14px', width: '85%' }} />
            <div className="skeleton" style={{ height: '14px', width: '70%' }} />
          </div>
        ))}
      </div>
    )
  }

  if (!result) return null

  const vanillaResult = {
    question: result.question,
    answer: result.vanilla_answer || 'No vanilla result available.',
    citations: result.vanilla_citations || [],
    context_chunks: result.vanilla_chunks || [],
    model: result.model,
  }

  const graphResult = {
    question: result.question,
    answer: result.answer,
    citations: result.citations || [],
    context_chunks: result.context_chunks || [],
    traversal_trace: result.traversal_trace,
    model: result.model,
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}
      >
        {/* Vanilla column */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
            padding: '8px 14px',
            background: 'rgba(124,58,237,0.08)',
            border: '1px solid rgba(124,58,237,0.2)',
            borderRadius: 'var(--radius-md)',
          }}>
            <span style={{ fontSize: '18px' }}>⚡</span>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#A78BFA' }}>Vanilla RAG</p>
              <p style={{ fontSize: '11px', color: 'var(--fg-muted)' }}>Vector similarity only</p>
            </div>
          </div>
          <AnswerPanel result={vanillaResult} mode="vanilla" />
        </div>

        {/* Graph column */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
            padding: '8px 14px',
            background: 'rgba(0,212,255,0.08)',
            border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: 'var(--radius-md)',
          }}>
            <span style={{ fontSize: '18px' }}>🕸️</span>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-cyan)' }}>Graph-Augmented</p>
              <p style={{ fontSize: '11px', color: 'var(--fg-muted)' }}>
                {result.traversal_trace?.nodes?.length || 0} nodes traversed
              </p>
            </div>
          </div>
          <AnswerPanel result={graphResult} mode="graph" />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
