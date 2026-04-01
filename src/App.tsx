import { Link, Outlet, ScrollRestoration } from 'react-router-dom'
import './App.css'
import { ThemeToggle } from './components/theme-toggle/ThemeToggle'
import { buttonVariants } from './components/ui/button'
import { ThemeProvider } from './context/ThemeProvider'
import { Toaster } from './components/ui/sonner'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-showcase-theme">
      <nav className="flex self-stretch justify-center border-b py-2 px-6">
        <div className="flex justify-between max-w-5xl grow">
          <Link
            to="/"
            className={`
              ${buttonVariants({ variant: 'link', size: 'lg' })}
              `}
          >
            Home
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <ScrollRestoration />
      <Outlet />
      <Toaster />
    </ThemeProvider>
  )
}

export default App
