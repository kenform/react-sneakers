import React from 'react'
import { Route, Routes } from 'react-router-dom'
import axios from 'axios'
import Header from './components/Header'
import Drawer from './components/Drawer'
import Footer from './components/Footer'
import AppContext from './context'

import Home from './pages/Home'
import Favorites from './pages/Favorites'
import Orders from './pages/Orders'
import { fallbackSneakers } from './data/fallbackSneakers'
import { withLocalSneakerImage } from './utils/imagePath'

const CART_API = 'https://64e215a3ab0037358818aaa5.mockapi.io/cart'
const FAVORITES_API = 'https://64e4a988c555638029139625.mockapi.io/favorites'
const ITEMS_API = 'https://64e215a3ab0037358818aaa5.mockapi.io/items'
const CART_STORAGE = 'react-sneakers-cart'
const FAVORITES_STORAGE = 'react-sneakers-favorites'
const ORDERS_STORAGE = 'react-sneakers-orders'

const readStorage = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}

const writeStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

function App() {
  const [items, setItems] = React.useState(fallbackSneakers)
  const [cartItems, setCartItems] = React.useState(() => readStorage(CART_STORAGE))
  const [favorites, setFavorites] = React.useState(() => readStorage(FAVORITES_STORAGE))
  const [searchValue, setSearchValue] = React.useState('')
  const [cartOpened, setCartOpened] = React.useState(false)

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [cartResponse, favoritesResponse, itemsResponse] = await Promise.allSettled([
          axios.get(CART_API),
          axios.get(FAVORITES_API),
          axios.get(ITEMS_API),
        ])

        if (itemsResponse.status === 'fulfilled' && Array.isArray(itemsResponse.value.data) && itemsResponse.value.data.length) {
          setItems(itemsResponse.value.data.map(withLocalSneakerImage))
        } else {
          setItems(fallbackSneakers)
        }

        if (cartResponse.status === 'fulfilled' && Array.isArray(cartResponse.value.data)) {
          const nextCart = cartResponse.value.data.map(withLocalSneakerImage)
          setCartItems(nextCart)
          writeStorage(CART_STORAGE, nextCart)
        }

        if (favoritesResponse.status === 'fulfilled' && Array.isArray(favoritesResponse.value.data)) {
          const nextFavorites = favoritesResponse.value.data.map(withLocalSneakerImage)
          setFavorites(nextFavorites)
          writeStorage(FAVORITES_STORAGE, nextFavorites)
        }
      } catch (error) {
        console.warn('MockAPI is unavailable, using local fallback data.', error)
        setItems(fallbackSneakers)
      }
    }

    fetchData()
  }, [])

  const updateCart = (nextCart) => {
    setCartItems(nextCart)
    writeStorage(CART_STORAGE, nextCart)
  }

  const clearCart = () => {
    updateCart([])
  }

  const saveLocalOrder = ({ id, items: orderItems, total, createdAt }) => {
    const currentOrders = readStorage(ORDERS_STORAGE)
    const order = {
      id: String(id || Date.now()),
      createdAt: createdAt || new Date().toISOString(),
      total: total || orderItems.reduce((sum, item) => sum + Number(item.price || 0), 0),
      items: orderItems.map(withLocalSneakerImage),
    }

    writeStorage(ORDERS_STORAGE, [order, ...currentOrders])
  }

  const onAddToCart = async (obj) => {
    const normalizedItem = withLocalSneakerImage(obj)
    const findItem = cartItems.find((item) => Number(item.id) === Number(normalizedItem.id))

    const nextCart = findItem
      ? cartItems.filter((item) => Number(item.id) !== Number(normalizedItem.id))
      : [...cartItems, normalizedItem]

    updateCart(nextCart)

    try {
      if (findItem) {
        await axios.delete(`${CART_API}/${findItem.id}`)
      } else {
        await axios.post(CART_API, normalizedItem)
      }
    } catch (error) {
      console.warn('Cart API sync failed; local cart is still updated.', error)
    }
  }

  const onRemoveItem = async (id) => {
    const nextCart = cartItems.filter((item) => Number(item.id) !== Number(id))
    updateCart(nextCart)

    try {
      await axios.delete(`${CART_API}/${id}`)
    } catch (error) {
      console.warn('Cart API remove failed; local cart is still updated.', error)
    }
  }

  const onAddToFavorite = async (obj) => {
    const normalizedItem = withLocalSneakerImage(obj)
    const exists = favorites.find((favObj) => Number(favObj.id) === Number(normalizedItem.id))
    const nextFavorites = exists
      ? favorites.filter((item) => Number(item.id) !== Number(normalizedItem.id))
      : [...favorites, normalizedItem]

    setFavorites(nextFavorites)
    writeStorage(FAVORITES_STORAGE, nextFavorites)

    try {
      if (exists) {
        await axios.delete(`${FAVORITES_API}/${exists.id}`)
      } else {
        await axios.post(FAVORITES_API, normalizedItem)
      }
    } catch (error) {
      console.warn('Favorites API sync failed; local favorites are still updated.', error)
    }
  }

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value)
  }

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.id) === Number(id))
  }

  return (
    <AppContext.Provider
      value={{
        items,
        cartItems,
        favorites,
        isItemAdded,
        onAddToFavorite,
        onAddToCart,
        setCartOpened,
        setCartItems,
        clearCart,
      }}
    >
      <div className='pageDecor' aria-hidden='true'>
        <span></span><span></span><span></span><span></span><span></span>
      </div>

      <div className='wrapper clear'>
        <Drawer
          items={cartItems}
          onClose={() => setCartOpened(false)}
          onRemove={onRemoveItem}
          onClearCart={clearCart}
          onCompleteOrder={(order) => {
            saveLocalOrder(order)
            clearCart()
          }}
          opened={cartOpened}
        />

        <Header onClickCart={() => setCartOpened(true)} />

        <Routes>
          <Route
            path=''
            element={
              <Home
                items={items}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onChangeSearchInput={onChangeSearchInput}
                onAddToFavorite={onAddToFavorite}
                onAddToCart={onAddToCart}
              />
            }
          />
          <Route path='favorites' element={<Favorites />} />
          <Route path='orders' element={<Orders />} />
        </Routes>

        <Footer />
      </div>
    </AppContext.Provider>
  )
}

export default App
