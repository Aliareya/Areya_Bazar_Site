import React, { useEffect, useMemo, useState } from 'react'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'

const API_BASE = 'http://localhost:3000'

const CATEGORIES = ['همه دسته‌ها', 'پوشاک', 'لوازم خانه', 'الکترونیک', 'زیبایی', 'ورزش']
const STOCK_FILTERS = ['همه وضعیت‌ها', 'موجود', 'کم موجود', 'ناموجود']

const PAGE_SIZE = 8

function stockInfo(stock, lowStockThreshold = 0) {
  if (stock === 0) return { label: 'ناموجود', style: 'bg-rose-50 text-rose-700 ring-rose-600/20' }
  if (stock <= (lowStockThreshold || 10)) return { label: 'کم موجود', style: 'bg-amber-50 text-amber-700 ring-amber-600/20' }
  return { label: 'موجود', style: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' }
}

// Afghan Afghani formatting
function formatPrice(value) {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat('fa-AF').format(value) + ' افغانی'
}

export default function Products() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [stockFilter, setStockFilter] = useState(STOCK_FILTERS[0])
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/products`)
      if (!res.ok) throw new Error(`خطا در دریافت اطلاعات (${res.status})`)
      const data = await res.json()
      setProducts(Array.isArray(data) ? data : data.products || [])
    } catch (err) {
      setError(err.message || 'خطا در ارتباط با سرور')
    } finally {
      setLoading(false)
    }
  }

  async function removeProduct(id) {
    const prev = products
    setProducts((p) => p.filter((x) => x.id !== id))
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
    } catch {
      setProducts(prev)
      alert('حذف محصول با خطا مواجه شد')
    }
  }

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const name = p.name || ''
      const sku = p.sku || ''
      const matchesSearch =
        name.toLowerCase().includes(search.toLowerCase()) ||
        sku.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === CATEGORIES[0] || p.category === category
      const info = stockInfo(p.stock, p.lowStockThreshold).label
      const matchesStock = stockFilter === STOCK_FILTERS[0] || info === stockFilter
      return matchesSearch && matchesCategory && matchesStock
    })
  }, [products, search, category, stockFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageSafe = Math.min(page, totalPages)
  const pageItems = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE)

  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0)
  const outOfStockCount = products.filter((p) => p.stock === 0).length
  const lowStockCount = products.filter(
    (p) => p.stock > 0 && p.stock <= (p.lowStockThreshold || 10)
  ).length

  if (loading) {
    return (
      <div dir="rtl" className="flex h-64 items-center justify-center text-black/40">
        <Icon icon="mdi:loading" className="ml-2 h-5 w-5 animate-spin" />
        در حال بارگذاری محصولات...
      </div>
    )
  }

  if (error) {
    return (
      <div dir="rtl" className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
        <Icon icon="mdi:alert-circle-outline" className="mx-auto mb-2 h-8 w-8" />
        {error}
        <div>
          <button
            onClick={fetchProducts}
            className="mt-3 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    )
  }

  return (
    <div dir="rtl" className="space-y-5">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1A1B23]">محصولات</h1>
          <p className="mt-1 text-sm text-black/50">مدیریت محصولات، موجودی و دسته‌بندی‌ها</p>
        </div>
        <button
          onClick={() => navigate('/admin/products/create')}
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-600/40"
        >
          <Icon icon="mdi:plus" className="h-5 w-5" />
          افزودن محصول
        </button>
      </div>

      {/* Stat chips */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'کل محصولات', value: products.length, icon: 'mdi:package-variant-closed', tint: 'text-slate-600 bg-slate-100' },
          { label: 'موجودی کل', value: totalStock, icon: 'mdi:warehouse', tint: 'text-violet-600 bg-violet-50' },
          { label: 'کم موجود', value: lowStockCount, icon: 'mdi:alert-outline', tint: 'text-amber-600 bg-amber-50' },
          { label: 'ناموجود', value: outOfStockCount, icon: 'mdi:close-circle-outline', tint: 'text-rose-600 bg-rose-50' },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-lg border border-black/10 bg-white p-4">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${s.tint}`}>
              <Icon icon={s.icon} className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-lg font-bold leading-none text-[#1A1B23]">{s.value}</p>
              <p className="mt-1 truncate text-xs text-black/50">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="rounded-lg border border-black/10 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Icon
              icon="mdi:magnify"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35"
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="جستجو بر اساس نام یا کد محصول..."
              className="w-full rounded-lg border border-black/10 bg-[#F4F5F7] py-2 pr-9 pl-3 text-sm text-[#1A1B23] placeholder:text-black/35 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
                setPage(1)
              }}
              className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#1A1B23] focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={stockFilter}
              onChange={(e) => {
                setStockFilter(e.target.value)
                setPage(1)
              }}
              className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#1A1B23] focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            >
              {STOCK_FILTERS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Product table */}
      <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
        {pageItems.length === 0 ? (
          <div className="px-4 py-16 text-center text-black/40">
            <Icon icon="mdi:package-variant-closed-remove" className="mx-auto mb-2 h-8 w-8 text-black/25" />
            محصولی با این مشخصات پیدا نشد
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-right text-sm">
              <thead>
                <tr className="border-b border-black/10 bg-[#F9FAFB] text-xs text-black/50">
                  <th className="whitespace-nowrap px-4 py-3 font-medium">محصول</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">کد / برند</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">دسته‌بندی</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">قیمت</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">موجودی</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">وضعیت</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((p) => {
                  const info = stockInfo(p.stock, p.lowStockThreshold)
                  return (
                    <tr key={p.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.02]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-10 w-10 shrink-0 rounded-md object-cover"
                          />
                          <div className="min-w-0">
                            <p className="max-w-[220px] truncate font-medium text-[#1A1B23]">{p.name}</p>
                            {p.shortDescription && (
                              <p className="max-w-[220px] truncate text-xs text-black/40">{p.shortDescription}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-black/60">
                        <p>{p.sku}</p>
                        {p.brand && <p className="text-xs text-black/40">{p.brand}</p>}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="rounded-md bg-[#F4F5F7] px-2 py-1 text-xs font-medium text-black/60">
                          {p.category}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <p className="font-medium text-[#1A1B23]">{formatPrice(p.price)}</p>
                        {p.compareAtPrice > p.price && (
                          <p className="text-xs text-black/35 line-through">{formatPrice(p.compareAtPrice)}</p>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${info.style}`}>
                          {info.label}
                        </span>
                        <p className="mt-1 text-xs text-black/40">{p.stock} عدد</p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {p.status === 'active' ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                            فعال
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/20">
                            غیرفعال
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            title="ویرایش"
                            onClick={() => navigate(`/admin/products/${p.id}/edit`)}
                            className="rounded-md p-1.5 text-black/40 transition hover:bg-black/5 hover:text-violet-600"
                          >
                            <Icon icon="mdi:pencil-outline" className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            title="حذف"
                            onClick={() => removeProduct(p.id)}
                            className="rounded-md p-1.5 text-black/40 transition hover:bg-rose-50 hover:text-rose-600"
                          >
                            <Icon icon="mdi:trash-can-outline" className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex flex-col gap-3 rounded-lg border border-black/10 bg-white p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-black/45">
            نمایش {(pageSafe - 1) * PAGE_SIZE + 1} تا {(pageSafe - 1) * PAGE_SIZE + pageItems.length} از {filtered.length} محصول
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={pageSafe <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-md p-2 text-black/50 transition hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Icon icon="mdi:chevron-right" className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i + 1)}
                className={`h-8 w-8 rounded-md text-sm font-medium transition ${
                  pageSafe === i + 1 ? 'bg-violet-600 text-white' : 'text-black/60 hover:bg-black/5'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              disabled={pageSafe >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-md p-2 text-black/50 transition hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Icon icon="mdi:chevron-left" className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}