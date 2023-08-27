import React from 'react';
import Card from '../components/Card';
import AppContext from '../context';
import '../index.scss'
function Favorites() {
  const { favorites, onAddToFavorite } = React.useContext(AppContext);

  return (
		<div className='content p-30'>
			<div className='mb-40'>
				<h1 className='title' >Мои закладки</h1>
			</div>

			<div className='cards__content'>
				{favorites.map((item, index) => (
					<Card
						key={index}
						favorited={true}
						onFavorite={onAddToFavorite}
						{...item}
					/>
				))}
			</div>
		</div>
	)
}

export default Favorites;
