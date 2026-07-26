import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

const EMPTY_FORM = {
    name: "",
    slug: "",
    description: "",
    image: null,
};

const EXISTING_NAMES = ["پوشاک", "لوازم خانه", "الکترونیک", "زیبایی", "ورزش"];

function slugify(name) {
    return name.trim().replace(/\s+/g, "-");
}

export default function CreateCategory({ onCancel, onCreate }) {
    const navigate = useNavigate();

    const [form, setForm] = useState(EMPTY_FORM);
    const [slugTouched, setSlugTouched] = useState(false);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    function update(field, value) {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        setSaved(false);
    }

    function handleNameChange(value) {
        setForm((prev) => ({
            ...prev,
            name: value,
            slug: slugTouched ? prev.slug : slugify(value),
        }));

        setSaved(false);
    }

    function handleImageChange(e) {
        const file = e.target.files?.[0] || null;

        setForm((prev) => ({
            ...prev,
            image: file,
        }));

        setSaved(false);
    }

    function validate() {
        const next = {};

        if (!form.name.trim()) {
            next.name = "وارد کردن نام دسته‌بندی الزامی است";
        } else if (EXISTING_NAMES.includes(form.name.trim())) {
            next.name = "این نام قبلاً ثبت شده است";
        }

        if (!form.slug.trim()) {
            next.slug = "وارد کردن آدرس (Slug) الزامی است";
        } else if (
            !/^[a-z0-9-]+$/i.test(form.slug) &&
            !/^[\u0600-\u06FF0-9-]+$/.test(form.slug)
        ) {
            next.slug = "فقط حروف، عدد و خط تیره مجاز است";
        }

        setErrors(next);

        return Object.keys(next).length === 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!validate()) return;

        setSaving(true);

        try {
            const formData = new FormData();

            formData.append("name", form.name);
            formData.append("slug", form.slug);
            formData.append("description", form.description);

            // Add image file
            if (form.image) {
                formData.append("image", form.image);
            }

            // Example API request
            const response = await fetch("http://localhost:3000/categories", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to create category");
            }

            const data = await response.json();
            
            setSaving(false);
            setSaved(true);
            navigate('/admin/categories')

            onCreate?.(data);
        } catch (error) {
            console.error("Create category error:", error);
            setSaving(false);
        }
    }

    function handleCancel() {
        if (onCancel) {
            onCancel();
        } else {
            navigate("/admin/categories");
        }
    }

    function handleReset() {
        setForm(EMPTY_FORM);
        setSlugTouched(false);
        setErrors({});
        setSaved(false);
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
                        بازگشت به دسته‌بندی‌ها
                    </button>

                    <h1 className="text-xl font-bold text-[#1A1B23]">
                        افزودن دسته‌بندی جدید
                    </h1>

                    <p className="mt-1 text-sm text-black/50">
                        دسته‌بندی جدیدی برای سازمان‌دهی محصولات ایجاد کنید
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
                        form="create-category-form"
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 disabled:opacity-60"
                    >
                        {saving ? (
                            <Icon icon="mdi:loading" className="h-4 w-4 animate-spin" />
                        ) : (
                            <Icon icon="mdi:plus" className="h-4 w-4" />
                        )}

                        {saving ? "در حال ذخیره..." : "ذخیره دسته‌بندی"}
                    </button>
                </div>
            </div>

            {/* Success message */}
            {saved && (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    <Icon icon="mdi:check-circle-outline" className="h-5 w-5 shrink-0" />
                    دسته‌بندی با موفقیت ایجاد شد
                    <button
                        type="button"
                        onClick={handleReset}
                        className="mr-auto text-xs font-medium text-emerald-700 underline underline-offset-2"
                    >
                        افزودن دسته‌بندی دیگر
                    </button>
                </div>
            )}

            {/* Form */}
            <form
                id="create-category-form"
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-5 lg:grid-cols-3"
            >
                {/* Left column */}
                <div className="space-y-5 lg:col-span-1">
                    {/* Preview */}
                    <div className="rounded-lg border border-black/10 bg-white p-5">
                        <h2 className="mb-3 text-sm font-semibold text-[#1A1B23]">
                            پیش‌نمایش
                        </h2>

                        <div className="flex items-center gap-3 rounded-lg border border-black/10 p-4">
                            {form.image ? (
                                <img
                                    src={URL.createObjectURL(form.image)}
                                    alt="Category preview"
                                    className="h-11 w-11 shrink-0 rounded-lg object-cover"
                                />
                            ) : (
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                                    <Icon icon="mdi:shape-outline" className="h-6 w-6" />
                                </span>
                            )}

                            <div className="min-w-0">
                                <p className="truncate font-medium text-[#1A1B23]">
                                    {form.name || "نام دسته‌بندی"}
                                </p>

                                <p className="truncate text-xs text-black/45">
                                    {form.description || "توضیح کوتاه دسته‌بندی"}
                                </p>
                            </div>
                        </div>

                        <p className="mt-3 truncate text-xs text-black/40" dir="ltr">
                            /category/{form.slug || "slug"}
                        </p>
                    </div>
                </div>

                {/* Right column */}
                <div className="space-y-5 lg:col-span-2">
                    <div className="rounded-lg border border-black/10 bg-white p-5">
                        <h2 className="mb-4 text-sm font-semibold text-[#1A1B23]">
                            اطلاعات دسته‌بندی
                        </h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* Name */}
                            <Field label="نام دسته‌بندی" error={errors.name}>
                                <input
                                    value={form.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    className={inputClass(errors.name)}
                                    placeholder="مثلاً پوشاک"
                                />
                            </Field>

                            {/* Slug */}
                            <Field label="آدرس (Slug)" error={errors.slug}>
                                <input
                                    dir="ltr"
                                    value={form.slug}
                                    onChange={(e) => {
                                        setSlugTouched(true);
                                        update("slug", e.target.value);
                                    }}
                                    className={inputClass(errors.slug)}
                                    placeholder="clothing"
                                />
                            </Field>
                        </div>

                        {/* Description */}
                        <div className="mt-4">
                            <Field label="توضیح کوتاه">
                                <textarea
                                    value={form.description}
                                    onChange={(e) => update("description", e.target.value)}
                                    rows={3}
                                    className={inputClass() + " resize-none"}
                                    placeholder="مثلاً لباس، کیف و اکسسوری"
                                />
                            </Field>
                        </div>

                        {/* IMAGE FIELD */}
                        <div className="mt-4">
                            <Field label="تصویر دسته‌بندی">
                                <div className="flex items-center gap-4">
                                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-black/10 bg-[#F4F5F7] px-4 py-2.5 text-sm text-[#1A1B23] transition hover:bg-black/[0.03]">
                                        <Icon
                                            icon="mdi:image-plus-outline"
                                            className="h-5 w-5 text-violet-600"
                                        />
                                        انتخاب تصویر
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>

                                    {form.image && (
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={URL.createObjectURL(form.image)}
                                                alt="Selected"
                                                className="h-12 w-12 rounded-lg object-cover"
                                            />

                                            <div>
                                                <p className="max-w-[200px] truncate text-xs font-medium text-[#1A1B23]">
                                                    {form.image.name}
                                                </p>

                                                <p className="text-xs text-black/40">تصویر انتخاب شد</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Field>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

function Field({ label, error, children }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-black/60">
                {label}
            </span>

            {children}

            {error && (
                <span className="mt-1 block text-xs text-rose-600">{error}</span>
            )}
        </label>
    );
}

function inputClass(error) {
    return `w-full rounded-lg border bg-[#F4F5F7] px-3 py-2.5 text-sm text-[#1A1B23] placeholder:text-black/35 focus:outline-none focus:ring-2 ${error
            ? "border-rose-300 focus:ring-rose-500/20"
            : "border-black/10 focus:border-violet-400 focus:ring-violet-500/20"
        }`;
}
