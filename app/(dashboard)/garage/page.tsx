'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/app/providers/auth-provider'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface CartVehicle {
  id: string; year: number; make: string; model: string; type: string
  voltage: string | null; color: string | null; nickname: string | null
  status: string; hero_image_url: string | null; mileage: number | null
  total_build_cost: number
}

const CART_MAKES = ['Club Car','EZGO','Yamaha','Cushman','Star EV','Advanced EV','Icon EV','Tomberlin','Bintelli','Evolution','Garia','Polaris GEM','Taylor-Dunn','Columbia','Other']
const CART_STATUSES = ['Daily Driver','Show Cart','Project Cart','For Sale','Storage']
const CART_TYPES = ['Electric','Gas','Solar','Hybrid']
const VOLTAGES = ['36V','48V','72V','Other']

const CART_FORUMS: Record<string, { name: string; url: string }[]> = {
  'Club Car':  [{ name:'CartAholic Club Car', url:'https://www.cartaholic.com/club-car-golf-cart-forum' }, { name:'Club Car Forum', url:'https://www.clubcarforum.com' }],
  'EZGO':      [{ name:'CartAholic EZGO', url:'https://www.cartaholic.com/ezgo-golf-cart-forum' }, { name:'EZGO Forum', url:'https://www.ezgoforum.com' }],
  'Yamaha':    [{ name:'CartAholic Yamaha', url:'https://www.cartaholic.com/yamaha-golf-cart-forum' }, { name:'Yamaha Golf Cart Forum', url:'https://www.yamahaforums.com' }],
}

function getForumsForMake(make: string) {
  const key = Object.keys(CART_FORUMS).find(k => make.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(make.toLowerCase()))
  const general = [{ name:'Golf Cart Forum', url:'https://www.golfcartforum.com' }, { name:'CartAholic', url:'https://www.cartaholic.com' }]
  return key ? [...CART_FORUMS[key], ...general] : general
}

export default function GaragePage() {
  const { user, profile } = useAuth()
  const [carts, setCarts] = useState<CartVehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ year:'', make:'Club Car', model:'', type:'Electric', voltage:'48V', color:'', nickname:'', mileage:'' })
  const [saving, setSaving] = useState(false)
  const [uploadCartId, setUploadCartId] = useState<string|null>(null)
  const [urlInput, setUrlInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadDone, setUploadDone] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => { if (user) loadCarts() }, [user])

  async function loadCarts() {
    setLoading(true)
    const { data } = await supabase.from('cart_garage_vehicles').select('*').eq('owner_id', user!.id).order('created_at', { ascending: false })
    setCarts((data ?? []) as CartVehicle[])
    setLoading(false)
  }

  async function addCart(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    await supabase.from('cart_garage_vehicles').insert({
      owner_id: user.id, year: parseInt(form.year), make: form.make,
      model: form.model, type: form.type, voltage: form.type === 'Electric' ? form.voltage : null,
      color: form.color || null, nickname: form.nickname || null,
      mileage: form.mileage ? parseInt(form.mileage) : null, status: 'Daily Driver',
    })
    setForm({ year:'', make:'Club Car', model:'', type:'Electric', voltage:'48V', color:'', nickname:'', mileage:'' })
    setShowAdd(false); setSaving(false); loadCarts()
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !uploadCartId || !user) return
    if (!file.type.startsWith('image/')) { setUploadError('Please select an image file'); return }
    if (file.size > 15 * 1024 * 1024) { setUploadError('File must be under 15MB'); return }
    setUploading(true); setUploadError('')
    const ext = file.name.split('.').pop()
    const path = `${user.id}/${uploadCartId}/hero_${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('vehicles').upload(path, file, { upsert:true, contentType:file.type })
    if (error) { setUploadError(`Upload failed: ${error.message}`); setUploading(false); return }
    const { data: urlData } = supabase.storage.from('vehicles').getPublicUrl(path)
    await supabase.from('cart_garage_vehicles').update({ hero_image_url: urlData.publicUrl }).eq('id', uploadCartId)
    setUploadDone(true); setUploading(false); loadCarts()
    setTimeout(() => { setUploadCartId(null); setUploadDone(false) }, 1500)
  }

  async function handleUrl() {
    if (!urlInput.trim() || !uploadCartId) return
    setUploading(true)
    await supabase.from('cart_garage_vehicles').update({ hero_image_url: urlInput.trim() }).eq('id', uploadCartId)
    setUploadDone(true); setUploading(false); loadCarts()
    setTimeout(() => { setUploadCartId(null); setUploadDone(false); setUrlInput('') }, 1500)
  }

  const inp: React.CSSProperties = { width:'100%', background:'#06101E', border:'1px solid rgba(230,57,70,0.15)', borderRadius:'0.75rem', padding:'0.625rem 0.875rem', color:'white', fontSize:'0.875rem', outline:'none' }
  const lbl: React.CSSProperties = { display:'block', fontSize:'0.75rem', color:'rgba(255,255,255,0.4)', marginBottom:'0.375rem' }

  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto', color:'white' }}>

      {/* Upload Modal */}
      {uploadCartId && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }} onClick={() => setUploadCartId(null)}>
          <div style={{ background:'#1A2940', border:'2px solid #E63946', borderRadius:'1.25rem', padding:'2rem', maxWidth:'460px', width:'100%' }} onClick={e => e.stopPropagation()}>
            {uploadDone ? (
              <div style={{ textAlign:'center', padding:'1rem' }}>
                <p style={{ fontSize:'4rem', marginBottom:'0.75rem' }}>✅</p>
                <p style={{ fontWeight:800, fontSize:'1.25rem', color:'#2DC653' }}>Photo Saved!</p>
              </div>
            ) : uploading ? (
              <div style={{ textAlign:'center', padding:'1rem' }}>
                <p style={{ fontSize:'3rem', marginBottom:'1rem' }}>⬆️</p>
                <p style={{ fontWeight:600, marginBottom:'1.5rem' }}>Uploading…</p>
              </div>
            ) : (
              <>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
                  <h2 style={{ fontWeight:900 }}>📸 Upload Cart Photo</h2>
                  <button onClick={() => setUploadCartId(null)} style={{ background:'transparent', border:'none', color:'rgba(255,255,255,0.5)', fontSize:'1.75rem', cursor:'pointer' }}>×</button>
                </div>
                <div onClick={() => fileRef.current?.click()} style={{ border:'3px dashed rgba(230,57,70,0.4)', borderRadius:'1rem', padding:'2.5rem 2rem', textAlign:'center', cursor:'pointer', marginBottom:'1rem' }}>
                  <p style={{ fontSize:'3rem', marginBottom:'0.75rem' }}>📷</p>
                  <p style={{ fontWeight:700, marginBottom:'0.5rem' }}>Click to choose a photo</p>
                  <p style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.4)' }}>JPG, PNG, WEBP — up to 15MB</p>
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleFile} />
                <div style={{ marginTop:'1rem' }}>
                  <label style={lbl}>Or paste a photo URL</label>
                  <div style={{ display:'flex', gap:'0.5rem' }}>
                    <input value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="https://example.com/my-cart.jpg" style={{ ...inp, flex:1 }} />
                    <button onClick={handleUrl} disabled={!urlInput.trim()} style={{ background:'#E63946', color:'white', border:'none', padding:'0.625rem 1rem', borderRadius:'0.75rem', fontWeight:700, cursor:'pointer' }}>Save</button>
                  </div>
                </div>
                {uploadError && <p style={{ color:'#E63946', fontSize:'0.8rem', marginTop:'0.75rem' }}>⚠️ {uploadError}</p>}
              </>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#1A2940,#06101E)', border:'1px solid rgba(230,57,70,0.1)', borderRadius:'1rem', padding:'2rem', marginBottom:'2rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:'linear-gradient(90deg,#E63946,#FFB700,#2DC653)' }} />
        <div style={{ display:'flex', alignItems:'flex-end', gap:'1.5rem', flexWrap:'wrap' }}>
          <div style={{ width:'80px', height:'80px', background:'rgba(230,57,70,0.12)', border:'2px solid rgba(230,57,70,0.3)', borderRadius:'1rem', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', flexShrink:0 }}>🏌️</div>
          <div style={{ flex:1 }}>
            <h1 style={{ fontSize:'1.5rem', fontWeight:800 }}>{profile?.display_name ?? profile?.username ?? user?.email?.split('@')[0] ?? 'My Cart Garage'}</h1>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.875rem' }}>@{profile?.username ?? '—'} · <span style={{ color:'#FFB700', textTransform:'capitalize' }}>{profile?.membership_tier ?? 'Cruiser'}</span></p>
            <div style={{ display:'flex', gap:'1.5rem', marginTop:'0.75rem' }}>
              <span style={{ fontSize:'0.875rem' }}><strong>{carts.length}</strong> <span style={{ color:'rgba(255,255,255,0.4)' }}>Carts</span></span>
              <span style={{ fontSize:'0.875rem' }}><strong style={{ color:'#FFB700' }}>{profile?.rev_points ?? 0}</strong> <span style={{ color:'rgba(255,255,255,0.4)' }}>Rev Points</span></span>
            </div>
          </div>
          {user && <button onClick={() => setShowAdd(!showAdd)} style={{ background:'linear-gradient(135deg,#E63946,#C42B37)', color:'white', border:'none', padding:'0.75rem 1.5rem', borderRadius:'0.75rem', fontWeight:700, cursor:'pointer', boxShadow:'0 4px 16px rgba(230,57,70,0.35)' }}>+ Add Cart</button>}
        </div>
      </div>

      {/* Add Cart Form */}
      {showAdd && (
        <div style={{ background:'#1A2940', border:'1px solid rgba(230,57,70,0.15)', borderRadius:'1rem', padding:'1.5rem', marginBottom:'2rem' }}>
          <h2 style={{ fontWeight:700, marginBottom:'1.25rem' }}>Add a Cart to Your Garage</h2>
          <form onSubmit={addCart}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px,1fr))', gap:'1rem', marginBottom:'1rem' }}>
              <div><label style={lbl}>Year *</label><input value={form.year} onChange={e => setForm(v => ({...v,year:e.target.value}))} required placeholder="2022" style={inp} /></div>
              <div>
                <label style={lbl}>Make *</label>
                <select value={form.make} onChange={e => setForm(v => ({...v,make:e.target.value}))} style={inp}>
                  {CART_MAKES.map(m => <option key={m} value={m} style={{background:'#1A2940'}}>{m}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Model *</label><input value={form.model} onChange={e => setForm(v => ({...v,model:e.target.value}))} required placeholder="DS" style={inp} /></div>
              <div>
                <label style={lbl}>Type</label>
                <select value={form.type} onChange={e => setForm(v => ({...v,type:e.target.value}))} style={inp}>
                  {CART_TYPES.map(t => <option key={t} value={t} style={{background:'#1A2940'}}>{t}</option>)}
                </select>
              </div>
              {form.type === 'Electric' && (
                <div>
                  <label style={lbl}>Voltage</label>
                  <select value={form.voltage} onChange={e => setForm(v => ({...v,voltage:e.target.value}))} style={inp}>
                    {VOLTAGES.map(v => <option key={v} value={v} style={{background:'#1A2940'}}>{v}</option>)}
                  </select>
                </div>
              )}
              <div><label style={lbl}>Color</label><input value={form.color} onChange={e => setForm(v => ({...v,color:e.target.value}))} placeholder="Pearl White" style={inp} /></div>
              <div><label style={lbl}>Nickname</label><input value={form.nickname} onChange={e => setForm(v => ({...v,nickname:e.target.value}))} placeholder="The Beast" style={inp} /></div>
              <div><label style={lbl}>Hours/Miles</label><input value={form.mileage} onChange={e => setForm(v => ({...v,mileage:e.target.value}))} placeholder="1200" style={inp} /></div>
            </div>
            <div style={{ display:'flex', gap:'0.75rem' }}>
              <button type="submit" disabled={saving} style={{ background:'linear-gradient(135deg,#E63946,#C42B37)', color:'white', border:'none', padding:'0.75rem 1.5rem', borderRadius:'0.75rem', fontWeight:700, cursor:'pointer' }}>{saving ? 'Saving…':'Save Cart'}</button>
              <button type="button" onClick={() => setShowAdd(false)} style={{ background:'transparent', color:'rgba(255,255,255,0.4)', border:'1px solid rgba(255,255,255,0.1)', padding:'0.75rem 1.5rem', borderRadius:'0.75rem', cursor:'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Not logged in */}
      {!user && (
        <div style={{ textAlign:'center', padding:'4rem 2rem', background:'#1A2940', border:'1px dashed rgba(230,57,70,0.2)', borderRadius:'1rem' }}>
          <p style={{ fontSize:'3rem', marginBottom:'1rem' }}>🏌️</p>
          <h2 style={{ fontWeight:700, marginBottom:'0.5rem' }}>Sign in to access your cart garage</h2>
          <p style={{ color:'rgba(255,255,255,0.4)', marginBottom:'1.5rem' }}>Upload photos, track mods, and document your builds.</p>
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center' }}>
            <Link href="/register" style={{ background:'linear-gradient(135deg,#E63946,#C42B37)', color:'white', padding:'0.75rem 1.5rem', borderRadius:'0.75rem', fontWeight:700 }}>Join Free</Link>
            <Link href="/login" style={{ background:'rgba(255,255,255,0.06)', color:'white', border:'1px solid rgba(255,255,255,0.1)', padding:'0.75rem 1.5rem', borderRadius:'0.75rem' }}>Sign In</Link>
          </div>
        </div>
      )}

      {/* Empty state */}
      {user && !loading && carts.length === 0 && (
        <div style={{ textAlign:'center', padding:'4rem 2rem', background:'#1A2940', border:'1px dashed rgba(230,57,70,0.15)', borderRadius:'1rem' }}>
          <p style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>🏌️</p>
          <h2 style={{ fontWeight:700, marginBottom:'0.5rem' }}>No carts yet</h2>
          <p style={{ color:'rgba(255,255,255,0.4)', marginBottom:'2rem' }}>Add your first cart and start building your garage.</p>
          <button onClick={() => setShowAdd(true)} style={{ background:'linear-gradient(135deg,#E63946,#C42B37)', color:'white', border:'none', padding:'0.875rem 2rem', borderRadius:'0.875rem', fontWeight:700, cursor:'pointer', boxShadow:'0 4px 16px rgba(230,57,70,0.35)', fontSize:'1rem' }}>
            + Add Your First Cart
          </button>
        </div>
      )}

      {/* Cart grid */}
      {carts.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px,1fr))', gap:'1.5rem' }}>
          {carts.map(cart => (
            <div key={cart.id} style={{ background:'#1A2940', border:'1px solid rgba(230,57,70,0.1)', borderRadius:'1rem', overflow:'hidden' }}>

              {/* Photo area */}
              <div style={{ height:'200px', background:'linear-gradient(135deg,rgba(230,57,70,0.08),#0A1628)', position:'relative', overflow:'hidden' }}>
                {cart.hero_image_url ? (
                  <>
                    <img src={cart.hero_image_url} alt={cart.nickname ?? ''} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0)', display:'flex', alignItems:'center', justifyContent:'center', opacity:0, transition:'all 0.2s' }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background='rgba(0,0,0,0.5)'; el.style.opacity='1' }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background='rgba(0,0,0,0)'; el.style.opacity='0' }}>
                      <button onClick={() => { setUploadCartId(cart.id); setUrlInput('') }} style={{ background:'linear-gradient(135deg,#E63946,#C42B37)', color:'white', border:'none', padding:'0.75rem 1.5rem', borderRadius:'0.875rem', fontWeight:700, cursor:'pointer' }}>
                        📸 Change Photo
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.75rem' }}>
                    <p style={{ fontSize:'2.5rem' }}>📷</p>
                    <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.875rem' }}>No photo yet</p>
                    <button onClick={() => { setUploadCartId(cart.id); setUrlInput('') }} style={{ background:'linear-gradient(135deg,#E63946,#C42B37)', color:'white', border:'none', padding:'0.625rem 1.5rem', borderRadius:'0.75rem', fontWeight:700, cursor:'pointer', fontSize:'0.875rem' }}>
                      📸 Upload Photo
                    </button>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding:'1.25rem' }}>
                <div style={{ marginBottom:'0.75rem' }}>
                  <h3 style={{ fontWeight:800, fontSize:'1.05rem' }}>{cart.nickname ?? `${cart.year} ${cart.make} ${cart.model}`}</h3>
                  {cart.nickname && <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.8rem' }}>{cart.year} {cart.make} {cart.model}</p>}
                  <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.4rem', flexWrap:'wrap' }}>
                    {cart.type && <span style={{ background:'rgba(45,198,83,0.12)', color:'#2DC653', border:'1px solid rgba(45,198,83,0.2)', borderRadius:'9999px', padding:'0.15rem 0.5rem', fontSize:'0.7rem', fontWeight:700 }}>{cart.type}</span>}
                    {cart.voltage && <span style={{ background:'rgba(255,183,0,0.12)', color:'#FFB700', border:'1px solid rgba(255,183,0,0.2)', borderRadius:'9999px', padding:'0.15rem 0.5rem', fontSize:'0.7rem', fontWeight:700 }}>{cart.voltage}</span>}
                    {cart.color && <span style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.5)', borderRadius:'9999px', padding:'0.15rem 0.5rem', fontSize:'0.7rem' }}>{cart.color}</span>}
                  </div>
                </div>

                {cart.mileage != null && <p style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.4)', marginBottom:'0.5rem' }}>⏱️ {cart.mileage.toLocaleString()} hrs/mi</p>}

                {/* Forum badges */}
                <div style={{ marginTop:'0.625rem', marginBottom:'0.5rem' }}>
                  <p style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'0.4rem', fontWeight:700 }}>
                    💬 Forums for your {cart.make}
                  </p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'0.35rem' }}>
                    {getForumsForMake(cart.make).slice(0,4).map((f, i) => (
                      <a key={i} href={f.url} target="_blank" rel="noopener noreferrer"
                        style={{ background:'rgba(230,57,70,0.1)', color:'#E63946', border:'1px solid rgba(230,57,70,0.2)', borderRadius:'9999px', padding:'0.2rem 0.6rem', fontSize:'0.7rem', fontWeight:700, textDecoration:'none', whiteSpace:'nowrap' }}>
                        {f.name}
                      </a>
                    ))}
                  </div>
                </div>

                <button onClick={() => { setUploadCartId(cart.id); setUrlInput('') }} style={{ width:'100%', background: cart.hero_image_url ? 'rgba(255,255,255,0.04)':'rgba(230,57,70,0.1)', border:`1px solid ${cart.hero_image_url ? 'rgba(255,255,255,0.1)':'rgba(230,57,70,0.3)'}`, color: cart.hero_image_url ? 'rgba(255,255,255,0.6)':'#E63946', padding:'0.625rem', borderRadius:'0.75rem', fontWeight:700, cursor:'pointer', fontSize:'0.875rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', marginTop:'0.5rem' }}>
                  📸 {cart.hero_image_url ? 'Change Photo' : 'Upload Photo'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
