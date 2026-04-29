import { supabase } from './supabase'
import { PropertyConfig, SavedReply } from './types'

export const defaultConfig: PropertyConfig = {
  host_name: '',
  prop_name: '',
  personality: '',
  checkin: '',
  checkout: '',
  wifi_name: '',
  wifi_pass: '',
  parking: '',
  rules: '',
  extra: '',
}

export const MESSAGE_TAGS = [
  'Check-in',
  'Check-out',
  'WiFi',
  'Parking',
  'House rules',
  'Local tips',
  'Request',
  'Complaint',
  'Other',
]

async function requireUid(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession()
  const uid = session?.user.id
  if (!uid) throw new Error('Not authenticated')
  return uid
}

export async function loadConfig(): Promise<PropertyConfig> {
  try {
    const uid = await requireUid()
    const { data } = await supabase
      .from('property_configs')
      .select('*')
      .eq('user_id', uid)
      .maybeSingle()
    if (!data) return defaultConfig
    return {
      host_name: data.host_name ?? '',
      prop_name: data.prop_name ?? '',
      personality: data.personality ?? '',
      checkin: data.checkin ?? '',
      checkout: data.checkout ?? '',
      wifi_name: data.wifi_name ?? '',
      wifi_pass: data.wifi_pass ?? '',
      parking: data.parking ?? '',
      rules: data.rules ?? '',
      extra: data.extra ?? '',
    }
  } catch {
    return defaultConfig
  }
}

export async function saveConfig(config: PropertyConfig): Promise<void> {
  const uid = await requireUid()
  await supabase
    .from('property_configs')
    .upsert({ user_id: uid, ...config, updated_at: new Date().toISOString() })
}

export async function loadSavedReplies(): Promise<SavedReply[]> {
  try {
    const uid = await requireUid()
    const { data } = await supabase
      .from('saved_replies')
      .select('*')
      .eq('user_id', uid)
      .order('saved_at', { ascending: false })
    if (!data) return []
    return data.map(row => ({
      id: row.id as string,
      guestMessage: row.guest_message as string,
      reply: row.reply as string,
      tag: row.tag as string,
      savedAt: row.saved_at as string,
    }))
  } catch {
    return []
  }
}

export async function saveReply(
  reply: Omit<SavedReply, 'id' | 'savedAt'>,
): Promise<SavedReply> {
  const uid = await requireUid()
  const savedAt = new Date().toISOString()
  const { data, error } = await supabase
    .from('saved_replies')
    .insert({
      user_id: uid,
      guest_message: reply.guestMessage,
      reply: reply.reply,
      tag: reply.tag,
      saved_at: savedAt,
    })
    .select()
    .single()
  if (error) throw error
  return {
    id: data.id as string,
    guestMessage: data.guest_message as string,
    reply: data.reply as string,
    tag: data.tag as string,
    savedAt: data.saved_at as string,
  }
}

export async function deleteReply(id: string): Promise<void> {
  const uid = await requireUid()
  await supabase
    .from('saved_replies')
    .delete()
    .eq('id', id)
    .eq('user_id', uid)
}

export function hasSetup(config: PropertyConfig): boolean {
  return !!(config.host_name || config.prop_name || config.checkin)
}
