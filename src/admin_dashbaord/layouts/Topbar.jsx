import React from 'react'
import { Icon } from '@iconify/react'

function Topbar({setMobileOpen}) {
    return (
        <header className="sticky top-0 z-20 h-16 flex bg-white shadow-md items-center justify-between gap-4 border-b border-black/[0.06] bg-[#F4F5F7]/90 backdrop-blur px-3 lg:px-5">
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden h-9 w-9 flex items-center justify-center rounded-md hover:bg-black/5"
            >
                <Icon icon="lucide:menu" className="h-5 w-5" />
            </button>

            <h1 className="text-base font-semibold">داشبورد</h1>

            <div className="flex-1 max-w-md">
                <div className="relative">
                    <Icon
                        icon="lucide:search"
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/35"
                    />
                    <input
                        type="text"
                        placeholder="جستجو…"
                        className="w-full h-9 rounded-md border border-black/10 bg-white pr-9 pl-3 text-sm placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-[#F2A63A]/40"
                    />
                </div>
            </div>

            <div className="flex items-center gap-1">
                {/* Notifications */}
                <button
                    aria-label="اعلان‌ها"
                    className="relative flex h-10 w-10 items-center justify-center rounded-lg text-black/55 transition hover:bg-black/[0.05] hover:text-black"
                >
                    <Icon icon="lucide:bell" className="h-[18px] w-[18px]" />

                    <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-[#F2A63A] ring-2 ring-[#F4F5F7]" />
                </button>

                {/* Divider */}
                <div className="mx-2 hidden h-6 w-px bg-black/[0.08] sm:block" />

                {/* User profile */}
                <button className="flex items-center gap-2 rounded-lg p-1.5 transition bg-gray-200">
                    <img
                        src="https://i.pravatar.cc/64?img=12"
                        alt="پروفایل کاربر"
                        className="h-8 w-8 rounded-full object-cover ring-1 ring-black/10"
                    />

                    <div className="hidden text-right sm:block">
                        <p className="text-xs font-semibold text-black/80">
                            مدیر سیستم
                        </p>
                        <p className="mt-0.5 text-[10px] text-black/40">
                            Administrator
                        </p>
                    </div>

                    <Icon
                        icon="lucide:chevron-down"
                        className="hidden h-4 w-4 text-black/35 sm:block"
                    />
                </button>
            </div>
        </header>
    )
}

export default Topbar