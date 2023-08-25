import React from 'react'
import { Link } from 'react-router-dom'
import './../index.scss'
import { useCart } from '../hooks/useCart'

function Header(props) {
	const { totalPrice } = useCart()

	return (
		<header className='d-flex justify-between align-center p-40'>
			<Link to='/'>
				<div className='d-flex align-center'>
					<img className='mr-15' width={40} height={40} src='img/logo.png' alt='Logotype' />
					<div>
						<h3 className='text-uppercase'>React Sneakers</h3>
						<p className='opacity-5'>Магазин лучших кроссовок</p>
					</div>
				</div>
			</Link>
			<ul className='header__actions actions-header d-flex '>
				<div className='actions-header__icon'>
					<li
						onClick={props.onClickCart}
						className='actions-header__icon  cu-p'
					>
						<img
							className='mr-15'
							width={25}
							height={25}
							src='img/cart.svg'
							alt='Корзина'
						/>
						<span>{totalPrice} руб.</span>
					</li>
				</div>

				<div className='actions-header__icon'>
					<li className=' cu-p'>
						<Link to='/favorites'>
							<img width={25} height={25} src='img/heart.svg' alt='Закладки' />
						</Link>
					</li>
				</div>

				<div className='actions-header__icon'>
					<li className='cu-p'>
						<Link to='/orders'>
							<img
								width={25}
								height={25}
								src='img/user.svg'
								alt='Пользователь'
							/>
						</Link>
					</li>
				</div>
			</ul>
		</header>
	)
}

export default Header
