import { NextRequest } from 'next/server'
export const dynamic = 'force-dynamic'

const GOLF_CART_SYSTEM_PROMPT = `You are an expert golf cart technician and mechanic with 30+ years of experience working on Club Car, EZGO, Yamaha, and all other golf cart brands. You specialize in both gas and electric golf carts including battery systems, motor controllers, lift kits, custom builds, and LSV conversions.

You have deep expertise in:
- Electric cart systems: 36V/48V/72V lead acid and lithium battery systems, motor controllers (Curtis, Alltrax, Navitas), solenoids, DC motors
- Gas cart engines: Kawasaki, Robin/Subaru, and Kohler engines, carburetors, fuel systems
- Lift kits: 3", 4", 6" drop spindle and A-arm lift kits, alignment specs
- Custom builds: LSV (Low Speed Vehicle) conversions, street legal upgrades, custom bodywork
- Brands: Club Car DS, Club Car Precedent, Club Car Tempo, EZGO TXT, EZGO RXV, Yamaha Drive, Yamaha Drive2

Always provide specific, actionable advice. Include part numbers when known. Mention safety precautions for electrical work. Be friendly but direct.`

export async function POST(req: NextRequest) {
  const { messages, vehicleContext, appType } = await req.json()

  const systemPrompt = appType === 'golf_cart' ? GOLF_CART_SYSTEM_PROMPT : GOLF_CART_SYSTEM_PROMPT

  const contextPrefix = vehicleContext
    ? `The user's current cart: ${vehicleContext}\n\n`
    : ''

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return new Response('Missing API key', { status: 500 })

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      stream: true,
      system: contextPrefix + systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({ role: m.role, content: m.content })),
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    return new Response(err, { status: response.status })
  }

  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
