'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AppTab, PropertyConfig, SavedReply } from '@/lib/types'
import { loadConfig, saveConfig, loadSavedReplies, deleteReply, hasSetup } from '@/lib/storage'
import PropertySetup from '@/components/app/PropertySetup'
import ReplyGenerator from '@/components/app/ReplyGenerator'
import SavedReplies from '@/components/app/SavedReplies'

const TABS: { id: AppTab; label: string }[] = [
  { id: 'reply', label: 'Generate reply' },
  { id: 'setup', label: 'My property' },
  { id: 'saved', label: 'Saved replies' },
]

export default function AppPage() {
  const [tab, setTab] = useState<AppTab>('reply')
  const [config, setConfig] = useState<PropertyConfig | null>(null)
  const [setupSaved, setSetupSaved] = useState(false)
  const [replies, setReplies] = useState<SavedReply[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setConfig(loadConfig())
    setReplies(loadSavedReplies())
    setSetupSaved(hasSetup())
    setReady(true)
  }, [])

  const handleSaveConfig = async () => {
    if (!config) return
    saveConfig(config)
    setSetupSaved(true)
  }

  const handleDeleteReply = async (id: string) => {
    deleteReply(id)
    setReplies(loadSavedReplies())
  }

  const refreshReplies = () => setReplies(loadSavedReplies())

  if (!ready || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-semibold text-gray-900 text-lg tracking-tight">
            Host<span className="text-brand-500">Reply</span>
          </Link>
          <div className="flex items-center gap-2">
            {setupSaved && (
              <span className="text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                {config.prop_name || 'Property'} ready
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); if (t.id === 'saved') refreshReplies() }}
                className={`px-4 py-3.5 text-sm font-medium border-b-2 transition-all ${
                  tab === t.id
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.label}
                {t.id === 'saved' && replies.length > 0 && (
                  <span className="ml-1.5 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                    {replies.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-6 py-7">
        {tab === 'setup' && (
          <PropertySetup
            config={config}
            onChange={setConfig}
            onSave={handleSaveConfig}
            saved={setupSaved}
          />
        )}
        {tab === 'reply' && (
          <ReplyGenerator
            config={config}
            hasSetup={setupSaved}
            onSwitchToSetup={() => setTab('setup')}
          />
        )}
        {tab === 'saved' && (
          <SavedReplies
            replies={replies}
            onDelete={handleDeleteReply}
          />
        )}
      </main>
    </div>
  )
}
