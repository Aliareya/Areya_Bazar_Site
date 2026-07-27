import React, { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { useApi } from '../../../context/ApiContext'

const API_URL = 'http://localhost:3000/users'

const ROLE_OPTIONS = [
  { value: 'admin', label: 'مدیر' },
  { value: 'seller', label: 'فروشنده' },
  { value: 'buyer', label: 'خریدار' },
]

function initials(form) {
  return `${form.firstName?.[0] || ''}${form.lastName?.[0] || ''}` || '?'
}

function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' })
  } catch {
    return '—'
  }
}

export default function UserEdit({ onCancel, onSave }) {
  const {apiurl} = useApi()
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('accessToken')
  const fileInputRef = useRef(null)

  const [form, setForm] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageError, setImageError] = useState('')

  useEffect(() => {
    if (!token) {
      navigate('/auth/login')
      return
    }

    const fetchUser = async () => {
      setLoading(true)
      setLoadError('')
      try {
        const res = await axios.get(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setForm(res.data)
      } catch (err) {
        console.error('Failed to fetch user:', err)
        setLoadError('دریافت اطلاعات کاربر با خطا مواجه شد')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [id])

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  function validate() {
    const next = {}
    if (!form.firstName?.trim()) next.firstName = 'وارد کردن نام الزامی است'
    if (!form.lastName?.trim()) next.lastName = 'وارد کردن نام خانوادگی الزامی است'
    if (!form.email?.trim()) next.email = 'وارد کردن ایمیل الزامی است'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'فرمت ایمیل معتبر نیست'

    // Only validate password fields if the admin is actually trying to change the password
    if (newPassword || confirmPassword) {
      if (newPassword.length < 6) next.newPassword = 'رمز عبور باید حداقل ۶ کاراکتر باشد'
      if (newPassword !== confirmPassword) next.confirmPassword = 'رمز عبور و تکرار آن یکسان نیست'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      role: form.role,
      ...(newPassword ? { password: newPassword } : {}),
    }

    setSaving(true)
    try {
      const res = await axios.put(`${apiurl}/users/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setForm((prev) => ({ ...prev, ...res.data?.data, ...res.data }))
      setNewPassword('')
      setConfirmPassword('')
      setSaved(true)
      onSave?.(res.data)
    } catch (err) {
      console.error('Failed to update user:', err)
      setErrors({ submit: err.response?.data?.message || 'ذخیره تغییرات با خطا مواجه شد' })
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    if (onCancel) onCancel()
    else navigate('/users')
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await axios.delete(`${apiurl}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      navigate('/users')
    } catch (err) {
      console.error('Failed to delete user:', err)
      setErrors({ submit: 'حذف کاربر با خطا مواجه شد' })
      setDeleting(false)
    }
  }

  // ==========================================
  // PROFILE IMAGE UPLOAD
  // ==========================================

  function triggerFileSelect() {
    fileInputRef.current?.click()
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setImageError('')
    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await axios.post(`${apiurl}/users/upload-profile/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      const imageUrl = res.data?.imageUrl?.url || res.data?.data?.profileImage
      if (imageUrl) {
        update('profileImage', imageUrl)
      }
    } catch (err) {
      console.error('Failed to upload profile image:', err)
      setImageError('آپلود تصویر با خطا مواجه شد')
    } finally {
      setUploadingImage(false)
      // reset input so selecting the same file again still triggers onChange
      e.target.value = ''
    }
  }

  if (loading) {
    return (
      <div dir="rtl" className="flex items-center justify-center py-24 text-black/40">
        <Icon icon="mdi:loading" className="me-2 h-6 w-6 animate-spin text-violet-500" />
        در حال بارگذاری اطلاعات کاربر...
      </div>
    )
  }

  if (loadError || !form) {
    return (
      <div dir="rtl" className="space-y-4">
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <Icon icon="mdi:alert-circle-outline" className="h-5 w-5 shrink-0" />
          {loadError || 'کاربر مورد نظر پیدا نشد'}
        </div>
        <button
          type="button"
          onClick={() => navigate('/users')}
          className="inline-flex items-center gap-1.5 text-sm text-black/45 transition hover:text-[#1A1B23]"
        >
          <Icon icon="mdi:arrow-right" className="h-4 w-4" />
          بازگشت به کاربران
        </button>
      </div>
    )
  }

  return (
    <div dir="rtl" className="space-y-5">
      {/* Header / breadcrumb */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={handleCancel}
            className="mb-2 inline-flex items-center gap-1.5 text-sm text-black/45 transition hover:text-[#1A1B23]"
          >
            <Icon icon="mdi:arrow-right" className="h-4 w-4" />
            بازگشت به کاربران
          </button>
          <h1 className="text-xl font-bold text-[#1A1B23]">ویرایش کاربر</h1>
          <p className="mt-1 text-sm text-black/50">
            به‌روزرسانی اطلاعات، نقش و دسترسی‌های {form.firstName || 'کاربر'} {form.lastName || ''}
          </p>
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
            form="edit-user-form"
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

      {errors.submit && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <Icon icon="mdi:alert-circle-outline" className="h-5 w-5 shrink-0" />
          {errors.submit}
        </div>
      )}

      <form id="edit-user-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left column: profile summary */}
        <div className="space-y-5 lg:col-span-1">
          <div className="rounded-lg border border-black/10 bg-white p-5 text-center">
            {form.profileImage ? (
              <img
                src={form.profileImage}
                alt={form.firstName}
                className="mx-auto h-20 w-20 rounded-full object-cover ring-1 ring-black/10"
              />
            ) : (
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 text-xl font-semibold text-violet-700">
                {initials(form)}
              </div>
            )}

            <p className="mt-3 truncate font-medium text-[#1A1B23]">
              {form.firstName} {form.lastName}
            </p>
            <p className="truncate text-xs text-black/45" dir="ltr">{form.email}</p>

            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />

            <button
              type="button"
              disabled={uploadingImage}
              onClick={triggerFileSelect}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-2 text-xs font-medium text-black/60 transition hover:bg-black/[0.03] disabled:opacity-60"
            >
              {uploadingImage ? (
                <Icon icon="mdi:loading" className="h-4 w-4 animate-spin" />
              ) : (
                <Icon icon="mdi:camera-outline" className="h-4 w-4" />
              )}
              {uploadingImage ? 'در حال آپلود...' : 'تغییر تصویر پروفایل'}
            </button>

            {imageError && (
              <p className="mt-2 text-xs text-rose-600">{imageError}</p>
            )}

            <div className="mt-5 border-t border-black/10 pt-4 text-right text-xs text-black/45">
              <div className="flex items-center justify-between py-1">
                <span>شناسه کاربر</span>
                <span className="font-mono text-black/60">#{form.id ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>تاریخ عضویت</span>
                <span className="text-black/60">{formatDate(form.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>آخرین بروزرسانی</span>
                <span className="text-black/60">{formatDate(form.updatedAt)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-rose-200 bg-white p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-rose-600">
              <Icon icon="mdi:alert-circle-outline" className="h-4 w-4" />
              منطقه خطر
            </p>
            <p className="mt-2 text-xs leading-5 text-black/50">
              حذف کامل، تمام اطلاعات این کاربر را برای همیشه پاک می‌کند. این عملیات قابل بازگشت نیست.
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
              {deleting ? 'در حال حذف...' : 'حذف کاربر'}
            </button>
          </div>
        </div>

        {/* Right column: editable fields */}
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-lg border border-black/10 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-[#1A1B23]">اطلاعات پایه</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="نام" error={errors.firstName}>
                <input
                  value={form.firstName || ''}
                  onChange={(e) => update('firstName', e.target.value)}
                  className={inputClass(errors.firstName)}
                  placeholder="مثلاً یحیی"
                />
              </Field>

              <Field label="نام خانوادگی" error={errors.lastName}>
                <input
                  value={form.lastName || ''}
                  onChange={(e) => update('lastName', e.target.value)}
                  className={inputClass(errors.lastName)}
                  placeholder="مثلاً رضایی"
                />
              </Field>

              <Field label="ایمیل" error={errors.email}>
                <input
                  dir="ltr"
                  value={form.email || ''}
                  onChange={(e) => update('email', e.target.value)}
                  className={inputClass(errors.email)}
                  placeholder="name@example.com"
                />
              </Field>

              <Field label="نقش کاربر">
                <select
                  value={form.role || ''}
                  onChange={(e) => update('role', e.target.value)}
                  className={inputClass()}
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
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