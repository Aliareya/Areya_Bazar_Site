import React from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

export default function EditCategory({
  title = "این صفحه در حال ساخت است",
  description = "ما در حال کار روی این بخش هستیم. لطفاً کمی بعد دوباره سر بزنید.",
}) {
  const navigate = useNavigate();

  return (
    <div
      dir="rtl"
      className="flex min-h-[70vh] flex-col items-center justify-center rounded-lg border border-black/10 bg-white px-4 py-16 text-center"
    >
      {/* ICON */}

      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-violet-50 text-violet-600">
        <Icon icon="mdi:hammer-wrench" className="h-10 w-10" />
      </div>

      {/* TITLE */}

      <h1 className="text-xl font-bold text-[#1A1B23]">{title}</h1>

      {/* DESCRIPTION */}

      <p className="mt-2 max-w-md text-sm leading-6 text-black/50">
        {description}
      </p>

      {/* BADGE */}

      <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
        <Icon icon="mdi:progress-wrench" className="h-3.5 w-3.5" />
        در حال توسعه
      </span>

      {/* BACK BUTTON */}

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-600/40"
      >
        <Icon icon="mdi:arrow-right" className="h-4 w-4" />
        بازگشت
      </button>
    </div>
  );
}