import { useState } from 'react'

interface Props {
  onSave: (key: string) => void
}

export default function ApiKeySetup({ onSave }: Props) {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')

  const handleSave = () => {
    const trimmed = key.trim()
    if (!trimmed) {
      setError('Please enter your API key.')
      return
    }
    if (!trimmed.startsWith('AIza')) {
      setError("This doesn't look like a Gemini API key. It should start with \"AIza\u2026\"")
      return
    }
    onSave(trimmed)
  }

  return (
    <div className="w-[420px] bg-white p-6">
      <div className="mb-5">
        <span className="font-semibold text-gray-900 text-base tracking-tight">
          Host<span className="text-brand-500">Reply</span>
        </span>
      </div>

      <h2 className="font-semibold text-gray-900 text-base mb-1">
        Enter your Gemini API key
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Get a free key from{' '}
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noreferrer"
          className="text-brand-500 underline"
        >
          Google AI Studio
        </a>
        . It's stored only on this device — never sent anywhere else.
      </p>

      <input
        className="input mb-2"
        type="password"
        placeholder="AIza…"
        value={key}
        onChange={e => {
          setKey(e.target.value)
          setError('')
        }}
        onKeyDown={e => e.key === 'Enter' && handleSave()}
        autoFocus
      />

      {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

      <button
        onClick={handleSave}
        disabled={!key.trim()}
        className="btn-primary w-full mt-2"
      >
        Save &amp; continue
      </button>

      <p className="text-xs text-gray-400 mt-4 text-center">
        Gemini API has a free tier — no credit card needed.
      </p>
    </div>
  )
}
