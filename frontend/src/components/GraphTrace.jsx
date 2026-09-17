import { useCallback, useMemo } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { motion } from 'framer-motion'

const NODE_TYPE_COLORS = {
  module:   { bg: 'rgba(0,212,255,0.15)',  border: '#00D4FF', text: '#00D4FF' },
  class:    { bg: 'rgba(124,58,237,0.15)', border: '#7C3AED', text: '#A78BFA' },
  function: { bg: 'rgba(34,197,94,0.12)',  border: '#22C55E', text: '#4ADE80' },
  package:  { bg: 'rgba(245,158,11,0.12)', border: '#F59E0B', text: '#FCD34D' },
  unknown:  { bg: 'rgba(148,163,184,0.1)', border: '#475569', text: '#94A3B8' },
}

const EDGE_TYPE_COLORS = {
  imports:       '#00D4FF',
  depends_on:    '#7C3AED',
  calls:         '#22C55E',
  inherits_from: '#F59E0B',
  defines:       '#94A3B8',
  related:       '#334155',
}

function buildReactFlowElements(trace) {
  if (!trace) return { nodes: [], edges: [] }

  const { nodes: traceNodes, edges: traceEdges } = trace

  // Layout nodes in a circle
  const angleStep = (2 * Math.PI) / Math.max(traceNodes.length, 1)
  const radius = Math.min(180 + traceNodes.length * 20, 400)

  const nodes = traceNodes.map((node, i) => {
    const colors = NODE_TYPE_COLORS[node.type] || NODE_TYPE_COLORS.unknown
    const angle = i * angleStep - Math.PI / 2
    return {
      id: node.id,
      position: {
        x: Math.cos(angle) * radius + 400,
        y: Math.sin(angle) * radius + 250,
      },
      data: {
        label: (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: colors.text, marginBottom: '2px', fontFamily: 'var(--font-mono)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {node.id}
            </div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
              {node.type}
            </div>
          </div>
        )
      },
      style: {
        background: node.matched
          ? 'rgba(0,212,255,0.25)'
          : colors.bg,
        border: `1px solid ${node.matched ? '#00D4FF' : colors.border}`,
        borderRadius: '8px',
        color: 'white',
        fontSize: '11px',
        minWidth: '100px',
        boxShadow: node.matched ? '0 0 16px rgba(0,212,255,0.5)' : 'none',
      }
    }
  })

  const edges = traceEdges.map((edge, i) => ({
    id: `edge-${i}`,
    source: edge.source,
    target: edge.target,
    label: edge.type,
    labelStyle: { fill: 'var(--fg-muted)', fontSize: '10px' },
    labelBgStyle: { fill: 'var(--bg-card)' },
    style: {
      stroke: EDGE_TYPE_COLORS[edge.type] || EDGE_TYPE_COLORS.related,
      strokeWidth: 1.5,
    },
    animated: edge.type === 'depends_on' || edge.type === 'imports',
  }))

  return { nodes, edges }
}

export default function GraphTrace({ trace, isLoading }) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildReactFlowElements(trace),
    [trace]
  )

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  if (isLoading) {
    return (
      <div className="glass" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '12px' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: 'var(--accent-cyan)',
                animation: `pulse-dot 1.2s ${i * 0.2}s ease-in-out infinite`,
              }} />
            ))}
          </div>
          <p style={{ color: 'var(--fg-muted)', fontSize: '13px' }}>Traversing graph…</p>
        </div>
      </div>
    )
  }

  if (!trace || !trace.nodes?.length) {
    return (
      <div className="glass" style={{ padding: '20px', textAlign: 'center', color: 'var(--fg-muted)' }}>
        <p style={{ fontSize: '13px' }}>No graph traversal in this result.</p>
        <p style={{ fontSize: '11px', marginTop: '4px' }}>Graph mode must be active and entities must match query.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="glass"
      style={{ overflow: 'hidden' }}
    >
      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--fg-primary)' }}>Graph Traversal</p>
          <p style={{ fontSize: '11px', color: 'var(--fg-muted)' }}>
            {trace.nodes.length} nodes · {trace.edges.length} edges
          </p>
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {Object.entries(NODE_TYPE_COLORS).slice(0, 4).map(([type, c]) => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: c.bg, border: `1px solid ${c.border}` }} />
              <span style={{ fontSize: '10px', color: 'var(--fg-muted)', textTransform: 'capitalize' }}>{type}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(0,212,255,0.25)', border: '1px solid #00D4FF', boxShadow: '0 0 6px rgba(0,212,255,0.5)' }} />
            <span style={{ fontSize: '10px', color: '#00D4FF' }}>matched</span>
          </div>
        </div>
      </div>

      {/* Flow canvas */}
      <div style={{ height: '380px', background: 'var(--bg-base)' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          attributionPosition="bottom-left"
          style={{ background: 'transparent' }}
        >
          <Background color="rgba(0,212,255,0.04)" gap={32} size={1} />
          <Controls style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} />
          <MiniMap
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            nodeColor={(n) => NODE_TYPE_COLORS[n.data?.type]?.border || '#475569'}
          />
        </ReactFlow>
      </div>
    </motion.div>
  )
}
