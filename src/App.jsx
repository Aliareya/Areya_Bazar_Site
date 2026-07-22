import React from 'react'
import AppLayout from './AppLayout'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastContainer } from 'react-toastify'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App