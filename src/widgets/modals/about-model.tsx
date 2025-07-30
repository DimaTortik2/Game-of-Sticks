import { BasicModal } from '../../shared/ui/modal/basic-modal'

export function AboutModal({
	isVisible,
	onClose,
}: {
	isVisible: boolean
	onClose: () => void
}) {
	return (
		<BasicModal
			isVisible={isVisible}
			onClose={onClose}
			className='w-[95vw] max-w-[1000px]'
		>
			<div className='absolute top-0 left-0 w-16 h-12 bg-[#d3d3d350] [clip-path:polygon(0_0,100%_0,0_100%)] rounded-tl-2xl' />
			<div className='absolute bottom-0 right-0 w-20 h-20 bg-[#d3d3d350] [clip-path:polygon(100%_100%,0_100%,100%_0)] rounded-br-2xl' />

			<div className='flex flex-col items-center justify-center p-5 gap-5'>
				<p className='text-[#E8E8E8] text-xl'>
					Спасибо от всей души за вашу поддержку, доброту и внимание. Ваше
					участие стало для меня важным источником вдохновения. Я ценю каждый
					жест, каждое слово и вашу заботу. Благодаря вам я чувствую
					уверенность, тепло и мотивацию двигаться вперёд. Искренне признателен
					вам!
				</p>
				<p className='text-[#E8E8E850]'>- ChatGpt</p>
			</div>
		</BasicModal>
	)
}
