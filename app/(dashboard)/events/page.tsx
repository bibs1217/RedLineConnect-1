'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']

const EVENT_TYPES = [
  { value:'all',       label:'All Events' },
  { value:'cart_meet', label:'Cart Meet' },
  { value:'cart_show', label:'Cart Show' },
  { value:'golf_tournament', label:'Golf Tournament' },
  { value:'parade_cruise', label:'Parade & Cruise' },
  { value:'poker_run', label:'Poker Run' },
  { value:'offroad',   label:'Off-Road Event' },
  { value:'drag_race', label:'Drag Race' },
  { value:'custom_show', label:'Custom Cart Show' },
  { value:'club_event', label:'Club Event' },
]

const TYPE_COLOR: Record<string, string> = {
  cart_meet:'#E63946', cart_show:'#FFB700', golf_tournament:'#2DC653',
  parade_cruise:'#3399FF', poker_run:'#E63946', offroad:'#2DC653',
  drag_race:'#E63946', custom_show:'#FFB700', club_event:'#3399FF', all:'#E63946',
}

const inp: React.CSSProperties = { background:'rgba(255,255,255,0.06)', border:'1px solid rgba(230,57,70,0.15)', borderRadius:'0.5rem', color:'white', padding:'0.65rem 0.9rem', fontSize:'0.9rem', outline:'none', width:'100%', boxSizing:'border-box' }
const lbl: React.CSSProperties = { fontSize:'0.65rem', color:'rgba(255,255,255,0.4)', display:'block', marginBottom:'0.3rem', textTransform:'uppercase', letterSpacing:'0.5px' }

function formatDate(d: string) {
  try { return new Date(d).toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric', year:'numeric' }) } catch { return d }
}

export default function EventsPage() {
  const [city, setCity] = useState('')
  const [stateVal, setStateVal] = useState('FL')
  const [zip, setZip] = useState('')
  const [radius, setRadius] = useState('50')
  const [eventType, setEventType] = useState('all')
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [seedEvents, setSeedEvents] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    supabase.from('cart_events').select('*').order('event_date', { ascending: true }).limit(20).then(({ data }) => setSeedEvents(data ?? []))
  }, [])

  async function handleSearch() {
    if (!city) { alert('Please enter a city.'); return }
    setLoading(true); setEvents([])
    try {
      const params = new URLSearchParams({ city, state: stateVal, zip, radius, event_type: eventType })
      const res = await fetch(`/api/events-search?${params}`)
      const data = await res.json()
      setEvents(data.events ?? [])
    } catch { setEvents([]) }
    setLoading(false); setSearched(true)
  }

  const typeLabel = EVENT_TYPES.find(t => t.value === eventType)?.label ?? 'Events'
  const platforms = [
    { name:'Eventbrite',       emoji:'🎫', url:`https://www.eventbrite.com/d/${stateVal.toLowerCase()}--${encodeURIComponent(city)}/golf-cart/`,                  desc:'Golf cart events near you' },
    { name:'Facebook Events',  emoji:'📘', url:`https://www.facebook.com/events/search?q=golf+cart+${encodeURIComponent(city)}`,                                   desc:'Local Facebook events' },
    { name:'NGCA Events',      emoji:'🏌️', url:'https://www.nationalgolfcartassociation.com/events',                                                              desc:'National Golf Cart Assoc.' },
    { name:'Meetup',           emoji:'👥', url:`https://www.meetup.com/find/?keywords=golf+cart&location=${encodeURIComponent(city+', '+stateVal)}`,               desc:'Golf cart meetup groups' },
  ]

  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto', color:'white' }}>
      <h1 style={{ fontSize:'2rem', fontWeight:900, marginBottom:'0.4rem' }}>📍 Golf Cart Events</h1>
      <p style={{ color:'rgba(255,255,255,0.4)', marginBottom:'1.75rem', fontSize:'0.9rem' }}>Find cart meets, shows, parades, and poker runs near you</p>

      {/* Search form */}
      <div style={{ background:'#1A2940', borderRadius:'1.25rem', padding:'1.5rem', marginBottom:'1.75rem', border:'1px solid rgba(230,57,70,0.1)' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px,1fr))', gap:'0.875rem', marginBottom:'1.1rem' }}>
          <div style={{ gridColumn:'span 2', minWidth:'150px' }}>
            <label style={lbl}>City *</label>
            <input style={inp} placeholder="Clearwater" value={city} onChange={e => setCity(e.target.value)} onKeyDown={e => e.key==='Enter' && handleSearch()} />
          </div>
          <div>
            <label style={lbl}>State</label>
            <select style={inp} value={stateVal} onChange={e => setStateVal(e.target.value)}>
              {US_STATES.map(s => <option key={s} value={s} style={{background:'#1A2940'}}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>ZIP</label>
            <input style={inp} placeholder="34698" value={zip} maxLength={5} onChange={e => setZip(e.target.value.replace(/\D/g,''))} />
          </div>
          <div>
            <label style={lbl}>Radius</label>
            <select style={inp} value={radius} onChange={e => setRadius(e.target.value)}>
              {['25','50','100','200','500'].map(r => <option key={r} value={r} style={{background:'#1A2940'}}>{r} miles</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Event Type</label>
            <select style={inp} value={eventType} onChange={e => setEventType(e.target.value)}>
              {EVENT_TYPES.map(t => <option key={t.value} value={t.value} style={{background:'#1A2940'}}>{t.label}</option>)}
            </select>
          </div>
        </div>
        <button onClick={handleSearch} disabled={loading} style={{ background: loading ? 'rgba(230,57,70,0.5)':'linear-gradient(135deg,#E63946,#C42B37)', color:'white', border:'none', borderRadius:'0.875rem', padding:'0.8rem 2.5rem', fontWeight:700, fontSize:'1rem', cursor: loading ? 'not-allowed':'pointer' }}>
          {loading ? '🔍 Searching…' : '📍 Find Events'}
        </button>
      </div>

      {/* AI results */}
      {searched && !loading && (
        <div style={{ marginBottom:'2rem' }}>
          <h2 style={{ fontWeight:800, fontSize:'1.1rem', marginBottom:'1rem' }}>
            {events.length > 0 ? `${events.length} events near ${city}, ${stateVal}` : `No AI results for ${city} — check the platforms below`}
          </h2>
          {events.length > 0 && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:'1.1rem', marginBottom:'1.5rem' }}>
              {events.map((ev, i) => {
                const color = TYPE_COLOR[ev.type ?? 'all'] ?? '#E63946'
                return (
                  <div key={i} style={{ background:'#1A2940', borderRadius:'1rem', padding:'1.25rem', border:`1px solid ${color}22` }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.5rem' }}>
                      <h3 style={{ fontWeight:800, fontSize:'0.95rem', flex:1, lineHeight:1.3 }}>{ev.name}</h3>
                      <span style={{ background:`${color}18`, color, fontSize:'0.65rem', fontWeight:700, padding:'0.2rem 0.5rem', borderRadius:'9999px', border:`1px solid ${color}33`, flexShrink:0, marginLeft:'0.5rem' }}>{ev.type?.replace('_',' ')}</span>
                    </div>
                    {ev.date && <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.8rem', marginBottom:'0.3rem' }}>📅 {ev.date}</p>}
                    {ev.location && <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.8rem', marginBottom:'0.3rem' }}>📍 {ev.location}</p>}
                    {ev.description && <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.78rem', lineHeight:1.5, marginTop:'0.5rem' }}>{ev.description}</p>}
                    {ev.url && <a href={ev.url} target="_blank" rel="noopener noreferrer" style={{ display:'block', marginTop:'0.75rem', background:`linear-gradient(135deg,${color},${color}CC)`, color:'white', padding:'0.5rem', borderRadius:'0.5rem', textAlign:'center', fontWeight:700, fontSize:'0.8rem', textDecoration:'none' }}>More Info →</a>}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Platform links */}
      <div style={{ marginBottom:'2.5rem' }}>
        <h2 style={{ fontWeight:800, fontSize:'1.1rem', marginBottom:'0.4rem' }}>🌐 Search These Platforms</h2>
        <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.78rem', marginBottom:'1rem' }}>
          {city ? `Pre-filled for ${city}, ${stateVal}` : 'Enter your city above then click to search'}
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:'0.875rem' }}>
          {platforms.map((p, i) => (
            <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none' }}>
              <div style={{ background:'#1A2940', borderRadius:'1rem', padding:'1.1rem', border:'1px solid rgba(230,57,70,0.08)', cursor:'pointer' }}>
                <div style={{ fontSize:'1.5rem', marginBottom:'0.4rem' }}>{p.emoji}</div>
                <p style={{ fontWeight:700, color:'white', fontSize:'0.9rem', margin:'0 0 0.2rem' }}>{p.name}</p>
                <p style={{ color:'rgba(255,255,255,0.38)', fontSize:'0.75rem', margin:0 }}>{p.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Upcoming events from DB */}
      {seedEvents.length > 0 && (
        <div>
          <h2 style={{ fontWeight:800, fontSize:'1.1rem', marginBottom:'1rem' }}>🗓️ Upcoming Golf Cart Events</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:'1rem' }}>
            {seedEvents.map((ev, i) => {
              const color = TYPE_COLOR[ev.event_type ?? 'all'] ?? '#E63946'
              return (
                <div key={i} style={{ background:'#1A2940', borderRadius:'1rem', padding:'1.25rem', border:`1px solid ${color}22` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.5rem' }}>
                    <h3 style={{ fontWeight:800, fontSize:'0.95rem', flex:1, lineHeight:1.3 }}>{ev.name}</h3>
                    {ev.event_type && <span style={{ background:`${color}18`, color, fontSize:'0.65rem', fontWeight:700, padding:'0.2rem 0.5rem', borderRadius:'9999px', border:`1px solid ${color}33`, flexShrink:0, marginLeft:'0.5rem' }}>{ev.event_type.replace(/_/g,' ')}</span>}
                  </div>
                  {ev.event_date && <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.8rem', marginBottom:'0.3rem' }}>📅 {formatDate(ev.event_date)}</p>}
                  {ev.location && <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.8rem', marginBottom:'0.3rem' }}>📍 {ev.location}</p>}
                  {ev.city && ev.state && <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.78rem' }}>{ev.city}, {ev.state}</p>}
                  {ev.description && <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.78rem', lineHeight:1.5, marginTop:'0.5rem' }}>{ev.description}</p>}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
