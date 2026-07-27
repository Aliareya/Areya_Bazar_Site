import React, { useEffect, useMemo, useState } from 'react'
import { Icon } from '@iconify/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../../../context/ApiContext'

const API_URL = 'http://localhost:3000/users'
const ROLE_LABELS = {
  admin: 'مدیر',
  seller: 'فروشنده',
  buyer: 'خریدار',
}

const ROLE_BADGE_STYLES = {
  admin: 'bg-violet-50 text-violet-700 ring-violet-600/20',
  seller: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  buyer: 'bg-sky-50 text-sky-700 ring-sky-600/20',
}

const DEFAULT_ROLE_BADGE = 'bg-slate-100 text-slate-600 ring-slate-500/20'

const ROLE_TINT = {
  admin: 'bg-violet-50 text-violet-600',
  seller: 'bg-amber-50 text-amber-600',
  buyer: 'bg-sky-50 text-sky-600',
}

const DEFAULT_ROLE_TINT = 'bg-slate-100 text-slate-600'

const AVATAR_PALETTE = [
  'bg-violet-100 text-violet-700',
  'bg-sky-100 text-sky-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
]

const PAGE_SIZE = 10
const ALL_ROLES_OPTION = 'همه نقش‌ها'

function fullName(u) {
  return `${u.firstName || ''} ${u.lastName || ''}`.trim()
}

function initials(u) {
  return `${u.firstName?.[0] || ''}${u.lastName?.[0] || ''}`
}

function roleLabel(role) {
  return ROLE_LABELS[role] || role || '—'
}

function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' })
  } catch {
    return '—'
  }
}

export default function Users() {
  const navigate = useNavigate()
  const token = localStorage.getItem('accessToken')

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const {apiurl} = useApi()

  const [search, setSearch] = useState('')
  const [role, setRole] = useState(ALL_ROLES_OPTION)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState([])
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (!token) {
      navigate('/auth/login')
      return
    }

    const fetchUsers = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await axios.get(`${apiurl}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUsers(response.data || [])
      } catch (err) {
        console.error('Failed to fetch users:', err)
        setError('دریافت لیست کاربران با خطا مواجه شد')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const roleOptions = useMemo(() => {
    const unique = Array.from(new Set(users.map((u) => u.role))).filter(Boolean)
    return [ALL_ROLES_OPTION, ...unique]
  }, [users])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return users.filter((u) => {
      const matchesSearch =
        !q || fullName(u).toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
      const matchesRole = role === ALL_ROLES_OPTION || u.role === role
      return matchesSearch && matchesRole
    })
  }, [users, search, role])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageSafe = Math.min(page, totalPages)
  const pageItems = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE)

  const allOnPageSelected = pageItems.length > 0 && pageItems.every((u) => selected.includes(u.id))

  function toggleAll() {
    if (allOnPageSelected) {
      setSelected((prev) => prev.filter((id) => !pageItems.some((u) => u.id === id)))
    } else {
      setSelected((prev) => Array.from(new Set([...prev, ...pageItems.map((u) => u.id)])))
    }
  }

  function toggleOne(id) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  async function removeUser(id) {
    setDeletingId(id)
    try {
      await axios.delete(`${apiurl}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers((prev) => prev.filter((u) => u.id !== id))
      setSelected((prev) => prev.filter((x) => x !== id))
    } catch (err) {
      console.error('Failed to delete user:', err)
      setError('حذف کاربر با خطا مواجه شد')
    } finally {
      setDeletingId(null)
    }
  }

  async function removeSelected() {
    const ids = [...selected]
    try {
      await Promise.all(
        ids.map((id) => axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } }))
      )
      setUsers((prev) => prev.filter((u) => !ids.includes(u.id)))
      setSelected([])
    } catch (err) {
      console.error('Failed to delete users:', err)
      setError('حذف کاربران انتخاب‌شده با خطا مواجه شد')
    }
  }

  const roleCounts = useMemo(() => {
    return users.reduce((acc, u) => {
      acc[u.role] = (acc[u.role] || 0) + 1
      return acc
    }, {})
  }, [users])

  return (
    <div dir="rtl" className="space-y-5">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1A1B23]">کاربران</h1>
          <p className="mt-1 text-sm text-black/50">
            مدیریت کاربران، نقش‌ها و دسترسی‌های سیستم
          </p>
        </div>

      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <Icon icon="mdi:alert-circle-outline" className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Stat chips */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex items-center gap-3 rounded-lg border border-black/10 bg-white p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <Icon icon="mdi:account-group-outline" className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-lg font-bold leading-none text-[#1A1B23]">{users.length}</p>
            <p className="mt-1 truncate text-xs text-black/50">کل کاربران</p>
          </div>
        </div>
        {Object.entries(roleCounts).map(([r, count]) => (
          <div key={r} className="flex items-center gap-3 rounded-lg border border-black/10 bg-white p-4">
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                (ROLE_BADGE_STYLES[r] || DEFAULT_ROLE_BADGE).replace('ring-', 'text-').split(' ').slice(0, 2).join(' ')
              }`}
            >
              <Icon icon="mdi:account-outline" className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-lg font-bold leading-none text-[#1A1B23]">{count}</p>
              <p className="mt-1 truncate text-xs text-black/50">{roleLabel(r)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="rounded-lg border border-black/10 bg-white">
        <div className="flex flex-col gap-3 border-b border-black/10 p-4 sm:flex-row sm:items-center sm:justify-between">
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
              placeholder="جستجو بر اساس نام یا ایمیل..."
              className="w-full rounded-lg border border-black/10 bg-[#F4F5F7] py-2 pr-9 pl-3 text-sm text-[#1A1B23] placeholder:text-black/35 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value)
                setPage(1)
              }}
              className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#1A1B23] focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            >
              {roleOptions.map((r) => (
                <option key={r} value={r}>{r === ALL_ROLES_OPTION ? r : roleLabel(r)}</option>
              ))}
            </select>

            {selected.length > 0 && (
              <button
                type="button"
                onClick={removeSelected}
                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-100"
              >
                <Icon icon="mdi:trash-can-outline" className="h-4 w-4" />
                حذف ({selected.length})
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-black/10 text-right text-xs text-black/40">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-black/20 text-violet-600 focus:ring-violet-500/30"
                  />
                </th>
                <th className="px-2 py-3 font-medium">کاربر</th>
                <th className="px-2 py-3 font-medium">نقش</th>
                <th className="px-2 py-3 font-medium">تاریخ عضویت</th>
                <th className="w-16 px-2 py-3 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-14 text-center text-black/40">
                    <Icon icon="mdi:loading" className="mx-auto mb-2 h-6 w-6 animate-spin text-violet-500" />
                    در حال بارگذاری کاربران...
                  </td>
                </tr>
              )}

              {!loading && pageItems.map((u, idx) => (
                <tr key={u.id} className="border-b border-black/5 last:border-0 hover:bg-[#F4F5F7]/70">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(u.id)}
                      onChange={() => toggleOne(u.id)}
                      className="h-4 w-4 rounded border-black/20 text-violet-600 focus:ring-violet-500/30"
                    />
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${AVATAR_PALETTE[idx % AVATAR_PALETTE.length]}`}
                      >
                        {initials(u)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-[#1A1B23]">{fullName(u)}</p>
                        <p className="truncate text-xs text-black/45" dir="ltr">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${ROLE_BADGE_STYLES[u.role] || DEFAULT_ROLE_BADGE}`}
                    >
                      {roleLabel(u.role)}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-black/60">{formatDate(u.createdAt)}</td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        title="ویرایش"
                        onClick={() => navigate(`/admin/users/${u.id}`)}
                        className="rounded-md p-1.5 text-black/40 transition hover:bg-black/5 hover:text-violet-600"
                      >
                        <Icon icon="mdi:pencil-outline" className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="حذف"
                        disabled={deletingId === u.id}
                        onClick={() => removeUser(u.id)}
                        className="rounded-md p-1.5 text-black/40 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
                      >
                        <Icon
                          icon={deletingId === u.id ? 'mdi:loading' : 'mdi:trash-can-outline'}
                          className={`h-4 w-4 ${deletingId === u.id ? 'animate-spin' : ''}`}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && pageItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-14 text-center text-black/40">
                    <Icon icon="mdi:account-search-outline" className="mx-auto mb-2 h-8 w-8 text-black/25" />
                    کاربری با این مشخصات پیدا نشد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-black/10 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-black/45">
              نمایش {(pageSafe - 1) * PAGE_SIZE + 1}
              {' '}تا {(pageSafe - 1) * PAGE_SIZE + pageItems.length} از {filtered.length} کاربر
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
    </div>
  )
}