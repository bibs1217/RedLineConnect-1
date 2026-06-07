'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers/auth-provider'

const NAV = [
  { href:'/garage',      icon:'🏌️', label:'Garage',       color:'#E63946' },
  { href:'/cart-search', icon:'🔍', label:'Buy a Cart',   color:'#3399FF' },
  { href:'/parts',       icon:'🔩', label:'Parts',        color:'#E63946' },
  { href:'/mechanic',    icon:'🔧', label:'AI Mechanic',  color:'#2DC653' },
  { href:'/events',      icon:'📍', label:'Events',       color:'#3399FF' },
  { href:'/auctions',    icon:'🏁', label:'Auctions',     color:'#FFB700' },
  { href:'/vendors',     icon:'🏪', label:'Vendors',      color:'#E63946' },
  { href:'/forums',      icon:'💬', label:'Forums',       color:'#3399FF' },
  { href:'/store',       icon:'👕', label:'Store',        color:'#FFB700' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, signOut } = useAuth()

  async function handleSignOut() {
    await signOut()
    router.push('/')
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0A1628', display:'flex', flexDirection:'column' }}>

      {/* Nav */}
      <header style={{ background:'#06101E', borderBottom:'3px solid transparent', borderImage:'linear-gradient(90deg, #E63946 0%, #FFB700 50%, #2DC653 100%) 1', padding:'0 1.5rem', height:'4rem', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:50, boxShadow:'0 4px 24px rgba(0,0,0,0.5)' }}>

        <Link href="/" style={{ fontSize:'1.2rem', fontWeight:900, display:'flex', alignItems:'center', gap:'0.3rem' }}>
          <span style={{ color:'white' }}>RedLine</span>
          <span style={{ background:'linear-gradient(90deg,#E63946,#FFB700)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Connect</span>
          <span style={{ color:'#FFB700' }}>-1</span>
          <span style={{ fontSize:'1.2rem' }}>🏌️</span>
        </Link>

        <div style={{ flex:1, maxWidth:'380px', margin:'0 1.5rem', display:'flex', alignItems:'center', gap:'0.5rem', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'0.625rem', padding:'0.5rem 1rem' }}>
          <span style={{ color:'rgba(255,255,255,0.3)' }}>🔍</span>
          <input placeholder="Search carts, parts, events…" style={{ flex:1, background:'transparent', border:'none', color:'white', fontSize:'0.875rem', outline:'none' }} />
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
          {user ? (
            <>
              <div style={{ background:'rgba(255,183,0,0.1)', border:'1px solid rgba(255,183,0,0.25)', borderRadius:'9999px', padding:'0.25rem 0.875rem', fontSize:'0.75rem', color:'#FFB700', fontWeight:700 }}>
                ⚡ {profile?.rev_points ?? 0} pts
              </div>
              <span style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.875rem' }}>@{profile?.username ?? user.email?.split('@')[0]}</span>
              <button onClick={handleSignOut} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.6)', padding:'0.4rem 0.875rem', borderRadius:'0.5rem', fontSize:'0.8rem', cursor:'pointer' }}>Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.875rem' }}>Sign In</Link>
              <Link href="/register" style={{ background:'linear-gradient(135deg,#E63946,#C42B37)', color:'white', padding:'0.5rem 1rem', borderRadius:'0.5rem', fontSize:'0.875rem', fontWeight:700, boxShadow:'0 2px 12px rgba(230,57,70,0.4)' }}>Join Free</Link>
            </>
          )}
        </div>
      </header>

      <div style={{ display:'flex', flex:1 }}>
        {/* Sidebar */}
        <aside style={{ width:'220px', background:'#06101E', borderRight:'1px solid rgba(255,255,255,0.05)', padding:'1.25rem 0.875rem', position:'sticky', top:'4rem', height:'calc(100vh - 4rem)', overflowY:'auto', display:'flex', flexDirection:'column' }}>

          {/* Cart hero image */}
          <div style={{ borderRadius:'0.75rem', overflow:'hidden', marginBottom:'1.25rem', height:'80px', position:'relative', background:'linear-gradient(135deg, rgba(230,57,70,0.2), #1A2940)' }}>
            <img src="https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400&q=75" alt="Golf Cart" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.65 }} />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(6,16,30,0.5), transparent)' }} />
            <div style={{ position:'absolute', bottom:'0.5rem', left:'0.75rem', fontSize:'0.6rem', color:'rgba(255,183,0,0.9)', fontWeight:800, letterSpacing:'2px', textTransform:'uppercase' }}>RedLineConnect-1</div>
          </div>

          <nav style={{ display:'flex', flexDirection:'column', gap:'0.15rem', flex:1 }}>
            {NAV.map(n => {
              const active = pathname === n.href || pathname.startsWith(n.href + '/')
              return (
                <Link key={n.href} href={n.href} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.625rem 0.875rem', borderRadius:'0.625rem', fontSize:'0.875rem', fontWeight: active ? 700 : 400, background: active ? `${n.color}18` : 'transparent', color: active ? n.color : 'rgba(255,255,255,0.45)', borderLeft: `3px solid ${active ? n.color : 'transparent'}`, paddingLeft:'0.625rem', transition:'all 0.15s' }}>
                  <span style={{ fontSize:'1rem' }}>{n.icon}</span>{n.label}
                </Link>
              )
            })}
          </nav>

          {/* Rev Points card */}
          <div style={{ marginTop:'1rem', borderRadius:'0.875rem', padding:'1rem', background:'linear-gradient(135deg, rgba(230,57,70,0.1), rgba(255,183,0,0.07))', border:'1px solid rgba(255,183,0,0.12)', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg, #E63946, #FFB700, #2DC653)' }} />
            <p style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.35)', marginBottom:'0.25rem', letterSpacing:'0.5px', textTransform:'uppercase' }}>Rev Points</p>
            <p style={{ fontSize:'1.75rem', fontWeight:900, background:'linear-gradient(90deg,#E63946,#FFB700)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{profile?.rev_points ?? 0}</p>
            <p style={{ fontSize:'0.7rem', color:'#FFB700', marginTop:'0.25rem', fontWeight:700, textTransform:'capitalize' }}>{profile?.membership_tier ?? 'Cruiser'} Tier</p>
            <div style={{ height:'3px', background:'rgba(0,0,0,0.3)', borderRadius:'9999px', marginTop:'0.75rem', overflow:'hidden' }}>
              <div style={{ height:'100%', width:'35%', background:'linear-gradient(90deg, #E63946, #FFB700, #2DC653)', borderRadius:'9999px' }} />
            </div>
          </div>
        </aside>

        <main style={{ flex:1, padding:'2rem', overflowX:'hidden', background:'#0A1628' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
