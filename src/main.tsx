import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home } from './pages/home/home.tsx'
import { ParabolaPage } from './pages/parabola/parabola.tsx'
import { PorcupinePage } from './pages/porcupine/porcupine.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'parabola',
        element: <ParabolaPage />,
      },
      {
        path: 'porcupine',
        element: <PorcupinePage />,
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
