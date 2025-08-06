import clsx from 'clsx'
import type { ReactNode } from 'react'
import { Btn } from '../../../shared/ui/btns-or-links/btn'

export function PresettingItem({
	slider,
	min,
	max,
	leftCount,
	rightCount,
	leftCountIsIvisible,
	title,
	isStreak,
	onRandomClick,
}: {
	slider: ReactNode
	min: number
	max: number
	leftCount?: number
	rightCount: number
	title: string
	isStreak?: boolean
	onRandomClick?: () => void
	leftCountIsIvisible?: boolean
}) {
	return (
		<div className=' flex gap-10 items-center'>
			<div className='flex flex-col'>
				<div
					className={clsx(
						' bg-[#3e3e3e] text-[#e8e8e8] w-full max-w-md px-6 py-5  text-lg font-semibold shadow-lg flex items-center justify-center min-w-[350px]',
						isStreak ? 'rounded-t-2xl' : 'rounded-2xl'
					)}
				>
					{title}
				</div>
				{isStreak && (
					<div className='flex items-center justify-center py-2 rounded-b-2xl bg-[#81BACF] font-semibold'>
						<p>Подряд</p>
					</div>
				)}
			</div>
			{(leftCount || leftCountIsIvisible) && (
				<div
					className={clsx(
						' text-[#e8e8e8] w-12 h-12 p-6 ',
						leftCount &&
							'bg-[#3e3e3e] rounded-full text-lg font-semibold shadow-lg flex items-center justify-center'
					)}
				>
					{leftCount}
				</div>
			)}
			<div className=' flex items-center text-[#212121]'>
				<p className='mr-7 p-1 bg-[#d9d9d9] flex items-center justify-center rounded-full min-w-[2rem]'>
					{min}
				</p>
				<div className='w-[170px]'>{slider}</div>
				<p className='ml-5 p-1 bg-[#d9d9d9] flex items-center justify-center rounded-full min-w-[2rem]'>
					{max}
				</p>
			</div>
			<div className='bg-[#3e3e3e] text-[#e8e8e8] w-12 h-12 p-6 rounded-full text-lg font-semibold shadow-lg flex items-center justify-center'>
				{rightCount}
			</div>

			<Btn className='bg-[#3e3e3e] text-[#e1cb4f]' onClick={onRandomClick}>
				Рандом
			</Btn>
		</div>
	)
}
