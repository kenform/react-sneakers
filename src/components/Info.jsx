import React from 'react'
import AppContext from '../context'
import { Link } from 'react-router-dom'

const Info = ({ title, image, description }) => {
	const { setCartOpened } = React.useContext(AppContext)

	return (
		<div className='cartEmpty d-flex align-center justify-center flex-column flex'>
			<img className='mb-20' width='120px' src={image} alt='Empty' />
			<h2>{title}</h2>
			<p className='opacity-6'>{description}</p>

			<Link to='/'>
				<button onClick={() => setCartOpened(false)} className='greenButton'>
					<img src={process.env.PUBLIC_URL + '/img/arrow.svg'} alt='Arrow' />
					Вернуться назад
				</button>
			</Link>
		</div>
	)
}

export default Info
