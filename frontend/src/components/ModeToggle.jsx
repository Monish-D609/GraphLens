import { motion } from 'framer-motion'

const MODES = [
  { id: 'vanilla', label: '⚡ Vanilla', desc: 'Vector only' },
  { id: 'graph',   label: '🕸️ Graph',   desc: 'Graph-augmented' },
  { id: 'compare', label: '⚖️ Compare', desc: 'Side-by-side' },
]

export default function ModeToggle({ mode, onChange, disabled }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="mode-toggle" role="radiogroup" aria-label="Retrieval mode">
        {MODES.map((m) => (
          <motion.button
            key={m.id}
            id={`mode-${m.id}`}
            role="radio"
            aria-checked={mode === m.id}
            className={`mode-btn ${mode === m.id ? 'active' : ''}`}
            onClick={() => !disabled && onChange(m.id)}
            disabled={disabled}
            whileTap={{ scale: 0.96 }}
            title={m.desc}
          >
            {m.label}
          </motion.button>
        ))}
      </div>
      <p style={{ fontSize: '11px', color: 'var(--fg-subtle)', marginTop: '6px' }}>
        {MODES.find(m => m.id === mode)?.desc}
      </p>
    </div>
  )
}
