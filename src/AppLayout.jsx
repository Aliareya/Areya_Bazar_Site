import React, { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

import SellerLayout from './seller_dashboard/layouts/SellerLayout';
import AdminLayout from './admin_dashbaord/layouts/AdminLayout';
import SiteLayout from './site/layouts/SiteLayout';
import { useAuth } from './context/AuthContext';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin" />
        <p className="text-xs text-gray-400">در حال بررسی هویت کاربر</p>
      </div>
    </div>
  );
}

function AccessDeniedScreen({ requiredRole }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="flex flex-col items-center gap-3 text-center max-w-sm">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <span className="text-red-500 text-2xl">⛔</span>
        </div>
        <h2 className="text-base font-bold text-gray-800">دسترسی غیرمجاز</h2>
        <p className="text-xs text-gray-400">
          شما اجازه‌ی دسترسی به این بخش را ندارید
          {requiredRole ? ` (فقط ${requiredRole})` : ""}.
        </p>
      </div>
    </div>
  );
}

function AppLayout() {
  const location = useLocation();
  const { user, loading } = useAuth();

  const isSellerRoute = location.pathname.startsWith('/seller');
  const isAdminRoute  = location.pathname.startsWith('/admin');

  const isSeller = user?.role === 'seller';
  const isAdmin  = user?.role === 'admin';

  return (
    <>
      <ScrollToTop />

      {loading ? (
        <AuthLoadingScreen />
      ) : isSellerRoute ? (
        !user ? (
          <Navigate to="/login" state={{ from: location }} replace />
        ) : isSeller ? (
          <SellerLayout />
        ) : (
          <AccessDeniedScreen requiredRole="فروشنده" />
        )
      ) : isAdminRoute ? (
        !user ? (
          <Navigate to="/login" state={{ from: location }} replace />
        ) : isAdmin ? (
          <AdminLayout />
        ) : (
          <AccessDeniedScreen requiredRole="مدیر" />
        )
      ) : (
        <SiteLayout />
      )}
    </>
  );
}

export default AppLayout;