'use client'

import { useState } from 'react'

const VENDOR_CATS = ['All', 'Custom Builds', 'Lift Kits', 'Wheels & Tires', 'Batteries', 'Dealers', 'Electronics', 'Body Kits', 'Service & Repair']

const VENDORS = [
  { id:'1',  name:'Golf Cart Parts Nation',  cat:'Batteries',     rating:4.9, reviews:2840, location:'National',          desc:'The largest golf cart parts supplier with 50,000+ parts in stock. Fast shipping on batteries, motors, controllers.',        website:'https://www.golfcartpartsnation.com', specialties:['OEM Parts','Aftermarket','Batteries'] },
  { id:'2',  name:'Buggies Unlimited',       cat:'Custom Builds',  rating:4.8, reviews:3120, location:'National',          desc:'Leading golf cart accessories and performance parts. Specializes in lifted carts and custom accessories.',                 website:'https://www.buggiesunlimited.com',    specialties:['Lift Kits','Accessories','Custom'] },
  { id:'3',  name:'RHOX Golf Cart Parts',    cat:'Body Kits',      rating:4.7, reviews:1950, location:'National',          desc:'Premium OEM and aftermarket parts for Club Car, EZGO, and Yamaha. Known for quality body panels and accessories.',        website:'https://www.rhox.com',               specialties:['Body Kits','OEM','Accessories'] },
  { id:'4',  name:'Golf Cart Tire Supply',   cat:'Wheels & Tires', rating:4.8, reviews:2200, location:'National',          desc:'The largest selection of golf cart tires and wheels. Ships within 24 hours with free shipping on most orders.',            website:'https://www.golfcarttiresupply.com', specialties:['Tires','Wheels','Lifted'] },
  { id:'5',  name:'BatteryPete',             cat:'Batteries',      rating:4.9, reviews:4100, location:'National',          desc:'Lithium and lead acid golf cart battery specialist. Factory direct pricing on Trojan, US Battery, and lithium packs.',     website:'https://www.batterypete.com',        specialties:['Lithium','Lead Acid','Install'] },
  { id:'6',  name:'Golf Cart Garage',        cat:'Custom Builds',  rating:4.7, reviews:1680, location:'National',          desc:'Custom golf cart build shop specializing in LSV conversions and street legal upgrades.',                                    website:'https://www.golfcartgarage.com',     specialties:['LSV','Custom Build','Street Legal'] },
  { id:'7',  name:'10L0L',                   cat:'Electronics',    rating:4.6, reviews:3890, location:'National',          desc:'Golf cart accessories and electronics — LED lighting, stereos, dashboards, and custom accessories.',                        website:'https://www.10l0l.com',              specialties:['LED Lights','Stereo','Accessories'] },
  { id:'8',  name:'Cart Parts',              cat:'Dealers',        rating:4.7, reviews:1420, location:'National',          desc:'OEM and aftermarket parts for all major golf cart brands. Fast fulfillment with dealer pricing.',                           website:'https://www.cartparts.com',          specialties:['OEM','Dealer Parts','Fast Ship'] },
  { id:'9',  name:'Golf Cart World',         cat:'Dealers',        rating:4.5, reviews:980,  location:'National',          desc:'Complete golf cart sales, service, and parts. New and used inventory plus extensive parts catalog.',                        website:'https://www.golfcartworld.com',      specialties:['Sales','Service','Parts'] },
  { id:'10', name:'Peachtree City Golf Carts', cat:'Dealers',      rating:4.9, reviews:760,  location:'Peachtree City GA', desc:'Premier Club Car and EZGO dealer in the golf cart capital of the world — Peachtree City GA.',                               website:'https://www.peachtreecitygolfcarts.com', specialties:['Club Car','EZGO','Custom'] },
]

const inp: React.CSSProperties = { background:'rgba(255,255,255,0.06)', border:'1px solid rgba(230,57,70,0.15)', borderRadius:'0.5rem', color:'white', padding:'0.6rem 0.875rem', fontSize:'0.875rem', outline:'none', width:'100%', boxSizing:'border-box' }

export default function VendorsPage() {
  const [cat, setCat] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = VENDORS.filter(v => {
    const matchCat = cat === 'All' || v.cat === cat
    const matchSearch = !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.desc.toLowerCase().includes(search.toLowerCase()) || v.specialties.some(s => s.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchSearch
  })

  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto', color:'white' }}>
      <h1 style={{ fontSize:'2rem', fontWeight:900, marginBottom:'0.4rem' }}>🏪 Vendor Marketplace</h1>
      <p style={{ color:'rgba(255,255,255,0.4)', marginBottom:'1.75rem', fontSize:'0.9rem' }}>Golf cart dealers, builders, and parts suppliers trusted by the community</p>

      {/* Filters */}
      <div style={{ background:'#1A2940', borderRadius:'1.25rem', padding:'1.5rem', marginBottom:'1.75rem', border:'1px solid rgba(230,57,70,0.1)' }}>
        <input style={{ ...inp, marginBottom:'1rem' }} placeholder="Search vendors, specialties…" value={search} onChange={e => setSearch(e.target.value)} />
        <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
          {VENDOR_CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ background: cat === c ? 'rgba(230,57,70,0.2)':'rgba(255,255,255,0.04)', border:`1px solid ${cat === c ? 'rgba(230,57,70,0.4)':'rgba(255,255,255,0.08)'}`, color: cat === c ? '#E63946':'rgba(255,255,255,0.55)', padding:'0.4rem 0.875rem', borderRadius:'9999px', fontSize:'0.8rem', cursor:'pointer', fontWeight: cat === c ? 700:400 }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px,1fr))', gap:'1.25rem' }}>
        {filtered.map(v => (
          <div key={v.id} style={{ background:'#1A2940', borderRadius:'1rem', padding:'1.5rem', border:'1px solid rgba(230,57,70,0.08)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.75rem' }}>
              <div>
                <h3 style={{ fontWeight:800, fontSize:'1rem', marginBottom:'0.2rem' }}>{v.name}</h3>
                <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.78rem' }}>📍 {v.location}</p>
              </div>
              <span style={{ background:'rgba(230,57,70,0.12)', color:'#E63946', fontSize:'0.7rem', fontWeight:700, padding:'0.2rem 0.6rem', borderRadius:'9999px', border:'1px solid rgba(230,57,70,0.2)', flexShrink:0, marginLeft:'0.5rem' }}>{v.cat}</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.75rem' }}>
              <span style={{ color:'#FFB700', fontSize:'0.85rem' }}>{'⭐'.repeat(Math.round(v.rating))}</span>
              <span style={{ fontWeight:700, fontSize:'0.875rem' }}>{v.rating}</span>
              <span style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.78rem' }}>({v.reviews.toLocaleString()} reviews)</span>
            </div>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.82rem', lineHeight:1.5, marginBottom:'0.875rem' }}>{v.desc}</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.35rem', marginBottom:'0.875rem' }}>
              {v.specialties.map((s, i) => (
                <span key={i} style={{ background:'rgba(255,183,0,0.08)', color:'#FFB700', border:'1px solid rgba(255,183,0,0.15)', borderRadius:'9999px', padding:'0.15rem 0.5rem', fontSize:'0.7rem', fontWeight:600 }}>{s}</span>
              ))}
            </div>
            <a href={v.website} target="_blank" rel="noopener noreferrer" style={{ display:'block', background:'linear-gradient(135deg,#E63946,#C42B37)', color:'white', padding:'0.6rem', borderRadius:'0.625rem', textAlign:'center', fontWeight:700, fontSize:'0.875rem', textDecoration:'none', boxShadow:'0 2px 10px rgba(230,57,70,0.3)' }}>
              Visit Website →
            </a>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign:'center', padding:'3rem', color:'rgba(255,255,255,0.4)' }}>
          <p style={{ fontSize:'2rem', marginBottom:'0.75rem' }}>🏪</p>
          <p>No vendors match your search. Try a different category or keyword.</p>
        </div>
      )}
    </div>
  )
}
