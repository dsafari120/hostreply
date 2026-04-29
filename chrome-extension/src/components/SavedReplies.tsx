import { useState } from 'react'
import { SavedReply } from '../lib/types'

const TAG_COLORS: Record<string, string> = {
  'Check-in': 'bg-blue-50 text-blue-700',
  'Check-out': 'bg-purple-50 text-purple-700',
  WiFi: 'bg-cyan-50 text-cyan-700',
  Parking: 'bg-orange-50 text-orange-700',
  'House rules': 'bg-red-50 text-red-700',
  'Local tips': 'bg-green-50 text-green-700',
  Request: 'bg-yellow-50 text-yellow-700',
  Complaint: 'bg-red-50 text-red-800',
  Other: 'bg-gray-100 text-gray-600',
}

interface Props {
  replies: SavedReply[]
  onDelete: (id: string) => Promise<void>
}

export default function SavedReplies({ replies, onDelete }: Props) {
  const [copied, setCopied] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [filter, setFilter] = useState('All')

  const tags = ['All', ...Array.from(new Set(replies.map(r => r.tag)))]
  const filtered = filter === 'All' ? replies : replies.filter(r => r.tag === filter)

  const copy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  if (replies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-gray-400 text-xl">☆</span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">No saved replies yet</h3>
        <p className="text-sm text-gray-500">
          Generate a reply and hit "Save reply" to build your library.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tags.length > 2 && (
        <div className="flex gap-2 flex-wrap">
          {tags.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                filter === t
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(r => (
          <div key={r.id} className="card border border-gray-100 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <span className={`tag text-xs ${TAG_COLORS[r.tag] ?? TAG_COLORS['Other']}`}>
                  {r.tag}
                </span>
                <p className="text-xs text-gray-400 mt-1.5 line-clamp-1 italic">
                  &ldquo;{r.guestMessage.slice(0, 80)}
                  {r.guestMessage.length > 80 ? '…' : ''}&rdquo;
                </p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">
                {new Date(r.savedAt).toLocaleDateString()}
              </span>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap line-clamp-4">
              {r.reply}
            </p>

            <div className="flex gap-2 pt-1 border-t border-gray-50">
              <button
                onClick={() => copy(r.id, r.reply)}
                disabled={deletingId === r.id}
                className={`flex-1 text-xs py-1.5 rounded-lg border transition-all ${
                  copied === r.id
                    ? 'bg-brand-50 text-brand-600 border-brand-200'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {copied === r.id ? '✓ Copied' : 'Copy'}
              </button>
              <button
                onClick={async () => {
                  setDeletingId(r.id)
                  try {
                    await onDelete(r.id)
                  } finally {
                    setDeletingId(null)
                  }
                }}
                disabled={deletingId === r.id}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {deletingId === r.id ? (
                  <><svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Deleting…</>
                ) : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
