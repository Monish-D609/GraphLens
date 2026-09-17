import { useState, useCallback } from 'react'
import { Search, Zap, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

const EXAMPLE_QUERIES = [
  "What depends on the authentication module?",
  "Which components does the serializer interact with?",
  "What is the relationship between views and models?",
  "Which modules call the permissions system?",
]

export default function QueryInput({ onQuery, isLoading, mode }) {
  const [value, setValue] = useState('')

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if (!value.trim() || isLoading) return
    onQuery(value.trim())
  }, [value, isLoading, onQuery])

  const handleExample = useCallback((q) => {
    setValue(q)
    onQuery(q)
  }, [onQuery])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ width: '100%' }}
    >
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <div className="gradient-border" style={{ position: 'relative' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
          }}>
            <Search size={20} style={{ color: 'var(--fg-muted)', flexShrink: 0 }} />
            <input
              id="query-input"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ask a relationship question… e.g. 'What depends on the auth module?'"
              disabled={isLoading}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--fg-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '15px',
                lineHeight: 1.5,
              }}
            />
            <button
              id="submit-query-btn"
              type="submit"
              disabled={!value.trim() || isLoading}
              className="btn btn-primary"
              style={{ flexShrink: 0, minWidth: '100px' }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Thinking…
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Ask
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Example queries */}
      <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: 'var(--fg-subtle)', alignSelf: 'center' }}>Try:</span>
        {EXAMPLE_QUERIES.map((q) => (
          <motion.button
            key={q}
            onClick={() => handleExample(q)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            style={{
              padding: '4px 12px',
              background: 'var(--bg-muted)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--fg-secondary)',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              transition: 'all var(--transition-fast)',
              maxWidth: '280px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {q}
          </motion.button>
        ))}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  )
}
