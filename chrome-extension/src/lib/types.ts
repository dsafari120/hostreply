export interface PropertyConfig {
  host_name: string
  prop_name: string
  personality: string
  checkin: string
  checkout: string
  wifi_name: string
  wifi_pass: string
  parking: string
  rules: string
  extra: string
}

export interface SavedReply {
  id: string
  guestMessage: string
  reply: string
  tag: string
  savedAt: string
}

export type ReplyModifier = 'shorter' | 'warmer' | 'formal' | 'default'

export type AppTab = 'setup' | 'reply' | 'saved'
