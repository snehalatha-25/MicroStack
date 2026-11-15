import { useMemo, useState } from 'react'
import { Search, ShoppingBag, ArrowRight, Sparkles, ShieldCheck, Truck, Headphones, X, Plus, Minus } from 'lucide-react'

const products = [
  { id: 1, name: 'Studio Headphones', category: 'Electronics', price: 3499, old: 4299, tag: 'BESTSELLER', tone: 'lavender', emoji: '🎧', desc: 'Immersive sound for every day.' },
  { id: 2, name: 'Everyday Backpack', category: 'Accessories', price: 2199, old: 2799, tag: 'POPULAR', tone: 'sand', emoji: '🎒', desc: 'A thoughtful companion for work and travel.' },
  { id: 3, name: 'Minimal Desk Lamp', category: 'Home', price: 1599, old: 1999, tag: 'NEW', tone: 'mint', emoji: '💡', desc: 'Warm light, clean lines.' },
  { id: 4, name: 'Classic Timepiece', category: 'Accessories', price: 2899, old: 3599, tag: 'LIMITED', tone: 'blue', emoji: '⌚', desc: 'A timeless detail for your day.' },
  { id: 5, name: 'Ceramic Coffee Set', category: 'Home', price: 999, old: 1299, tag: 'MADE FOR YOU', tone: 'peach', emoji: '☕', desc: 'Make the little moments special.' },
  { id: 6, name: 'Wireless Speaker', category: 'Electronics', price: 2499, old: 3199, tag: 'TRENDING', tone: 'rose', emoji: '🔊', desc: 'Big sound in a compact design.' },
]
const money = n => '₹' + n.toLocaleString('en-IN')

export default function App() {
  const [cart, setCart] = useState([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [open, setOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const categories = ['All', 'Electronics', 'Accessories', 'Home']
  const shown = useMemo(() => products.filter(p => (category === 'All' || p.category === category) && (p.name + p.category).toLowerCase().includes(query.toLowerCase())), [category, query])
  const count = cart.reduce((n, x) => n + x.qty, 0)
  const total = cart.reduce((n, x) => n + x.price * x.qty, 0)
  const add = p => { setCart(old => old.some(x => x.id === p.id) ? old.map(x => x.id === p.id ? {...x, qty:x.qty+1} : x) : [...old, {...p, qty:1}]); setNotice(`${p.name} added to your bag`); setTimeout(() => setNotice(''), 2200) }
  const change = (id, d) => setCart(old => old.map(x => x.id === id ? {...x, qty:x.qty+d} : x).filter(x => x.qty > 0))
  return <div className="app">
    <div className="topline">A BETTER WAY TO SHOP <span>•</span> CURATED FINDS, EVERY DAY</div>
    <header className="nav wrap"><a className="brand" href="#"><span className="brandmark">m</span> micro<span>stack</span></a><nav><a href="#shop">Shop</a><a href="#story">Our story</a><a href="#benefits">Why us</a></nav><button className="bag" onClick={() => setOpen(true)}><ShoppingBag size={18}/> Bag <b>{count}</b></button></header>
    <main>
      <section className="hero wrap"><div className="hero-copy"><div className="eyebrow"><Sparkles size={15}/> THE EVERYDAY EDIT</div><h1>Good things.<br/><em>Thoughtfully</em> chosen.</h1><p>Discover useful, beautiful finds that make everyday living feel a little more special.</p><a className="primary" href="#shop">Explore collection <ArrowRight size={17}/></a><div className="hero-note"><span>✳</span> A little more joy in every order</div></div><div className="hero-art"><div className="art-orbit orbit-one"></div><div className="art-orbit orbit-two"></div><div className="art-card card-back">✦<small>THE GOOD<br/>LIFE EDIT</small></div><div className="art-card card-front"><span>CURATED FOR YOU</span><strong>Find your<br/>everyday<br/><i>favourite.</i></strong><div className="art-sticker">NEW<br/>SEASON</div></div><div className="floating f-one">✧</div><div className="floating f-two">✳</div></div></section>
      <section className="benefits wrap" id="benefits"><div><Truck/><span><b>Reliable delivery</b><small>To your doorstep</small></span></div><div><ShieldCheck/><span><b>Secure checkout</b><small>Shopping made simple</small></span></div><div><Headphones/><span><b>Here to help</b><small>Friendly support</small></span></div></section>
      <section className="shop wrap" id="shop"><div className="section-head"><div><div className="eyebrow">THE COLLECTION</div><h2>Find your next favourite.</h2><p>Little upgrades. Lasting delight.</p></div><div className="search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products"/></div></div>
        <div className="filters">{categories.map(c=><button className={category===c?'active':''} onClick={()=>setCategory(c)} key={c}>{c}</button>)}</div>
        <div className="products">{shown.map(p=><article className="product" key={p.id}><div className={`product-art ${p.tone}`}><span className="tag">{p.tag}</span><span className="product-emoji">{p.emoji}</span><button className="quick-add" onClick={()=>add(p)}><Plus size={18}/></button></div><div className="product-info"><div><small>{p.category}</small><h3>{p.name}</h3><p>{p.desc}</p></div><div className="price">{money(p.price)} <del>{money(p.old)}</del></div></div></article>)}</div>
        {shown.length===0&&<div className="empty">No products match that search. Try another keyword.</div>}
      </section>
      <section className="story wrap" id="story"><div className="story-mark">m.</div><div><div className="eyebrow">A SMALLER, BETTER WAY</div><h2>Less scrolling.<br/><em>More finding.</em></h2><p>MicroStack brings together practical picks and thoughtful design, so finding something you love feels easy.</p></div><div className="story-side">“The best finds are the ones that fit right into your life.”</div></section>
    </main>
    <footer><div className="wrap foot"><a className="brand" href="#"><span className="brandmark">m</span> micro<span>stack</span></a><small>© 2026 MicroStack. Student project demo.</small><small>Built with care · Powered by microservices</small></div></footer>
    {notice&&<div className="toast">{notice}</div>}
    {open&&<div className="overlay" onClick={()=>setOpen(false)}><aside className="drawer" onClick={e=>e.stopPropagation()}><div className="drawer-head"><div><small>YOUR SELECTION</small><h2>Shopping bag ({count})</h2></div><button onClick={()=>setOpen(false)}><X/></button></div>{cart.length===0?<div className="empty">Your bag is waiting for something lovely.</div>:<><div className="cart-items">{cart.map(x=><div className="cart-item" key={x.id}><div className={`mini ${x.tone}`}>{x.emoji}</div><div className="cart-desc"><b>{x.name}</b><small>{money(x.price)}</small><div className="qty"><button onClick={()=>change(x.id,-1)}><Minus size={13}/></button>{x.qty}<button onClick={()=>change(x.id,1)}><Plus size={13}/></button></div></div><strong>{money(x.price*x.qty)}</strong></div>)}</div><div className="checkout"><div><span>Subtotal</span><b>{money(total)}</b></div><button onClick={()=>{setNotice('Demo checkout selected — no payment is processed.');setOpen(false);setTimeout(()=>setNotice(''),2800)}}>Continue to demo checkout <ArrowRight size={17}/></button><small>Demo only. No real payment is collected.</small></div></>}</aside></div>}
  </div>
}
