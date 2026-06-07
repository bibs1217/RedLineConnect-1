import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const make     = searchParams.get('make')     ?? ''
  const model    = searchParams.get('model')    ?? ''
  const year     = searchParams.get('year')     ?? ''
  const type     = searchParams.get('type')     ?? ''
  const voltage  = searchParams.get('voltage')  ?? ''
  const category = searchParams.get('category') ?? ''
  const query    = searchParams.get('query')    ?? ''

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return NextResponse.json({ parts: [] })

  const cartDesc = [year, make, model, type, voltage ? `${voltage}V` : ''].filter(Boolean).join(' ')
  const prompt = `You are a golf cart parts expert. The user has a ${cartDesc || 'golf cart'} and needs parts in the category: "${category || 'general'}". Their specific request: "${query || 'general parts lookup'}".

Return a JSON array of 8 relevant parts. Each part object must have these exact fields:
- name: part name (string)
- price: price range as string like "$45-$65"
- brand: brand name (string)
- part_number: part number or "see fitment" (string)
- description: 1-2 sentence description (string)
- compatibility: what it fits (string)
- url: search URL on buggiesunlimited.com or golfcartpartsnation.com (string)

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
    const parts = jsonMatch ? JSON.parse(jsonMatch[0]) : []
    return NextResponse.json({ parts })
  } catch {
    return NextResponse.json({ parts: [] })
  }
}
