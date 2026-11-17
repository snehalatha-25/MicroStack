
import { useEffect, useMemo, useState } from 'react'
import {
  Search, ShoppingBag, ArrowRight, ShieldCheck, Truck,
  Headphones, X, Plus, Minus, Trash2, SlidersHorizontal, Check
} from 'lucide-react'
import './styles.css'

const API_URL = '/api/products'
const CART_API_URL = '/api/cart'
const ORDER_API_URL = '/api/orders'
const productImages = {
  // Electronics
  1: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
  4: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=85',
  5: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85',
  6: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85',
  7: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85',
  8: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=85',
  9: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=85',
  10: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=900&q=85',

  // Fashion
  11: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85',
  12: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=85',
  13: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85',
  14: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=85',
  15: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85',
  16: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85',
  17: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=85',

  // Home
  3: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85',
  18: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=900&q=85',
  19: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=900&q=85',
  20: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=85',
  21: 'https://images.unsplash.com/photo-1563861826100-9a?auto=format&fit=crop&w=900&q=85',
  22: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=85',
  23: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=85',
  24: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=85',

  // Accessories
  2: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85',
  25: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85',
  26: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85',
  27: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=900&q=85',
  28: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=85',
  29: 'https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&w=900&q=85',
  30: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=900&q=85'
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
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [currentView, setCurrentView] = useState('shop')
  const [orderLoading, setOrderLoading] = useState(false)
  const [orderError, setOrderError] = useState('')
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

// Delivery charge calculation
const deliveryCharge = subtotal >= 1000 ? 0 : 50

// Final amount customer needs to pay
const total = subtotal + deliveryCharge

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

  // Create an order first, then clear the cart only after success
  const checkout = async () => {
    if (!cart.length || cartBusy || orderLoading) return

    if (!customerName.trim() || !phone.trim() || !deliveryAddress.trim()) {
      setOrderError('Please enter your name, phone number and delivery address.')
      return
    }
if (!/^\d{10}$/.test(phone.trim())) {
      setOrderError('Please enter a valid 10-digit phone number.')
      return
    }

    try {
      setOrderLoading(true)
      setOrderError('')
      setCartError('')

      const orderData = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        items: cart.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.qty,
          unitPrice: item.price,
          image: item.image,
          category: item.category
        }))
      }

      const response = await fetch(ORDER_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        throw new Error('Order creation failed')
      }

      const createdOrder = await response.json()

      setSelectedOrder(createdOrder)
      setOrders(previous => [createdOrder, ...previous])
      setCurrentView('confirmation')
      setCartOpen(false)

      // Do not delete cart items until the order exists successfully.
      try {
        await Promise.all(
          cart.map(item =>
            fetch(`${CART_API_URL}/${item.id}`, {
              method: 'DELETE'
            }).then(deleteResponse => {
              if (!deleteResponse.ok) {
                throw new Error('Cart cleanup failed')
              }
            })
          )
        )
        await refreshCart()
      } catch (cleanupError) {
        setCartError('Your order was created, but the cart could not be completely cleared.')
      }

      showNotice('Your order has been placed successfully')
    } catch (err) {
      setOrderError('Unable to place your order. Please try again.')
    } finally {
      setOrderLoading(false)
    }
  }

  // Load orders stored by the Order Service for this runtime
  const openOrders = async () => {
    setCurrentView('orders')
    setOrderError('')

    try {
      const response = await fetch(ORDER_API_URL)
      if (!response.ok) throw new Error('Unable to load orders')
      const data = await response.json()
      setOrders(Array.isArray(data) ? data.reverse() : [])
    } catch (err) {
      setOrderError('Unable to load orders. Please check that Order Service is running.')
    }
  }

  const openTracking = async orderId => {
    try {
      setOrderError('')
      const response = await fetch(`${ORDER_API_URL}/${orderId}`)
      if (!response.ok) throw new Error('Unable to load order')
      const data = await response.json()
      setSelectedOrder(data)
      setCurrentView('tracking')
    } catch (err) {
      setOrderError('Unable to load tracking details.')
    }
  }

  // Demo-only manual tracking progression; no courier integration
  const advanceTracking = async () => {
    if (!selectedOrder || selectedOrder.status === 'DELIVERED' || orderLoading) return

    const stages = ['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED']
    const nextStatus = stages[stages.indexOf(selectedOrder.status) + 1]
    if (!nextStatus) return

    try {
      setOrderLoading(true)
      const response = await fetch(`${ORDER_API_URL}/${selectedOrder.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      })
      if (!response.ok) throw new Error('Unable to update tracking')

      const updatedOrder = await response.json()
      setSelectedOrder(updatedOrder)
      setOrders(previous => previous.map(order =>
        order.id === updatedOrder.id ? updatedOrder : order
      ))
      showNotice(`Demo status updated to ${nextStatus}`)
    } catch (err) {
      setOrderError('Unable to update demo tracking status.')
    } finally {
      setOrderLoading(false)
    }
  }

  return (
    <div className="site-shell">

      {/* Top information bar */}
      <div className="utility-bar">
        <div className="container utility-inner">
          <span>Welcome to MicroStack — Everyday shopping, made simple</span>
          <span>Customer Support | Help Centre</span>
        </div>
      </div>

      {/* Main header */}
      <header className="header container">
        <a className="logo" href="#top" aria-label="MicroStack home">
          <span className="logo-mark">M</span>
          <span>
            micro<span className="logo-accent">stack</span>
          </span>
        </a>

        <label className="header-search">
          <Search size={19} />

          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for products, brands and more..."
            aria-label="Search products"
          />

          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </label>

        <button
          className="my-orders-trigger"
          onClick={openOrders}
        >
          My Orders
        </button>

        <button
          className="cart-trigger"
          onClick={() => setCartOpen(true)}
        >
          <ShoppingBag size={19} />
          <span>My Cart</span>
          <b>{count}</b>
        </button>
      </header>

      {/* Category navigation */}
      <nav className="red-navigation">
        <div className="container red-navigation-inner">
          <a href="#categories">All Categories</a>
          <a href="#shop">Electronics</a>
          <a href="#shop">Fashion</a>
          <a href="#shop">Home & Living</a>
          <a href="#shop">Accessories</a>
          <a href="#about">About Us</a>
        </div>
      </nav>

      <main id="top">
        {currentView === 'shop' ? (
          <>

        {/* Hero banner */}
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

        {/* Service highlights */}
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

        {/* Product catalogue */}
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

        {/* About section */}
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


          </>
        ) : currentView === 'confirmation' && selectedOrder ? (
          <section className="order-page container">
            <div className="order-page-heading">
              <span className="eyebrow">ORDER CONFIRMED</span>
              <h1><Check size={25} /> Thank you for your order!</h1>
              <p>Your order has been created successfully in MicroStack.</p>
            </div>

            <div className="order-panel">
              <div className="order-panel-heading">
                <div>
                  <small>ORDER ID</small>
                  <h2>#{selectedOrder.id}</h2>
                </div>
                <div>
                  <small>ORDER DATE</small>
                  <b>{new Date(selectedOrder.orderDate).toLocaleString('en-IN')}</b>
                </div>
              </div>

              <h3>Items ordered</h3>
              {(selectedOrder.items || []).map((item, index) => (
                <div className="order-item" key={`${item.productId}-${index}`}>
                  <img src={item.image || productImages[item.productId] || productImages[1]} alt={item.productName} />
                  <div>
                    <b>{item.productName}</b>
                    <small>Qty: {item.quantity} × {money(item.unitPrice)}</small>
                  </div>
                  <strong>{money(item.lineTotal)}</strong>
                </div>
              ))}

              <div className="order-address">
                <h3>Delivery address</h3>
                <p>{selectedOrder.customerName}</p>
                <p>{selectedOrder.phone}</p>
                <p>{selectedOrder.deliveryAddress}</p>
              </div>

              <div className="order-total-lines">
                <div><span>Subtotal</span><b>{money(selectedOrder.subtotal)}</b></div>
                <div><span>Delivery</span><b>{Number(selectedOrder.deliveryCharge) === 0 ? 'FREE' : money(selectedOrder.deliveryCharge)}</b></div>
                <div className="order-grand-total"><span>Order total</span><b>{money(selectedOrder.total)}</b></div>
              </div>

              <div className="order-actions">
                <button className="checkout-button" onClick={() => openTracking(selectedOrder.id)}>
                  Track this order <ArrowRight size={17} />
                </button>
                <button className="secondary-action" onClick={openOrders}>View my orders</button>
                <button className="secondary-action" onClick={() => setCurrentView('shop')}>Continue shopping</button>
              </div>
              <p className="demo-disclaimer">Academic demo: no payment was collected and no real courier is connected.</p>
            </div>
          </section>
        ) : currentView === 'orders' ? (
          <section className="order-page container">
            <div className="order-page-heading">
              <span className="eyebrow">YOUR ACCOUNT</span>
              <h1>My Orders</h1>
              <p>Orders currently held by the running Order Service.</p>
            </div>

            {orderError && <div className="order-message">{orderError}</div>}
            {!orders.length ? (
              <div className="empty-state">
                <ShoppingBag size={30} />
                <h3>No orders found</h3>
                <p>Orders will appear here after you place them.</p>
                <button onClick={() => setCurrentView('shop')}>Start shopping</button>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <article className="order-list-card" key={order.id}>
                    <div>
                      <small>ORDER #{order.id}</small>
                      <h3>{money(order.total)}</h3>
                      <p>{new Date(order.orderDate).toLocaleString('en-IN')}</p>
                      <span className="order-status">{order.status}</span>
                    </div>
                    <div>
                      <p>{(order.items || []).length} item type(s)</p>
                      <button className="secondary-action" onClick={() => openTracking(order.id)}>
                        View tracking <ArrowRight size={15} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
            <button className="secondary-action back-to-shop" onClick={() => setCurrentView('shop')}>Back to shopping</button>
          </section>
        ) : currentView === 'tracking' && selectedOrder ? (
          <section className="order-page container">
            <div className="order-page-heading">
              <span className="eyebrow">ORDER TRACKING</span>
              <h1>Track order #{selectedOrder.id}</h1>
              <p>Current status: <strong>{selectedOrder.status}</strong></p>
            </div>

            {orderError && <div className="order-message">{orderError}</div>}
            <div className="order-panel">
              <div className="tracking-timeline">
                {['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED'].map((stage, index) => {
                  const event = (selectedOrder.trackingHistory || []).find(item => item.status === stage)
                  const completed = Boolean(event)
                  return (
                    <div className={`tracking-step ${completed ? 'completed' : ''}`} key={stage}>
                      <span className="tracking-marker">{completed ? <Check size={15} /> : index + 1}</span>
                      <div>
                        <b>{stage}</b>
                        <p>{event ? event.message : 'Not reached yet'}</p>
                        {event && <small>{new Date(event.timestamp).toLocaleString('en-IN')}</small>}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="order-actions">
                {selectedOrder.status !== 'DELIVERED' && (
                  <button className="checkout-button" onClick={advanceTracking} disabled={orderLoading}>
                    {orderLoading ? 'Updating...' : 'Advance demo tracking'} <ArrowRight size={17} />
                  </button>
                )}
                <button className="secondary-action" onClick={openOrders}>Back to my orders</button>
                <button className="secondary-action" onClick={() => setCurrentView('shop')}>Continue shopping</button>
              </div>
              <p className="demo-disclaimer">Tracking stages are manually advanced for this academic demonstration. They are not live courier updates.</p>
            </div>
          </section>
        ) : (
          <section className="order-page container">
            <div className="empty-state">
              <h3>Order not selected</h3>
              <button onClick={openOrders}>Open my orders</button>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
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

      {/* Notification */}
      {notice && (
        <div className="toast">
          <Check size={16} />
          {notice}
        </div>
      )}

      {/* Shopping cart drawer */}
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
                  <h3>Delivery details</h3>

                  <label className="checkout-field">
                    <span>Customer name</span>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                    />
                  </label>

                  <label className="checkout-field">
                    <span>Phone number</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    />
                  </label>

                  <label className="checkout-field">
                    <span>Delivery address</span>
                    <textarea
                      rows={3}
                      placeholder="House number, street, area, city and PIN code"
                      value={deliveryAddress}
                      onChange={e => setDeliveryAddress(e.target.value)}
                    />
                  </label>

                  {orderError && <div className="order-message">{orderError}</div>}

                  <div className="summary-line">
                    <span>Subtotal</span>
                    <b>{money(subtotal)}</b>
                  </div>
                  <div className="summary-line">
                    <span>Delivery charge</span>
                    <b>{deliveryCharge === 0 ? 'FREE' : money(deliveryCharge)}</b>
                  </div>
                  <div className="summary-line summary-total">
                    <strong>Final total</strong>
                    <strong>{money(total)}</strong>
                  </div>

                  <button
                    className="checkout-button"
                    onClick={checkout}
                    disabled={cartBusy || orderLoading}
                  >
                    {orderLoading ? 'Placing order...' : 'Place Order'}
                    <ArrowRight size={17} />
                  </button>

                  <p>Demo checkout — no real payment or courier service.</p>
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
