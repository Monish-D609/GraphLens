import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GitBranch, Database, Activity, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react'
import axios from 'axios'

import QueryInput from './components/QueryInput'
import ModeToggle from './components/ModeToggle'
import AnswerPanel from './components/AnswerPanel'
import ComparisonView from './components/ComparisonView'
import GraphTrace from './components/GraphTrace'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

function StatusBar({ health }) {
  if (!health) return null
  const ingested = health.vector_store_count > 0
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '8px 16px',
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border)',
      fontSize: '12px',
      color: 'var(--fg-muted)',
      flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {ingested ? <CheckCircle2 size={12} style={{ color: 'var(--accent-green)' }} /> : <AlertCircle size={12} style={{ color: 'var(--accent-amber)' }} />}
        <span>{ingested ? `${health.vector_store_count} chunks indexed` : 'Not ingested'}</span>
      </div>
      {health.graph_nodes > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <GitBranch size={12} style={{ color: 'var(--accent-cyan)' }} />
          <span>{health.graph_nodes} entities · {health.graph_edges} edges</span>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <div className="pulse-dot" style={{ width: '6px', height: '6px' }} />
        <span>API connected</span>
      </div>
    </div>
  )
}

export default function App() {
  const [mode, setMode] = useState('graph')
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isIngesting, setIsIngesting] = useState(false)
  const [error, setError] = useState(null)
  const [health, setHealth] = useState(null)

  // Health check on mount
  useState(() => {
    axios.get(`${API_BASE}/api/health`)
      .then(r => setHealth(r.data))
      .catch(() => setHealth(null))
  })

  const handleQuery = useCallback(async (question) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const { data } = await axios.post(`${API_BASE}/api/query`, {
        question,
        mode,
      }, { timeout: 30000 })
      setResult(data)
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Query failed'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [mode])

  const handleIngest = useCallback(async () => {
    setIsIngesting(true)
    setError(null)
    try {
      await axios.post(`${API_BASE}/api/ingest`)
      // Poll until done
      const poll = setInterval(async () => {
        const { data } = await axios.get(`${API_BASE}/api/ingest/status`)
        if (data.status === 'done' || data.status === 'error') {
          clearInterval(poll)
          setIsIngesting(false)
          const h = await axios.get(`${API_BASE}/api/health`)
          setHealth(h.data)
        }
      }, 3000)
    } catch (err) {
      setError('Ingestion failed: ' + (err.message || 'unknown error'))
      setIsIngesting(false)
    }
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ── Header ── */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(2,6,23,0.9)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--glow-cyan)',
          }}>
            <GitBranch size={20} color="#000" />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.03em' }}>
              GraphLens
            </h1>
            <p style={{ fontSize: '11px', color: 'var(--fg-muted)', marginTop: '-2px' }}>
              Graph-Augmented RAG over Technical Docs
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <StatusBar health={health} />
          <button
            id="ingest-btn"
            onClick={handleIngest}
            disabled={isIngesting}
            className="btn btn-ghost"
            style={{ fontSize: '12px' }}
          >
            <Database size={14} />
            {isIngesting ? 'Ingesting…' : 'Re-Ingest'}
          </button>
          <a
            href="https://github.com/Monish-D609/GraphLens"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            style={{ fontSize: '12px' }}
          >
            <ExternalLink size={14} />
            GitHub
          </a>
        </div>
      </header>

      {/* ── Hero section ── */}
      <div style={{
        padding: '48px 32px 32px',
        textAlign: 'center',
        maxWidth: '960px',
        margin: '0 auto',
        width: '100%',
      }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            background: 'rgba(0,212,255,0.08)',
            border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: 'var(--radius-full)',
            fontSize: '12px',
            color: 'var(--accent-cyan)',
            fontWeight: 500,
            marginBottom: '20px',
          }}>
            <Activity size={12} />
            Relationship-aware document QA
          </div>

          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '16px',
          }}>
            Ask questions that live{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              between the documents
            </span>
          </h2>

          <p style={{ color: 'var(--fg-muted)', fontSize: '15px', maxWidth: '560px', margin: '0 auto 32px', lineHeight: 1.7 }}>
            GraphLens combines vector search with entity–relationship graph traversal.
            Ask dependency and blast-radius questions that flat embeddings can't answer.
          </p>
        </motion.div>

        {/* Mode toggle */}
        <div style={{ marginBottom: '24px' }}>
          <ModeToggle mode={mode} onChange={setMode} disabled={isLoading} />
        </div>

        {/* Query input */}
        <QueryInput onQuery={handleQuery} isLoading={isLoading} mode={mode} />
      </div>

      {/* ── Main content ── */}
      <main style={{
        flex: 1,
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 32px 64px',
        width: '100%',
      }}>
        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                padding: '12px 16px',
                background: 'rgba(244,63,94,0.1)',
                border: '1px solid rgba(244,63,94,0.3)',
                borderRadius: 'var(--radius-md)',
                color: '#FB7185',
                fontSize: '13px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={14} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compare mode layout */}
        {mode === 'compare' && (result || isLoading) && (
          <ComparisonView result={result} isLoading={isLoading} />
        )}

        {/* Single mode layout */}
        {mode !== 'compare' && (
          <div style={{ display: 'grid', gridTemplateColumns: result?.traversal_trace?.nodes?.length ? '1fr 420px' : '1fr', gap: '24px', alignItems: 'start' }}>
            <AnswerPanel result={result} isLoading={isLoading} mode={mode} />
            {(result?.traversal_trace || isLoading) && mode === 'graph' && (
              <div style={{ position: 'sticky', top: '80px' }}>
                <GraphTrace trace={result?.traversal_trace} isLoading={isLoading} />
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!result && !isLoading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--fg-subtle)' }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 20px',
              borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <GitBranch size={36} style={{ color: 'var(--fg-subtle)' }} />
            </div>
            <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--fg-muted)', marginBottom: '8px' }}>
              Ask your first question
            </p>
            <p style={{ fontSize: '13px' }}>
              Try a relationship question to see graph traversal in action
            </p>
          </motion.div>
        )}
      </main>
    </div>
  )
}
