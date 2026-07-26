import React from 'react'
import { Icon } from '@iconify/react'

// ---- Mock data (replace with real API data) ----------------------------
const STATS = [
  { label: 'کل کاربران', value: '۱۲,۴۸۰', delta: '+۸.۲٪', trend: 'up', icon: 'mdi:account-group-outline', tint: 'bg-violet-50 text-violet-600' },
  { label: 'درآمد این ماه', value: '۴۲۸,۹۰۰,۰۰۰ ت', delta: '+۱۲.۴٪', trend: 'up', icon: 'mdi:cash-multiple', tint: 'bg-emerald-50 text-emerald-600' },
  { label: 'سفارش‌های جدید', value: '۹۶۳', delta: '-۲.۱٪', trend: 'down', icon: 'mdi:cart-outline', tint: 'bg-sky-50 text-sky-600' },
  { label: 'نرخ بازگشت مشتری', value: '۶۴٪', delta: '+۳.۶٪', trend: 'up', icon: 'mdi:refresh', tint: 'bg-amber-50 text-amber-600' },
]

const WEEKLY_SALES = [
  { day: 'شنبه', value: 42 },
  { day: 'یکشنبه', value: 58 },
  { day: 'دوشنبه', value: 35 },
  { day: 'سه‌شنبه', value: 71 },
  { day: 'چهارشنبه', value: 64 },
  { day: 'پنجشنبه', value: 88 },
  { day: 'جمعه', value: 53 },
]

const ROLE_SPLIT = [
  { label: 'کاربر', value: 68, color: '#7C3AED' },
  { label: 'ویرایشگر', value: 22, color: '#38BDF8' },
  { label: 'مدیر', value: 10, color: '#34D399' },
]

const ACTIVITY = [
  { icon: 'mdi:account-plus-outline', tint: 'bg-violet-50 text-violet-600', text: 'مریم کریمی به عنوان کاربر جدید ثبت‌نام کرد', time: '۱۰ دقیقه پیش' },
  { icon: 'mdi:cart-check', tint: 'bg-emerald-50 text-emerald-600', text: 'سفارش #۱۰۴۲ با موفقیت پرداخت شد', time: '۳۲ دقیقه پیش' },
  { icon: 'mdi:alert-circle-outline', tint: 'bg-amber-50 text-amber-600', text: 'موجودی محصول «کیف چرم» رو به اتمام است', time: '۱ ساعت پیش' },
  { icon: 'mdi:account-edit-outline', tint: 'bg-sky-50 text-sky-600', text: 'نقش کاربر علی رضایی به ویرایشگر تغییر کرد', time: '۳ ساعت پیش' },
  { icon: 'mdi:message-alert-outline', tint: 'bg-rose-50 text-rose-600', text: 'تیکت پشتیبانی جدید از طرف حسین محمدی', time: 'دیروز' },
]

const TOP_USERS = [
  { name: 'سارا احمدی', role: 'مدیر', orders: 128, avatarTint: 'bg-violet-100 text-violet-700' },
  { name: 'علی رضایی', role: 'ویرایشگر', orders: 94, avatarTint: 'bg-sky-100 text-sky-700' },
  { name: 'نگار صادقی', role: 'ویرایشگر', orders: 81, avatarTint: 'bg-emerald-100 text-emerald-700' },
  { name: 'امیر حسینی', role: 'کاربر', orders: 67, avatarTint: 'bg-amber-100 text-amber-700' },
]

function initials(name) {
  const parts = name.trim().split(' ')
  return (parts[0]?.[0] || '') + (parts[1]?.[0] || '')
}

export default function Dashboard() {
  const maxSales = Math.max(...WEEKLY_SALES.map((d) => d.value))
  const total = ROLE_SPLIT.reduce((sum, r) => sum + r.value, 0)

  // Build donut chart segments
  let cumulative = 0
  const radius = 46
  const circumference = 2 * Math.PI * radius
  const segments = ROLE_SPLIT.map((r) => {
    const fraction = r.value / total
    const dash = fraction * circumference
    const seg = { ...r, dash, offset: circumference - cumulative }
    cumulative += dash
    return seg
  })

  return (
    <div dir="rtl" className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1A1B23]">خوش آمدید 👋</h1>
          <p className="mt-1 text-sm text-black/50">نمای کلی عملکرد امروز، ۴ مرداد ۱۴۰۳</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700"
        >
          <Icon icon="mdi:download-outline" className="h-5 w-5" />
          دانلود گزارش
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-lg border border-black/10 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.tint}`}>
                <Icon icon={s.icon} className="h-5 w-5" />
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  s.trend === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}
              >
                <Icon icon={s.trend === 'up' ? 'mdi:trending-up' : 'mdi:trending-down'} className="h-3.5 w-3.5" />
                {s.delta}
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold text-[#1A1B23]">{s.value}</p>
            <p className="mt-1 text-xs text-black/45">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Weekly sales bar chart */}
        <div className="rounded-lg border border-black/10 bg-white p-5 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#1A1B23]">فروش هفتگی</h2>
              <p className="text-xs text-black/45">مقایسه فروش روزانه در هفته جاری</p>
            </div>
            <span className="rounded-lg bg-[#F4F5F7] px-3 py-1.5 text-xs font-medium text-black/60">
              ۷ روز اخیر
            </span>
          </div>

          <div className="flex h-52 items-end justify-between gap-2 sm:gap-4">
            {WEEKLY_SALES.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-40 w-full items-end justify-center">
                  <div
                    className="w-full max-w-[32px] rounded-t-md bg-violet-500/85 transition-all hover:bg-violet-600"
                    style={{ height: `${(d.value / maxSales) * 100}%` }}
                    title={`${d.value} سفارش`}
                  />
                </div>
                <span className="text-[11px] text-black/40">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Role distribution donut */}
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <h2 className="text-sm font-semibold text-[#1A1B23]">توزیع کاربران</h2>
          <p className="mb-4 text-xs text-black/45">بر اساس نقش در سیستم</p>

          <div className="flex items-center justify-center py-2">
            <svg viewBox="0 0 120 120" className="h-40 w-40 -rotate-90">
              <circle cx="60" cy="60" r={radius} fill="none" stroke="#F1F1F4" strokeWidth="14" />
              {segments.map((seg) => (
                <circle
                  key={seg.label}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="14"
                  strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
                  strokeDashoffset={seg.offset}
                  strokeLinecap="round"
                />
              ))}
            </svg>
          </div>

          <div className="mt-2 space-y-2">
            {ROLE_SPLIT.map((r) => (
              <div key={r.label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                  <span className="text-black/60">{r.label}</span>
                </div>
                <span className="font-medium text-[#1A1B23]">{r.value}٪</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity + Top users */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Recent activity */}
        <div className="rounded-lg border border-black/10 bg-white p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-[#1A1B23]">فعالیت‌های اخیر</h2>
          <ul className="space-y-4">
            {ACTIVITY.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${a.tint}`}>
                  <Icon icon={a.icon} className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1 border-b border-black/5 pb-4 last:border-0 last:pb-0">
                  <p className="text-sm text-[#1A1B23]">{a.text}</p>
                  <p className="mt-0.5 text-xs text-black/40">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Top users */}
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-[#1A1B23]">کاربران برتر</h2>
          <ul className="space-y-3">
            {TOP_USERS.map((u) => (
              <li key={u.name} className="flex items-center gap-3">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${u.avatarTint}`}>
                  {initials(u.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#1A1B23]">{u.name}</p>
                  <p className="truncate text-xs text-black/45">{u.role}</p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-black/60">{u.orders} سفارش</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}