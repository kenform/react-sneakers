import React from 'react'
import ContentLoader from 'react-content-loader'

import AppContext from '../../context'
import { getPublicImageUrl, getSneakerImageUrl } from '../../utils/imagePath'

import styles from './Card.module.scss'

function Card({
  id,
  title,
  imageUrl,
  price,
  onFavorite,
  onPlus,
  favorited = false,
  loading = false,
}) {
  const { isItemAdded } = React.useContext(AppContext)
  const [isFavorite, setIsFavorite] = React.useState(favorited)
  const obj = { id, title, imageUrl, price }

  const onClickPlus = () => {
    onPlus(obj)
  }

  const onClickFavorite = () => {
    onFavorite(obj)
    setIsFavorite(!isFavorite)
  }

  return (
    <div className={styles.card}>
      {loading ? (
        <ContentLoader
          speed={2}
          width={180}
          height={270}
          viewBox='0 0 180 270'
          backgroundColor='#f3f7fb'
          foregroundColor='#e7eef5'
        >
          <rect x='0' y='0' rx='22' ry='22' width='180' height='145' />
          <rect x='0' y='165' rx='7' ry='7' width='160' height='16' />
          <rect x='0' y='190' rx='7' ry='7' width='115' height='16' />
          <rect x='0' y='238' rx='8' ry='8' width='85' height='26' />
          <rect x='140' y='232' rx='12' ry='12' width='38' height='38' />
        </ContentLoader>
      ) : (
        <>
          {onFavorite && (
            <button className={styles.favorite} onClick={onClickFavorite} aria-label='Добавить в избранное'>
              <img
                src={
                  isFavorite
                    ? process.env.PUBLIC_URL + '/img/liked.svg'
                    : process.env.PUBLIC_URL + '/img/unliked.svg'
                }
                alt='Favorite'
              />
            </button>
          )}

          <div className={styles.imageBox}>
            <img
              src={getPublicImageUrl(imageUrl, id)}
              onError={(event) => {
                event.currentTarget.src = process.env.PUBLIC_URL + '/' + getSneakerImageUrl(id)
              }}
              alt={title}
            />
          </div>

          <h5>{title}</h5>

          <div className={styles.cardBottom}>
            <div className='d-flex flex-column'>
              <span>Цена:</span>
              <b>{price} руб.</b>
            </div>

            {onPlus && (
              <button className={styles.plusButton} onClick={onClickPlus} aria-label='Добавить в корзину'>
                <img
                  width={24}
                  height={24}
                  src={
                    isItemAdded(id)
                      ? process.env.PUBLIC_URL + '/img/btn-checked.svg'
                      : process.env.PUBLIC_URL + '/img/btn-plus.svg'
                  }
                  alt='Plus'
                />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Card
