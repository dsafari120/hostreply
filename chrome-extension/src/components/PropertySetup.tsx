import { useState } from 'react'
import { PropertyConfig } from '../lib/types'

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}

interface Props {
  config: PropertyConfig
  onChange: (config: PropertyConfig) => void
  onSave: () => Promise<void>
  saved: boolean
}

export default function PropertySetup({ config, onChange, onSave, saved }: Props) {
  const [saving, setSaving] = useState(false)

  const set =
    (key: keyof PropertyConfig) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange({ ...config, [key]: e.target.value })

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-4 py-3">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Property saved — switch to Generate reply to start
        </div>
      )}

      {/* Host identity */}
      <div>
        <p className="label mb-3">Host identity</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Your name</label>
            <input
              className="input"
              placeholder="e.g. Ahmad"
              value={config.host_name}
              onChange={set('host_name')}
            />
          </div>
          <div>
            <label className="label">Property nickname</label>
            <input
              className="input"
              placeholder="e.g. The Zurich Loft"
              value={config.prop_name}
              onChange={set('prop_name')}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="label">Your reply style</label>
        <textarea
          className="textarea min-h-[80px]"
          placeholder="Describe how you like to communicate. e.g. Warm and casual, I love giving local tips, I keep messages short and always sign off with my name."
          value={config.personality}
          onChange={set('personality')}
        />
        <p className="text-xs text-gray-400 mt-1">
          This shapes how the AI sounds — make it sound like you.
        </p>
      </div>

      {/* Property details */}
      <div>
        <p className="label mb-3">Property details</p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="label">Check-in time</label>
            <input
              className="input"
              placeholder="e.g. 3:00 PM"
              value={config.checkin}
              onChange={set('checkin')}
            />
          </div>
          <div>
            <label className="label">Check-out time</label>
            <input
              className="input"
              placeholder="e.g. 11:00 AM"
              value={config.checkout}
              onChange={set('checkout')}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="label">WiFi name</label>
            <input
              className="input"
              placeholder="Network name"
              value={config.wifi_name}
              onChange={set('wifi_name')}
            />
          </div>
          <div>
            <label className="label">WiFi password</label>
            <input
              className="input"
              placeholder="Password"
              value={config.wifi_pass}
              onChange={set('wifi_pass')}
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="label">Parking / access info</label>
          <input
            className="input"
            placeholder="e.g. Free street parking on Main St, no permit needed"
            value={config.parking}
            onChange={set('parking')}
          />
        </div>
        <div className="mb-3">
          <label className="label">Key house rules</label>
          <textarea
            className="textarea min-h-[72px]"
            placeholder="e.g. No smoking, no parties, quiet hours after 10pm, max 2 guests"
            value={config.rules}
            onChange={set('rules')}
          />
        </div>
        <div>
          <label className="label">Anything else guests often ask about</label>
          <textarea
            className="textarea min-h-[72px]"
            placeholder="e.g. Key lockbox is behind the red door. Nearest supermarket is 2 min walk."
            value={config.extra}
            onChange={set('extra')}
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary w-full py-3 flex items-center justify-center gap-2"
      >
        {saving ? <><Spinner /> Saving…</> : 'Save property info'}
      </button>
    </div>
  )
}
