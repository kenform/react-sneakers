import React from 'react'

import Card from '../components/Card'
import "../index.scss"
function Home({
	items,
	searchValue,
	setSearchValue,
	onChangeSearchInput,
	onAddToFavorite,
	onAddToCart,
	isLoading,
}) {
	const renderItems = () => {
		const filtredItems = items.filter((item) =>
			item.title.toLowerCase().includes(searchValue.toLowerCase())
		)
		return (isLoading ? [...Array(8)] : filtredItems).map((item, index) => (
			<Card
				key={index}
				onFavorite={(obj) => onAddToFavorite(obj)}
				onPlus={(obj) => onAddToCart(obj)}
				loading={isLoading}
				{...item}
			/>
		))
	}

	return (
		<div className='content'>
			<div className='search-container d-flex align-center justify-between mb-40'>
				<h1 className='title'>
					{searchValue ? `Поиск по запросу: "${searchValue}"` : 'Все кроссовки'}
				</h1>
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
						placeholder='Поиск...'
					/>
				</div>
			</div>

			<div className='cards__content'>{renderItems()}</div>
		</div>
	)
}

export default Home
