import { NextRequest } from 'next/server'
export const dynamic = 'force-dynamic'

/* ────────────────────────────────────────────────────────────────────────
   RedLineConnect-1 AI — tool-use upgrade.
   Claude with 5 tools: built-in web search + the 4 platform features
   (parts, vendors, cart listings, events). Streaming tool_use/tool_result
   loop; final text streams to the existing chat UI unchanged.
   ──────────────────────────────────────────────────────────────────────── */

const TOOLS: any[] = [
  { type: 'web_search_20250305', name: 'web_search', max_uses: 3 },
  {
    name: 'parts_search',
    description: 'Search golf cart parts by name, part number, or cart fitment. Returns pricing, brands, part numbers, and links from major golf cart parts retailers. Same data source as the /parts page.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Part name, part number, or description, e.g. "lithium conversion kit", "solenoid"' },
        cart: { type: 'string', description: 'Year make model and voltage, e.g. "2018 Club Car Precedent 48V"' },
        category: { type: 'string', description: 'Part category, e.g. batteries, lift kits, controllers, tires, body' },
      },
      required: ['query'],
    },
  },
  {
    name: 'vendor_lookup',
    description: 'Find golf cart vendors, builders, dealers, and parts suppliers by specialty — lift kits, batteries, custom builds, LSV conversions, wheels, electronics. Same data source as the /vendors page.',
    input_schema: {
      type: 'object',
      properties: {
        service_type: { type: 'string', description: 'Specialty or service, e.g. lithium install, lift kit, custom build, LSV conversion' },
        location: { type: 'string', description: 'User location if provided' },
      },
      required: ['service_type'],
    },
  },
  {
    name: 'cart_search',
    description: 'Search live golf cart listings for sale by make, model, year, price range, or keyword. Same data source as the /cart-search page.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Make, model, year, or keyword, e.g. "EZGO RXV", "lifted Club Car"' },
        max_price: { type: 'number', description: 'Maximum price in USD' },
        location: { type: 'string', description: 'City or zip code' },
      },
      required: ['query'],
    },
  },
  {
    name: 'events_lookup',
    description: 'Find upcoming golf cart events — cart meets, shows, parades, poker runs, club events — near the user. Same data source as the /events page.',
    input_schema: {
      type: 'object',
      properties: {
        location: { type: 'string', description: 'City and state, or zip code' },
        event_type: { type: 'string', description: 'cart meet, show, parade, poker run, drag race, club event, any' },
        date_range: { type: 'string', description: 'e.g. this weekend, next 30 days' },
      },
      required: ['location'],
    },
  },
]

/* Same vendor data as /vendors */
const VENDORS = [
  { name:'Golf Cart Parts Nation', cat:'Batteries', rating:4.9, location:'National', desc:'The largest golf cart parts supplier with 50,000+ parts in stock. Fast shipping on batteries, motors, controllers.', website:'https://www.golfcartpartsnation.com', specialties:['OEM Parts','Aftermarket','Batteries'] },
  { name:'Buggies Unlimited', cat:'Custom Builds', rating:4.8, location:'National', desc:'Leading golf cart accessories and performance parts. Specializes in lifted carts and custom accessories.', website:'https://www.buggiesunlimited.com', specialties:['Lift Kits','Accessories','Custom'] },
  { name:'RHOX Golf Cart Parts', cat:'Body Kits', rating:4.7, location:'National', desc:'Premium OEM and aftermarket parts for Club Car, EZGO, and Yamaha. Known for quality body panels and accessories.', website:'https://www.rhox.com', specialties:['Body Kits','OEM','Accessories'] },
  { name:'Golf Cart Tire Supply', cat:'Wheels & Tires', rating:4.8, location:'National', desc:'The largest selection of golf cart tires and wheels. Ships within 24 hours with free shipping on most orders.', website:'https://www.golfcarttiresupply.com', specialties:['Tires','Wheels','Lifted'] },
  { name:'BatteryPete', cat:'Batteries', rating:4.9, location:'National', desc:'Lithium and lead acid golf cart battery specialist. Factory direct pricing on Trojan, US Battery, and lithium packs.', website:'https://www.batterypete.com', specialties:['Lithium','Lead Acid','Install'] },
  { name:'Golf Cart Garage', cat:'Custom Builds', rating:4.7, location:'National', desc:'Custom golf cart build shop specializing in LSV conversions and street legal upgrades.', website:'https://www.golfcartgarage.com', specialties:['LSV','Custom Build','Street Legal'] },
  { name:'10L0L', cat:'Electronics', rating:4.6, location:'National', desc:'Golf cart accessories and electronics — LED lighting, stereos, dashboards, and custom accessories.', website:'https://www.10l0l.com', specialties:['LED Lights','Stereo','Accessories'] },
  { name:'Cart Parts', cat:'Dealers', rating:4.7, location:'National', desc:'OEM and aftermarket parts for all major golf cart brands. Fast fulfillment with dealer pricing.', website:'https://www.cartparts.com', specialties:['OEM','Dealer Parts','Fast Ship'] },
  { name:'Golf Cart World', cat:'Dealers', rating:4.5, location:'National', desc:'Complete golf cart sales, service, and parts. New and used inventory plus extensive parts catalog.', website:'https://www.golfcartworld.com', specialties:['Sales','Service','Parts'] },
  { name:'Peachtree City Golf Carts', cat:'Dealers', rating:4.9, location:'Peachtree City GA', desc:'Premier Club Car and EZGO dealer in the golf cart capital of the world.', website:'https://www.peachtreecitygolfcarts.com', specialties:['Club Car','EZGO','Custom'] },
]

const CART_MAKES = ['club car', 'ezgo', 'e-z-go', 'yamaha', 'icon', 'evolution', 'advanced ev', 'star', 'tomberlin', 'bintelli', 'denago', 'madjax']

function parseCart(s: string): { year: string; make: string; model: string; voltage: string } {
  const raw = (s ?? '').toLowerCase()
  const year = raw.match(/\b(19|20)\d{2}\b/)?.[0] ?? ''
  const voltage = raw.match(/\b(36|48|72)\s*v\b/)?.[1] ?? ''
  let make = '', model = ''
  for (const m of CART_MAKES) {
    if (raw.includes(m)) {
      make = m === 'e-z-go' ? 'EZGO' : m.replace(/\b\w/g, c => c.toUpperCase())
      const after = raw.split(m)[1] ?? ''
      model = after.replace(/\b(19|20)\d{2}\b/, '').replace(/\b(36|48|72)\s*v\b/, '').trim().split(/\s+/).slice(0, 2).join(' ')
      break
    }
  }
  return { year, make, model, voltage }
}

function parseLocation(s: string): { city: string; state: string; zip: string; raw: string } {
  const raw = (s ?? '').trim()
  if (/^\d{5}$/.test(raw)) return { city: '', state: '', zip: raw, raw }
  const m = raw.match(/^(.*?)[,\s]+([A-Za-z]{2})(?:\s+\d{5})?$/)
  if (m && m[1].trim()) return { city: m[1].trim(), state: m[2].toUpperCase(), zip: (raw.match(/\d{5}/) ?? [''])[0], raw }
  return { city: raw, state: '', zip: '', raw }
}

const qs = (o: Record<string, string | undefined>) => {
  const p = new URLSearchParams()
  for (const [k, v] of Object.entries(o)) if (v) p.set(k, v)
  return p.toString()
}

async function getJSON(url: string, timeoutMs = 30000): Promise<any> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) })
    if (!res.ok) return null
    return await res.json()
  } catch { return null }
}

async function execTool(name: string, args: any, origin: string): Promise<string> {
  const a = args ?? {}
  try {
    switch (name) {
      case 'parts_search': {
        const pc = parseCart(a.cart ?? '')
        const data = await getJSON(`${origin}/api/parts-search?${qs({ query: a.query, category: a.category, year: pc.year, make: pc.make, model: pc.model, voltage: pc.voltage })}`, 35000)
        const parts: any[] = data?.parts ?? []
        if (parts.length) return JSON.stringify(parts.slice(0, 8))
        return `No catalog results. Recommend these retailer searches instead: Buggies Unlimited https://www.buggiesunlimited.com/catalogsearch/result/?q=${encodeURIComponent(a.query)} ; Golf Cart Parts Nation https://www.golfcartpartsnation.com/search?q=${encodeURIComponent(a.query)} ; Amazon https://www.amazon.com/s?k=${encodeURIComponent('golf cart ' + a.query)}`
      }
      case 'vendor_lookup': {
        const q = (a.service_type ?? '').toLowerCase()
        const tokens = q.split(/[\s,/]+/).filter((t: string) => t.length > 2)
        let items = VENDORS.filter(v => {
          const hay = `${v.name} ${v.cat} ${v.desc} ${v.specialties.join(' ')}`.toLowerCase()
          return tokens.some((t: string) => hay.includes(t))
        })
        if (!items.length) items = VENDORS.slice(0, 6)
        return JSON.stringify(items.slice(0, 6))
      }
      case 'cart_search': {
        const pc = parseCart(a.query ?? '')
        const loc = parseLocation(a.location ?? '')
        const priceMax = a.max_price ? String(Math.round(Number(a.max_price))) : ''
        const data = await getJSON(`${origin}/api/cart-search?${qs({ make: pc.make, model: pc.model, price_max: priceMax, zip: loc.zip })}`)
        const items: any[] = data?.items ?? []
        if (items.length) return JSON.stringify(items.slice(0, 8).map((i: any) => ({ title: i.title, price: i.price, condition: i.condition, location: i.location, url: i.url })))
        const kw = encodeURIComponent(`${a.query} golf cart`)
        return `Live feed returned nothing. Recommend these live marketplace searches (present as links): eBay https://www.ebay.com/sch/47254/i.html?_nkw=${kw}${priceMax ? `&_udhi=${priceMax}` : ''} ; Facebook Marketplace https://www.facebook.com/marketplace/search/?query=${kw} ; GolfCartResource https://www.golfcartresource.com/carts-for-sale ; Craigslist https://www.craigslist.org/search/sss?query=${kw}`
      }
      case 'events_lookup': {
        const loc = parseLocation(a.location ?? '')
        if (!loc.city && !loc.zip) return `Could not resolve "${a.location}" — ask the user for a city + state or zip.`
        const et = (a.event_type ?? 'any').toLowerCase()
        const type = et.includes('meet') ? 'cart_meet' : et.includes('show') ? 'cart_show' : et.includes('parade') || et.includes('cruise') ? 'parade_cruise' : et.includes('poker') ? 'poker_run' : et.includes('drag') ? 'drag_race' : et.includes('club') ? 'club_event' : 'all'
        const data = await getJSON(`${origin}/api/events-search?${qs({ city: loc.city, state: loc.state, zip: loc.zip, event_type: type })}`, 35000)
        const events: any[] = data?.events ?? []
        if (!events.length) return `No events found near ${loc.raw}.`
        return JSON.stringify(events.slice(0, 8)) + (a.date_range ? ` (user asked for: ${a.date_range} — filter recommendations accordingly)` : '')
      }
      default:
        return `Unknown tool ${name}`
    }
  } catch (e: any) {
    return `Tool ${name} failed: ${e?.message ?? 'error'}`
  }
}

export async function POST(req: NextRequest) {
  const { messages, cartContext } = await req.json()

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Anthropic API key not configured.' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  }

  const origin = new URL(req.url).origin

  let systemPrompt = `You are the RedLineConnect-1 AI — a 30-year master golf cart technician and cart culture expert with live access to the entire RedLineConnect-1 platform. You specialize in Club Car, EZGO, and Yamaha — gas and electric — including 36V/48V/72V battery systems, motor controllers (Curtis, Alltrax, Navitas), lift kits, LSV conversions, and custom builds. You can search golf cart parts with pricing from major retailers, find vendors and build shops, search live cart listings for sale, and surface upcoming cart meets and events. You also have live web search for anything else. When a user asks a question, proactively search for live results across whatever platform features are relevant and include specific recommendations, prices, and links in your response. You can run multiple searches in a single response. Never tell the user you can't look something up. Always be direct, knowledgeable, and enthusiast-friendly. Include part numbers when known and mention safety precautions for electrical work.`

  if (cartContext) systemPrompt += `\n\nThe user's current cart: ${cartContext}`

  const convo: any[] = messages.map((m: { role: string; content: string }) => ({ role: m.role, content: m.content }))
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: any) => {
        const body = typeof payload === 'string' ? payload : JSON.stringify(payload)
        controller.enqueue(encoder.encode(`data: ${body}\n\n`))
      }
      const sendText = (text: string) => send({ choices: [{ delta: { content: text } }] })

      try {
        for (let round = 0; round < 5; round++) {
          const res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
            body: JSON.stringify({
              model: 'claude-sonnet-4-5',
              max_tokens: 1600,
              system: systemPrompt,
              messages: convo,
              tools: TOOLS,
              stream: true,
            }),
          })

          if (!res.ok || !res.body) {
            const err = await res.text().catch(() => '')
            sendText(`\n[!] AI service error (${res.status}). ${err.slice(0, 160)}`)
            break
          }

          const reader = res.body.getReader()
          const decoder = new TextDecoder()
          let buf = ''
          let stopReason: string | null = null
          const blocks: any[] = []

          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            buf += decoder.decode(value, { stream: true })
            const lines = buf.split('\n')
            buf = lines.pop() ?? ''
            for (const line of lines) {
              if (!line.startsWith('data: ')) continue
              const data = line.slice(6).trim()
              if (!data) continue
              let ev: any
              try { ev = JSON.parse(data) } catch { continue }

              if (ev.type === 'content_block_start') {
                const cb = ev.content_block
                if (cb.type === 'tool_use') blocks[ev.index] = { type: 'tool_use', id: cb.id, name: cb.name, _json: '' }
                else if (cb.type === 'text') blocks[ev.index] = { type: 'text', text: '' }
                else blocks[ev.index] = { type: cb.type, _skip: true }
              } else if (ev.type === 'content_block_delta') {
                const d = ev.delta
                const blk = blocks[ev.index]
                if (d.type === 'text_delta') {
                  if (blk && blk.type === 'text') blk.text += d.text
                  send({ choices: [{ delta: { content: d.text } }] })
                } else if (d.type === 'input_json_delta' && blk && blk.type === 'tool_use') {
                  blk._json += d.partial_json
                }
              } else if (ev.type === 'message_delta') {
                if (ev.delta?.stop_reason) stopReason = ev.delta.stop_reason
              }
            }
          }

          const toolUses = blocks.filter(b => b && b.type === 'tool_use')
          if (stopReason !== 'tool_use' || toolUses.length === 0) break

          const assistantContent: any[] = []
          for (const b of blocks) {
            if (!b || b._skip) continue
            if (b.type === 'text' && b.text) assistantContent.push({ type: 'text', text: b.text })
            if (b.type === 'tool_use') {
              let input: any = {}
              try { input = JSON.parse(b._json || '{}') } catch {}
              b._input = input
              assistantContent.push({ type: 'tool_use', id: b.id, name: b.name, input })
            }
          }
          convo.push({ role: 'assistant', content: assistantContent })

          const results = await Promise.all(toolUses.map(async (tu) => ({ tu, out: await execTool(tu.name, tu._input ?? {}, origin) })))
          convo.push({ role: 'user', content: results.map(({ tu, out }) => ({ type: 'tool_result', tool_use_id: tu.id, content: out })) })
        }
      } catch {
        sendText('\n[!] Connection issue - please try again.')
      }

      send('[DONE]')
      controller.close()
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' },
  })
}
