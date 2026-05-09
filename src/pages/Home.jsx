import React from 'react'

import Card from '../components/Card'
import '../index.scss'

function Home({
  items,
  searchValue,
  setSearchValue,
  onChangeSearchInput,
  onAddToFavorite,
  onAddToCart,
  isLoading,
}) {
  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchValue.toLowerCase())
  )

  const renderItems = () => {
    return (isLoading ? [...Array(8)] : filteredItems).map((item, index) => (
      <Card
        key={item?.id || index}
        onFavorite={(obj) => onAddToFavorite(obj)}
        onPlus={(obj) => onAddToCart(obj)}
        loading={isLoading}
        {...item}
      />
    ))
  }

  return (
    <main className='content'>
      <section className='storeHero'>
        <div>
          <span className='storeHero__eyebrow'>Sneaker Store</span>
          <h1>Свежие кроссовки для города и повседневного стиля</h1>
          <p>
            Выбирай пару, добавляй в избранное, собирай корзину и оформляй заказ без лишней сложности.
          </p>
        </div>

        <div className='storeHero__stats'>
          <span>12 моделей</span>
          <span>Избранное</span>
          <span>Быстрый заказ</span>
        </div>
      </section>

      <div className='search-container d-flex align-center justify-between mb-40'>
        <h2 className='title'>
          {searchValue ? `Поиск: "${searchValue}"` : 'Все кроссовки'}
        </h2>

        <div className='search-block d-flex'>
          <img
            className='search__icon'
            width={25}
            height={25}
            src={process.env.PUBLIC_URL + '/img/search.svg'}
            alt='Search'
          />

          {searchValue && (
            <img
              onClick={() => setSearchValue('')}
              className='clear cu-p'
              src={process.env.PUBLIC_URL + '/img/btn-remove.svg'}
              alt='Clear'
            />
          )}

          <input
            onChange={onChangeSearchInput}
            value={searchValue}
            placeholder='Поиск кроссовок...'
          />
        </div>
      </div>

      <div className='cards__content'>{renderItems()}</div>
    </main>
  )
}

export default Home
