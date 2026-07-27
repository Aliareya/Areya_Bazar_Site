import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom'
import Users from '../pages/users/Users'
import UserEdit from '../pages/users/EditUsers'
import Dashboard from '../pages/dashbaord/Dashboard'
import Products from '../pages/products/Products'
import CreateProduct from '../pages/products/CreateProduct'
import ProductEdit from '../pages/products/EditProduct'
import Categories from '../pages/categories/Categories'
import CreateCategory from '../pages/categories/CreateCategory'
import EditCategory from '../pages/categories/EditCategory'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const { user, is_login, loading, checkAuth } = useAuth()

  useEffect(() => {
    // Wait until the auth check finishes before deciding anything
    if (loading) return

    if (!user || user.role !== 'admin') {
      navigate('/auth/login')
    }
  }, [user, loading, navigate])

  // While auth status is being verified, show a loading screen
  // instead of flashing the admin panel or redirecting too early
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F5F7]">
        <div className="flex flex-col items-center gap-3 text-black/40">
          <Icon icon="mdi:loading" className="h-8 w-8 animate-spin text-violet-500" />
          <p className="text-sm">در حال بررسی هویت کاربر...</p>
        </div>
      </div>
    )
  }

  // Don't render admin content at all if the user isn't an authorized admin
  // (the useEffect above will redirect, this just prevents a flash of content)
  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#F4F5F7] text-[#1A1B23]">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main column */}
      <div className="lg:pr-64 bg-slate-100">
        {/* Topbar */}
        <Topbar setMobileOpen={setMobileOpen} />

        {/* Content */}
        <main className="px-3 lg:px-5 py-6">
          <Routes>
            {/* Default: redirect /admin to dashboard */}
            <Route index element={<Navigate to="/admin/dashboard" replace />} />

            <Route path="/admin/dashboard" element={<Dashboard />} />

            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/users/:id" element={<UserEdit />} />

            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/products/create" element={<CreateProduct />} />
            <Route path="/admin/products/:id/edit" element={<ProductEdit />} />

            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/categories/create" element={<CreateCategory />} />
            <Route path="/admin/categories/:id/edit" element={<EditCategory />} />

            {/* Catch-all: unknown admin routes redirect to dashboard */}
            {/* <Route path="*" element={<Navigate to="/admin/dashboard" replace />} /> */}
          </Routes>
        </main>
      </div>
    </div>
  )
}