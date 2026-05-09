import React from 'react'
import { useCart } from '../hooks/useCart'
import { Link, NavLink } from 'react-router-dom'
import './../index.scss'

function Header({ onClickCart }) {
  const { totalPrice } = useCart()

  return (
    <header className='header d-flex justify-between align-center'>
      <Link to='/' className='header__logo'>
        <img
          width={48}
          height={48}
          alt='React Sneakers'
          src={process.env.PUBLIC_URL + '/img/logo.png'}
        />
        <div className='logo__text'>
          <h3 className='text-uppercase'>React Sneakers</h3>
          <p>Магазин лучших кроссовок</p>
        </div>
      </Link>

      <nav className='header__nav'>
        <NavLink to='/'>Каталог</NavLink>
        <NavLink to='/favorites'>Избранное</NavLink>
        <NavLink to='/orders'>Заказы</NavLink>
      </nav>

      <ul className='header__actions actions-header d-flex'>
        <li onClick={onClickCart} className='actions-header__icon cu-p'>
          <img width={24} height={24} src={process.env.PUBLIC_URL + '/img/cart.svg'} alt='Корзина' />
          <span className='total__price'>{totalPrice} руб.</span>
        </li>

        <li className='actions-header__icon cu-p'>
          <Link to='/favorites'>
            <img width={24} height={24} src={process.env.PUBLIC_URL + '/img/heart.svg'} alt='Избранное' />
          </Link>
        </li>

        <li className='actions-header__icon cu-p'>
          <Link to='/orders'>
            <img width={24} height={24} src={process.env.PUBLIC_URL + '/img/user.svg'} alt='Заказы' />
          </Link>
        </li>
      </ul>
    </header>
  )
}

export default Header
