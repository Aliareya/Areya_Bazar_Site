import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Change this to your real API URL
const API_URL = "http://localhost:3000/categories";

export default function Categories() {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [deletingId, setDeletingId] = useState(null);
    const [deleteModal, setDeleteModal] = useState(null);


    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(API_URL);
            setCategories(response.data.categorise || []);
        } catch (err) {
            console.error("Fetch categories error:", err);

            setError("دریافت دسته‌بندی‌ها با مشکل مواجه شد");
        } finally {
            setLoading(false);
        }
    }

    const filteredCategories = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return categories;
        }

        return categories.filter((category) => {
            const name = category.name?.toLowerCase() || "";

            const slug = category.slug?.toLowerCase() || "";

            const description = category.description?.toLowerCase() || "";

            return (
                name.includes(query) ||
                slug.includes(query) ||
                description.includes(query)
            );
        });
    }, [categories, search]);


    const totalCategories = categories.length;

    const activeCategories = categories.filter(
        (category) => category.status === true,
    ).length;

    const inactiveCategories = totalCategories - activeCategories;


    function formatDate(date) {
        if (!date) {
            return "-";
        }

        try {
            return new Date(date).toLocaleDateString("fa-AF", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch {
            return "-";
        }
    }


    function openDeleteModal(category) {
        setDeleteModal(category);
    }

    function closeDeleteModal() {
        if (deletingId) {
            return;
        }

        setDeleteModal(null);
    }

    async function handleDelete() {
        if (!deleteModal) {
            return;
        }

        const slug = deleteModal.slug;

        try {
            setDeletingId(slug);
            setError("");

            await axios.delete(`${API_URL}/${slug}`);

            setCategories((prev) => prev.filter((category) => category.slug !== slug));

            setDeleteModal(null);
        } catch (err) {
            console.error("Delete category error:", err);

            setError("حذف دسته‌بندی با مشکل مواجه شد");
        } finally {
            setDeletingId(null);
        }
    }


    function handleEdit(category) {
        navigate(`/admin/categories/${category.id}/edit`);
    }

    function handleCreate() {
        navigate("/admin/categories/create");
    }


    return (
        <div dir="rtl" className="space-y-5">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[#1A1B23]">دسته‌بندی‌ها</h1>

                    <p className="mt-1 text-sm text-black/50">
                        مدیریت دسته‌بندی محصولات فروشگاه
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleCreate}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-600/40"
                >
                    <Icon icon="mdi:plus" className="h-5 w-5" />
                    افزودن دسته‌بندی
                </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <StatCard
                    value={totalCategories}
                    label="کل دسته‌ها"
                    icon="mdi:shape-outline"
                    className="bg-slate-100 text-slate-600"
                />

                <StatCard
                    value={activeCategories}
                    label="دسته‌های فعال"
                    icon="mdi:check-circle-outline"
                    className="bg-emerald-50 text-emerald-600"
                />

                <StatCard
                    value={inactiveCategories}
                    label="دسته‌های غیرفعال"
                    icon="mdi:eye-off-outline"
                    className="bg-rose-50 text-rose-600"
                />
            </div>

            {error && (
                <div className="flex flex-col gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <Icon
                            icon="mdi:alert-circle-outline"
                            className="h-5 w-5 shrink-0"
                        />

                        <span>{error}</span>
                    </div>

                    <button
                        type="button"
                        onClick={fetchCategories}
                        className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-rose-700"
                    >
                        تلاش مجدد
                    </button>
                </div>
            )}

            <div className="rounded-lg border border-black/10 bg-white p-4">
                <div className="relative w-full sm:max-w-md">
                    <Icon
                        icon="mdi:magnify"
                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="جستجو بر اساس نام، اسلاگ یا توضیحات..."
                        className="w-full rounded-lg border border-black/10 bg-[#F4F5F7] py-2.5 pr-9 pl-3 text-sm text-[#1A1B23] placeholder:text-black/35 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    />
                </div>
            </div>

            {loading ? (
                <div className="rounded-lg border border-black/10 bg-white px-4 py-20 text-center">
                    <Icon
                        icon="mdi:loading"
                        className="mx-auto mb-3 h-9 w-9 animate-spin text-violet-600"
                    />

                    <p className="text-sm text-black/50">در حال دریافت دسته‌بندی‌ها...</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[950px] text-sm">
                            <thead>
                                <tr className="border-b border-black/10 text-right text-xs text-black/40">
                                    <th className="px-4 py-3 font-medium">دسته‌بندی</th>
                                    <th className="px-2 py-3 font-medium">اسلاگ</th>
                                    <th className="px-2 py-3 font-medium">توضیحات</th>
                                    <th className="px-2 py-3 font-medium">وضعیت</th>
                                    <th className="px-2 py-3 font-medium">تاریخ ایجاد</th>
                                    <th className="w-24 px-2 py-3 font-medium">عملیات</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredCategories.map((category) => (
                                    <tr
                                        key={category.id}
                                        className="border-b border-black/5 last:border-0 hover:bg-[#F4F5F7]/70"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-black/10 bg-[#F4F5F7]">
                                                    {category.image ? (
                                                        <img
                                                            src={category.image}
                                                            alt={category.name}
                                                            className="h-full w-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-black/30">
                                                            <Icon
                                                                icon="mdi:image-off-outline"
                                                                className="h-5 w-5"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-[#1A1B23]">
                                                        {category.name}
                                                    </p>

                                                    <p className="text-xs text-black/40">
                                                        ID: {category.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-2 py-3">
                                            <span
                                                dir="ltr"
                                                className="rounded-md bg-[#F4F5F7] px-2 py-1 text-xs text-black/60"
                                            >
                                                {category.slug}
                                            </span>
                                        </td>

                                        <td className="max-w-[280px] px-2 py-3">
                                            <p className="truncate text-black/60">
                                                {category.description || "-"}
                                            </p>
                                        </td>

                                        <td className="px-2 py-3">
                                            {category.status ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                                    <Icon
                                                        icon="mdi:check-circle-outline"
                                                        className="h-3.5 w-3.5"
                                                    />
                                                    فعال
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20">
                                                    <Icon
                                                        icon="mdi:close-circle-outline"
                                                        className="h-3.5 w-3.5"
                                                    />
                                                    غیرفعال
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-2 py-3 text-xs text-black/50">
                                            {formatDate(category.createdAt)}
                                        </td>

                                        <td className="px-2 py-3">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    title="ویرایش"
                                                    onClick={() => handleEdit(category)}
                                                    className="rounded-md p-1.5 text-black/40 transition hover:bg-black/5 hover:text-violet-600"
                                                >
                                                    <Icon icon="mdi:pencil-outline" className="h-4 w-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    title="حذف"
                                                    disabled={deletingId === category.id}
                                                    onClick={() => openDeleteModal(category)}
                                                    className="rounded-md p-1.5 text-black/40 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
                                                >
                                                    {deletingId === category.id ? (
                                                        <Icon
                                                            icon="mdi:loading"
                                                            className="h-4 w-4 animate-spin"
                                                        />
                                                    ) : (
                                                        <Icon
                                                            icon="mdi:trash-can-outline"
                                                            className="h-4 w-4"
                                                        />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredCategories.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-16 text-center">
                                            <Icon
                                                icon="mdi:shape-outline"
                                                className="mx-auto mb-3 h-10 w-10 text-black/20"
                                            />

                                            <p className="text-sm text-black/40">
                                                {search
                                                    ? "دسته‌بندی‌ای با این جستجو پیدا نشد"
                                                    : "هنوز هیچ دسته‌بندی‌ای ثبت نشده است"}
                                            </p>

                                            {!search && (
                                                <button
                                                    type="button"
                                                    onClick={handleCreate}
                                                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-xs font-medium text-white hover:bg-violet-700"
                                                >
                                                    <Icon icon="mdi:plus" className="h-4 w-4" />
                                                    افزودن دسته‌بندی
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {deleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div
                        dir="rtl"
                        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
                    >
                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                            <Icon icon="mdi:trash-can-outline" className="h-6 w-6" />
                        </div>

                        <h2 className="text-lg font-bold text-[#1A1B23]">حذف دسته‌بندی</h2>

                        <p className="mt-2 text-sm leading-6 text-black/50">
                            آیا مطمئن هستید که می‌خواهید دسته‌بندی
                            <span className="mx-1 font-semibold text-[#1A1B23]">
                                "{deleteModal.name}"
                            </span>
                            را حذف کنید؟
                        </p>

                        <p className="mt-2 text-xs text-rose-600">
                            این عملیات قابل برگشت نیست.
                        </p>

                        <div className="mt-6 flex items-center justify-end gap-2">
                            <button
                                type="button"
                                disabled={!!deletingId}
                                onClick={closeDeleteModal}
                                className="rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-[#1A1B23] transition hover:bg-black/[0.03] disabled:opacity-50"
                            >
                                انصراف
                            </button>

                            <button
                                type="button"
                                disabled={!!deletingId}
                                onClick={handleDelete}
                                className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-700 disabled:opacity-60"
                            >
                                {deletingId ? (
                                    <Icon icon="mdi:loading" className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Icon icon="mdi:trash-can-outline" className="h-4 w-4" />
                                )}

                                {deletingId ? "در حال حذف..." : "حذف دسته‌بندی"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


function StatCard({ value, label, icon, className }) {
    return (
        <div className="flex items-center gap-3 rounded-lg border border-black/10 bg-white p-4">
            <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${className}`}
            >
                <Icon icon={icon} className="h-5 w-5" />
            </span>

            <div className="min-w-0">
                <p className="text-lg font-bold leading-none text-[#1A1B23]">{value}</p>

                <p className="mt-1 truncate text-xs text-black/50">{label}</p>
            </div>
        </div>
    );
}