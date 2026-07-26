import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = ['پوشاک', 'لوازم خانه', 'الکترونیک', 'زیبایی', 'ورزش']

const EMPTY_FORM = {
  name: '',
  category: CATEGORIES[0],
  sku: '',
  price: '',
  compareAtPrice: '',
  stock: '',
  description: '',
}

function formatPreviewPrice(value) {
  const num = Number(value)
  if (!value || Number.isNaN(num)) return '۰ تومان'
  return new Intl.NumberFormat('fa-IR').format(num) + ' تومان'
}

function generateSku(name) {
  const prefix = name.trim().slice(0, 3).toUpperCase() || 'PRD'
  const suffix = Math.floor(1000 + Math.random() * 9000)
  return `${prefix}-${suffix}`
}

export default function CreateProduct({ onCancel, onCreate }) {
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY_FORM)
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

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

  function handleAutoSku() {
    update('sku', generateSku(form.name))
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
    // Simulate an async save — swap for: await axios.post('/products', payload)
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
      onCreate?.(payload)
    }, 700)
  }

  function handleCancel() {
    if (onCancel) onCancel()
    else navigate('/products')
  }

  function handleReset() {
    setForm(EMPTY_FORM)
    setImagePreview(null)
    setErrors({})
    setSaved(false)
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
          <h1 className="text-xl font-bold text-[#1A1B23]">افزودن محصول جدید</h1>
          <p className="mt-1 text-sm text-black/50">اطلاعات محصول را وارد کنید تا به فروشگاه اضافه شود</p>
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
            form="create-product-form"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 disabled:opacity-60"
          >
            {saving ? (
              <Icon icon="mdi:loading" className="h-4 w-4 animate-spin" />
            ) : (
              <Icon icon="mdi:plus" className="h-4 w-4" />
            )}
            {saving ? 'در حال ذخیره...' : 'ذخیره محصول'}
          </button>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <Icon icon="mdi:check-circle-outline" className="h-5 w-5 shrink-0" />
          محصول با موفقیت ذخیره شد
          <button
            type="button"
            onClick={handleReset}
            className="mr-auto text-xs font-medium text-emerald-700 underline underline-offset-2"
          >
            افزودن محصول دیگر
          </button>
        </div>
      )}

      <form id="create-product-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left column: image + live preview */}
        <div className="space-y-5 lg:col-span-1">
          <div className="rounded-lg border border-black/10 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-[#1A1B23]">تصویر محصول</h2>

            <label
              htmlFor="product-image"
              className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-black/15 bg-[#F4F5F7] text-black/40 transition hover:border-violet-300 hover:text-violet-500"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="پیش‌نمایش محصول" className="h-full w-full rounded-lg object-cover" />
              ) : (
                <>
                  <Icon icon="mdi:image-plus-outline" className="h-9 w-9" />
                  <span className="text-xs">برای آپلود تصویر کلیک کنید</span>
                </>
              )}
            </label>
            <input id="product-image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

            {errors.image && <p className="mt-2 text-xs text-rose-600">{errors.image}</p>}

            {imagePreview && (
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-black/10 px-3 py-2 text-xs font-medium text-black/60 transition hover:bg-black/[0.03]"
              >
                <Icon icon="mdi:trash-can-outline" className="h-4 w-4" />
                حذف تصویر
              </button>
            )}
          </div>

          <div className="rounded-lg border border-black/10 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-[#1A1B23]">پیش‌نمایش کارت محصول</h2>
            <div className="rounded-lg border border-black/10 p-3">
              <div className="mb-2 flex items-start justify-between gap-2">
                <p className="truncate text-sm font-medium text-[#1A1B23]">{form.name || 'نام محصول'}</p>
                <span className="shrink-0 rounded-md bg-[#F4F5F7] px-2 py-0.5 text-[11px] font-medium text-black/60">
                  {form.category}
                </span>
              </div>
              <p className="mb-2 text-xs text-black/40">کد: {form.sku || '—'}</p>
              <p className="font-bold text-[#1A1B23]">{formatPreviewPrice(form.price)}</p>
              <p className="mt-0.5 text-xs text-black/40">{form.stock || 0} عدد موجودی</p>
            </div>
          </div>
        </div>

        {/* Right column: form fields */}
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
                    placeholder="مثلاً کیف چرم دستدوز"
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
                <div className="flex gap-2">
                  <input
                    dir="ltr"
                    value={form.sku}
                    onChange={(e) => update('sku', e.target.value)}
                    className={inputClass(errors.sku)}
                    placeholder="BAG-1042"
                  />
                  <button
                    type="button"
                    onClick={handleAutoSku}
                    title="تولید خودکار کد"
                    className="shrink-0 rounded-lg border border-black/10 px-3 text-black/50 transition hover:bg-black/[0.03]"
                  >
                    <Icon icon="mdi:auto-fix" className="h-4 w-4" />
                  </button>
                </div>
              </Field>
            </div>

            <div className="mt-4">
              <Field label="توضیحات محصول">
                <textarea
                  value={form.description}
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
                  placeholder="1250000"
                />
              </Field>

              <Field label="قیمت قبل از تخفیف" error={errors.compareAtPrice}>
                <input
                  dir="ltr"
                  type="number"
                  min="0"
                  value={form.compareAtPrice}
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
                  placeholder="24"
                />
              </Field>
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