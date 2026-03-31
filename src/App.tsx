import { Link, Outlet, ScrollRestoration } from 'react-router-dom'
import './App.css'
import { ThemeToggle } from './components/theme-toggle/ThemeToggle'
import {
  Button,
  buttonVariants,
  type ButtonVariant,
} from './components/ui/button'
import { ThemeProvider } from './context/ThemeProvider'
import { Toaster } from './components/ui/sonner'

const vars: ButtonVariant[] = [
  'default',
  'outline',
  'secondary',
  'ghost',
  'destructive',
  'link',
]

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-showcase-theme">
      {/* <NavigationMenu className="self-stretch justify-center border-b-2">
        <div className="flex justify-between max-w-6xl grow">
          <Link
            to="/"
            className={buttonVariants({ variant: 'link', size: 'default' })}
          >
            Home
          </Link>
          <ThemeToggle />
        </div>
      </NavigationMenu> */}
      <nav className="flex self-stretch justify-center border-b-2 p-2">
        <div className="flex justify-between max-w-5xl grow">
          <Link
            to="/"
            className={buttonVariants({ variant: 'link', size: 'default' })}
          >
            Home
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <ScrollRestoration />
      <Outlet />
      <Toaster />
      {/* <div className="flex items-center">
        {vars.map((variant, key) => (
          <Button key={key} variant={variant} size="lg">
            {variant}
          </Button>
        ))}
        <Button variant={'ghost'}>helloooo</Button>
      </div> */}
    </ThemeProvider>
  )
}

export default App
