import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { IconButton } from '../../../shared/ui/icons/icon-button'
import { Link } from 'react-router'

export function Header({
	modeName,
	modeDesc,
}: {
	modeName?: string
	modeDesc?: string
}) {
	return (
		<div className='w-full relative top-0 p-7 bg-[#3E3E3E] rounded-b-2xl flex items-center gap-5 z-50'>
			<Link to={'/'}>
				<IconButton icon={<ArrowBackIcon />} />
			</Link>

			<p className='text-2xl'>{modeName ? modeName : 'Неизвестно'}</p>

			<p>{modeDesc ? modeDesc : 'Неизвестно'}</p>
		</div>
	)
}
