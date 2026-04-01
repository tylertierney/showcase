import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home } from './pages/home/home.tsx'
import { ParabolaPage } from './pages/parabola/parabola.tsx'
import { PorcupinePage } from './pages/porcupine/porcupine.tsx'
import { MatrixPage } from './pages/matrix/matrix.tsx'
import { Sandbox } from './components/sandbox/sandbox.tsx'

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
      {
        path: 'matrix',
        element: <MatrixPage />,
      },
      {
        path: 'sandbox',
        element: <Sandbox />,
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
