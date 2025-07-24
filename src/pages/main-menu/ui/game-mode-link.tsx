import { Link } from 'react-router-dom'

interface IProps {
	number?: number
	title: string
	description: string
	onClick: () => void
	to: string
}

export const GameModeLink = ({
	number,
	title,
	description,
	onClick,
	to,
}: IProps) => {
	return (
		<Link
			to={to}
			onClick={onClick}
			className='bg-[#d9d9d9] text-[#212121] p-4 rounded-2xl flex items-start gap-4 w-full max-w-md shadow-md transition-transform transform hover:scale-105 cursor-pointer'
		>
			<div className='flex-shrink-0 flex items-center justify-center w-12 h-12 bg-[#d9d9d9] text-custom-dark text-4xl font-bold rounded-full border-2 border-[#212121]'>
				{number || 'nan'}
			</div>
			<div className='flex-grow'>
				<h3 className='font-bold text-xl mb-1'>{title}</h3>
				<p className='text-sm'>{description}</p>
			</div>
		</Link>
	)
}
