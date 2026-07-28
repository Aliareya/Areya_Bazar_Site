import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { useNavigate, useParams } from 'react-router-dom'

const API_BASE = 'http://localhost:3000'

const CATEGORIES = ['پوشاک', 'لوازم خانه', 'الکترونیک', 'زیبایی', 'ورزش']
const STATUS_OPTIONS = [
  { value: 'active', label: 'فعال' },
  { value: 'inactive', label: 'غیرفعال' },
  { value: 'draft', label: 'پیش‌نویس' },
]

const EMPTY_FORM = {
  name: '',
  category: CATEGORIES[0],
  brand: '',
  sku: '',
  barcode: '',
  tags: '',
  shortDescription: '',
  description: '',
  price: '',
  compareAtPrice: '',
  costPrice: '',
  trackInventory: true,
  stock: '',
  lowStockThreshold: '',
  allowBackorder: false,
  status: 'active',
  featured: false,
  image: '',
}

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [imageFile, setImageFile] = useState(null)

  useEffect(() => {
    fetchProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function fetchProduct() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/products/${id}`)
      if (!res.ok) throw new Error(`خطا در دریافت محصول (${res.status})`)
      const data = await res.json()
      const p = data.product || data

      setForm({
        name: p.name || '',
        category: p.category || CATEGORIES[0],
        brand: p.brand || '',
        sku: p.sku || '',
        barcode: p.barcode || '',
        tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''),
        shortDescription: p.shortDescription || '',
        description: p.description || '',
        price: p.price ?? '',
        compareAtPrice: p.compareAtPrice ?? '',
        costPrice: p.costPrice ?? '',
        trackInventory: !!p.trackInventory,
        stock: p.stock ?? '',
        lowStockThreshold: p.lowStockThreshold ?? '',
        allowBackorder: !!p.allowBackorder,
        status: p.status || 'active',
        featured: !!p.featured,
        image: p.image || '',
      })
      setImagePreview(p.image || '')
    } catch (err) {
      setError(err.message || 'خطا در ارتباط با سرور')
    } finally {
      setLoading(false)
    }
  }

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  // Uploads a new image via the dedicated PATCH /products/:id/image route.
  // Returns the new image URL from the response.
  async function uploadProductImage(file) {
    const fd = new FormData()
    fd.append('image', file)

    const res = await fetch(`${API_BASE}/products/${id}/image`, {
      method: 'PATCH',
      body: fd, // no Content-Type header — browser sets the multipart boundary
    })

    if (!res.ok) {
      const errBody = await res.json().catch(() => null)
      throw new Error(errBody?.message || `آپلود تصویر با خطا مواجه شد (${res.status})`)
    }

    const data = await res.json()
    return data.product?.image || data.image
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setSaveError(null)

    try {
      let imageUrl = form.image

      // 1) If a new image file was selected, upload it first through the
      //    dedicated image route, so the image and the rest of the fields
      //    are handled by two focused endpoints instead of one big multipart PATCH.
      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile)
      }

      // 2) Save the rest of the product fields as plain JSON.
      const payload = {
        name: form.name,
        category: form.category,
        brand: form.brand || null,
        sku: form.sku,
        barcode: form.barcode,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        shortDescription: form.shortDescription,
        description: form.description,
        price: Number(form.price) || 0,
        compareAtPrice: form.compareAtPrice === '' ? null : Number(form.compareAtPrice),
        costPrice: form.costPrice === '' ? null : Number(form.costPrice),
        trackInventory: form.trackInventory,
        stock: Number(form.stock) || 0,
        lowStockThreshold: Number(form.lowStockThreshold) || 0,
        allowBackorder: form.allowBackorder,
        status: form.status,
        featured: form.featured,
        // Only send image if we don't already have a separate image route handling it.
        // Sending it here too is harmless (backend just overwrites with the same value),
        // but you can drop this line if you'd rather keep image updates fully separate.
        image: imageUrl,
      }

      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errBody = await res.json().catch(() => null)
        throw new Error(errBody?.message || `ذخیره تغییرات با خطا مواجه شد (${res.status})`)
      }

      navigate('/admin/products')
    } catch (err) {
      setSaveError(err.message || 'خطا در ذخیره‌سازی')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div dir="rtl" className="flex h-64 items-center justify-center text-black/40">
        <Icon icon="mdi:loading" className="ml-2 h-5 w-5 animate-spin" />
        در حال بارگذاری محصول...
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
            onClick={fetchProduct}
            className="mt-3 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    )
  }

  const inputClass =
    'w-full rounded-lg border border-black/10 bg-[#F4F5F7] px-3 py-2 text-sm text-[#1A1B23] placeholder:text-black/35 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20'
  const labelClass = 'mb-1.5 block text-sm font-medium text-black/70'

  return (
    <div dir="rtl" className="space-y-5">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="rounded-lg p-2 text-black/50 transition hover:bg-black/5"
          >
            <Icon icon="mdi:arrow-right" className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#1A1B23]">ویرایش محصول</h1>
            <p className="mt-1 text-sm text-black/50">اطلاعات محصول را ویرایش و ذخیره کنید</p>
          </div>
        </div>
      </div>

      {saveError && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <Icon icon="mdi:alert-circle-outline" className="h-5 w-5 shrink-0" />
          {saveError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-5 lg:col-span-2">
            {/* Basic info */}
            <div className="rounded-lg border border-black/10 bg-white p-5">
              <h2 className="mb-4 text-sm font-bold text-[#1A1B23]">اطلاعات پایه</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>نام محصول</label>
                  <input
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>دسته‌بندی</label>
                    <select
                      value={form.category}
                      onChange={(e) => updateField('category', e.target.value)}
                      className={inputClass}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>برند</label>
                    <input
                      value={form.brand}
                      onChange={(e) => updateField('brand', e.target.value)}
                      className={inputClass}
                      placeholder="اختیاری"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>توضیح کوتاه</label>
                  <input
                    value={form.shortDescription}
                    onChange={(e) => updateField('shortDescription', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>توضیحات کامل</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={5}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>برچسب‌ها (با کاما جدا کنید)</label>
                  <input
                    value={form.tags}
                    onChange={(e) => updateField('tags', e.target.value)}
                    className={inputClass}
                    placeholder="مثال: تابستانی, پنبه‌ای, جدید"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="rounded-lg border border-black/10 bg-white p-5">
              <h2 className="mb-4 text-sm font-bold text-[#1A1B23]">قیمت‌گذاری</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelClass}>قیمت (افغانی)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => updateField('price', e.target.value)}
                    className={inputClass}
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className={labelClass}>قیمت قبل از تخفیف</label>
                  <input
                    type="number"
                    value={form.compareAtPrice}
                    onChange={(e) => updateField('compareAtPrice', e.target.value)}
                    className={inputClass}
                    min="0"
                  />
                </div>
                <div>
                  <label className={labelClass}>قیمت تمام‌شده</label>
                  <input
                    type="number"
                    value={form.costPrice}
                    onChange={(e) => updateField('costPrice', e.target.value)}
                    className={inputClass}
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="rounded-lg border border-black/10 bg-white p-5">
              <h2 className="mb-4 text-sm font-bold text-[#1A1B23]">موجودی</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className={labelClass}>کد SKU</label>
                    <input
                      value={form.sku}
                      onChange={(e) => updateField('sku', e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>بارکد</label>
                    <input
                      value={form.barcode}
                      onChange={(e) => updateField('barcode', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>موجودی انبار</label>
                    <input
                      type="number"
                      value={form.stock}
                      onChange={(e) => updateField('stock', e.target.value)}
                      className={inputClass}
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>آستانه کم‌موجودی</label>
                    <input
                      type="number"
                      value={form.lowStockThreshold}
                      onChange={(e) => updateField('lowStockThreshold', e.target.value)}
                      className={inputClass}
                      min="0"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                  <label className="flex items-center gap-2 text-sm text-black/70">
                    <input
                      type="checkbox"
                      checked={form.trackInventory}
                      onChange={(e) => updateField('trackInventory', e.target.checked)}
                      className="h-4 w-4 rounded border-black/20 text-violet-600 focus:ring-violet-500"
                    />
                    پیگیری موجودی
                  </label>
                  <label className="flex items-center gap-2 text-sm text-black/70">
                    <input
                      type="checkbox"
                      checked={form.allowBackorder}
                      onChange={(e) => updateField('allowBackorder', e.target.checked)}
                      className="h-4 w-4 rounded border-black/20 text-violet-600 focus:ring-violet-500"
                    />
                    اجازه سفارش بدون موجودی
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar column */}
          <div className="space-y-5">
            {/* Status */}
            <div className="rounded-lg border border-black/10 bg-white p-5">
              <h2 className="mb-4 text-sm font-bold text-[#1A1B23]">وضعیت</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>وضعیت انتشار</label>
                  <select
                    value={form.status}
                    onChange={(e) => updateField('status', e.target.value)}
                    className={inputClass}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-2 text-sm text-black/70">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => updateField('featured', e.target.checked)}
                    className="h-4 w-4 rounded border-black/20 text-violet-600 focus:ring-violet-500"
                  />
                  محصول ویژه
                </label>
              </div>
            </div>

            {/* Image */}
            <div className="rounded-lg border border-black/10 bg-white p-5">
              <h2 className="mb-4 text-sm font-bold text-[#1A1B23]">تصویر محصول</h2>
              <div className="space-y-3">
                <div className="flex h-40 w-full items-center justify-center overflow-hidden rounded-lg bg-[#F4F5F7]">
                  {imagePreview ? (
                    <img src={imagePreview} alt="پیش‌نمایش" className="h-full w-full object-cover" />
                  ) : (
                    <Icon icon="mdi:image-outline" className="h-10 w-10 text-black/25" />
                  )}
                </div>
                <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-black/20 px-3 py-2.5 text-sm text-black/60 transition hover:border-violet-400 hover:text-violet-600">
                  <Icon icon="mdi:upload-outline" className="h-4 w-4" />
                  تغییر تصویر
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                <p className="text-center text-xs text-black/35">
                  در صورت انتخاب نشدن تصویر جدید، تصویر فعلی حفظ می‌شود
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 rounded-lg border border-black/10 bg-white p-5">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Icon icon="mdi:loading" className="h-4 w-4 animate-spin" />
                    در حال ذخیره...
                  </>
                ) : (
                  <>
                    <Icon icon="mdi:content-save-outline" className="h-4 w-4" />
                    ذخیره تغییرات
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="rounded-lg border border-black/10 px-4 py-2.5 text-sm font-medium text-black/60 transition hover:bg-black/5"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}