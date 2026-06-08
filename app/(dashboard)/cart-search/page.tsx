'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'

const MAKES = ['Any','Club Car','EZGO','Yamaha','Cushman','Star EV','Advanced EV','Icon EV','Tomberlin','Bintelli','Evolution','Garia','Textron','Polaris GEM','Taylor-Dunn','Columbia','Other']
const CONDITIONS = ['All','New','Used','Refurbished','Custom Build']
const CART_TYPES = ['All','Gas','Electric','Solar','Lifted','Street Legal LSV','Off-Road','Luxury']
const SEATS = ['Any','2','4','6','8+']
const YEARS = Array.from({length:46}, (_,i) => String(2025 - i))
const RADII = ['10','25','50','100','250','Nationwide']

const inp: React.CSSProperties = { background:'rgba(255,255,255,0.06)', border:'1px solid rgba(230,57,70,0.15)', borderRadius:'0.5rem', color:'white', padding:'0.6rem 0.875rem', fontSize:'0.875rem', outline:'none', width:'100%', boxSizing:'border-box' }
const lbl: React.CSSProperties = { fontSize:'0.65rem', color:'rgba(255,255,255,0.4)', display:'block', marginBottom:'0.3rem', textTransform:'uppercase', letterSpacing:'0.5px' }

function buildPlatformLinks(state: {make:string;model:string;yearMin:string;yearMax:string;priceMin:string;priceMax:string;zip:string;radius:string}) {
  const { make, model, yearMin, yearMax, priceMin, priceMax, zip, radius } = state
  const m = make === 'Any' ? '' : make
  return [
    { name:'Golf Cart Resource',   emoji:'🏌️', url:`https://www.golfcartresource.com/listings/?make=${encodeURIComponent(m)}&model=${encodeURIComponent(model)}&year_min=${yearMin}&year_max=${yearMax}&price_max=${priceMax}&zip=${zip}`, desc:'Golf cart classifieds' },
    { name:'Golf Cart Trader',     emoji:'🛒', url:`https://www.golfcarttrader.com/listings/?make=${encodeURIComponent(m)}&price_max=${priceMax}&zip=${zip}`, desc:'Trader listings' },
    { name:'Cart Mart',            emoji:'🏪', url:`https://www.cartmart.com/used-golf-carts/?zip=${zip}`, desc:'Used cart dealer' },
    { name:'eBay Golf Carts',      emoji:'🏷️', url:`https://www.ebay.com/b/Golf-Carts/47254/bn_2312462?_sop=15&LH_ItemCondition=3000&_udhi=${priceMax || 50000}`, desc:'eBay Motors' },
    { name:'Facebook Marketplace', emoji:'📘', url:`https://www.facebook.com/marketplace/vehicles/golfcarts/?minPrice=${priceMin}&maxPrice=${priceMax}&zip=${zip}`, desc:'Local listings' },
    { name:'Craigslist',           emoji:'📋', url:`https://www.craigslist.org/search/sss?query=golf+cart+${encodeURIComponent(m+' '+model)}&min_price=${priceMin}&max_price=${priceMax}&postal=${zip}&search_distance=${radius === 'Nationwide' ? '500':radius}`, desc:'Craigslist' },
    { name:'Golf Cart King',       emoji:'👑', url:`https://www.golfcartking.com/pages/used-golf-carts?zip=${zip}`, desc:'Dealer inventory' },
    { name:'Used Golf Carts',      emoji:'♻️', url:`https://www.usedgolfcarts.org/?make=${encodeURIComponent(m)}&zip=${zip}&price_max=${priceMax}`, desc:'Used inventory' },
    { name:'Golf Cart Depot',      emoji:'🏬', url:`https://www.golfcartdepot.com/used/?zip=${zip}`, desc:'Depot listings' },
    { name:'Club Car Dealers',     emoji:'🅱️', url:`https://www.clubcar.com/us/en/consumer/find-a-dealer.html?zip=${zip}`, desc:'Official dealers' },
    { name:'EZGO Dealers',         emoji:'🅴', url:`https://www.ezgo.com/dealer-locator/?zip=${zip}`, desc:'Official dealers' },
    { name:'Yamaha Dealers',       emoji:'🎸', url:`https://www.yamahacommercialproducts.com/dealer-locator?zip=${zip}`, desc:'Official dealers' },
  ]
}

export default function CartSearchPage() {
  const [make, setMake] = useState('Any')
  const [model, setModel] = useState('')
  const [yearMin, setYearMin] = useState('2000')
  const [yearMax, setYearMax] = useState('2025')
  const [condition, setCondition] = useState('All')
  const [cartType, setCartType] = useState('All')
  const [seats, setSeats] = useState('Any')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [zip, setZip] = useState('')
  const [radius, setRadius] = useState('50')
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  const state = { make, model, yearMin, yearMax, priceMin, priceMax, zip, radius }
  const platforms = buildPlatformLinks(state)

  async function handleSearch() {
    setLoading(true); setError(''); setListings([])
    try {
      const params = new URLSearchParams({ make: make === 'Any' ? '' : make, model, yearMin, yearMax, condition, cartType, seats, priceMin, priceMax, zip, radius })
      const res = await fetch(`/api/cart-search?${params}`)
      const data = await res.json()
      if (data.error) setError(data.error)
      else setListings(data.listings ?? [])
    } catch { setError('Search failed. Please try again.') }
    setLoading(false); setSearched(true)
  }

  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto', color:'white' }}>
      <h1 style={{ fontSize:'2rem', fontWeight:900, marginBottom:'0.4rem' }}>🔍 Golf Cart Search</h1>
      <p style={{ color:'rgba(255,255,255,0.4)', marginBottom:'1.75rem', fontSize:'0.9rem' }}>Search every golf cart marketplace — eBay, dealers, classifieds, and more</p>

      {/* Filters */}
      <div style={{ background:'#1A2940', borderRadius:'1.25rem', padding:'1.5rem', marginBottom:'1.75rem', border:'1px solid rgba(230,57,70,0.1)' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px,1fr))', gap:'0.875rem', marginBottom:'1.1rem' }}>
          <div>
            <label style={lbl}>Make</label>
            <select style={inp} value={make} onChange={e => setMake(e.target.value)}>
              {MAKES.map(m => <option key={m} value={m} style={{background:'#1A2940'}}>{m}</option>)}
            </select>
          </div>
          <div><label style={lbl}>Model</label><input style={inp} placeholder="DS, TXT, G29…" value={model} onChange={e => setModel(e.target.value)} /></div>
          <div>
            <label style={lbl}>Year Min</label>
            <select style={inp} value={yearMin} onChange={e => setYearMin(e.target.value)}>
              {YEARS.map(y => <option key={y} value={y} style={{background:'#1A2940'}}>{y}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Year Max</label>
            <select style={inp} value={yearMax} onChange={e => setYearMax(e.target.value)}>
              {YEARS.map(y => <option key={y} value={y} style={{background:'#1A2940'}}>{y}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Condition</label>
            <select style={inp} value={condition} onChange={e => setCondition(e.target.value)}>
              {CONDITIONS.map(c => <option key={c} value={c} style={{background:'#1A2940'}}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Type</label>
            <select style={inp} value={cartType} onChange={e => setCartType(e.target.value)}>
              {CART_TYPES.map(t => <option key={t} value={t} style={{background:'#1A2940'}}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Seats</label>
            <select style={inp} value={seats} onChange={e => setSeats(e.target.value)}>
              {SEATS.map(s => <option key={s} value={s} style={{background:'#1A2940'}}>{s}</option>)}
            </select>
          </div>
          <div><label style={lbl}>Price Min</label><input style={inp} placeholder="$0" value={priceMin} onChange={e => setPriceMin(e.target.value.replace(/\D/g,''))} /></div>
          <div><label style={lbl}>Price Max</label><input style={inp} placeholder="$50,000" value={priceMax} onChange={e => setPriceMax(e.target.value.replace(/\D/g,''))} /></div>
          <div><label style={lbl}>ZIP Code</label><input style={inp} placeholder="34698" value={zip} maxLength={5} onChange={e => setZip(e.target.value.replace(/\D/g,''))} /></div>
          <div>
            <label style={lbl}>Radius</label>
            <select style={inp} value={radius} onChange={e => setRadius(e.target.value)}>
              {RADII.map(r => <option key={r} value={r} style={{background:'#1A2940'}}>{r === 'Nationwide' ? r : `${r} miles`}</option>)}
            </select>
          </div>
        </div>
        <button onClick={handleSearch} disabled={loading} style={{ background: loading ? 'rgba(230,57,70,0.5)':'linear-gradient(135deg,#E63946,#C42B37)', color:'white', border:'none', borderRadius:'0.875rem', padding:'0.8rem 2.5rem', fontWeight:700, fontSize:'1rem', cursor: loading ? 'not-allowed':'pointer', boxShadow: loading ? 'none':'0 4px 16px rgba(230,57,70,0.4)' }}>
          {loading ? '🔍 Searching…' : '🔍 Search Golf Carts'}
        </button>
      </div>

      {error && <div style={{ background:'rgba(230,57,70,0.1)', border:'1px solid rgba(230,57,70,0.3)', borderRadius:'0.875rem', padding:'1rem', marginBottom:'1.5rem', color:'#E63946' }}>⚠️ {error}</div>}

      {/* eBay results */}
      {searched && !loading && (
        <div style={{ marginBottom:'2rem' }}>
          <h2 style={{ fontWeight:800, fontSize:'1.1rem', marginBottom:'1rem' }}>
            {listings.length > 0 ? `${listings.length} eBay Listings` : 'No eBay results — try the platforms below'}
          </h2>
          {listings.length > 0 && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))', gap:'1.1rem', marginBottom:'1.5rem' }}>
              {listings.map((l, i) => (
                <div key={i} style={{ background:'#1A2940', borderRadius:'1rem', overflow:'hidden', border:'1px solid rgba(230,57,70,0.1)' }}>
                  {l.image && <img src={l.image} alt={l.title} style={{ width:'100%', height:'180px', objectFit:'cover' }} />}
                  <div style={{ padding:'1rem' }}>
                    <p style={{ fontWeight:700, fontSize:'0.9rem', marginBottom:'0.4rem', lineHeight:1.3 }}>{l.title}</p>
                    <p style={{ color:'#2DC653', fontWeight:800, fontSize:'1.1rem', marginBottom:'0.25rem' }}>{l.price}</p>
                    {l.location && <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.78rem', marginBottom:'0.5rem' }}>📍 {l.location}</p>}
                    {l.condition && <span style={{ background:'rgba(255,183,0,0.1)', color:'#FFB700', fontSize:'0.7rem', fontWeight:700, padding:'0.2rem 0.5rem', borderRadius:'9999px', border:'1px solid rgba(255,183,0,0.2)' }}>{l.condition}</span>}
                    <a href={l.url} target="_blank" rel="noopener noreferrer" style={{ display:'block', marginTop:'0.75rem', background:'linear-gradient(135deg,#E63946,#C42B37)', color:'white', padding:'0.55rem', borderRadius:'0.5rem', textAlign:'center', fontWeight:700, fontSize:'0.8rem' }}>
                      View on eBay →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Platform buttons */}
      <div style={{ marginBottom:'2rem' }}>
        <h2 style={{ fontWeight:800, fontSize:'1.1rem', marginBottom:'0.4rem' }}>🌐 Search These Platforms</h2>
        <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.78rem', marginBottom:'1rem' }}>
          {zip ? `Pre-filled for ZIP ${zip} — opens in a new tab` : 'Enter your ZIP above and click to search these platforms'}
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:'0.875rem' }}>
          {platforms.map((p, i) => (
            <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none' }}>
              <div style={{ background:'#1A2940', borderRadius:'1rem', padding:'1.1rem', border:'1px solid rgba(230,57,70,0.08)', cursor:'pointer', transition:'all 0.15s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(230,57,70,0.3)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(230,57,70,0.08)' }}>
                <div style={{ fontSize:'1.5rem', marginBottom:'0.4rem' }}>{p.emoji}</div>
                <p style={{ fontWeight:700, color:'white', fontSize:'0.9rem', margin:'0 0 0.2rem' }}>{p.name}</p>
                <p style={{ color:'rgba(255,255,255,0.38)', fontSize:'0.75rem', margin:0 }}>{p.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
