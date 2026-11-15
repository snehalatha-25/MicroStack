
import { useEffect, useMemo, useState } from 'react'
import {
  Search, ShoppingBag, ArrowRight, ShieldCheck, Truck,
  Headphones, X, Plus, Minus, Trash2, SlidersHorizontal, Check
} from 'lucide-react'
import './styles.css'

const API_URL = 'http://localhost:8081/api/products'
const CART_API_URL = 'http://localhost:8082/api/cart'

const productImages = {
  1: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
  2: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85',
  3: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85'
}

const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Accessories']

const money = n => `₹${Number(n).toLocaleString('en-IN')}`

export default function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [cart, setCart] = useState([])
  const [cartLoading, setCartLoading] = useState(false)
  const [cartBusy, setCartBusy] = useState(false)
  const [cartError, setCartError] = useState('')

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('featured')
  const [cartOpen, setCartOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)

  // Fetch products from Java Product Service
  useEffect(() => {
    let active = true

    async function loadProducts() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error('Product API request failed')
        }

        const data = await response.json()

        if (!Array.isArray(data)) {
          throw new Error('Invalid product response')
        }

        const formattedProducts = data.map(product => ({
          ...product,
          price: Number(product.price),
          image: productImages[product.id] || productImages[1],
          description: 'Discover this everyday essential.',
          badge: ''
        }))

        if (active) {
          setProducts(formattedProducts)
        }
      } catch (err) {
        if (active) {
          setError('Unable to load products from the backend. Please check that the Product Service is running.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      active = false
    }
  }, [])

  // Convert backend cart data into frontend cart format
  const formatCartItems = data => {
    return data.map(item => {
      const product = products.find(
        p => Number(p.id) === Number(item.productId)
      )

      return {
        id: Number(item.productId),
        name: item.productName,
        qty: Number(item.quantity),
        price: Number(item.unitPrice),
        image: product?.image || productImages[item.productId] || productImages[1],
        category: product?.category || 'Other',
        description: product?.description || ''
      }
    })
  }

  // Fetch cart from Java Cart Service
  const refreshCart = async () => {
    const response = await fetch(CART_API_URL)

    if (!response.ok) {
      throw new Error('Unable to load cart')
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new Error('Invalid cart response')
    }

    setCart(formatCartItems(data))
  }

  // Load backend cart after products are available
  useEffect(() => {
    if (!products.length) return

    let active = true

    async function loadCart() {
      try {
        setCartLoading(true)
        setCartError('')

        const response = await fetch(CART_API_URL)

        if (!response.ok) {
          throw new Error('Cart API request failed')
        }

        const data = await response.json()

        if (active && Array.isArray(data)) {
          setCart(formatCartItems(data))
        }
      } catch (err) {
        if (active) {
          setCartError('Unable to load your cart. Please check that the Cart Service is running.')
        }
      } finally {
        if (active) {
          setCartLoading(false)
        }
      }
    }

    loadCart()

    return () => {
      active = false
    }
  }, [products])

  // Search, category filtering and sorting
  const shown = useMemo(() => {
    let list = products.filter(product =>
      (category === 'All' || product.category === category) &&
      `${product.name} ${product.category} ${product.description}`
        .toLowerCase()
        .includes(query.toLowerCase())
    )

    if (sort === 'low') {
      list = [...list].sort((a, b) => a.price - b.price)
    }

    if (sort === 'high') {
      list = [...list].sort((a, b) => b.price - a.price)
    }

    if (sort === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    }

    return list
  }, [products, category, query, sort])

  const count = cart.reduce((sum, item) => sum + item.qty, 0)

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  )

  // Display notification
  const showNotice = message => {
    setNotice(message)

    window.clearTimeout(window.__microStackNotice)

    window.__microStackNotice = window.setTimeout(
      () => setNotice(''),
      2200
    )
  }

  // Add product using backend POST API
  const add = async product => {
    try {
      setCartBusy(true)
      setCartError('')

      const response = await fetch(CART_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          quantity: 1,
          unitPrice: product.price
        })
      })

      if (!response.ok) {
        throw new Error('Unable to add product')
      }

      await refreshCart()

      setOrderPlaced(false)
      showNotice(`${product.name} added to cart`)
    } catch (err) {
      setCartError('Could not add product. Please try again.')
      showNotice('Unable to add product')
    } finally {
      setCartBusy(false)
    }
  }

  // Update quantity using backend PUT or DELETE API
  const changeQty = async (id, delta) => {
    const item = cart.find(item => item.id === id)

    if (!item) return

    const newQuantity = item.qty + delta

    try {
      setCartBusy(true)
      setCartError('')

      let response

      if (newQuantity <= 0) {
        response = await fetch(`${CART_API_URL}/${id}`, {
          method: 'DELETE'
        })
      } else {
        response = await fetch(
          `${CART_API_URL}/${id}?quantity=${newQuantity}`,
          { method: 'PUT' }
        )
      }

      if (!response.ok) {
        throw new Error('Unable to update quantity')
      }

      await refreshCart()
    } catch (err) {
      setCartError('Could not update product quantity.')
    } finally {
      setCartBusy(false)
    }
  }

  // Remove product using backend DELETE API
  const remove = async id => {
    try {
      setCartBusy(true)
      setCartError('')

      const response = await fetch(`${CART_API_URL}/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Unable to remove product')
      }

      await refreshCart()
      showNotice('Product removed from cart')
    } catch (err) {
      setCartError('Could not remove product. Please try again.')
    } finally {
      setCartBusy(false)
    }
  }

  // Demo checkout: clear backend cart, but do not create a real order
  const checkout = async () => {
    if (!cart.length || cartBusy) return

    try {
      setCartBusy(true)
      setCartError('')

      for (const item of cart) {
        const response = await fetch(`${CART_API_URL}/${item.id}`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          throw new Error('Unable to clear cart')
        }
      }

      await refreshCart()

      setOrderPlaced(true)
      showNotice('Demo order placed successfully')
    } catch (err) {
      setCartError('Checkout could not be completed. Please try again.')
      await refreshCart().catch(() => {})
    } finally {
      setCartBusy(false)
    }
  }

  return (
    <div className="site-shell">

      <div className="announcement">
        THOUGHTFUL FINDS FOR EVERYDAY LIVING
        <span>•</span>
        DISCOVER THE MICROSTACK EDIT
      </div>

      <header className="header container">
        <a className="logo" href="#top" aria-label="MicroStack home">
          <span className="logo-mark">M</span>
          <span>
            micro<span className="logo-accent">stack</span>
          </span>
        </a>

        <nav className="main-nav">
          <a href="#shop">Shop</a>
          <a href="#categories">Categories</a>
          <a href="#about">About</a>
        </nav>

        <div className="header-actions">
          <button
            className="cart-trigger"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag size={18} />
            <span>Cart</span>
            <b>{count}</b>
          </button>
        </div>
      </header>

      <main id="top">

        <section className="hero container">
          <div className="hero-copy">
            <span className="eyebrow">THE EVERYDAY COLLECTION</span>

            <h1>
              Find the things<br />
              that make life <em>better.</em>
            </h1>

            <p>
              Useful essentials, considered design and everyday favourites
              — all in one place.
            </p>

            <a className="hero-cta" href="#shop">
              Explore the collection <ArrowRight size={17} />
            </a>

            <div className="hero-assurance">
              <span><Check size={14} /> Thoughtful selection</span>
              <span><Check size={14} /> Easy shopping</span>
            </div>
          </div>

          <div className="hero-photo">
            <img
              src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=85"
              alt="Everyday home essentials"
            />
            <div className="hero-photo-label">
              <small>THE MICROSTACK EDIT</small>
              <strong>Everyday,<br />elevated.</strong>
            </div>
          </div>
        </section>

        <section className="trust-strip container">
          <div>
            <Truck />
            <span>
              <b>Reliable delivery</b>
              <small>To your doorstep</small>
            </span>
          </div>

          <div>
            <ShieldCheck />
            <span>
              <b>Simple, secure shopping</b>
              <small>A clear checkout experience</small>
            </span>
          </div>

          <div>
            <Headphones />
            <span>
              <b>Customer support</b>
              <small>Here when you need us</small>
            </span>
          </div>
        </section>

        <section className="shop-section container" id="shop">

          <div className="section-heading">
            <div>
              <span className="eyebrow">SHOP THE COLLECTION</span>
              <h2>Everyday favourites.</h2>
              <p>
                Explore practical picks across the categories you love.
              </p>
            </div>

            <div className="result-count">
              {loading ? 'Loading...' : `${shown.length} products`}
            </div>
          </div>

          <div className="toolbar">
            <div className="category-tabs" id="categories">
              {categories.map(c => (
                <button
                  key={c}
                  className={category === c ? 'selected' : ''}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="toolbar-right">
              <label className="search-box">
                <Search size={17} />

                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search products..."
                  aria-label="Search products"
                />

                {query && (
                  <button
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </label>

              <label className="sort-box">
                <SlidersHorizontal size={15} />

                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  aria-label="Sort products"
                >
                  <option value="featured">Featured</option>
                  <option value="low">Price: low to high</option>
                  <option value="high">Price: high to low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </label>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              <p>Loading products from MicroStack backend...</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <h3>Products unavailable</h3>
              <p>{error}</p>
            </div>
          ) : shown.length ? (
            <div className="product-grid">
              {shown.map(p => (
                <article className="product-card" key={p.id}>
                  <div className="product-image">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                    />

                    {p.badge && (
                      <span className="product-badge">
                        {p.badge}
                      </span>
                    )}

                    <button
                      className="add-button"
                      onClick={() => add(p)}
                      disabled={cartBusy}
                      aria-label={`Add ${p.name} to cart`}
                    >
                      <Plus size={19} />
                    </button>
                  </div>

                  <div className="product-meta">
                    <span>{p.category}</span>
                    <span className="product-price">
                      {money(p.price)}
                    </span>
                  </div>

                  <h3>{p.name}</h3>

                  <p className="product-description">
                    {p.description}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Search size={26} />
              <h3>No matching products</h3>
              <p>
                Try another search term or choose a different category.
              </p>
              <button
                onClick={() => {
                  setQuery('')
                  setCategory('All')
                }}
              >
                Clear filters
              </button>
            </div>
          )}

        </section>

        <section className="about-section container" id="about">
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1000&q=85"
              alt="Thoughtfully arranged everyday home essentials"
              loading="lazy"
            />
          </div>

          <div className="about-copy">
            <span className="eyebrow">A BETTER WAY TO DISCOVER</span>

            <h2>
              Good design.<br />
              <em>Everyday purpose.</em>
            </h2>

            <p>
              MicroStack brings together useful products across electronics,
              fashion, home and accessories. Browse clearly, compare simply
              and build your everyday essentials in one place.
            </p>

            <a href="#shop">
              Browse all products <ArrowRight size={16} />
            </a>
          </div>
        </section>

      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <a className="logo footer-logo" href="#top">
            <span className="logo-mark">M</span>
            <span>
              micro<span className="logo-accent">stack</span>
            </span>
          </a>

          <p>Everyday essentials, thoughtfully brought together.</p>

          <small>
            © 2026 MicroStack. Academic project demonstration.
          </small>
        </div>
      </footer>

      {notice && (
        <div className="toast">
          <Check size={16} />
          {notice}
        </div>
      )}

      {cartOpen && (
        <div
          className="drawer-backdrop"
          onMouseDown={e => {
            if (e.target === e.currentTarget) {
              setCartOpen(false)
            }
          }}
        >
          <aside className="cart-drawer">

            <div className="drawer-header">
              <div>
                <span className="eyebrow">YOUR SELECTION</span>
                <h2>
                  Shopping cart <small>({count})</small>
                </h2>
              </div>

              <button
                className="icon-button"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
              >
                <X />
              </button>
            </div>

            {orderPlaced && (
              <div className="order-message">
                <Check size={18} />
                Demo order placed successfully. No payment was processed.
              </div>
            )}

            {cartError && (
              <div className="order-message">
                {cartError}
              </div>
            )}

            {cartLoading && (
              <div className="empty-state">
                <p>Loading your cart...</p>
              </div>
            )}

            {!cartLoading && cart.length ? (
              <>
                <div className="cart-list">
                  {cart.map(item => (
                    <div className="cart-row" key={item.id}>
                      <img src={item.image} alt={item.name} />

                      <div className="cart-item-info">
                        <b>{item.name}</b>
                        <small>{money(item.price)}</small>

                        <div className="quantity-control">
                          <button
                            onClick={() => changeQty(item.id, -1)}
                            disabled={cartBusy}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={13} />
                          </button>

                          <span>{item.qty}</span>

                          <button
                            onClick={() => changeQty(item.id, 1)}
                            disabled={cartBusy}
                            aria-label="Increase quantity"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="cart-row-end">
                        <b>{money(item.price * item.qty)}</b>

                        <button
                          className="remove-button"
                          onClick={() => remove(item.id)}
                          disabled={cartBusy}
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div>
                    <span>Subtotal</span>
                    <b>{money(subtotal)}</b>
                  </div>

                  <small>
                    Shipping and taxes are not calculated in this demo.
                  </small>

                  <button
                    className="checkout-button"
                    onClick={checkout}
                    disabled={cartBusy}
                  >
                    {cartBusy ? 'Please wait...' : 'Place demo order'}
                    <ArrowRight size={17} />
                  </button>

                  <p>
                    Demonstration only — no real payment or shipment.
                  </p>
                </div>
              </>
            ) : !cartLoading ? (
              <div className="cart-empty">
                <ShoppingBag size={35} />
                <h3>Your cart is empty</h3>
                <p>
                  Explore the collection and add something you like.
                </p>
                <button onClick={() => setCartOpen(false)}>
                  Continue shopping
                </button>
              </div>
            ) : null}

          </aside>
        </div>
      )}

    </div>
  )
}
