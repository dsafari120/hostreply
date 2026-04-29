import { supabase } from './supabase'
import { PropertyConfig, SavedReply } from './types'

export const defaultConfig: PropertyConfig = {
  host_name: '', prop_name: '', personality: '',
  checkin: '', checkout: '', wifi_name: '',
  wifi_pass: '', parking: '', rules: '', extra: '',
}

async function getOrCreateUser() {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) return session.user
  const { data, error } = await supabase.auth.signInAnonymously()
  if (error) throw error
  return data.user!
}

export async function loadConfig(): Promise<PropertyConfig> {
  try {
    const user = await getOrCreateUser()
    const { data, error } = await supabase
      .from('property_configs')
      .select('host_name, prop_name, personality, checkin, checkout, wifi_name, wifi_pass, parking, rules, extra')
      .eq('user_id', user.id)
      .maybeSingle()
    if (error) throw error
    return data ? { ...defaultConfig, ...data } : defaultConfig
  } catch {
    return defaultConfig
  }
}

export async function saveConfig(config: PropertyConfig): Promise<void> {
  const user = await getOrCreateUser()
  const { error } = await supabase
    .from('property_configs')
    .upsert(
      {
        user_id: user.id,
        host_name: config.host_name,
        prop_name: config.prop_name,
        personality: config.personality,
        checkin: config.checkin,
        checkout: config.checkout,
        wifi_name: config.wifi_name,
        wifi_pass: config.wifi_pass,
        parking: config.parking,
        rules: config.rules,
        extra: config.extra,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
  if (error) throw error
}

export async function loadSavedReplies(): Promise<SavedReply[]> {
  try {
    const user = await getOrCreateUser()
    const { data, error } = await supabase
      .from('saved_replies')
      .select('*')
      .eq('user_id', user.id)
      .order('saved_at', { ascending: false })
    if (error) throw error
    return (data || []).map(r => ({
      id: r.id,
      guestMessage: r.guest_message,
      reply: r.reply,
      tag: r.tag,
      savedAt: r.saved_at,
    }))
  } catch {
    return []
  }
}

export async function saveReply(reply: Omit<SavedReply, 'id' | 'savedAt'>): Promise<SavedReply> {
  const user = await getOrCreateUser()
  const { data, error } = await supabase
    .from('saved_replies')
    .insert({
      user_id: user.id,
      guest_message: reply.guestMessage,
      reply: reply.reply,
      tag: reply.tag,
    })
    .select()
    .single()
  if (error) throw error
  return {
    id: data.id,
    guestMessage: data.guest_message,
    reply: data.reply,
    tag: data.tag,
    savedAt: data.saved_at,
  }
}

export async function deleteReply(id: string): Promise<void> {
  const user = await getOrCreateUser()
  const { error } = await supabase
    .from('saved_replies')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
  if (error) throw error
}

export async function hasSetup(): Promise<boolean> {
  const c = await loadConfig()
  return !!(c.host_name || c.prop_name || c.checkin)
}

export const MESSAGE_TAGS = [
  'Check-in', 'Check-out', 'WiFi', 'Parking',
  'House rules', 'Local tips', 'Request', 'Complaint', 'Other'
]

