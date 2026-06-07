'use client'

import { useState } from 'react'

const MAKES = ['Club Car','EZGO','Yamaha','Cushman','Star EV','Advanced EV','Icon EV','Tomberlin','Bintelli','Evolution','Garia','Polaris GEM','Other']
const YEARS = Array.from({length:46}, (_,i) => String(2025-i))
const CART_TYPES_PT = ['Electric','Gas']
const VOLTAGES = ['36V','48V','72V','Other']

const PART_CATS = [
  { value:'motor_controller',   label:'Motor & Controller (Electric)', emoji:'⚡' },
  { value:'engine_drivetrain',  label:'Engine & Drivetrain (Gas)',     emoji:'🔧' },
  { value:'batteries_charging', label:'Batteries & Charging',          emoji:'🔋' },
  { value:'lift_suspension',    label:'Lift Kits & Suspension',        emoji:'⬆️' },
  { value:'wheels_tires',       label:'Wheels & Tires',                emoji:'🛞' },
  { value:'body_accessories',   label:'Body & Accessories',            emoji:'🏎️' },
  { value:'seats_upholstery',   label:'Seats & Upholstery',            emoji:'💺' },
  { value:'lighting_electrical',label:'Lighting & Electrical',         emoji:'💡' },
  { value:'windshields',        label:'Windshields & Enclosures',      emoji:'🪟' },
  { value:'stereo',             label:'Stereo & Entertainment',        emoji:'🔊' },
  { value:'performance',        label:'Performance Upgrades',          emoji:'🚀' },
  { value:'brakes',             label:'Brakes',                        emoji:'🛑' },
  { value:'steering',           label:'Steering',                      emoji:'🎯' },
  { value:'cargo_storage',      label:'Cargo & Storage',               emoji:'📦' },
  { value:'safety_mirrors',     label:'Safety & Mirrors',              emoji:'🪞' },
]

const SUPPLIERS = [
  { name:'Golf Cart Parts Nation', emoji:'🏌️', url:'https://www.golfcartpartsnation.com',       desc:'Huge parts catalog' },
  { name:'RHOX Golf Cart Parts',   emoji:'⚙️', url:'https://www.rhox.com',                      desc:'OEM & aftermarket' },
  { name:'Buggies Unlimited',      emoji:'🛒', url:'https://www.buggiesunlimited.com',           desc:'10K+ parts in stock' },
  { name:'Golf Cart Tire Supply',  emoji:'🛞', url:'https://www.golfcarttiresupply.com',         desc:'Tires & wheels' },
  { name:'Cart Parts',             emoji:'🔩', url:'https://www.cartparts.com',                  desc:'OEM parts' },
  { name:'Golf Cart Garage',       emoji:'🏠', url:'https://www.golfcartgarage.com',             desc:'Accessories & parts' },
  { name:'10L0L',                  emoji:'⭐', url:'https://www.10l0l.com',                      desc:'Accessories & parts' },
  { name:'Golf Cart World',        emoji:'🌍', url:'https://www.golfcartworld.com',              desc:'Parts & accessories' },
  { name:'Amazon Golf Cart Parts', emoji:'📦', url:'https://www.amazon.com/s?k=golf+cart+parts',desc:'Prime shipping' },
  { name:'eBay Golf Cart Parts',   emoji:'🏷️', url:'https://www.ebay.com/b/Golf-Cart-Parts-Accessories/66471/bn_2312564',desc:'eBay listings' },
]

const inp: React.CSSProperties = { background:'rgba(255,255,255,0.06)', border:'1px solid rgba(230,57,70,0.15)', borderRadius:'0.5rem', color:'white', padding:'0.6rem 0.875rem', fontSize:'0.875rem', outline:'none', width:'100%', boxSizing:'border-box' }
const lbl: React.CSSProperties = { fontSize:'0.65rem', color:'rgba(255,255,255,0.4)', display:'block', marginBottom:'0.3rem', textTransform:'uppercase', letterSpacing:'0.5px' }

export default function PartsPage() {
  const [make, setMake] = useState('Club Car')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('2020')
  const [cartType, setCartType] = useState('Electric')
  const [voltage, setVoltage] = useState('48V')
  const [category, setCategory] = useState(PART_CATS[0].value)
  const [partQuery, setPartQuery] = useState('')
  const [parts, setParts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch() {
    setLoading(true); setError(''); setParts([])
    try {
      const params = new URLSearchParams({ make, model, year, cart_type: cartType, voltage, category, query: partQuery })
      const res = await fetch(`/api/parts-search?${params}`)
      const data = await res.json()
      if (data.error && !data.parts) setError(data.error)
      else setParts(data.parts ?? [])
    } catch { setError('Search failed. Please try again.') }
    setLoading(false); setSearched(true)
  }

  const categoryLabel = PART_CATS.find(c => c.value === category)

  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto', color:'white' }}>
      <h1 style={{ fontSize:'2rem', fontWeight:900, marginBottom:'0.4rem' }}>🔩 Golf Cart Parts Search</h1>
      <p style={{ color:'rgba(255,255,255,0.4)', marginBottom:'1.75rem', fontSize:'0.9rem' }}>AI-powered parts search for every make and model — with prices and fitment</p>

      {/* Search Form */}
      <div style={{ background:'#1A2940', borderRadius:'1.25rem', padding:'1.5rem', marginBottom:'1.75rem', border:'1px solid rgba(230,57,70,0.1)' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px,1fr))', gap:'0.875rem', marginBottom:'1.1rem' }}>
          <div>
            <label style={lbl}>Make *</label>
            <select style={inp} value={make} onChange={e => setMake(e.target.value)}>
              {MAKES.map(m => <option key={m} value={m} style={{background:'#1A2940'}}>{m}</option>)}
            </select>
          </div>
          <div><label style={lbl}>Model</label><input style={inp} placeholder="DS, TXT, G29…" value={model} onChange={e => setModel(e.target.value)} /></div>
          <div>
            <label style={lbl}>Year</label>
            <select style={inp} value={year} onChange={e => setYear(e.target.value)}>
              {YEARS.map(y => <option key={y} value={y} style={{background:'#1A2940'}}>{y}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Type</label>
            <select style={inp} value={cartType} onChange={e => setCartType(e.target.value)}>
              {CART_TYPES_PT.map(t => <option key={t} value={t} style={{background:'#1A2940'}}>{t}</option>)}
            </select>
          </div>
          {cartType === 'Electric' && (
            <div>
              <label style={lbl}>Voltage</label>
              <select style={inp} value={voltage} onChange={e => setVoltage(e.target.value)}>
                {VOLTAGES.map(v => <option key={v} value={v} style={{background:'#1A2940'}}>{v}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Category chips */}
        <p style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.4)', marginBottom:'0.625rem', textTransform:'uppercase', letterSpacing:'0.5px' }}>Part Category</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginBottom:'1rem' }}>
          {PART_CATS.map(c => (
            <button key={c.value} onClick={() => setCategory(c.value)}
              style={{ background: category === c.value ? 'rgba(230,57,70,0.2)':'rgba(255,255,255,0.04)', border:`1px solid ${category === c.value ? 'rgba(230,57,70,0.5)':'rgba(255,255,255,0.08)'}`, color: category === c.value ? '#E63946':'rgba(255,255,255,0.5)', padding:'0.4rem 0.875rem', borderRadius:'9999px', fontSize:'0.8rem', cursor:'pointer', fontWeight: category === c.value ? 700:400 }}>
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        <div style={{ display:'flex', gap:'0.875rem', alignItems:'flex-end', flexWrap:'wrap' }}>
          <div style={{ flex:1, minWidth:'200px' }}>
            <label style={lbl}>Specific Part (Optional)</label>
            <input style={inp} placeholder="e.g. speed chip, lithium battery, 6 inch lift kit…" value={partQuery} onChange={e => setPartQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
          </div>
          <button onClick={handleSearch} disabled={loading} style={{ background: loading ? 'rgba(230,57,70,0.5)':'linear-gradient(135deg,#E63946,#C42B37)', color:'white', border:'none', borderRadius:'0.875rem', padding:'0.8rem 2rem', fontWeight:700, fontSize:'1rem', cursor: loading ? 'not-allowed':'pointer', whiteSpace:'nowrap' }}>
            {loading ? '⏳ Searching…' : '🔩 Find Parts'}
          </button>
        </div>
      </div>

      {error && <div style={{ background:'rgba(230,57,70,0.1)', border:'1px solid rgba(230,57,70,0.3)', borderRadius:'0.875rem', padding:'1rem', marginBottom:'1.5rem', color:'#E63946' }}>⚠️ {error}</div>}

      {/* Results */}
      {searched && !loading && parts.length > 0 && (
        <div style={{ marginBottom:'2.5rem' }}>
          <h2 style={{ fontWeight:800, fontSize:'1.1rem', marginBottom:'1rem' }}>
            {parts.length} {categoryLabel?.label} Parts for {year} {make} {model}
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:'1.1rem' }}>
            {parts.map((p, i) => (
              <div key={i} style={{ background:'#1A2940', borderRadius:'1rem', padding:'1.25rem', border:'1px solid rgba(230,57,70,0.1)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.5rem' }}>
                  <h3 style={{ fontWeight:800, fontSize:'0.95rem', flex:1, lineHeight:1.3 }}>{p.name}</h3>
                  {p.price && <span style={{ color:'#2DC653', fontWeight:800, fontSize:'1rem', flexShrink:0, marginLeft:'0.5rem' }}>{p.price}</span>}
                </div>
                {p.brand && <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.78rem', marginBottom:'0.3rem' }}>Brand: {p.brand}</p>}
                {p.part_number && <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.75rem', marginBottom:'0.5rem' }}>Part #: {p.part_number}</p>}
                {p.description && <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.8rem', lineHeight:1.5, marginBottom:'0.75rem' }}>{p.description}</p>}
                <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                  {p.compatibility && <span style={{ background:'rgba(45,198,83,0.1)', color:'#2DC653', border:'1px solid rgba(45,198,83,0.2)', borderRadius:'9999px', padding:'0.2rem 0.6rem', fontSize:'0.7rem', fontWeight:700 }}>✓ Fits your cart</span>}
                  {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ background:'rgba(230,57,70,0.15)', color:'#E63946', border:'1px solid rgba(230,57,70,0.25)', borderRadius:'9999px', padding:'0.2rem 0.6rem', fontSize:'0.7rem', fontWeight:700, textDecoration:'none' }}>Buy →</a>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {searched && !loading && parts.length === 0 && !error && (
        <div style={{ textAlign:'center', padding:'2rem', background:'rgba(255,255,255,0.02)', borderRadius:'1rem', border:'1px solid rgba(255,255,255,0.05)', marginBottom:'2rem' }}>
          <p style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>🔩</p>
          <p style={{ fontWeight:700, marginBottom:'0.5rem' }}>Search our supplier network below</p>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.875rem' }}>Click any supplier to search for your part directly</p>
        </div>
      )}

      {/* Supplier links */}
      <div>
        <h2 style={{ fontWeight:800, fontSize:'1.1rem', marginBottom:'0.4rem' }}>🏪 Supplier Network</h2>
        <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.78rem', marginBottom:'1rem' }}>Shop directly at these golf cart parts suppliers</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:'0.875rem' }}>
          {SUPPLIERS.map((s, i) => {
            const url = s.name === 'Amazon Golf Cart Parts' ? `https://www.amazon.com/s?k=golf+cart+parts+${encodeURIComponent(make)}+${encodeURIComponent(model)}` :
                        s.name === 'eBay Golf Cart Parts' ? `https://www.ebay.com/b/Golf-Cart-Parts-Accessories/66471/bn_2312564?_nkw=${encodeURIComponent(make+' '+model+' parts')}` : s.url
            return (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none' }}>
                <div style={{ background:'#1A2940', borderRadius:'1rem', padding:'1.1rem', border:'1px solid rgba(230,57,70,0.08)', cursor:'pointer', transition:'all 0.15s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(230,57,70,0.3)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(230,57,70,0.08)' }}>
                  <div style={{ fontSize:'1.5rem', marginBottom:'0.4rem' }}>{s.emoji}</div>
                  <p style={{ fontWeight:700, color:'white', fontSize:'0.9rem', margin:'0 0 0.2rem' }}>{s.name}</p>
                  <p style={{ color:'rgba(255,255,255,0.38)', fontSize:'0.75rem', margin:0 }}>{s.desc}</p>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
