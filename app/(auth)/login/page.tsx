'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/garage')
  }

  const inp: React.CSSProperties = { width:'100%', background:'#0E1825', border:'1px solid rgba(230,57,70,0.2)', borderRadius:'0.75rem', padding:'0.75rem 1rem', color:'white', fontSize:'0.875rem', outline:'none' }
  const lbl: React.CSSProperties = { display:'block', fontSize:'0.75rem', color:'rgba(255,255,255,0.5)', marginBottom:'0.5rem' }

  return (
    <div style={{ minHeight:'100vh', background:'#0A1628', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
      <div style={{ width:'100%', maxWidth:'420px' }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <Link href="/" style={{ fontSize:'2rem', fontWeight:900, display:'block', marginBottom:'0.5rem' }}>
            <span style={{ color:'white' }}>RedLine</span>
            <span style={{ background:'linear-gradient(90deg,#E63946,#FFB700)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Connect</span>
            <span style={{ color:'#FFB700' }}>-1</span>
            <span> 🏌️</span>
          </Link>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.9rem' }}>Sign in to your account</p>
        </div>

        <div style={{ background:'#1A2940', border:'1px solid rgba(230,57,70,0.15)', borderRadius:'1rem', padding:'2rem', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,#E63946,#FFB700,#2DC653)' }} />
          <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div>
              <label style={lbl}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" style={inp} />
            </div>
            <div>
              <label style={lbl}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={inp} />
            </div>
            {error && <div style={{ background:'rgba(230,57,70,0.1)', border:'1px solid rgba(230,57,70,0.3)', borderRadius:'0.5rem', padding:'0.75rem', fontSize:'0.875rem', color:'#E63946' }}>{error}</div>}
            <button type="submit" disabled={loading} style={{ background:'linear-gradient(135deg,#E63946,#C42B37)', color:'white', border:'none', padding:'0.875rem', borderRadius:'0.75rem', fontWeight:700, fontSize:'1rem', cursor: loading ? 'default':'pointer', opacity: loading ? 0.6:1 }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
        <p style={{ textAlign:'center', color:'rgba(255,255,255,0.4)', marginTop:'1.5rem', fontSize:'0.875rem' }}>
          No account? <Link href="/register" style={{ color:'#E63946', fontWeight:600 }}>Join RedLineConnect-1</Link>
        </p>
      </div>
    </div>
  )
}
