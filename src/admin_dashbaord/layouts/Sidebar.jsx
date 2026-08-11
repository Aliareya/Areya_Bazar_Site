import React from 'react';
import { Icon } from '@iconify/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Sidebar({ mobileOpen, setMobileOpen }) {
    const navigate = useNavigate();
    const location = useLocation();
    const {user} = useAuth()

    const NAV_ITEMS = [
        { name: 'داشبورد', icon: 'lucide:layout-dashboard', path: '/admin/dashboard' },
        { name: 'کاربران', icon: 'lucide:users', path: '/admin/users' },
        { name: 'سفارش‌ها', icon: 'lucide:shopping-cart', path: '/admin/orders' },
        { name: 'محصولات', icon: 'lucide:package', path: '/admin/products' },
        { name: 'دسته بندی ها', icon: 'lucide:shapes', path: '/admin/categories' },
        { name: 'تنظیمات', icon: 'lucide:settings', path: '/admin/settings' },
    ];

    function handleNavigate(path) {
        navigate(path);
        setMobileOpen(false);
    }

    return (
        <aside
            className={`fixed inset-y-0 right-0 z-50 w-64 bg-[#1f5138] transition-transform duration-200
            lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
            <div className="flex h-full flex-col">
                <div className="flex items-center gap-2 px-5 h-16 shrink-0 border-b border-white/10">
                    <span className="text-lg font-bold text-white">
                        پنل مدیریت <span className="text-[#F2A63A]">آریا بازار</span>
                    </span>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive =
                            location.pathname === item.path ||
                            location.pathname.startsWith(`${item.path}/`);

                        return (
                            <button
                                key={item.name}
                                onClick={() => handleNavigate(item.path)}
                                className={`w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                                    isActive
                                        ? 'bg-white/[0.08] text-white'
                                        : 'text-white/55 hover:text-white hover:bg-white/[0.05]'
                                }`}
                            >
                                <Icon icon={item.icon} className="h-[18px] w-[18px] shrink-0" />
                                <span>{item.name}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="px-3 py-4 border-t border-white/10">
                    <div className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/[0.05] cursor-pointer">
                        <img
                            src={user?.image}
                            alt=""
                            className="h-8 w-8 rounded-full ring-1 ring-white/10"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="text-sm text-white truncate">{user?.first_name}</p>
                            <p className="text-xs text-white/35 truncate">{user?.role}</p>
                        </div>
                        <Icon icon="lucide:log-out" className="h-4 w-4 text-white/40" />
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;