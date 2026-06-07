'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '@/app/providers/auth-provider'
import { createClient } from '@/lib/supabase/client'

interface Message { role: 'user' | 'assistant'; content: string }

const QUICK_PROMPTS = [
  'How do I replace the batteries in my 48V cart?',
  'Walk me through a 6 inch lift kit install',
  'How do I install a speed chip on my EZGO?',
  'My cart is slow — how do I troubleshoot the controller?',
  'How do I convert my lead acid cart to lithium?',
  'Walk me through replacing the solenoid',
  'How do I program a Curtis controller?',
  'How do I make my golf cart street legal (LSV)?',
  'My cart won\'t charge — how do I troubleshoot?',
  'How do I replace the rear leaf springs?',
]

export default function MechanicPage() {
  const { user } = useAuth()
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasKey, setHasKey] = useState(true)
  const [autoSpeak, setAutoSpeak] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [cartContext, setCartContext] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    if (!user) return
    supabase.from('cart_garage_vehicles').select('year,make,model,type,voltage').eq('owner_id', user.id).order('created_at', { ascending: false }).limit(1).then(({ data }) => {
      if (data?.[0]) {
        const c = data[0]
        setCartContext(`${c.year} ${c.make} ${c.model}${c.type ? ` (${c.type}${c.voltage ? ` ${c.voltage}` : ''})` : ''}`)
      }
    })
  }, [user])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
      window.speechSynthesis.onvoiceschanged = () => {}
    }
  }, [])

  const speak = useCallback((text: string) => {
    if (!synthRef.current) return
    synthRef.current.cancel()
    const clean = text.replace(/\*\*(.*?)\*\*/g,'$1').replace(/#{1,6}\s/g,'').replace(/[🔧🏌️⚡🔋⚠️]/g,'').trim()
    const utterance = new SpeechSynthesisUtterance(clean)
    const voices = synthRef.current.getVoices()
    const preferred = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha') || (v.lang==='en-US' && !v.name.includes('compact'))) || voices.find(v => v.lang.startsWith('en')) || voices[0]
    if (preferred) utterance.voice = preferred
    utterance.rate = 0.95
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    synthRef.current.speak(utterance)
  }, [])

  const stopSpeaking = useCallback(() => { synthRef.current?.cancel(); setSpeaking(false) }, [])

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return
    const userMsg: Message = { role:'user', content:text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setMessages(prev => [...prev, { role:'assistant', content:'' }])
    try {
      const res = await fetch('/api/mechanic', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ messages:[...messages, userMsg], cartContext, appType:'golf_cart' })
      })
      if (!res.ok) {
        const err = await res.json()
        if (err.error?.includes('API key')) setHasKey(false)
        setMessages(prev => { const n=[...prev]; n[n.length-1]={ role:'assistant', content: err.error ?? 'Something went wrong.' }; return n })
        setLoading(false); return
      }
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let full = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        for (const line of chunk.split('\n').filter(l => l.startsWith('data: '))) {
          const data = line.slice(6)
          if (data === '[DONE]') break
          try {
            const parsed = JSON.parse(data)
            const delta = parsed.delta?.text ?? parsed.choices?.[0]?.delta?.content ?? ''
            full += delta
            setMessages(prev => { const n=[...prev]; n[n.length-1]={ role:'assistant', content:full }; return n })
          } catch {}
        }
      }
      if (autoSpeak && full) speak(full)
    } catch {
      setMessages(prev => { const n=[...prev]; n[n.length-1]={ role:'assistant', content:'Connection error. Please try again.' }; return n })
    }
    setLoading(false)
  }

  function formatMessage(text: string) {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} style={{ fontWeight:700, color:'#FFB700', marginBottom:'0.5rem' }}>{line.slice(2,-2)}</p>
      if (/^\d+\./.test(line)) return <p key={i} style={{ paddingLeft:'1rem', marginBottom:'0.375rem', color:'#e0e0e0' }}>{line}</p>
      if (line.startsWith('- ') || line.startsWith('• ')) return <p key={i} style={{ paddingLeft:'1rem', marginBottom:'0.25rem', color:'#aaa' }}>{line}</p>
      if (line.startsWith('#')) return <p key={i} style={{ fontWeight:700, fontSize:'1rem', marginBottom:'0.5rem', marginTop:'0.75rem' }}>{line.replace(/^#+\s/,'')}</p>
      return line ? <p key={i} style={{ marginBottom:'0.375rem', lineHeight:1.6 }}>{line}</p> : <div key={i} style={{ height:'0.5rem' }} />
    })
  }

  const hasSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window

  return (
    <div style={{ maxWidth:'900px', margin:'0 auto', height:'calc(100vh - 8rem)', display:'flex', flexDirection:'column', color:'white' }}>

      <div style={{ textAlign:'center', padding:'1rem 0' }}>
        <div style={{ width:'56px', height:'56px', background:'rgba(45,198,83,0.12)', border:'2px solid rgba(45,198,83,0.25)', borderRadius:'1rem', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.75rem', margin:'0 auto 0.625rem' }}>🔧</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'1rem' }}>
          <h1 style={{ fontSize:'1.5rem', fontWeight:800 }}>AI Golf Cart Mechanic</h1>
          {hasSpeech && (
            <button onClick={() => { setAutoSpeak(!autoSpeak); if (autoSpeak) stopSpeaking() }}
              style={{ background: autoSpeak ? 'rgba(45,198,83,0.15)':'rgba(255,255,255,0.06)', border:`1px solid ${autoSpeak ? 'rgba(45,198,83,0.4)':'rgba(255,255,255,0.12)'}`, color: autoSpeak ? '#2DC653':'rgba(255,255,255,0.5)', padding:'0.375rem 0.75rem', borderRadius:'9999px', fontSize:'0.8rem', fontWeight: autoSpeak ? 700:400, cursor:'pointer' }}>
              {autoSpeak ? '🔊 Auto-Speak ON' : '🔇 Auto-Speak OFF'}
            </button>
          )}
          {speaking && <button onClick={stopSpeaking} style={{ background:'rgba(230,57,70,0.1)', border:'1px solid rgba(230,57,70,0.25)', color:'#E63946', padding:'0.375rem 0.75rem', borderRadius:'9999px', fontSize:'0.8rem', cursor:'pointer' }}>⏹ Stop</button>}
        </div>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.8rem', marginTop:'0.2rem' }}>
          30-year golf cart specialist · Club Car · EZGO · Yamaha · Gas & Electric · 24/7
        </p>
      </div>

      {cartContext && (
        <div style={{ display:'flex', justifyContent:'center', marginBottom:'0.75rem' }}>
          <span style={{ background:'rgba(45,198,83,0.1)', border:'1px solid rgba(45,198,83,0.2)', color:'#2DC653', padding:'0.3rem 0.875rem', borderRadius:'9999px', fontSize:'0.8rem', fontWeight:600 }}>
            🏌️ Working on: {cartContext}
          </span>
        </div>
      )}

      {!hasKey && (
        <div style={{ background:'rgba(255,183,0,0.08)', border:'1px solid rgba(255,183,0,0.2)', borderRadius:'0.75rem', padding:'0.875rem 1rem', marginBottom:'0.75rem', fontSize:'0.875rem', color:'#FFB700' }}>
          ⚠️ Add <code style={{ background:'rgba(0,0,0,0.3)', padding:'0.1rem 0.4rem', borderRadius:'0.25rem' }}>ANTHROPIC_API_KEY</code> to your environment variables.
        </div>
      )}

      <div style={{ flex:1, background:'rgba(6,16,30,0.5)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'1rem', overflowY:'auto', padding:'1.5rem', marginBottom:'1rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
        {messages.length === 0 ? (
          <div>
            <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.5rem' }}>
              <div style={{ width:'36px', height:'36px', background:'rgba(45,198,83,0.15)', border:'1px solid rgba(45,198,83,0.2)', borderRadius:'0.75rem', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.25rem', flexShrink:0 }}>🔧</div>
              <div style={{ background:'#1A2940', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'0.75rem', borderTopLeftRadius:'0.25rem', padding:'1rem', maxWidth:'80%' }}>
                <p style={{ fontWeight:600, marginBottom:'0.5rem', color:'#2DC653' }}>RedLineConnect-1 AI Mechanic</p>
                <p style={{ color:'#ccc', lineHeight:1.6, marginBottom:'0.5rem' }}>
                  {cartContext
                    ? `Hey! I see you're working on your ${cartContext}. What do you need help with?`
                    : `Hey! I'm your dedicated golf cart mechanic. I specialize in Club Car, EZGO, Yamaha, and all other brands — gas and electric. Tell me what you're working on!`}
                </p>
                {hasSpeech && <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.8rem' }}>💡 Tip: Enable Auto-Speak above for hands-free audio while you work on your cart.</p>}
              </div>
            </div>
            <p style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.3)', marginBottom:'0.75rem' }}>Quick questions:</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
              {QUICK_PROMPTS.map(p => (
                <button key={p} onClick={() => sendMessage(p)} style={{ background:'rgba(26,41,64,0.8)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.6)', padding:'0.5rem 0.875rem', borderRadius:'9999px', fontSize:'0.8rem', cursor:'pointer' }}>{p}</button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} style={{ display:'flex', gap:'0.75rem', flexDirection: msg.role==='user' ? 'row-reverse':'row' }}>
              <div style={{ width:'32px', height:'32px', background: msg.role==='user' ? 'rgba(230,57,70,0.15)':'rgba(45,198,83,0.1)', border:`1px solid ${msg.role==='user' ? 'rgba(230,57,70,0.2)':'rgba(45,198,83,0.15)'}`, borderRadius:'0.625rem', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>
                {msg.role === 'user' ? '👤' : '🔧'}
              </div>
              <div style={{ position:'relative', maxWidth:'80%' }}>
                <div style={{ background: msg.role==='user' ? 'rgba(230,57,70,0.08)':'#1A2940', border:`1px solid ${msg.role==='user' ? 'rgba(230,57,70,0.15)':'rgba(255,255,255,0.07)'}`, borderRadius:'0.75rem', borderTopRightRadius: msg.role==='user' ? '0.25rem':'0.75rem', borderTopLeftRadius: msg.role==='user' ? '0.75rem':'0.25rem', padding:'0.875rem 1rem', fontSize:'0.9rem' }}>
                  {msg.role === 'assistant' ? formatMessage(msg.content) : <p style={{ lineHeight:1.6 }}>{msg.content}</p>}
                  {msg.role === 'assistant' && loading && i === messages.length-1 && !msg.content && (
                    <span style={{ display:'inline-flex', gap:'0.3rem', alignItems:'center' }}>
                      {[0,1,2].map(n => <span key={n} style={{ width:'6px', height:'6px', background:'#E63946', borderRadius:'50%', display:'inline-block' }} />)}
                    </span>
                  )}
                </div>
                {msg.role === 'assistant' && msg.content && hasSpeech && (
                  <button onClick={() => speaking ? stopSpeaking() : speak(msg.content)} style={{ position:'absolute', bottom:'-1.5rem', right:0, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.4)', padding:'0.2rem 0.5rem', borderRadius:'9999px', fontSize:'0.7rem', cursor:'pointer' }}>
                    {speaking ? '⏹ Stop' : '🔊 Listen'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} style={{ height:'2rem' }} />
      </div>

      <div style={{ display:'flex', gap:'0.75rem' }}>
        <div style={{ flex:1, display:'flex', alignItems:'center', gap:'0.75rem', background:'#1A2940', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'0.875rem', padding:'0.75rem 1rem' }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && !e.shiftKey && (e.preventDefault(), sendMessage(input))}
            placeholder={cartContext ? `Ask about your ${cartContext}…` : 'Ask about your golf cart… (e.g. "My 48V Club Car DS runs slow")'}
            style={{ flex:1, background:'transparent', border:'none', color:'white', fontSize:'0.9rem', outline:'none' }}
            disabled={loading} />
        </div>
        <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()}
          style={{ background: loading || !input.trim() ? '#1A2940':'linear-gradient(135deg,#E63946,#C42B37)', color:'white', border:'none', width:'48px', height:'48px', borderRadius:'0.875rem', fontSize:'1.25rem', cursor: loading || !input.trim() ? 'default':'pointer', boxShadow: loading || !input.trim() ? 'none':'0 4px 16px rgba(230,57,70,0.4)', flexShrink:0 }}>
          {loading ? '⏳' : '→'}
        </button>
      </div>
      <p style={{ textAlign:'center', fontSize:'0.7rem', color:'rgba(255,255,255,0.25)', marginTop:'0.5rem' }}>Safety-critical work should always be verified by a professional.</p>
    </div>
  )
}
