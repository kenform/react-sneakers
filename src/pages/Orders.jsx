import React from 'react'
import axios from 'axios'
import '../index.scss'
import Card from '../components/Card'
import AppContext from '../context'

function Orders() {
	const { onAddToFavorite, onAddToCart } = React.useContext(AppContext)
	const [orders, setOrders] = React.useState([])
	const [isLoading, setIsLoading] = React.useState(true)

	React.useEffect(() => {
		;(async () => {
			try {
				const { data } = await axios.get(
					'https://64e4a988c555638029139625.mockapi.io/orders'
				)
				setOrders(data.reduce((prev, obj) => [...prev, ...obj.items], []))
				setIsLoading(false)
			} catch (error) {
				alert('Ошибка при запросе заказов')
				console.error(error)
			}
		})()
	}, [])

	return (
		<div className='content p-30'>
			<div className='mb-40'>
				<h1 className='title'>Мои заказы</h1>
			</div>

			<div className='cards__content'>
				{(isLoading ? [...Array(8)] : orders).map((item, index) => (
					<Card key={index} loading={isLoading} {...item} />
				))}
			</div>
		</div>
	)
}

export default Orders
