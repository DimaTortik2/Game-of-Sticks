import React, { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { AboutModal } from '../../../widgets/modals/about-model'

export const ShinyTitle: React.FC = () => {
	const [isModalVisible, setIsModalVisible] = useState(false)

	const containerRef = useRef<HTMLDivElement>(null)

	const mouseX = useMotionValue(50)
	const mouseY = useMotionValue(50)

	const springConfig = {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	}

	const springX = useSpring(mouseX, springConfig)
	const springY = useSpring(mouseY, springConfig)

	const rotate = useTransform(springX, [0, 100], [-7, 7])

	const backgroundImage = useTransform(
		[springX, springY],
		([x, y]) =>
			`radial-gradient(
				250px circle at ${x}% ${y}%,
				#FFD700,
				#e8e8e8 70%
			)`
	)

	const handleMouseMove = (e: React.MouseEvent) => {
		const container = containerRef.current
		if (!container) return

		const rect = container.getBoundingClientRect()
		const x = ((e.clientX - rect.left) / rect.width) * 100
		const y = ((e.clientY - rect.top) / rect.height) * 100

		mouseX.set(x)
		mouseY.set(y)
	}

	const handleMouseLeave = () => {
		mouseX.set(50)
		mouseY.set(50)
	}

	return (
		<>
			<div
				ref={containerRef}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				className='w-screen z-[30] flex items-center justify-center bg-[#212121] py-20'
			>
				<motion.div
					style={{
						rotate,
					}}
				>
					<div
						className='bg-[#3e3e3e] z-60 text-[#e8e8e8] p-14 rounded-2xl max-w-[95vw] cursor-pointer transition-transform transform hover:scale-101'
						onClick={() => setIsModalVisible(true)}
					>
						<motion.p
							className='text-7xl font-bold bg-clip-text text-transparent'
							style={{
								backgroundImage,
							}}
						>
							About Sticks
						</motion.p>
					</div>
				</motion.div>
			</div>
			<AboutModal
				isVisible={isModalVisible}
				onClose={() => setIsModalVisible(false)}
			/>
		</>
	)
}
