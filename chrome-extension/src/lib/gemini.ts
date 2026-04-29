import { PropertyConfig, ReplyModifier } from './types'

function buildPrompt(
  guestMessage: string,
  config: PropertyConfig,
  modifier: ReplyModifier,
): string {
  const modifierInstruction =
    modifier === 'shorter'
      ? ' Write a notably shorter, more concise reply.'
      : modifier === 'warmer'
        ? ' Make the tone noticeably warmer and more personal — like a friend.'
        : modifier === 'formal'
          ? ' Make the tone professional and formal.'
          : ''

  return `You are a smart assistant helping an Airbnb host named ${config.host_name || 'the host'} reply to guest messages.

Property: ${config.prop_name || 'their listing'}
Check-in: ${config.checkin || 'flexible'} | Check-out: ${config.checkout || 'flexible'}
WiFi: ${config.wifi_name ? `${config.wifi_name} / ${config.wifi_pass}` : 'not specified'}
Parking: ${config.parking || 'not specified'}
House rules: ${config.rules || 'standard Airbnb rules'}
Additional info: ${config.extra || 'none'}

Host personality & style: ${config.personality || 'friendly and helpful'}

Instructions:
- Write a natural, human-sounding reply — not a template, not a bot
- Match the host's personality exactly
- Be concise but warm
- Answer the guest's question directly using property info above
- Sign off with the host's first name${modifierInstruction}

Reply ONLY with the message text. No subject line, no preamble, just the reply.

Guest message:
${guestMessage}`
}

export async function generateReply(
  guestMessage: string,
  config: PropertyConfig,
  modifier: ReplyModifier,
  apiKey: string,
): Promise<string> {
  const prompt = buildPrompt(guestMessage, config, modifier)

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    },
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      (err as { error?: { message?: string } }).error?.message ||
        `Gemini error ${res.status}`,
    )
  }

  const data = await res.json()
  const text: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  if (!text) throw new Error('Empty response from Gemini')
  return text
}

export function detectTag(guestMessage: string): string {
  const lower = guestMessage.toLowerCase()
  if (lower.includes('check') && lower.includes('in')) return 'Check-in'
  if (lower.includes('check') && lower.includes('out')) return 'Check-out'
  if (lower.includes('wifi') || lower.includes('wi-fi') || lower.includes('internet'))
    return 'WiFi'
  if (lower.includes('park')) return 'Parking'
  if (lower.includes('rule') || lower.includes('allow') || lower.includes('permit'))
    return 'House rules'
  if (
    lower.includes('restaurant') ||
    lower.includes('recommend') ||
    lower.includes('nearby')
  )
    return 'Local tips'
  if (lower.includes('early') || lower.includes('late') || lower.includes('request'))
    return 'Request'
  if (
    lower.includes('issue') ||
    lower.includes('problem') ||
    lower.includes('broken')
  )
    return 'Complaint'
  return 'Other'
}
