import React from 'react'
import axios from 'axios'

import Info from '../Info'
import { useCart } from '../../hooks/useCart'

import styles from './Drawer.module.scss'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function Drawer({ onClose, onRemove, items = [], opened }) {
	const { cartItems, setCartItems, totalPrice } = useCart()
	const [orderId, setOrderId] = React.useState(null)
	const [isOrderComplete, setIsOrderComplete] = React.useState(false)
	const [isLoading, setIsLoading] = React.useState(false)

	const onClickOrder = async () => {
		try {
			console.log(isLoading)
			setIsLoading(true)
			console.log(isLoading)
			const { data } = await axios.post(
				'https://64e4a988c555638029139625.mockapi.io/orders',
				{
					items: cartItems,
				}
			)

			setOrderId(data.id)
			setIsOrderComplete(true)
			setCartItems([])

			for (let i = 0; i < cartItems.length; i++) {
				const item = cartItems[i]
				await axios.delete(
					'https://64e215a3ab0037358818aaa5.mockapi.io/cart/' + item.id
				)
				await delay(1500)
			}
		} catch (error) {
			alert('Ошибка при создании заказа :(')
		}
		setIsLoading(false)
	}

	return (
		<div className={`${styles.overlay} ${opened ? styles.overlayVisible : ''}`}>
			<div className={styles.drawer}>
				<h2 className='d-flex justify-between mb-30'>
					Корзина{' '}
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
								<div
									key={obj.id}
									className='cartItem d-flex  mb-20'
								>
									<div
										style={{
											backgroundImage: `url(${process.env.PUBLIC_URL + "/" + obj.imageUrl
											})`,
										}}
										className='cartItemImg'
									></div>

									<div className='cartItem__text flex'>
										<p className='mb-5'>{obj.title}</p>
										<b>{obj.price} руб.</b>
									</div>
									<img
										onClick={() => onRemove(obj.id)}
										className='removeBtn'
										alt='Remove'
										src={process.env.PUBLIC_URL + '/img/btn-remove.svg'}
									/>
								</div>
							))}
						</div>
						<div className='cartTotalBlock'>
							<ul>
								<li>
									<span>Итого:</span>
									<div></div>
									<b>{totalPrice.toFixed(1)} руб. </b>
								</li>
								<li>
									<span>Налог 5%:</span>
									<div></div>
									<b>{((totalPrice / 100) * 5).toFixed(1)} руб. </b>
								</li>
							</ul>
							<button
								disabled={isLoading}
								onClick={onClickOrder}
								className='greenButton'
							>
								Оформить заказ{' '}
								<img
									src={process.env.PUBLIC_URL + '/img/arrow.svg'}
									alt='Arrow'
								/>
							</button>
						</div>
					</div>
				) : (
					<Info
						title={isOrderComplete ? 'Заказ оформлен!' : 'Корзина пустая'}
						description={
							isOrderComplete
								? `Ваш заказ #${orderId} скоро будет передан курьерской доставке`
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
