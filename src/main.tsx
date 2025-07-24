import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { MainMenuPage } from './pages/main-menu/ui/main-menu-page'
import { BrowserRouter, Routes, Route } from 'react-router'
import { TestPage } from './pages/test-page'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<MainMenuPage />} />
				<Route path='/test' element={<TestPage />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>
)
