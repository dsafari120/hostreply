import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { PropertyConfig, ReplyModifier } from '@/lib/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { guestMessage, config, modifier }: {
      guestMessage: string
      config: PropertyConfig
      modifier: ReplyModifier
    } = await req.json()

    if (!guestMessage?.trim()) {
      return NextResponse.json({ error: 'Guest message is required' }, { status: 400 })
    }

    const modifierInstruction =
      modifier === 'shorter' ? ' Write a notably shorter, more concise reply.' :
      modifier === 'warmer'  ? ' Make the tone noticeably warmer and more personal — like a friend.' :
      modifier === 'formal'  ? ' Make the tone professional and formal.' : ''

    const prompt = `You are a smart assistant helping an Airbnb host named ${config.host_name || 'the host'} reply to guest messages.

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

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    let text = ''
    let lastErr: unknown
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const result = await model.generateContent(prompt)
        text = result.response.text()
        break
      } catch (e) {
        lastErr = e
        const msg = e instanceof Error ? e.message : ''
        if (msg.includes('503') || msg.includes('fetch failed')) {
          await new Promise(r => setTimeout(r, 1500 * (attempt + 1)))
          continue
        }
        throw e
      }
    }
    if (!text) throw lastErr

    // Auto-detect message category
    const lowerMsg = guestMessage.toLowerCase()
    const tag =
      lowerMsg.includes('check') && lowerMsg.includes('in')  ? 'Check-in'  :
      lowerMsg.includes('check') && lowerMsg.includes('out') ? 'Check-out' :
      lowerMsg.includes('wifi') || lowerMsg.includes('wi-fi') || lowerMsg.includes('internet') ? 'WiFi' :
      lowerMsg.includes('park') ? 'Parking' :
      lowerMsg.includes('rule') || lowerMsg.includes('allow') || lowerMsg.includes('permit') ? 'House rules' :
      lowerMsg.includes('restaurant') || lowerMsg.includes('recommend') || lowerMsg.includes('nearby') ? 'Local tips' :
      lowerMsg.includes('early') || lowerMsg.includes('late') || lowerMsg.includes('request') ? 'Request' :
      lowerMsg.includes('issue') || lowerMsg.includes('problem') || lowerMsg.includes('broken') ? 'Complaint' :
      'Other'

    return NextResponse.json({ reply: text, tag })
  } catch (err) {
    console.error('[reply route error]', err)
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: 'Failed to generate reply', detail: message }, { status: 500 })
  }
}
