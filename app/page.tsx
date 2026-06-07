import Link from 'next/link'

const SHOWCASE = [
  { year:'2022', name:'DS Classic Resto',    make:'Club Car',  url:'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&q=85', accent:'#E63946' },
  { year:'2021', name:'TXT Street Legal',     make:'EZGO',      url:'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&q=85', accent:'#FFB700' },
  { year:'2023', name:'G29 Custom Build',     make:'Yamaha',    url:'https://images.unsplash.com/photo-1592840062661-a5a7f78e2056?w=600&q=85', accent:'#2DC653' },
  { year:'2020', name:'Precedent Lifted 6"',  make:'Club Car',  url:'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&q=85', accent:'#E63946' },
  { year:'2023', name:'RXV Lithium Build',    make:'EZGO',      url:'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&q=85', accent:'#FFB700' },
  { year:'2024', name:'LSV Street Build',     make:'Custom',    url:'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&q=85', accent:'#3399FF' },
]

const FEATURES = [
  { icon:'🔍', title:'Cart Search Engine',      desc:'Live listings from eBay, dealers, Craigslist & every golf cart marketplace', href:'/cart-search',  color:'#E63946' },
  { icon:'🔩', title:'Parts & Mods Search',     desc:'Real-time price comparison across every golf cart parts supplier',           href:'/parts',        color:'#FFB700' },
  { icon:'🔧', title:'AI Cart Mechanic',        desc:'Expert ASE-level golf cart tech available 24/7 — gas and electric',          href:'/mechanic',     color:'#2DC653' },
  { icon:'🏌️', title:'Digital Garage',          desc:'Build docs, mods, photos, costs, and maintenance logs for your fleet',       href:'/garage',       color:'#E63946' },
  { icon:'📍', title:'Events & Meets',          desc:'GPS-powered golf cart meet and show discovery near you',                      href:'/events',       color:'#3399FF' },
  { icon:'🏁', title:'Auction Intelligence',    desc:'Every golf cart auction source with cost and bidding calculators',            href:'/auctions',     color:'#FFB700' },
  { icon:'🏪', title:'Vendor Marketplace',      desc:'Performance shops, dealers, and custom builders in your area',                href:'/vendors',      color:'#2DC653' },
  { icon:'💬', title:'Forums Directory',        desc:'Every golf cart forum community — Club Car, EZGO, Yamaha, and more',          href:'/forums',       color:'#3399FF' },
  { icon:'👕', title:'Merch Store',             desc:'Exclusive RedLineConnect-1 drops and Rev Points loyalty rewards',            href:'/store',        color:'#E63946' },
  { icon:'⚡', title:'AI-Powered',              desc:'Every feature has its own dedicated AI agent trained on golf cart knowledge', href:'/mechanic',     color:'#FFB700' },
]

const STATS = [
  { value:'10+',  label:'AI Features',    icon:'⚡' },
  { value:'24/7', label:'AI Mechanic',     icon:'🔧' },
  { value:'50K+', label:'Cart Listings',   icon:'🏌️' },
  { value:'100+', label:'Vendors',         icon:'🏪' },
]

export default function HomePage() {
  return (
    <div style={{ minHeight:'100vh', background:'#0A1628', color:'white', fontFamily:'system-ui,sans-serif' }}>

      {/* ── TOP NAV ── */}
      <header style={{ background:'rgba(10,22,40,0.95)', borderBottom:'2px solid transparent', borderImage:'linear-gradient(90deg,#E63946 0%,#FFB700 50%,#2DC653 100%) 1', padding:'0 2rem', height:'4rem', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:50, backdropFilter:'blur(12px)' }}>
        <div style={{ fontSize:'1.35rem', fontWeight:900, display:'flex', alignItems:'center', gap:'0.3rem' }}>
          <span style={{ color:'white' }}>RedLine</span>
          <span className="redline-text">Connect</span>
          <span style={{ color:'#FFB700', textShadow:'0 0 10px rgba(255,183,0,0.5)' }}>-1</span>
          <span style={{ marginLeft:'0.3rem', fontSize:'1.5rem' }}>🏌️</span>
        </div>
        <div style={{ display:'flex', gap:'0.75rem', alignItems:'center' }}>
          <Link href="/login" style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.875rem', padding:'0.5rem 1rem' }}>Sign In</Link>
          <Link href="/register" style={{ background:'linear-gradient(135deg,#E63946,#C42B37)', color:'white', padding:'0.5rem 1.25rem', borderRadius:'0.625rem', fontWeight:700, fontSize:'0.875rem', boxShadow:'0 2px 12px rgba(230,57,70,0.4)' }}>Join Free</Link>
          <Link href="/garage" style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', color:'white', padding:'0.5rem 1.25rem', borderRadius:'0.625rem', fontSize:'0.875rem' }}>Dashboard →</Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ padding:'5rem 2rem 4rem', textAlign:'center', position:'relative', overflow:'hidden' }}>
        {/* Background glow effects */}
        <div style={{ position:'absolute', top:'20%', left:'50%', transform:'translateX(-50%)', width:'600px', height:'300px', background:'radial-gradient(ellipse,rgba(230,57,70,0.15),transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:0, left:'20%', width:'400px', height:'200px', background:'radial-gradient(ellipse,rgba(255,183,0,0.08),transparent 70%)', pointerEvents:'none' }} />

        <div style={{ position:'relative', zIndex:1 }}>
          {/* Icon badge */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:'0.75rem', background:'rgba(230,57,70,0.1)', border:'1px solid rgba(230,57,70,0.25)', borderRadius:'9999px', padding:'0.5rem 1.5rem', marginBottom:'2rem', fontSize:'0.85rem', color:'#E63946', fontWeight:700 }}>
            <span style={{ fontSize:'1.5rem' }}>🏌️</span>
            Golf Cart Enthusiast Platform
          </div>

          {/* Main headline */}
          <h1 style={{ fontSize:'clamp(2.5rem,6vw,4.5rem)', fontWeight:900, lineHeight:1.1, marginBottom:'1.25rem', letterSpacing:'-1px' }}>
            <span style={{ display:'block' }}>The Ultimate Platform</span>
            <span className="redline-text" style={{ display:'block' }}>For Golf Cart Enthusiasts</span>
          </h1>

          <p style={{ fontSize:'1.2rem', color:'rgba(255,255,255,0.5)', marginBottom:'0.75rem' }}>
            Custom Builds · Community · Commerce · AI-Powered
          </p>
          <p style={{ fontSize:'0.95rem', color:'rgba(255,255,255,0.35)', marginBottom:'2.5rem', maxWidth:'560px', margin:'0 auto 2.5rem' }}>
            Club Car · EZGO · Yamaha · Custom LSV · Off-Road · Street Legal — every cart, every platform, one place.
          </p>

          {/* CTAs */}
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap', marginBottom:'3rem' }}>
            <Link href="/register" style={{ background:'linear-gradient(135deg,#E63946,#C42B37)', color:'white', padding:'1rem 2.5rem', borderRadius:'0.875rem', fontWeight:800, fontSize:'1.1rem', boxShadow:'0 4px 24px rgba(230,57,70,0.5)', display:'inline-block' }}>
              Join Free →
            </Link>
            <Link href="/garage" style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.15)', color:'white', padding:'1rem 2.5rem', borderRadius:'0.875rem', fontWeight:700, fontSize:'1.1rem', display:'inline-block' }}>
              Explore Platform
            </Link>
          </div>

          {/* Stats bar */}
          <div style={{ display:'flex', gap:'2rem', justifyContent:'center', flexWrap:'wrap' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <div style={{ fontSize:'0.9rem', marginBottom:'0.2rem' }}>{s.icon}</div>
                <div style={{ fontSize:'1.75rem', fontWeight:900, color:'white' }}>{s.value}</div>
                <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.5px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOWCASE ── */}
      <section style={{ padding:'3rem 2rem', maxWidth:'1200px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <h2 style={{ fontSize:'2rem', fontWeight:900, marginBottom:'0.5rem' }}>🏆 Featured Custom Builds</h2>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.95rem' }}>Iconic builds from the RedLineConnect-1 community garage</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:'1rem' }}>
          {SHOWCASE.map((cart, i) => (
            <Link key={i} href="/garage" style={{ display:'block', position:'relative', borderRadius:'0.875rem', overflow:'hidden', aspectRatio:'4/3', background:'#1A2940', border:`1px solid ${cart.accent}22`, transition:'transform 0.2s', textDecoration:'none' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform='scale(1.04)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform='scale(1)' }}>
              <img src={cart.url} alt={cart.name} style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.8 }} />
              <div style={{ position:'absolute', inset:0, background:`linear-gradient(to top, ${cart.accent}CC 0%, transparent 55%)` }} />
              <div style={{ position:'absolute', bottom:'0.625rem', left:'0.75rem', right:'0.75rem' }}>
                <p style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.7)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px' }}>{cart.year} {cart.make}</p>
                <p style={{ fontSize:'0.8rem', fontWeight:800, color:'white', lineHeight:1.2 }}>{cart.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding:'3rem 2rem 5rem', maxWidth:'1200px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <h2 style={{ fontSize:'2rem', fontWeight:900, marginBottom:'0.5rem' }}>⚡ Everything Your Cart Needs</h2>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.95rem' }}>10 AI-powered tools built specifically for golf cart enthusiasts</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))', gap:'1.25rem' }}>
          {FEATURES.map((f, i) => (
            <Link key={i} href={f.href} style={{ display:'block', background:'#1A2940', border:`1px solid ${f.color}22`, borderRadius:'1rem', padding:'1.5rem', transition:'all 0.2s', textDecoration:'none' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform='translateY(-4px)'; el.style.borderColor=`${f.color}55`; el.style.boxShadow=`0 8px 32px ${f.color}22` }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform='translateY(0)'; el.style.borderColor=`${f.color}22`; el.style.boxShadow='none' }}>
              <div style={{ width:'48px', height:'48px', background:`${f.color}15`, border:`1px solid ${f.color}33`, borderRadius:'0.75rem', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', marginBottom:'1rem' }}>
                {f.icon}
              </div>
              <h3 style={{ fontWeight:800, fontSize:'1rem', color:'white', marginBottom:'0.5rem' }}>{f.title}</h3>
              <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.83rem', lineHeight:1.5 }}>{f.desc}</p>
              <div style={{ marginTop:'1rem', color:f.color, fontSize:'0.8rem', fontWeight:700 }}>Explore →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:'#06101E', borderTop:'1px solid rgba(255,255,255,0.05)', padding:'2rem', textAlign:'center' }}>
        <div style={{ fontSize:'1.1rem', fontWeight:900, marginBottom:'0.5rem' }}>
          <span style={{ color:'white' }}>RedLine</span><span className="redline-text">Connect</span><span style={{ color:'#FFB700' }}>-1</span>
        </div>
        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.8rem' }}>
          The ultimate golf cart enthusiast platform · Club Car · EZGO · Yamaha · Custom LSV
        </p>
        <p style={{ color:'rgba(255,255,255,0.2)', fontSize:'0.75rem', marginTop:'0.75rem' }}>
          Sister app of <a href="https://rev-connect-1.vercel.app" style={{ color:'#E63946' }}>RevConnect-1</a>
        </p>
      </footer>
    </div>
  )
}
