import React from 'react'
import { useLocation } from 'react-router-dom';
import SellerLayout from './seller_dashboard/layouts/SellerLayout';
import AdminLayout from './admin_dashbaord/layouts/AdminLayout';
import SiteLayout from './site/layouts/SiteLayout';

function AppLayout() {
    const location = useLocation();
    const is_seller = location.pathname.startsWith('/seller');
    const is_admin = location.pathname.startsWith('/admin');


    return (
        <>
            {
                is_admin ? 
                <AdminLayout /> :
                is_seller ?
                <SellerLayout /> : 
                <SiteLayout />
            }
        </>
    )
}

export default AppLayout