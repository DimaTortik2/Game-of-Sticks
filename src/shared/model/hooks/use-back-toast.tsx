import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import type { Id } from 'react-toastify'

const ToastContent = ({
	onBackClick,
	closeToast,
}: {
	onBackClick: () => void
	closeToast?: () => void
}) => {
	const handleBack = () => {
		onBackClick()
		if (closeToast) {
			closeToast()
		}
	}

	return (
		<div className='bg-[#3e3e3e] rounded-2xl p-4 text-[#e8e8e8]'>
			<span>Возможно вы случайно вышли ?</span>
			<button
				onClick={handleBack}
				className='p-2 text-[#212121] bg-[#e8e8e8] rounded-2xl mt-2 cursor-pointer transition-transform transform hover:scale-105'
			>
				Обратно!
			</button>
		</div>
	)
}

export const useBackToast = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const toastId = useRef<Id | null>(null)

	useEffect(() => {
		if (location.state?.showBackToast) {
			const goBack = () => {
				navigate(-1)
			}

			toastId.current = toast(<ToastContent onBackClick={goBack} />, {
				toastId: 'custom-back-toast',
				autoClose: 8000,
				closeButton: false,
				className: 'full-width-toast',
			})

			navigate(location.pathname, {
				state: { ...location.state, showBackToast: false },
				replace: true,
			})
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location])
}
