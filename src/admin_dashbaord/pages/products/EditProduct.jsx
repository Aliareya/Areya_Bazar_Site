import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { useNavigate, useParams } from 'react-router-dom'

const CATEGORIES = ['پوشاک', 'لوازم خانه', 'الکترونیک', 'زیبایی', 'ورزش']

// Same static catalogue as ProductsPage — replace both with a real API call
// (GET /products/:id) once your products endpoint exists.
const PRODUCTS = [
  { id: 1, name: 'کیف چرم دستدوز', category: 'پوشاک', price: 1250000, compareAtPrice: null, stock: 24, rating: 4.6, sku: 'BAG-1042', description: 'کیف چرم طبیعی دستدوز با روکش داخلی مخمل و بند قابل تنظیم.', image: 'https://picsum.photos/seed/bag1/400/300', createdAt: '2026-03-02T09:12:00.000Z' },
  { id: 2, name: 'هدفون بی‌سیم نویز کنسلینگ', category: 'الکترونیک', price: 3480000, compareAtPrice: 3990000, stock: 8, rating: 4.8, sku: 'AUD-2093', description: 'هدفون بی‌سیم با حذف نویز فعال و باتری ۳۰ ساعته.', image: 'https://picsum.photos/seed/headphone/400/300', createdAt: '2026-01-18T09:12:00.000Z' },
  { id: 3, name: 'مجموعه ظروف سرامیکی', category: 'لوازم خانه', price: 890000, compareAtPrice: null, stock: 0, rating: 4.2, sku: 'HOME-3311', description: 'ست ۶ پارچه ظروف سرامیکی مناسب مایکروویو و ماشین ظرفشویی.', image: 'https://picsum.photos/seed/ceramics/400/300', createdAt: '2025-12-05T09:12:00.000Z' },
]

function formatPreviewPrice(value) {
  const num = Number(value)
  if (!value || Number.isNaN(num)) return '۰ تومان'
  return new Intl.NumberFormat('fa-IR').format(num) + ' تومان'
}

function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' })
  } catch {
    return '—'
  }
}

export default function ProductEdit({ product, onCancel, onSave }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    // Swap this block for: axios.get(`/products/${id}`)
    setLoading(true)
    setLoadError('')
    const found = product || PRODUCTS.find((p) => String(p.id) === String(id))
    if (found) {
      setForm({ ...found })
      setImagePreview(found.image)
    } else {
      setLoadError('محصول مورد نظر پیدا نشد')
    }
    setLoading(false)
  }, [id, product])

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, image: 'فقط فایل تصویری مجاز است' }))
      return
    }

    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
    setErrors((prev) => ({ ...prev, image: undefined }))
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'وارد کردن نام محصول الزامی است'
    if (!form.sku.trim()) next.sku = 'وارد کردن کد محصول الزامی است'

    if (!form.price) next.price = 'وارد کردن قیمت الزامی است'
    else if (Number(form.price) <= 0) next.price = 'قیمت باید بزرگتر از صفر باشد'

    if (form.compareAtPrice && Number(form.compareAtPrice) <= Number(form.price)) {
      next.compareAtPrice = 'قیمت قبل از تخفیف باید بیشتر از قیمت فروش باشد'
    }

    if (form.stock === '') next.stock = 'وارد کردن موجودی الزامی است'
    else if (Number(form.stock) < 0) next.stock = 'موجودی نمی‌تواند منفی باشد'

    setErrors((prev) => ({ ...prev, ...next }))
    return Object.keys(next).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    // Swap this block for: await axios.patch(`/products/${id}`, payload)
    const payload = {
      ...form,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      stock: Number(form.stock),
      image: imagePreview,
    }

    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      onSave?.(payload)
    }, 700)
  }

  function handleCancel() {
    if (onCancel) onCancel()
    else navigate('/products')
  }

  function handleDelete() {
    setDeleting(true)
    // Swap this block for: await axios.delete(`/products/${id}`)
    setTimeout(() => {
      navigate('/products')
    }, 600)
  }

  if (loading) {
    return (
      <div dir="rtl" className="flex items-center justify-center py-24 text-black/40">
        <Icon icon="mdi:loading" className="me-2 h-6 w-6 animate-spin text-violet-500" />
        در حال بارگذاری اطلاعات محصول...
      </div>
    )
  }

  if (loadError || !form) {
    return (
      <div dir="rtl" className="space-y-4">
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <Icon icon="mdi:alert-circle-outline" className="h-5 w-5 shrink-0" />
          {loadError || 'محصول مورد نظر پیدا نشد'}
        </div>
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="inline-flex items-center gap-1.5 text-sm text-black/45 transition hover:text-[#1A1B23]"
        >
          <Icon icon="mdi:arrow-right" className="h-4 w-4" />
          بازگشت به محصولات
        </button>
      </div>
    )
  }

  return (
    <div dir="rtl" className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={handleCancel}
            className="mb-2 inline-flex items-center gap-1.5 text-sm text-black/45 transition hover:text-[#1A1B23]"
          >
            <Icon icon="mdi:arrow-right" className="h-4 w-4" />
            بازگشت به محصولات
          </button>
          <h1 className="text-xl font-bold text-[#1A1B23]">ویرایش محصول</h1>
          <p className="mt-1 text-sm text-black/50">به‌روزرسانی اطلاعات {form.name}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-[#1A1B23] transition hover:bg-black/[0.03]"
          >
            انصراف
          </button>
          <button
            type="submit"
            form="edit-product-form"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 disabled:opacity-60"
          >
            {saving ? (
              <Icon icon="mdi:loading" className="h-4 w-4 animate-spin" />
            ) : (
              <Icon icon="mdi:content-save-outline" className="h-4 w-4" />
            )}
            {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </button>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <Icon icon="mdi:check-circle-outline" className="h-5 w-5 shrink-0" />
          تغییرات با موفقیت ذخیره شد
        </div>
      )}

      <form id="edit-product-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left column: image + meta + danger zone */}
        <div className="space-y-5 lg:col-span-1">
          <div className="rounded-lg border border-black/10 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-[#1A1B23]">تصویر محصول</h2>

            <label
              htmlFor="product-image"
              className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed border-black/15 bg-[#F4F5F7] text-black/40 transition hover:border-violet-300 hover:text-violet-500"
            >
              {imagePreview ? (
                <img src={imagePreview} alt={form.name} className="h-full w-full object-cover" />
              ) : (
                <>
                  <Icon icon="mdi:image-plus-outline" className="h-9 w-9" />
                  <span className="text-xs">برای آپلود تصویر کلیک کنید</span>
                </>
              )}
            </label>
            <input id="product-image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            {errors.image && <p className="mt-2 text-xs text-rose-600">{errors.image}</p>}

            <div className="mt-4 border-t border-black/10 pt-4 text-xs text-black/45">
              <div className="flex items-center justify-between py-1">
                <span>شناسه محصول</span>
                <span className="font-mono text-black/60">#{form.id}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>امتیاز کاربران</span>
                <span className="flex items-center gap-1 text-black/60">
                  <Icon icon="mdi:star" className="h-3.5 w-3.5 text-amber-500" />
                  {form.rating ?? '—'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>تاریخ ثبت</span>
                <span className="text-black/60">{formatDate(form.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-rose-200 bg-white p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-rose-600">
              <Icon icon="mdi:alert-circle-outline" className="h-4 w-4" />
              منطقه خطر
            </p>
            <p className="mt-2 text-xs leading-5 text-black/50">
              حذف این محصول از فروشگاه، آن را از دید مشتریان و لیست محصولات حذف می‌کند.
            </p>
            <button
              type="button"
              disabled={deleting}
              onClick={handleDelete}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-100 disabled:opacity-60"
            >
              {deleting ? (
                <Icon icon="mdi:loading" className="h-4 w-4 animate-spin" />
              ) : (
                <Icon icon="mdi:trash-can-outline" className="h-4 w-4" />
              )}
              {deleting ? 'در حال حذف...' : 'حذف محصول'}
            </button>
          </div>
        </div>

        {/* Right column: editable fields */}
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-lg border border-black/10 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-[#1A1B23]">اطلاعات پایه</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="نام محصول" error={errors.name}>
                  <input
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    className={inputClass(errors.name)}
                  />
                </Field>
              </div>

              <Field label="دسته‌بندی">
                <select
                  value={form.category}
                  onChange={(e) => update('category', e.target.value)}
                  className={inputClass()}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>

              <Field label="کد محصول (SKU)" error={errors.sku}>
                <input
                  dir="ltr"
                  value={form.sku}
                  onChange={(e) => update('sku', e.target.value)}
                  className={inputClass(errors.sku)}
                />
              </Field>
            </div>

            <div className="mt-4">
              <Field label="توضیحات محصول">
                <textarea
                  value={form.description || ''}
                  onChange={(e) => update('description', e.target.value)}
                  rows={4}
                  className={inputClass() + ' resize-none'}
                  placeholder="ویژگی‌ها، جنس، ابعاد و سایر توضیحات محصول را بنویسید..."
                />
              </Field>
            </div>
          </div>

          <div className="rounded-lg border border-black/10 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-[#1A1B23]">قیمت‌گذاری و موجودی</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="قیمت فروش (تومان)" error={errors.price}>
                <input
                  dir="ltr"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => update('price', e.target.value)}
                  className={inputClass(errors.price)}
                />
              </Field>

              <Field label="قیمت قبل از تخفیف" error={errors.compareAtPrice}>
                <input
                  dir="ltr"
                  type="number"
                  min="0"
                  value={form.compareAtPrice || ''}
                  onChange={(e) => update('compareAtPrice', e.target.value)}
                  className={inputClass(errors.compareAtPrice)}
                  placeholder="اختیاری"
                />
              </Field>

              <Field label="موجودی انبار" error={errors.stock}>
                <input
                  dir="ltr"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => update('stock', e.target.value)}
                  className={inputClass(errors.stock)}
                />
              </Field>
            </div>

            <div className="mt-4 rounded-lg bg-[#F4F5F7] p-3 text-xs text-black/50">
              پیش‌نمایش قیمت فعلی: <span className="font-semibold text-[#1A1B23]">{formatPreviewPrice(form.price)}</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-black/60">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-rose-600">{error}</span>}
    </label>
  )
}

function inputClass(error) {
  return `w-full rounded-lg border bg-[#F4F5F7] px-3 py-2.5 text-sm text-[#1A1B23] placeholder:text-black/35 focus:outline-none focus:ring-2 ${
    error
      ? 'border-rose-300 focus:ring-rose-500/20'
      : 'border-black/10 focus:border-violet-400 focus:ring-violet-500/20'
  }`
}