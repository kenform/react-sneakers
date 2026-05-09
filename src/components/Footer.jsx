import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className='siteFooter'>
      <div>
        <div className='siteFooter__brand'>React Sneakers</div>
        <p>Аккуратный demo-store: каталог, избранное, корзина и история заказов.</p>
      </div>

      <nav className='siteFooter__nav'>
        <Link to='/'>Каталог</Link>
        <Link to='/favorites'>Избранное</Link>
        <Link to='/orders'>Заказы</Link>
      </nav>
    </footer>
  )
}

export default Footer
