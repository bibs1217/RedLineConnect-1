'use client'
export const dynamic = 'force-dynamic'
import { useState, useMemo } from 'react'
import Link from 'next/link'

const CART_FORUMS: Record<string, { name: string; url: string; desc: string; members: string }[]> = {
  'General Golf Cart': [
    { name:'Golf Cart Forum',        url:'https://www.golfcartforum.com',                         desc:'Largest golf cart community online',         members:'200K+' },
    { name:'CartAholic',             url:'https://www.cartaholic.com',                            desc:'Golf cart tips, tricks, and community',      members:'150K+' },
    { name:'Golf Cart Talk',         url:'https://www.golfcarttalk.com',                          desc:'Golf cart owners and enthusiasts',           members:'100K+' },
    { name:'Reddit r/golfcarts',     url:'https://www.reddit.com/r/golfcarts',                   desc:'Golf cart subreddit community',              members:'50K+'  },
  ],
  'Club Car': [
    { name:'CartAholic Club Car',    url:'https://www.cartaholic.com/club-car-golf-cart-forum',   desc:'Club Car specific forum',                   members:'75K+'  },
    { name:'Club Car Forum',         url:'https://www.clubcarforum.com',                          desc:'Club Car owners community',                 members:'50K+'  },
  ],
  'EZGO': [
    { name:'CartAholic EZGO',        url:'https://www.cartaholic.com/ezgo-golf-cart-forum',       desc:'EZGO specific forum',                       members:'75K+'  },
    { name:'EZGO Forum',             url:'https://www.ezgoforum.com',                             desc:'EZGO golf cart owners',                     members:'50K+'  },
  ],
  'Yamaha': [
    { name:'CartAholic Yamaha',      url:'https://www.cartaholic.com/yamaha-golf-cart-forum',     desc:'Yamaha golf cart forum',                    members:'60K+'  },
    { name:'Yamaha Golf Cart Forum', url:'https://www.yamahaforums.com',                          desc:'Yamaha cart owners community',              members:'40K+'  },
  ],
  'Electric & Lithium': [
    { name:'Lithium Battery Forum',  url:'https://www.golfcartforum.com/forums/lithium-batteries',desc:'Lithium battery conversion community',      members:'30K+'  },
    { name:'EV Golf Cart Community', url:'https://www.reddit.com/r/ElectricVehicles',             desc:'Electric vehicle and cart community',       members:'200K+' },
  ],
  'Custom & LSV': [
    { name:'Custom Golf Cart Forum', url:'https://www.golfcartforum.com/forums/custom-golf-carts',desc:'Custom build community',                    members:'40K+'  },
    { name:'LSV Forum',              url:'https://www.golfcartforum.com/forums/street-legal-lsv', desc:'Low speed vehicle community',               members:'25K+'  },
  ],
  'Lifted & Off-Road': [
    { name:'Lifted Cart Forum',      url:'https://www.golfcartforum.com/forums/lifted-golf-carts',desc:'Lifted and off-road cart community',        members:'35K+'  },
    { name:'Off-Road Golf Carts',    url:'https://www.reddit.com/r/golfcarts',                   desc:'Off-road and trail cart builds',            members:'50K+'  },
  ],
  'Buying & Selling': [
    { name:'Golf Cart Classifieds',  url:'https://www.golfcartforum.com/forums/classifieds',      desc:'Buy and sell golf carts',                   members:'80K+'  },
    { name:'Golf Cart Trader',       url:'https://www.golfcarttrader.com',                        desc:'Golf cart marketplace',                     members:'60K+'  },
  ],
}

const FEATURED = [
  { name:'Golf Cart Forum',      url:'https://www.golfcartforum.com',               members:'200K+', desc:'Largest golf cart community',  emoji:'🏌️' },
  { name:'CartAholic',           url:'https://www.cartaholic.com',                  members:'150K+', desc:'Tips, tricks, and mods',        emoji:'🔧' },
  { name:'Golf Cart Talk',       url:'https://www.golfcarttalk.com',                members:'100K+', desc:'Owners and enthusiasts',        emoji:'💬' },
  { name:'Reddit r/golfcarts',   url:'https://www.reddit.com/r/golfcarts',         members:'50K+',  desc:'Golf cart subreddit',           emoji:'🟠' },
  { name:'EV Golf Cart Community', url:'https://www.reddit.com/r/ElectricVehicles', members:'200K+', desc:'Electric and lithium builds',   emoji:'⚡' },
  { name:'Golf Cart Trader',     url:'https://www.golfcarttrader.com',              members:'60K+',  desc:'Buy and sell marketplace',      emoji:'🛒' },
]

const CAT_COLOR: Record<string, string> = {
  'General Golf Cart':  '#E63946',
  'Club Car':           '#3399FF',
  'EZGO':               '#FFB700',
  'Yamaha':             '#E63946',
  'Electric & Lithium': '#2DC653',
  'Custom & LSV':       '#FFB700',
  'Lifted & Off-Road':  '#2DC653',
  'Buying & Selling':   '#3399FF',
}

const inp: React.CSSProperties = { background:'rgba(255,255,255,0.06)', border:'1px solid rgba(230,57,70,0.15)', borderRadius:'0.875rem', color:'white', padding:'0.75rem 1.1rem', fontSize:'1rem', outline:'none', width:'100%', boxSizing:'border-box' }

export default function ForumsPage() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return CART_FORUMS
    const result: typeof CART_FORUMS = {}
    for (const [cat, forums] of Object.entries(CART_FORUMS)) {
      const matches = forums.filter(f => f.name.toLowerCase().includes(q) || f.desc.toLowerCase().includes(q) || cat.toLowerCase().includes(q))
      if (matches.length > 0) result[cat] = matches
    }
    return result
  }, [search])

  const totalResults = Object.values(filtered).reduce((n, arr) => n + arr.length, 0)
  const totalForums = Object.values(CART_FORUMS).reduce((n, arr) => n + arr.length, 0)

  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto', color:'white' }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#1A2940,#06101E)', border:'1px solid rgba(230,57,70,0.1)', borderRadius:'1rem', padding:'2rem', marginBottom:'2rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:'linear-gradient(90deg,#E63946,#FFB700,#2DC653)' }} />
        <h1 style={{ fontSize:'2rem', fontWeight:900, marginBottom:'0.4rem' }}>💬 Golf Cart Forums Directory</h1>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.95rem', marginBottom:'1.25rem' }}>
          Connect with owners and enthusiasts for your exact cart — {totalForums} forums across {Object.keys(CART_FORUMS).length} categories
        </p>
        <div style={{ position:'relative', maxWidth:'560px' }}>
          <span style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.35)', pointerEvents:'none' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by forum name or topic…" style={{ ...inp, paddingLeft:'2.75rem' }} />
          {search && <button onClick={() => setSearch('')} style={{ position:'absolute', right:'0.875rem', top:'50%', transform:'translateY(-50%)', background:'transparent', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:'1.1rem' }}>×</button>}
        </div>
        {search && <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.8rem', marginTop:'0.625rem' }}>{totalResults} forum{totalResults !== 1 ? 's' : ''} match "{search}"</p>}
      </div>

      {/* Featured */}
      {!search && (
        <div style={{ marginBottom:'2.5rem' }}>
          <p style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'1rem', fontWeight:700 }}>⭐ Featured Communities</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px,1fr))', gap:'0.875rem' }}>
            {FEATURED.map((f, i) => (
              <a key={i} href={f.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none' }}>
                <div style={{ background:'linear-gradient(135deg,rgba(230,57,70,0.08),rgba(255,183,0,0.05))', border:'1px solid rgba(255,183,0,0.12)', borderRadius:'1rem', padding:'1.25rem', display:'flex', alignItems:'center', gap:'1rem', transition:'all 0.15s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(255,183,0,0.35)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(255,183,0,0.12)' }}>
                  <div style={{ fontSize:'2rem', flexShrink:0 }}>{f.emoji}</div>
                  <div>
                    <p style={{ fontWeight:800, color:'white', fontSize:'0.95rem', margin:'0 0 0.2rem' }}>{f.name}</p>
                    <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.75rem', margin:'0 0 0.3rem' }}>{f.desc}</p>
                    <span style={{ background:'rgba(255,183,0,0.12)', color:'#FFB700', fontSize:'0.7rem', fontWeight:700, padding:'0.15rem 0.5rem', borderRadius:'9999px', border:'1px solid rgba(255,183,0,0.2)' }}>{f.members} members</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {Object.keys(filtered).length === 0 ? (
        <div style={{ textAlign:'center', padding:'4rem 2rem', background:'rgba(255,255,255,0.02)', borderRadius:'1.25rem', border:'1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontSize:'3rem', marginBottom:'1rem' }}>🔍</p>
          <h2 style={{ fontWeight:800, marginBottom:'0.5rem' }}>No forums match "{search}"</h2>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.9rem' }}>Try "Club Car", "EZGO", "lift kit", or "electric"</p>
        </div>
      ) : (
        Object.entries(filtered).map(([category, forums]) => {
          const color = CAT_COLOR[category] ?? '#E63946'
          return (
            <div key={category} style={{ marginBottom:'2.5rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.875rem', marginBottom:'1rem' }}>
                <div style={{ width:'4px', height:'28px', background:color, borderRadius:'9999px', flexShrink:0 }} />
                <h2 style={{ fontWeight:900, fontSize:'1.2rem', margin:0 }}>{category}</h2>
                <span style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.4)', fontSize:'0.7rem', fontWeight:700, padding:'0.2rem 0.6rem', borderRadius:'9999px' }}>{forums.length}</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:'1rem' }}>
                {forums.map((f, i) => (
                  <div key={i} style={{ background:'#1A2940', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'1rem', padding:'1.25rem', display:'flex', flexDirection:'column', gap:'0.625rem' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'0.5rem' }}>
                      <a href={f.url} target="_blank" rel="noopener noreferrer"
                        style={{ fontWeight:800, fontSize:'1rem', color, textDecoration:'none', lineHeight:1.3, flex:1 }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.textDecoration='underline' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.textDecoration='none' }}>
                        {f.name}
                      </a>
                      <span style={{ background:`${color}18`, color, fontSize:'0.65rem', fontWeight:800, padding:'0.2rem 0.5rem', borderRadius:'9999px', border:`1px solid ${color}33`, flexShrink:0, whiteSpace:'nowrap' }}>{f.members}</span>
                    </div>
                    <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.8rem', lineHeight:1.5, margin:0, flex:1 }}>{f.desc}</p>
                    <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.25rem' }}>
                      <a href={f.url} target="_blank" rel="noopener noreferrer"
                        style={{ flex:2, background:`linear-gradient(135deg,${color},${color}CC)`, color:'white', padding:'0.55rem 0.75rem', borderRadius:'0.625rem', textDecoration:'none', textAlign:'center', fontWeight:700, fontSize:'0.8rem', boxShadow:`0 2px 10px ${color}33` }}>
                        Visit Forum →
                      </a>
                      <Link href="/garage" style={{ flex:1, background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.55)', border:'1px solid rgba(255,255,255,0.1)', padding:'0.55rem 0.5rem', borderRadius:'0.625rem', textDecoration:'none', textAlign:'center', fontWeight:600, fontSize:'0.75rem' }}>
                        + Garage
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
