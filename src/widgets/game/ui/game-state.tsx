import clsx from 'clsx'

export function GameState({
	isEnemyStep,
	selectedCount,
	className,
	isHelping,
}: {
	isEnemyStep: boolean
	selectedCount: number
	className?: string
	isHelping: boolean
}) {
	return (
		<div
			className={clsx(
				'p-5 rounded-2xl text-[#e8e8e8] min-w-[130px] text-center',
				className,
				isHelping
					? 'bg-[#cfbd56]'
					: selectedCount > 0
					? 'bg-[#3e3e3e]'
					: isEnemyStep
					? 'bg-[#E59696]'
					: 'bg-[#58BF5F]'
			)}
		>
			{isHelping
				? 'Подсказка'
				: selectedCount > 0
				? 'Выбрано ' + selectedCount
				: isEnemyStep
				? 'Ход противника'
				: 'Ваш ход'}
		</div>
	)
}
