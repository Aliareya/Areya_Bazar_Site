import React from 'react'
import AppLayout from './AppLayout'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastContainer } from 'react-toastify'
import { ApiProvider } from './context/ApiContext'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ApiProvider>
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
        </ApiProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App