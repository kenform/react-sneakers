import React from 'react'
import '../index.scss'
import { getPublicImageUrl } from '../utils/imagePath'

const ORDERS_STORAGE = 'react-sneakers-orders'

const readOrders = () => {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_STORAGE) || '[]')
  } catch {
    return []
  }
}

const writeOrders = (orders) => {
  localStorage.setItem(ORDERS_STORAGE, JSON.stringify(orders))
}

const normalizeOrder = (order) => ({
  id: String(order.id || Date.now()),
  createdAt: order.createdAt || new Date().toISOString(),
  total: order.total || (order.items || []).reduce((sum, item) => sum + Number(item.price || 0), 0),
  items: order.items || [],
})

function Orders() {
  const [orders, setOrders] = React.useState([])

  React.useEffect(() => {
    const localOrders = readOrders().map(normalizeOrder)
    setOrders(localOrders)
    writeOrders(localOrders)
  }, [])

  const updateOrders = (nextOrders) => {
    setOrders(nextOrders)
    writeOrders(nextOrders)
  }

  const deleteOrder = (orderId) => {
    updateOrders(orders.filter((order) => String(order.id) !== String(orderId)))
  }

  const deleteOrderItem = (orderId, itemId) => {
    const nextOrders = orders
      .map((order) => {
        if (String(order.id) !== String(orderId)) return order

        const nextItems = order.items.filter((item, index) => `${item.id}-${index}` !== String(itemId))
        return {
          ...order,
          items: nextItems,
          total: nextItems.reduce((sum, item) => sum + Number(item.price || 0), 0),
        }
      })
      .filter((order) => order.items.length > 0)

    updateOrders(nextOrders)
  }

  const clearHistory = () => {
    updateOrders([])
  }

  return (
    <main className='content ordersPage'>
      <div className='ordersPage__header'>
        <div>
          <span className='storeHero__eyebrow'>Order History</span>
          <h1 className='title'>Мои заказы</h1>
          <p>Здесь можно посмотреть оформленные товары и удалить лишние позиции после заказа.</p>
        </div>

        {orders.length > 0 && (
          <button className='ordersPage__clear' onClick={clearHistory}>
            Очистить историю
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className='ordersPage__empty'>
          <h2>Заказов пока нет</h2>
          <p>Добавьте кроссовки в корзину и оформите заказ — он появится здесь.</p>
        </div>
      ) : (
        <div className='ordersList'>
          {orders.map((order) => (
            <section className='orderCard' key={order.id}>
              <div className='orderCard__top'>
                <div>
                  <h2>Заказ #{order.id}</h2>
                  <p>{new Date(order.createdAt).toLocaleString('ru-RU')}</p>
                </div>

                <div className='orderCard__summary'>
                  <strong>{order.total} руб.</strong>
                  <button onClick={() => deleteOrder(order.id)}>Удалить заказ</button>
                </div>
              </div>

              <div className='orderCard__items'>
                {order.items.map((item, index) => (
                  <article className='orderItem' key={`${order.id}-${item.id}-${index}`}>
                    <img src={getPublicImageUrl(item.imageUrl, item.id)} alt={item.title} />
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.price} руб.</p>
                    </div>
                    <button onClick={() => deleteOrderItem(order.id, `${item.id}-${index}`)}>Удалить</button>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  )
}

export default Orders
