import React, { useEffect } from 'react'
import AppLayout from './AppLayout'
import {
  BrowserRouter,
  useLocation,
} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastContainer } from 'react-toastify'
import { ApiProvider } from './context/ApiContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { CheckoutProvider } from './context/CheckoutContext'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <AuthProvider>
        <ApiProvider>
          <CartProvider>
            <WishlistProvider>
              <CheckoutProvider>
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  pauseOnHover
                  theme="light"
                />
                <AppLayout />
              </CheckoutProvider>
            </WishlistProvider>
          </CartProvider>
        </ApiProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App