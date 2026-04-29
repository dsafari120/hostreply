import { useState } from 'react'
import { PropertyConfig, ReplyModifier } from '../lib/types'
import { saveReply } from '../lib/storage'
import { generateReply, detectTag } from '../lib/gemini'

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
  config: PropertyConfig
  hasSetup: boolean
  onSwitchToSetup: () => void
  apiKey: string
  onReplySaved: () => Promise<void>
}

export default function ReplyGenerator({
  config,
  hasSetup,
  onSwitchToSetup,
  apiKey,
  onReplySaved,
}: Props) {
  const [guestMsg, setGuestMsg] = useState('')
  const [reply, setReply] = useState('')
  const [tag, setTag] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const generate = async (modifier: ReplyModifier = 'default') => {
    if (!guestMsg.trim()) return
    setLoading(true)
    setError('')
    setSaved(false)
    try {
      const text = await generateReply(guestMsg, config, modifier, apiKey)
      setReply(text)
      setTag(detectTag(guestMsg))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate reply. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(reply)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const save = async () => {
    setSaving(true)
    try {
      await saveReply({ guestMessage: guestMsg, reply, tag })
      await onReplySaved()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  if (!hasSetup) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-brand-500 text-xl">⚙</span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">Set up your property first</h3>
        <p className="text-sm text-gray-500 mb-5">It takes under 2 minutes — just your basics.</p>
        <button onClick={onSwitchToSetup} className="btn-primary">
          Go to setup →
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Paste guest message</label>
        <textarea
          className="textarea min-h-[100px]"
          placeholder="Paste the message your guest sent on Airbnb…"
          value={guestMsg}
          onChange={e => setGuestMsg(e.target.value)}
        />
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-400">{guestMsg.length} chars</span>
        </div>
      </div>

      <button
        onClick={() => generate()}
        disabled={loading || !guestMsg.trim()}
        className="btn-primary w-full py-3 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Generating…
          </>
        ) : (
          'Generate reply'
        )}
      </button>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {reply && (
        <div className="card border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className={`tag text-xs ${TAG_COLORS[tag] ?? TAG_COLORS['Other']}`}>
              {tag}
            </span>
            <div className="flex gap-2">
              <button
                onClick={save}
                disabled={saving || saved}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  saved
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {saving ? (
                  <><svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Saving…</>
                ) : saved ? '✓ Saved' : 'Save reply'}
              </button>
              <button
                onClick={copy}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  copied
                    ? 'bg-brand-50 text-brand-600 border-brand-200'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{reply}</p>

          {/* Refine buttons */}
          <div className="flex gap-2 flex-wrap pt-1 border-t border-gray-50">
            {(['shorter', 'warmer', 'formal'] as ReplyModifier[]).map(mod => (
              <button
                key={mod}
                onClick={() => generate(mod)}
                disabled={loading}
                className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-gray-300 transition-all capitalize disabled:opacity-40"
              >
                {mod === 'shorter' ? '↓ Shorter' : mod === 'warmer' ? '❤ Warmer' : '▲ Formal'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
