import React, { useMemo, useState } from 'react'
import { Icon } from '@iconify/react'
import { Navigate, useNavigate } from 'react-router-dom'

// ---- Static data (replace with real API data later) --------------------
const CATEGORIES = ['همه دسته‌ها', 'پوشاک', 'لوازم خانه', 'الکترونیک', 'زیبایی', 'ورزش']
const STOCK_FILTERS = ['همه وضعیت‌ها', 'موجود', 'کم موجود', 'ناموجود']

const PRODUCTS = [
  {
    id: 1,
    name: 'کیف چرم دستدوز',
    category: 'پوشاک',
    price: 1250000,
    stock: 24,
    rating: 4.6,
    sku: 'BAG-1042',
    image: 'https://picsum.photos/seed/bag1/400/300',
  },
  {
    id: 2,
    name: 'هدفون بی‌سیم نویز کنسلینگ',
    category: 'الکترونیک',
    price: 3480000,
    stock: 8,
    rating: 4.8,
    sku: 'AUD-2093',
    image: 'https://picsum.photos/seed/headphone/400/300',
  },
  {
    id: 3,
    name: 'مجموعه ظروف سرامیکی',
    category: 'لوازم خانه',
    price: 890000,
    stock: 0,
    rating: 4.2,
    sku: 'HOME-3311',
    image: 'https://picsum.photos/seed/ceramics/400/300',
  },
  {
    id: 4,
    name: 'کرم مرطوب‌کننده صورت',
    category: 'زیبایی',
    price: 420000,
    stock: 56,
    rating: 4.4,
    sku: 'BEA-0087',
    image: 'https://picsum.photos/seed/cream/400/300',
  },
  {
    id: 5,
    name: 'کفش دویدن مردانه',
    category: 'ورزش',
    price: 2150000,
    stock: 15,
    rating: 4.5,
    sku: 'SPO-5521',
    image: 'https://picsum.photos/seed/shoe1/400/300',
  },
  {
    id: 6,
    name: 'ساعت هوشمند سری ۵',
    category: 'الکترونیک',
    price: 5670000,
    stock: 3,
    rating: 4.7,
    sku: 'AUD-7742',
    image: 'https://picsum.photos/seed/watch1/400/300',
  },
  {
    id: 7,
    name: 'پتوی پشمی دو نفره',
    category: 'لوازم خانه',
    price: 1340000,
    stock: 19,
    rating: 4.3,
    sku: 'HOME-4420',
    image: 'https://picsum.photos/seed/blanket/400/300',
  },
  {
    id: 8,
    name: 'ژاکت بافتنی زنانه',
    category: 'پوشاک',
    price: 980000,
    stock: 0,
    rating: 4.1,
    sku: 'BAG-6650',
    image: 'https://picsum.photos/seed/jacket/400/300',
  },
  {
    id: 9,
    name: 'توپ یوگا ضد انفجار',
    category: 'ورزش',
    price: 350000,
    stock: 42,
    rating: 4.0,
    sku: 'SPO-1189',
    image: 'https://picsum.photos/seed/yogaball/400/300',
  },
  {
    id: 10,
    name: 'رژ لب مات ماندگار',
    category: 'زیبایی',
    price: 265000,
    stock: 6,
    rating: 4.6,
    sku: 'BEA-9932',
    image: 'https://picsum.photos/seed/lipstick/400/300',
  },
]

const PAGE_SIZE = 6

function stockInfo(stock) {
  if (stock === 0) return { label: 'ناموجود', style: 'bg-rose-50 text-rose-700 ring-rose-600/20' }
  if (stock <= 10) return { label: 'کم موجود', style: 'bg-amber-50 text-amber-700 ring-amber-600/20' }
  return { label: 'موجود', style: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' }
}

function formatPrice(value) {
  return new Intl.NumberFormat('fa-IR').format(value) + ' تومان'
}

export default function Products() {
  const navigate = useNavigate()
  const [products, setProducts] = useState(PRODUCTS)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [stockFilter, setStockFilter] = useState(STOCK_FILTERS[0])
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.includes(search) || p.sku.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === CATEGORIES[0] || p.category === category
      const info = stockInfo(p.stock).label
      const matchesStock = stockFilter === STOCK_FILTERS[0] || info === stockFilter
      return matchesSearch && matchesCategory && matchesStock
    })
  }, [products, search, category, stockFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageSafe = Math.min(page, totalPages)
  const pageItems = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE)

  function removeProduct(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const outOfStockCount = products.filter((p) => p.stock === 0).length
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 10).length

  return (
    <div dir="rtl" className="space-y-5">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1A1B23]">محصولات</h1>
          <p className="mt-1 text-sm text-black/50">مدیریت محصولات، موجودی و دسته‌بندی‌ها</p>
        </div>
        <button 
        onClick={()=>navigate('/admin/products/create')}
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

      {/* Product grid */}
      {pageItems.length === 0 ? (
        <div className="rounded-lg border border-black/10 bg-white px-4 py-16 text-center text-black/40">
          <Icon icon="mdi:package-variant-closed-remove" className="mx-auto mb-2 h-8 w-8 text-black/25" />
          محصولی با این مشخصات پیدا نشد
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((p) => {
            const info = stockInfo(p.stock)
            return (
              <div key={p.id} className="overflow-hidden rounded-lg border border-black/10 bg-white">
                <div className="relative h-40 w-full bg-slate-100">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                  <span
                    className={`absolute right-3 top-3 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${info.style}`}
                  >
                    {info.label}
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[#1A1B23]">{p.name}</p>
                      <p className="mt-0.5 text-xs text-black/40">کد: {p.sku}</p>
                    </div>
                    <span className="shrink-0 rounded-md bg-[#F4F5F7] px-2 py-1 text-xs font-medium text-black/60">
                      {p.category}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-1 text-xs text-amber-500">
                    <Icon icon="mdi:star" className="h-4 w-4" />
                    <span className="font-medium text-black/70">{p.rating}</span>
                    <span className="text-black/35">از ۵</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-black/5 pt-3">
                    <div>
                      <p className="font-bold text-[#1A1B23]">{formatPrice(p.price)}</p>
                      <p className="mt-0.5 text-xs text-black/40">{p.stock} عدد موجودی</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        title="ویرایش"
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
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

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