import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const city       = searchParams.get('city')       ?? ''
  const state      = searchParams.get('state')      ?? ''
  const zip        = searchParams.get('zip')        ?? ''
  const radius     = searchParams.get('radius')     ?? '50'
  const eventType  = searchParams.get('event_type') ?? 'all'

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return NextResponse.json({ events: [] })

  const location = [city, state, zip].filter(Boolean).join(', ')
  const typeFilter = eventType !== 'all' ? ` specifically "${eventType.replace(/_/g,' ')}" events` : ''

  const prompt = `You are a golf cart event finder. Find upcoming golf cart events${typeFilter} near ${location} within ${radius} miles.

Return a JSON array of up to 8 events. Each event object must have:
- name: event name (string)
- date: date string like "July 4, 2026" or "TBD" (string)
- location: venue/park name (string)
- city: city (string)
- state: 2-letter state (string)
- type: one of cart_meet, cart_show, golf_tournament, parade_cruise, poker_run, offroad, drag_race, custom_show, club_event (string)
- description: 1-2 sentence description (string)
- url: registration or info URL or "" (string)

Include real, known recurring golf cart events if applicable (like Peachtree City events, Villages parades, etc). If you don't know of specific events, generate realistic ones for that area.

Respond with ONLY the JSON array, no markdown, no explanation.`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await res.json()
    const text = data?.content?.[0]?.text ?? '[]'
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    const events = jsonMatch ? JSON.parse(jsonMatch[0]) : []
    return NextResponse.json({ events })
  } catch {
    return NextResponse.json({ events: [] })
  }
}
