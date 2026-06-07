'use client'

const AUCTION_SOURCES = [
  { name:'eBay Golf Cart Auctions',  emoji:'🏷️', url:'https://www.ebay.com/b/Golf-Carts/47254/bn_2312462?LH_Auction=1',      desc:'Live and ending-soon golf cart auctions', tip:'Filter by "Auction" to find ending soon deals' },
  { name:'GovPlanet',                emoji:'🏛️', url:'https://www.govplanet.com/for-sale/Golf-Carts/c207',                   desc:'Government and fleet surplus golf carts',  tip:'Find fleet vehicles at government pricing' },
  { name:'Purple Wave',              emoji:'🟣', url:'https://www.purplewave.com/results?q=golf+cart',                        desc:'Unreserved online auctions',               tip:'No reserve — true market price' },
  { name:'Proxibid',                 emoji:'🔨', url:'https://www.proxibid.com/search?q=golf+cart',                          desc:'Industrial and commercial cart auctions',  tip:'Great for fleet and commercial carts' },
  { name:'IronPlanet',               emoji:'🔩', url:'https://www.ironplanet.com/results?q=golf+cart',                       desc:'Heavy equipment and cart auctions',        tip:'IronClad Assurance inspection reports' },
  { name:'Ritchie Bros.',            emoji:'🏗️', url:'https://www.rbauction.com/equipment/golf-cart',                        desc:'World\'s largest equipment auctioneer',   tip:'Onsite and online bidding' },
  { name:'BidSpotter',               emoji:'📱', url:'https://www.bidspotter.com/en-us/auction-catalogues?q=golf+cart',      desc:'Live auction streaming platform',         tip:'Participate in live auctions online' },
  { name:'K-BID',                    emoji:'🏷️', url:'https://www.k-bid.com/auction/search?q=golf+cart',                    desc:'Midwest online auction platform',         tip:'Golf resort and club liquidations' },
]

const TIPS = [
  { icon:'🔍', tip:'Always check the seller\'s feedback score before bidding on eBay' },
  { icon:'🔋', tip:'For electric carts, ask when the batteries were last replaced — a set of new batteries can cost $800-$3,000' },
  { icon:'📋', tip:'GovPlanet inspections mean you can trust the condition rating' },
  { icon:'🏌️', tip:'Golf resort liquidations are the best source for lightly used commercial fleet carts' },
  { icon:'⚡', tip:'Lithium conversions add $2,000-$5,000 to value — check if it has been done before bidding' },
  { icon:'📐', tip:'Lifted carts command 20-40% premium — factor in new tires when budgeting' },
]

export default function AuctionsPage() {
  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto', color:'white' }}>
      <h1 style={{ fontSize:'2rem', fontWeight:900, marginBottom:'0.4rem' }}>🏁 Golf Cart Auction Intelligence</h1>
      <p style={{ color:'rgba(255,255,255,0.4)', marginBottom:'1.75rem', fontSize:'0.9rem' }}>Every golf cart auction source — find deals before they're gone</p>

      {/* Auction sources */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:'1.25rem', marginBottom:'2.5rem' }}>
        {AUCTION_SOURCES.map((a, i) => (
          <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none' }}>
            <div style={{ background:'#1A2940', borderRadius:'1rem', padding:'1.5rem', border:'1px solid rgba(230,57,70,0.1)', height:'100%', display:'flex', flexDirection:'column', gap:'0.75rem', transition:'all 0.15s', cursor:'pointer' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(230,57,70,0.35)'; el.style.transform='translateY(-3px)'; el.style.boxShadow='0 8px 30px rgba(230,57,70,0.15)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(230,57,70,0.1)'; el.style.transform='translateY(0)'; el.style.boxShadow='none' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.875rem' }}>
                <span style={{ fontSize:'2rem' }}>{a.emoji}</span>
                <div>
                  <p style={{ fontWeight:800, color:'white', fontSize:'1rem', margin:0 }}>{a.name}</p>
                  <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.78rem', margin:0 }}>{a.desc}</p>
                </div>
              </div>
              <p style={{ color:'rgba(255,183,0,0.7)', fontSize:'0.78rem', fontStyle:'italic', margin:0, flex:1 }}>
                💡 {a.tip}
              </p>
              <div style={{ background:'linear-gradient(135deg,#E63946,#C42B37)', color:'white', padding:'0.55rem', borderRadius:'0.625rem', textAlign:'center', fontWeight:700, fontSize:'0.875rem', boxShadow:'0 2px 10px rgba(230,57,70,0.3)' }}>
                Search Auctions →
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Bidding tips */}
      <div style={{ background:'#1A2940', borderRadius:'1rem', padding:'1.75rem', border:'1px solid rgba(255,183,0,0.12)', marginBottom:'2rem' }}>
        <h2 style={{ fontWeight:800, fontSize:'1.1rem', marginBottom:'1.25rem' }}>💡 Golf Cart Auction Buying Tips</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))', gap:'0.875rem' }}>
          {TIPS.map((t, i) => (
            <div key={i} style={{ display:'flex', gap:'0.75rem', alignItems:'flex-start' }}>
              <span style={{ fontSize:'1.25rem', flexShrink:0 }}>{t.icon}</span>
              <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.83rem', lineHeight:1.5 }}>{t.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cost calculator teaser */}
      <div style={{ background:'linear-gradient(135deg,rgba(230,57,70,0.08),rgba(45,198,83,0.05))', border:'1px solid rgba(230,57,70,0.15)', borderRadius:'1rem', padding:'1.75rem', textAlign:'center' }}>
        <p style={{ fontSize:'2rem', marginBottom:'0.75rem' }}>🧮</p>
        <h3 style={{ fontWeight:800, fontSize:'1.1rem', marginBottom:'0.5rem' }}>Total Cost Calculator</h3>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.875rem', maxWidth:'480px', margin:'0 auto 1.25rem' }}>
          Before bidding, calculate your all-in cost: auction price + buyer's premium + transport + any needed repairs or upgrades.
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:'0.75rem', maxWidth:'600px', margin:'0 auto' }}>
          {['Auction Price','Buyer\'s Premium (typically 5-15%)','Transport / Haul Cost','Battery Replacement (if needed)','Lift Kit / Tires (if needed)','Registration / LSV Kit'].map((item, i) => (
            <div key={i} style={{ background:'rgba(255,255,255,0.04)', borderRadius:'0.625rem', padding:'0.625rem 0.875rem', fontSize:'0.78rem', color:'rgba(255,255,255,0.55)', textAlign:'left' }}>
              + {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
