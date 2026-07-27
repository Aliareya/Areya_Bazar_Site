import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../../../context/ApiContext'
import { useAuth } from '../../../context/AuthContext'

const CATEGORIES = ['پوشاک', 'لوازم خانه', 'الکترونیک', 'زیبایی', 'ورزش']
const STATUSES = [
  { value: 'active', label: 'فعال (نمایش در فروشگاه)' },
  { value: 'draft', label: 'پیش‌نویس' },
  { value: 'archived', label: 'آرشیو شده' },
]

const EMPTY_FORM = {
  name: '',
  category: CATEGORIES[0],
  brand: '',
  sku: '',
  barcode: '',
  tags: [],
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
}

const API_URL = 'http://localhost:3000/products'

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
  const {apiurl} = useApi()
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY_FORM)
  const [image, setImage] = useState(null) // { file, url }
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  function toggle(field) {
    update(field, !form[field])
  }

  // ---------- Image ----------
  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, image: 'فقط فایل تصویری مجاز است' }))
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => setImage({ file, url: reader.result })
    reader.readAsDataURL(file)
    setErrors((prev) => ({ ...prev, image: undefined }))
    e.target.value = ''
  }

  function removeImage() {
    setImage(null)
  }

  // ---------- Tags ----------
  function addTag(raw) {
    const value = raw.trim().replace(/,$/, '')
    if (!value) return
    if (form.tags.includes(value)) {
      setTagInput('')
      return
    }
    update('tags', [...form.tags, value])
    setTagInput('')
  }

  function handleTagKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(tagInput)
    } else if (e.key === 'Backspace' && !tagInput && form.tags.length) {
      update('tags', form.tags.slice(0, -1))
    }
  }

  function removeTag(tag) {
    update('tags', form.tags.filter((t) => t !== tag))
  }

  // ---------- Auto-fill helpers ----------
  function handleAutoSku() {
    update('sku', generateSku(form.name))
  }

  // ---------- Validation ----------
  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'وارد کردن نام محصول الزامی است'
    if (!form.sku.trim()) next.sku = 'وارد کردن کد محصول الزامی است'

    if (!form.price) next.price = 'وارد کردن قیمت الزامی است'
    else if (Number(form.price) <= 0) next.price = 'قیمت باید بزرگتر از صفر باشد'

    if (form.compareAtPrice && Number(form.compareAtPrice) <= Number(form.price)) {
      next.compareAtPrice = 'قیمت قبل از تخفیف باید بیشتر از قیمت فروش باشد'
    }

    if (form.trackInventory) {
      if (form.stock === '') next.stock = 'وارد کردن موجودی الزامی است'
      else if (Number(form.stock) < 0) next.stock = 'موجودی نمی‌تواند منفی باشد'
    }

    if (!image) next.image = 'تصویر محصول الزامی است'

    setErrors((prev) => ({ ...prev, ...next }))
    return Object.keys(next).length === 0
  }

  const {user} = useAuth();

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    setErrors((prev) => ({ ...prev, submit: undefined }))

    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('category', form.category)
      if (form.brand) formData.append('brand', form.brand)
      formData.append('sku', form.sku)
      if (form.barcode) formData.append('barcode', form.barcode)
      formData.append('tags', JSON.stringify(form.tags))
      if (form.shortDescription) formData.append('shortDescription', form.shortDescription)
      if (form.description) formData.append('description', form.description)
      formData.append('price', String(Number(form.price)))
      if (form.compareAtPrice) formData.append('compareAtPrice', String(Number(form.compareAtPrice)))
      if (form.costPrice) formData.append('costPrice', String(Number(form.costPrice)))
      formData.append('trackInventory', String(form.trackInventory))
      if (form.trackInventory) formData.append('stock', String(Number(form.stock)))
      if (form.lowStockThreshold) formData.append('lowStockThreshold', String(Number(form.lowStockThreshold)))
      formData.append('allowBackorder', String(form.allowBackorder))
      formData.append('status', form.status)
      formData.append('featured', String(form.featured))
      formData.append('user_id', user.id)
      // Field name here ("image") must match FileInterceptor('image') on the backend
      formData.append('image', image.file, image.file.name)

      const response = await fetch(`${apiurl}/products`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null)
        const message =
          (Array.isArray(errorBody?.message) ? errorBody.message.join('، ') : errorBody?.message) ||
          'ثبت محصول با خطا مواجه شد'
        throw new Error(message)
      }

      const createdProduct = await response.json()
      setSaved(true)
      onCreate?.(createdProduct)
    } catch (err) {
      setErrors((prev) => ({ ...prev, submit: err.message || 'خطایی در ارتباط با سرور رخ داد' }))
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    if (onCancel) onCancel()
    else navigate('/admin/products')
  }

  function handleReset() {
    setForm(EMPTY_FORM)
    setImage(null)
    setTagInput('')
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

      {errors.submit && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <Icon icon="mdi:alert-circle-outline" className="h-5 w-5 shrink-0" />
          {errors.submit}
        </div>
      )}

      <form id="create-product-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* ============ Left column ============ */}
        <div className="space-y-5 lg:col-span-1">
          {/* Image uploader */}
          <div className="rounded-lg border border-black/10 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-[#1A1B23]">تصویر محصول</h2>

            <label
              htmlFor="product-image"
              className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-black/15 bg-[#F4F5F7] text-black/40 transition hover:border-violet-300 hover:text-violet-500"
            >
              {image ? (
                <img src={image.url} alt="پیش‌نمایش محصول" className="h-full w-full rounded-lg object-cover" />
              ) : (
                <>
                  <Icon icon="mdi:image-plus-outline" className="h-9 w-9" />
                  <span className="text-xs">برای آپلود تصویر کلیک کنید</span>
                </>
              )}
            </label>
            <input
              id="product-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {errors.image && <p className="mt-2 text-xs text-rose-600">{errors.image}</p>}

            {image && (
              <button
                type="button"
                onClick={removeImage}
                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-black/10 px-3 py-2 text-xs font-medium text-black/60 transition hover:bg-black/[0.03]"
              >
                <Icon icon="mdi:trash-can-outline" className="h-4 w-4" />
                حذف تصویر
              </button>
            )}
          </div>

          {/* Status & visibility */}
          <div className="rounded-lg border border-black/10 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-[#1A1B23]">وضعیت و نمایش</h2>
            <Field label="وضعیت محصول">
              <select value={form.status} onChange={(e) => update('status', e.target.value)} className={inputClass()}>
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </Field>

            <label className="mt-4 flex items-center justify-between rounded-lg border border-black/10 px-3 py-2.5">
              <span className="text-sm text-[#1A1B23]">محصول ویژه</span>
              <Toggle checked={form.featured} onChange={() => toggle('featured')} />
            </label>
          </div>

          {/* Live preview */}
          <div className="rounded-lg border border-black/10 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-[#1A1B23]">پیش‌نمایش کارت محصول</h2>
            <div className="rounded-lg border border-black/10 p-3">
              {image && (
                <img src={image.url} alt="پیش‌نمایش" className="mb-3 h-32 w-full rounded-md object-cover" />
              )}
              <div className="mb-2 flex items-start justify-between gap-2">
                <p className="truncate text-sm font-medium text-[#1A1B23]">{form.name || 'نام محصول'}</p>
                <span className="shrink-0 rounded-md bg-[#F4F5F7] px-2 py-0.5 text-[11px] font-medium text-black/60">
                  {form.category}
                </span>
              </div>
              <p className="mb-2 text-xs text-black/40">کد: {form.sku || '—'}</p>
              <p className="font-bold text-[#1A1B23]">{formatPreviewPrice(form.price)}</p>
              <p className="mt-0.5 text-xs text-black/40">
                {form.trackInventory ? `${form.stock || 0} عدد موجودی` : 'موجودی نامحدود'}
              </p>
            </div>
          </div>
        </div>

        {/* ============ Right column ============ */}
        <div className="space-y-5 lg:col-span-2">
          {/* Basic info */}
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
                <select value={form.category} onChange={(e) => update('category', e.target.value)} className={inputClass()}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>

              <Field label="برند (اختیاری)">
                <input
                  value={form.brand}
                  onChange={(e) => update('brand', e.target.value)}
                  className={inputClass()}
                  placeholder="مثلاً چرم آرا"
                />
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

              <Field label="بارکد / GTIN (اختیاری)">
                <input
                  dir="ltr"
                  value={form.barcode}
                  onChange={(e) => update('barcode', e.target.value)}
                  className={inputClass()}
                  placeholder="8991234567890"
                />
              </Field>

              <div className="sm:col-span-2">
                <Field label="برچسب‌ها (تگ)">
                  <div className={inputClass() + ' flex flex-wrap items-center gap-1.5 py-2'}>
                    {form.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-md bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700"
                      >
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-violet-500 hover:text-violet-800">
                          <Icon icon="mdi:close" className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      onBlur={() => addTag(tagInput)}
                      placeholder={form.tags.length ? '' : 'برچسب را بنویسید و Enter بزنید'}
                      className="min-w-[100px] flex-1 bg-transparent text-sm text-[#1A1B23] outline-none placeholder:text-black/35"
                    />
                  </div>
                </Field>
              </div>

              <div className="sm:col-span-2">
                <Field label="توضیح کوتاه">
                  <input
                    value={form.shortDescription}
                    onChange={(e) => update('shortDescription', e.target.value)}
                    className={inputClass()}
                    placeholder="یک جمله کوتاه برای معرفی محصول در لیست‌ها"
                  />
                </Field>
              </div>

              <div className="sm:col-span-2">
                <Field label="توضیحات کامل محصول">
                  <textarea
                    value={form.description}
                    onChange={(e) => update('description', e.target.value)}
                    rows={5}
                    className={inputClass() + ' resize-none'}
                    placeholder="ویژگی‌ها، جنس، ابعاد و سایر توضیحات محصول را بنویسید..."
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Pricing & inventory */}
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

              <Field label="قیمت تمام‌شده (اختیاری)">
                <input
                  dir="ltr"
                  type="number"
                  min="0"
                  value={form.costPrice}
                  onChange={(e) => update('costPrice', e.target.value)}
                  className={inputClass()}
                  placeholder="برای محاسبه سود"
                />
              </Field>
            </div>

            <label className="mt-4 flex items-center justify-between rounded-lg border border-black/10 px-3 py-2.5">
              <span className="text-sm text-[#1A1B23]">پیگیری موجودی انبار</span>
              <Toggle checked={form.trackInventory} onChange={() => toggle('trackInventory')} />
            </label>

            {form.trackInventory && (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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

                <Field label="آستانه هشدار کمبود موجودی (اختیاری)">
                  <input
                    dir="ltr"
                    type="number"
                    min="0"
                    value={form.lowStockThreshold}
                    onChange={(e) => update('lowStockThreshold', e.target.value)}
                    className={inputClass()}
                    placeholder="مثلاً 5"
                  />
                </Field>

                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between rounded-lg border border-black/10 px-3 py-2.5">
                    <span className="text-sm text-[#1A1B23]">امکان ثبت سفارش پس از اتمام موجودی</span>
                    <Toggle checked={form.allowBackorder} onChange={() => toggle('allowBackorder')} />
                  </label>
                </div>
              </div>
            )}
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

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? 'bg-violet-600' : 'bg-black/15'}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
          checked ? 'right-0.5' : 'right-[22px]'
        }`}
      />
    </button>
  )
}

function inputClass(error) {
  return `w-full rounded-lg border bg-[#F4F5F7] px-3 py-2.5 text-sm text-[#1A1B23] placeholder:text-black/35 focus:outline-none focus:ring-2 ${
    error
      ? 'border-rose-300 focus:ring-rose-500/20'
      : 'border-black/10 focus:border-violet-400 focus:ring-violet-500/20'
  }`
}