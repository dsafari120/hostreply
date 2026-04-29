import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import {
  loadConfig,
  saveConfig,
  loadSavedReplies,
  deleteReply,
  hasSetup,
  defaultConfig,
} from './lib/storage'
import { PropertyConfig, SavedReply, AppTab } from './lib/types'
import ApiKeySetup from './components/ApiKeySetup'
import PropertySetup from './components/PropertySetup'
import ReplyGenerator from './components/ReplyGenerator'
import SavedReplies from './components/SavedReplies'

const TABS: { id: AppTab; label: string }[] = [
  { id: 'reply', label: 'Generate reply' },
  { id: 'setup', label: 'My property' },
  { id: 'saved', label: 'Saved replies' },
]

function getStoredApiKey(): Promise<string> {
  return new Promise(resolve => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.get(['gemini_api_key'], result => {
        resolve((result.gemini_api_key as string) ?? '')
      })
    } else {
      resolve(localStorage.getItem('gemini_api_key') ?? '')
    }
  })
}

function storeApiKey(key: string): void {
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    chrome.storage.local.set({ gemini_api_key: key })
  } else {
    localStorage.setItem('gemini_api_key', key)
  }
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [apiKey, setApiKey] = useState('')
  const [apiKeyReady, setApiKeyReady] = useState(false)
  const [tab, setTab] = useState<AppTab>('reply')
  const [config, setConfig] = useState<PropertyConfig>(defaultConfig)
  const [setupSaved, setSetupSaved] = useState(false)
  const [replies, setReplies] = useState<SavedReply[]>([])
  const [dataLoading, setDataLoading] = useState(false)

  // Step 1 — anonymous auth via Supabase
  useEffect(() => {
    // Check for existing session first, then sign in anonymously if none
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        setUser(session.user)
      } else {
        const { data } = await supabase.auth.signInAnonymously()
        if (data.user) setUser(data.user)
      }
      setAuthLoading(false)
    })

    // Keep user state in sync across tab focus / token refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Step 2 — load stored API key
  useEffect(() => {
    getStoredApiKey().then(key => {
      if (key) {
        setApiKey(key)
        setApiKeyReady(true)
      }
    })
  }, [])

  // Step 3 — load cloud data once user is authenticated
  useEffect(() => {
    if (!user) return
    setDataLoading(true)
    Promise.all([loadConfig(), loadSavedReplies()])
      .then(([cfg, reps]) => {
        setConfig(cfg)
        setReplies(reps)
        setSetupSaved(hasSetup(cfg))
      })
      .finally(() => setDataLoading(false))
  }, [user])

  const handleSaveApiKey = (key: string) => {
    storeApiKey(key)
    setApiKey(key)
    setApiKeyReady(true)
  }

  const handleSaveConfig = async (): Promise<void> => {
    await saveConfig(config)
    setSetupSaved(true)
  }

  const handleDeleteReply = async (id: string) => {
    await deleteReply(id)
    setReplies(await loadSavedReplies())
  }

  const handleReplySaved = async () => {
    setReplies(await loadSavedReplies())
  }

  // ── Loading state ────────────────────────────────────────────────────────
  if (authLoading || dataLoading) {
    return (
      <div className="w-[420px] h-48 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-6 w-6 text-brand-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-sm text-gray-400">Loading…</span>
        </div>
      </div>
    )
  }

  // ── API key gate ─────────────────────────────────────────────────────────
  if (!apiKeyReady) {
    return <ApiKeySetup onSave={handleSaveApiKey} />
  }

  // ── Main app ─────────────────────────────────────────────────────────────
  return (
    <div className="w-[420px] bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <span className="font-semibold text-gray-900 text-base tracking-tight">
          Host<span className="text-brand-500">Reply</span>
        </span>
        <button
          onClick={() => setApiKeyReady(false)}
          title="Change API key"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ⚙
        </button>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-100">
        <div className="flex">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 text-xs py-2.5 font-medium transition-colors ${
                tab === t.id
                  ? 'text-brand-500 border-b-2 border-brand-500'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto max-h-[540px]">
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
            apiKey={apiKey}
            onReplySaved={handleReplySaved}
          />
        )}
        {tab === 'saved' && (
          <SavedReplies replies={replies} onDelete={handleDeleteReply} />
        )}
      </div>
    </div>
  )
}
