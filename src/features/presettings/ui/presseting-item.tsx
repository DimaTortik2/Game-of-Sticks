import type { ReactNode } from 'react'

export function PresettingItem({
	slider,
	min,
	max,
	leftCount,
	rightCount,
	title,
}: {
	slider: ReactNode
	min: number
	max: number
	leftCount?: number
	rightCount: number
	title: string
}) {
	return (
		<div className=' flex gap-10 items-center'>
			<div className=' bg-[#3e3e3e] text-[#e8e8e8] w-full max-w-md px-6 py-5 rounded-2xl text-lg font-semibold shadow-lg flex items-center justify-center'>
				{title}
			</div>
			{leftCount && (
				<div className='bg-[#3e3e3e] text-[#e8e8e8] w-12 h-12 p-6 rounded-full text-lg font-semibold shadow-lg flex items-center justify-center'>
					{leftCount}
				</div>
			)}
			<div className=' flex items-center text-[#212121]'>
				<p className='mr-7 min-w-[2rem]'>{min}</p>
				<div className='w-[170px]'>{slider}</div>
				<p className='ml-5 min-w-[2rem]'>{max}</p>
			</div>
			<div className='bg-[#3e3e3e] text-[#e8e8e8] w-12 h-12 p-6 rounded-full text-lg font-semibold shadow-lg flex items-center justify-center'>
				{rightCount}
			</div>
		</div>
	)
}
