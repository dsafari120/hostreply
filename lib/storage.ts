import { PropertyConfig, SavedReply } from './types'

const CONFIG_KEY = 'hostreply_config'
const REPLIES_KEY = 'hostreply_saved'

export const defaultConfig: PropertyConfig = {
  host_name: '', prop_name: '', personality: '',
  checkin: '', checkout: '', wifi_name: '',
  wifi_pass: '', parking: '', rules: '', extra: '',
}

export function loadConfig(): PropertyConfig {
  if (typeof window === 'undefined') return defaultConfig
  try {
    const raw = localStorage.getItem(CONFIG_KEY)
    return raw ? { ...defaultConfig, ...JSON.parse(raw) } : defaultConfig
  } catch { return defaultConfig }
}

export function saveConfig(config: PropertyConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
}

export function loadSavedReplies(): SavedReply[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(REPLIES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function saveReply(reply: Omit<SavedReply, 'id' | 'savedAt'>): SavedReply {
  const replies = loadSavedReplies()
  const newReply: SavedReply = {
    ...reply,
    id: Date.now().toString(),
    savedAt: new Date().toISOString(),
  }
  localStorage.setItem(REPLIES_KEY, JSON.stringify([newReply, ...replies]))
  return newReply
}

export function deleteReply(id: string): void {
  const replies = loadSavedReplies().filter(r => r.id !== id)
  localStorage.setItem(REPLIES_KEY, JSON.stringify(replies))
}

export function hasSetup(): boolean {
  const c = loadConfig()
  return !!(c.host_name || c.prop_name || c.checkin)
}

export const MESSAGE_TAGS = [
  'Check-in', 'Check-out', 'WiFi', 'Parking',
  'House rules', 'Local tips', 'Request', 'Complaint', 'Other'
]
