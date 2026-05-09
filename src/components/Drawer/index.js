import React from 'react'
import axios from 'axios'

import Info from '../Info'
import { useCart } from '../../hooks/useCart'
import { getPublicImageUrl } from '../../utils/imagePath'

import styles from './Drawer.module.scss'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function Drawer({ onClose, onRemove, onClearCart, onCompleteOrder, items = [], opened }) {
  const { cartItems, totalPrice } = useCart()
  const [orderId, setOrderId] = React.useState(null)
  const [isOrderComplete, setIsOrderComplete] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const onClickOrder = async () => {
    if (!cartItems.length) return

    const orderItems = cartItems.map((item) => ({ ...item }))
    const createdAt = new Date().toISOString()
    let resolvedOrderId = Date.now()

    try {
      setIsLoading(true)

      const { data } = await axios.post('https://64e4a988c555638029139625.mockapi.io/orders', {
        items: orderItems,
        createdAt,
        total: totalPrice,
      })

      resolvedOrderId = data?.id || resolvedOrderId

      for (let i = 0; i < orderItems.length; i++) {
        const item = orderItems[i]
        await axios.delete('https://64e215a3ab0037358818aaa5.mockapi.io/cart/' + item.id).catch(() => null)
        await delay(120)
      }
    } catch (error) {
      console.warn('Order API failed; local order is still saved.', error)
    } finally {
      onCompleteOrder?.({
        id: resolvedOrderId,
        items: orderItems,
        total: totalPrice,
        createdAt,
      })
      setOrderId(resolvedOrderId)
      setIsOrderComplete(true)
      setIsLoading(false)
    }
  }

  return (
    <div
      className={`${styles.overlay} ${opened ? styles.overlayVisible : ''}`}
      onClick={onClose}
    >
      <div className={styles.drawer} onClick={(event) => event.stopPropagation()}>
        <h2 className='d-flex justify-between mb-30'>
          Корзина
          <img
            onClick={onClose}
            className='cu-p'
            src={process.env.PUBLIC_URL + '/img/btn-remove.svg'}
            alt='Close'
          />
        </h2>

        {items.length > 0 ? (
          <div className='d-flex flex-column flex'>
            <div className='items flex'>
              {items.map((obj) => (
                <div key={obj.id} className='cartItem d-flex mb-20'>
                  <div
                    style={{
                      backgroundImage: `url(${getPublicImageUrl(obj.imageUrl, obj.id)})`,
                    }}
                    className='cartItemImg'
                  ></div>

                  <div className='cartItem__text flex'>
                    <p className='mb-5'>{obj.title}</p>
                    <b>{obj.price} руб.</b>
                  </div>

                  <button
                    type='button'
                    onClick={() => onRemove(obj.id)}
                    className='removeBtn'
                    aria-label='Удалить товар'
                  >
                    <img alt='Remove' src={process.env.PUBLIC_URL + '/img/btn-remove.svg'} />
                  </button>
                </div>
              ))}
            </div>

            <div className='cartTotalBlock'>
              <button type='button' className='cartClearButton' onClick={onClearCart}>
                Очистить корзину
              </button>

              <ul>
                <li>
                  <span>Итого:</span>
                  <div></div>
                  <b>{totalPrice.toFixed(0)} руб.</b>
                </li>
                <li>
                  <span>Налог 5%:</span>
                  <div></div>
                  <b>{((totalPrice / 100) * 5).toFixed(0)} руб.</b>
                </li>
              </ul>

              <button disabled={isLoading} onClick={onClickOrder} className='greenButton'>
                {isLoading ? 'Оформляем...' : 'Оформить заказ'}
                <img src={process.env.PUBLIC_URL + '/img/arrow.svg'} alt='Arrow' />
              </button>
            </div>
          </div>
        ) : (
          <Info
            title={isOrderComplete ? 'Заказ оформлен!' : 'Корзина пустая'}
            description={
              isOrderComplete
                ? `Ваш заказ #${orderId} сохранён. Его можно посмотреть и удалить в разделе заказов.`
                : 'Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ.'
            }
            image={
              isOrderComplete
                ? process.env.PUBLIC_URL + '/img/complete-order.jpg'
                : process.env.PUBLIC_URL + '/img/empty-cart.jpg'
            }
          />
        )}
      </div>
    </div>
  )
}

export default Drawer
