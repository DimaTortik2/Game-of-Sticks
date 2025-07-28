import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { Transition } from 'framer-motion'
import { TestPage } from './pages/test-page'
import { MainMenuPage } from './pages/main-menu/fasade/main-menu-page'
import { PresettingsPage } from './pages/presettings/fasade/presittings-page'
import { useBackToast } from './shared/model/hooks/use-back-toast'
import { GamePage } from './pages/game-page/fasade/game-page'

const pageVariants = {
	initial: {
		opacity: 0,
	},
	in: {
		opacity: 1,
	},
	out: {
		opacity: 0,
	},
}

const pageTransition: Transition = {
	type: 'tween',
	ease: 'anticipate',
	duration: 0.25,
}

const AnimatedRoutes = () => {
	const location = useLocation()
	useBackToast()

	return (
		<AnimatePresence mode='wait'>
			<Routes location={location} key={location.pathname}>
				<Route
					path='/'
					element={
						<motion.div
							initial='initial'
							animate='in'
							exit='out'
							variants={pageVariants}
							transition={pageTransition}
						>
							<MainMenuPage />
						</motion.div>
					}
				/>
				<Route
					path='/test'
					element={
						<motion.div
							initial='initial'
							animate='in'
							exit='out'
							variants={pageVariants}
							transition={pageTransition}
						>
							<TestPage />
						</motion.div>
					}
				/>
				<Route
					path='/preset'
					element={
						<motion.div
							initial='initial'
							animate='in'
							exit='out'
							variants={pageVariants}
							transition={pageTransition}
						>
							<PresettingsPage />
						</motion.div>
					}
				/>
				<Route
					path='/game'
					element={
							<motion.div
								initial='initial'
								animate='in'
								exit='out'
								variants={pageVariants}
								transition={pageTransition}
							>
								<GamePage />
							</motion.div>
					}
				/>
			</Routes>
		</AnimatePresence>
	)
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<div className='relative w-full min-h-screen bg-[#e8e8e8]'>
				<AnimatedRoutes />
			</div>
		</BrowserRouter>
		<ToastContainer
			position='bottom-right'
			autoClose={10000}
			hideProgressBar={false}
		/>
	</StrictMode>
)
