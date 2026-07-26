import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { Route, Routes } from 'react-router-dom'
import Users from '../pages/users/Users'
import UserEdit from '../pages/users/EditUsers'
import Dashboard from '../pages/dashbaord/Dashboard'
import Products from '../pages/products/Products'
import CreateProduct from '../pages/products/CreateProduct'
import ProductEdit from '../pages/products/EditProduct'
import Categories from '../pages/categories/Categories'
import CreateCategory from '../pages/categories/CreateCategory'
import EditCategory from '../pages/categories/EditCategory'



export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

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
      <Sidebar mobileOpen={mobileOpen}/>

      {/* Main column */}
      <div className="lg:pr-64 bg-slate-100">
        {/* Topbar */}
        <Topbar setMobileOpen={setMobileOpen}/>

        {/* Content */}
        <main className="px-3 lg:px-5 py-6">
          <Routes>
            <Route path='/admin/users' element={<Users/>}/>
            <Route path='/admin/users/:id' element={<UserEdit/>}/>
            <Route path='/admin/dasboard' element={<Dashboard/>}/>
            <Route path='/admin/products' element={<Products/>}/>
            <Route path='/admin/products/create' element={<CreateProduct/>}/>
            <Route path='/admin/products/:id/edit' element={<ProductEdit/>}/>
            <Route path='/admin/categories' element={<Categories/>}/>
            <Route path='/admin/categories/create' element={<CreateCategory/>}/>
            <Route path='/admin/categories/:id/edit' element={<EditCategory/>}/>
          </Routes>
        </main>
      </div>
    </div>
  )
}