'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'

interface Product { id: string; name: string; price: number; image: string; category: string; desc: string; badge?: string }

const PRODUCTS: Product[] = [
  { id:'1',  name:'RedLineConnect-1 Snapback Hat',       price:34.99, category:'Headwear',    image:'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=85',  desc:'Structured snapback with embroidered logo', badge:'Best Seller' },
  { id:'2',  name:'RedLineConnect-1 Logo Tee',           price:29.99, category:'Tops',        image:'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=85',  desc:'Premium cotton tee with RedLine logo' },
  { id:'3',  name:'RedLineConnect-1 Hoodie',             price:64.99, category:'Tops',        image:'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=85',  desc:'Fleece pullover hoodie', badge:'New' },
  { id:'4',  name:'RedLineConnect-1 Cart Sticker Pack',  price:14.99, category:'Accessories', image:'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=85',  desc:'10-piece vinyl sticker set — weather resistant', badge:'Fan Fav' },
  { id:'5',  name:'RedLineConnect-1 Tumbler 30oz',       price:39.99, category:'Drinkware',   image:'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=85',  desc:'Insulated stainless tumbler with lid' },
  { id:'6',  name:'RedLineConnect-1 Phone Case',         price:24.99, category:'Accessories', image:'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=85',  desc:'Slim protective case for iPhone and Android' },
  { id:'7',  name:'RedLineConnect-1 Cart Flag',          price:19.99, category:'Accessories', image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=85',  desc:'12"x18" vinyl flag for golf cart antenna', badge:'New' },
  { id:'8',  name:'RedLineConnect-1 Keychain',           price:12.99, category:'Accessories', image:'https://images.unsplash.com/photo-1558618047-f9a88cb4f7e1?w=400&q=85',  desc:'Metal keychain with engraved logo' },
  { id:'9',  name:'RedLineConnect-1 Cooler Bag',         price:44.99, category:'Gear',        image:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=85',  desc:'Insulated cooler bag — fits cart cup holders' },
  { id:'10', name:'RedLineConnect-1 Seat Cover',         price:54.99, category:'Cart Gear',   image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=85',  desc:'Universal fit vinyl seat cover with logo' },
]

const CATS = ['All', 'Tops', 'Headwear', 'Accessories', 'Drinkware', 'Gear', 'Cart Gear']

export default function StorePage() {
  const [cat, setCat] = useState('All')
  const [cart, setCart] = useState<string[]>([])

  const filtered = cat === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === cat)

  function addToCart(id: string) {
    setCart(prev => [...prev, id])
    setTimeout(() => setCart(prev => prev.filter((_, i) => i !== 0)), 2000)
  }

  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto', color:'white' }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#1A2940,#06101E)', border:'1px solid rgba(230,57,70,0.1)', borderRadius:'1rem', padding:'2rem', marginBottom:'2rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:'linear-gradient(90deg,#E63946,#FFB700,#2DC653)' }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <h1 style={{ fontSize:'2rem', fontWeight:900, marginBottom:'0.4rem' }}>👕 RedLineConnect-1 Store</h1>
            <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.95rem' }}>Official merch drops and Rev Points loyalty rewards</p>
          </div>
          {cart.length > 0 && (
            <div style={{ background:'rgba(230,57,70,0.15)', border:'1px solid rgba(230,57,70,0.3)', borderRadius:'0.875rem', padding:'0.75rem 1.25rem', color:'#E63946', fontWeight:700 }}>
              🛒 {cart.length} item{cart.length !== 1 ? 's' : ''} added!
            </div>
          )}
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'1.75rem' }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            style={{ background: cat === c ? 'rgba(230,57,70,0.2)':'rgba(255,255,255,0.05)', border:`1px solid ${cat === c ? 'rgba(230,57,70,0.4)':'rgba(255,255,255,0.08)'}`, color: cat === c ? '#E63946':'rgba(255,255,255,0.55)', padding:'0.5rem 1rem', borderRadius:'9999px', fontSize:'0.875rem', cursor:'pointer', fontWeight: cat === c ? 700:400 }}>
            {c}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px,1fr))', gap:'1.25rem', marginBottom:'3rem' }}>
        {filtered.map(p => (
          <div key={p.id} style={{ background:'#1A2940', borderRadius:'1rem', overflow:'hidden', border:'1px solid rgba(230,57,70,0.08)' }}>
            {/* Image with overlay */}
            <div style={{ height:'220px', position:'relative', overflow:'hidden', background:'#0A1628' }}>
              <img src={p.image} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.85 }} />
              {/* RedLineConnect-1 badge */}
              <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'rgba(0,0,0,0.6)', borderRadius:'4px', padding:'0.3rem 0.75rem', border:'1px solid rgba(255,255,255,0.25)', pointerEvents:'none' }}>
                <span style={{ color:'white', fontWeight:700, fontSize:'0.85rem', whiteSpace:'nowrap' }}>RedLineConnect-1</span>
              </div>
              {p.badge && (
                <div style={{ position:'absolute', top:'0.75rem', right:'0.75rem', background: p.badge === 'New' ? '#2DC653' : p.badge === 'Best Seller' ? '#FFB700' : '#E63946', color:'white', fontSize:'0.7rem', fontWeight:800, padding:'0.25rem 0.625rem', borderRadius:'9999px' }}>
                  {p.badge}
                </div>
              )}
              {/* Bottom watermark */}
              <div style={{ position:'absolute', bottom:'0.5rem', right:'0.75rem', background:'rgba(230,57,70,0.7)', borderRadius:'9999px', padding:'0.15rem 0.625rem', fontSize:'0.6rem', fontWeight:800, color:'white', letterSpacing:'0.5px' }}>
                REDLINE-1
              </div>
            </div>

            <div style={{ padding:'1.1rem' }}>
              <h3 style={{ fontWeight:800, fontSize:'0.95rem', lineHeight:1.3, marginBottom:'0.35rem' }}>{p.name}</h3>
              <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.78rem', marginBottom:'0.75rem', lineHeight:1.4 }}>{p.desc}</p>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'1.2rem', fontWeight:900, color:'#E63946' }}>${p.price}</span>
                <button onClick={() => addToCart(p.id)} style={{ background:'linear-gradient(135deg,#E63946,#C42B37)', color:'white', border:'none', padding:'0.5rem 1rem', borderRadius:'0.625rem', fontWeight:700, fontSize:'0.8rem', cursor:'pointer', boxShadow:'0 2px 10px rgba(230,57,70,0.35)' }}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rev Points promo */}
      <div style={{ background:'linear-gradient(135deg,rgba(255,183,0,0.08),rgba(230,57,70,0.05))', border:'1px solid rgba(255,183,0,0.15)', borderRadius:'1rem', padding:'1.5rem', textAlign:'center' }}>
        <p style={{ fontSize:'1.5rem', marginBottom:'0.5rem' }}>⚡</p>
        <h3 style={{ fontWeight:800, fontSize:'1.1rem', marginBottom:'0.4rem' }}>Earn Rev Points on Every Purchase</h3>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.875rem' }}>Every dollar spent = 10 Rev Points. Redeem for discounts, exclusive drops, and early access.</p>
        <Link href="/register" style={{ display:'inline-block', marginTop:'1rem', background:'linear-gradient(135deg,#FFB700,#E69900)', color:'#0A1628', padding:'0.625rem 1.5rem', borderRadius:'0.75rem', fontWeight:800, fontSize:'0.9rem' }}>
          Join Free to Earn Points →
        </Link>
      </div>
    </div>
  )
}
