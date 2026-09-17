import { FileText } from 'lucide-react'

export default function CitationChip({ citation }) {
  const filename = citation.split('/').pop()
  return (
    <span className="citation-chip" title={citation}>
      <FileText size={10} />
      {filename}
    </span>
  )
}
