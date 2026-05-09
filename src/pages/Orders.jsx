import React from 'react'
import axios from 'axios'
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
  const [orders, setOrders] = React.useState(() => readOrders().map(normalizeOrder))
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    ;(async () => {
      try {
        const { data } = await axios.get('https://64e4a988c555638029139625.mockapi.io/orders')
        const remoteOrders = Array.isArray(data) ? data.map(normalizeOrder) : []
        const localOrders = readOrders().map(normalizeOrder)

        const uniqueOrders = [...localOrders, ...remoteOrders].reduce((acc, order) => {
          if (!acc.some((item) => String(item.id) === String(order.id))) {
            acc.push(order)
          }
          return acc
        }, [])

        setOrders(uniqueOrders)
        writeOrders(uniqueOrders)
      } catch (error) {
        console.warn('Orders API unavailable; using local orders.', error)
        setOrders(readOrders().map(normalizeOrder))
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  const deleteOrder = (orderId) => {
    const nextOrders = orders.filter((order) => String(order.id) !== String(orderId))
    setOrders(nextOrders)
    writeOrders(nextOrders)
  }

  const deleteOrderItem = (orderId, itemId) => {
    const nextOrders = orders
      .map((order) => {
        if (String(order.id) !== String(orderId)) return order

        const nextItems = order.items.filter((item) => String(item.id) !== String(itemId))
        return {
          ...order,
          items: nextItems,
          total: nextItems.reduce((sum, item) => sum + Number(item.price || 0), 0),
        }
      })
      .filter((order) => order.items.length > 0)

    setOrders(nextOrders)
    writeOrders(nextOrders)
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
          <button className='ordersPage__clear' onClick={() => {
            setOrders([])
            writeOrders([])
          }}>
            Очистить историю
          </button>
        )}
      </div>

      {isLoading ? (
        <div className='ordersPage__empty'>Загружаем заказы...</div>
      ) : orders.length === 0 ? (
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
                {order.items.map((item) => (
                  <article className='orderItem' key={`${order.id}-${item.id}`}>
                    <img src={getPublicImageUrl(item.imageUrl, item.id)} alt={item.title} />
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.price} руб.</p>
                    </div>
                    <button onClick={() => deleteOrderItem(order.id, item.id)}>Удалить</button>
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
