import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import { Link } from 'react-router'

export function PlayButton({ onClick }: { onClick: () => void }) {
	return (
		<Link to={'/game'}>
			<div
				onClick={onClick}
				className='bg-[#4B9E51] p-5 w-[100px] h-[100px] rounded-full absolute bottom-[40px] left-[40px] flex justify-center items-center cursor-pointer transition-transform transform hover:scale-105'
			>
				<ArrowRightIcon sx={{ fontSize: 110, color: '#e8e8e8' }} />
			</div>
		</Link>
	)
}
