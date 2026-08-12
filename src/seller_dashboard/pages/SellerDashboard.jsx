import { Icon } from "@iconify/react";

/* ─────────────────────── helpers ─────────────────────── */
const fa = (n) => String(n).replace(/\d/g, (d) => "۰۱۴۵۶۷۸۹"[+d]);

/* ─────────────────────── static data ─────────────────── */
const STATS = [
  {
    title: "فروش کل",         value: "۲۴۳۰", unit: "؋",
    delta: "+۱۸.۴٪",           deltaUp: true,
    note: "در مقایسه با ماه گذشته",
    icon: "solar:wallet-money-bold-duotone",
    ibg: "bg-amber-100",       icolor: "text-amber-600",
  },
  {
    title: "سفارشات",         value: "۳۱",     unit: "سفارش",
    delta: "+۹.۲٪",            deltaUp: true,
    note: "۲۴ سفارش امروز",
    icon: "solar:bag-smile-bold-duotone",
    ibg: "bg-emerald-100",     icolor: "text-emerald-600",
  },
  {
    title: "فروشگاه‌های فعال", value: "۵۲",       unit: "فروشگاه",
    delta: "+۴.۶٪",            deltaUp: true,
    note: "۱۲ فروشگاه در انتظار تایید",
    icon: "solar:shop-bold-duotone",
    ibg: "bg-emerald-100",     icolor: "text-emerald-600",
  },
  {
    title: "بازدیدکنندگان",    value: "۸۴۲",   unit: "کاربر",
    delta: "-۲.۱٪",            deltaUp: false,
    note: "نرخ تبدیل ۳.۷٪",
    icon: "solar:users-group-rounded-bold-duotone",
    ibg: "bg-emerald-100",     icolor: "text-emerald-600",
  },
];

const C = 439.82;
const CATS = [
  { label: "مبلمان",     pct: 34, color: "#15803d", len: 0.34*C, off:  0       },
  { label: "روشنایی",    pct: 24, color: "#d97706", len: 0.24*C, off: -0.34*C },
  { label: "پوشاک",      pct: 18, color: "#0d9488", len: 0.18*C, off: -0.58*C },
  { label: "لوازم خانه", pct: 14, color: "#dc2626", len: 0.14*C, off: -0.76*C },
  { label: "دیجیتال",    pct: 10, color: "#7c3aed", len: 0.10*C, off: -0.90*C },
];

const MONTHS = ["حمل","ثور","جوزا","سرطان","اسد","سنبله","میزان","عقرب","قوس","جدی","دلو","حوت"];
const sy = (v) => 220 - (v / 400) * 220;
const sx = (i) => (i / 11) * 600;
const SALES = [120,130,155,175,195,220,248,275,298,320,352,392];
const ORDS  = [ 78, 84, 96,107,116,126,136,147,157,168,182,208];

const smoothPath = (pts) => {
  let d = `M ${sx(0)},${sy(pts[0])}`;
  for (let i = 1; i < pts.length; i++) {
    const cpx = (sx(i-1) + sx(i)) / 2;
    d += ` C ${cpx},${sy(pts[i-1])} ${cpx},${sy(pts[i])} ${sx(i)},${sy(pts[i])}`;
  }
  return d;
};
const salesLine  = smoothPath(SALES);
const ordersLine = smoothPath(ORDS);
const salesArea  = salesLine  + " L 600,220 L 0,220 Z";
const ordersArea = ordersLine + " L 600,220 L 0,220 Z";

const ORDERS_TABLE = [
  { id:"AB-10482", cust:"احمد رشاد",   store:"قلب آسیا",      amt:"۴٬۳", st:"پرداخت شده", sc:"bg-emerald-100 text-emerald-700" },
  { id:"AB-10481", cust:"زهرا نوری",   store:"هرات مال",       amt:"۱٬۱۲۰", st:"در انتظار",  sc:"bg-amber-100   text-amber-700"   },
  { id:"AB-10480", cust:"فهیم صدیقی",  store:"فهیم سوپرمارکت", amt:"۹٬۸۰", st:"ارسال شده",  sc:"bg-sky-100     text-sky-700"     },
  { id:"AB-10479", cust:"مریم کریمی",  store:"الماس شرق",      amt:"۲٬۳۰", st:"پرداخت شده", sc:"bg-emerald-100 text-emerald-700" },
  { id:"AB-10478", cust:"بلال احمدی",  store:"مالکیت",         amt:"۵٬۰۰", st:"لغو شده",    sc:"bg-red-100     text-red-700"     },
  { id:"AB-10477", cust:"سمیرا حیدری", store:"شهایی مارکت",    amt:"۶٬۳۰", st:"ارسال شده",  sc:"bg-sky-100     text-sky-700"     },
];

const ACTIVITIES = [
  { txt:"سفارش جدید AB-10482 ثبت شد",            sub:"۵ دقیقه پیش · قلب آسیا",   dot:"bg-emerald-500" },
  { txt:"فروشگاه «نور مارکت» درخواست تایید داد",  sub:"۲ دقیقه پیش · هرات",      dot:"bg-sky-500"     },
  { txt:"موجودی «چراغ رومیزی» کمتر از ۱۰ عدد است", sub:"۱ ساعت پیش · انبار مرکزی", dot:"bg-amber-500"   },
  { txt:"سفارش AB-10478 لغو شد",                   sub:"۳ ساعت پیش · جلال‌آباد",   dot:"bg-red-500"     },
  { txt:"۴۸ محصول جدید به کتلاگ اضافه شد",        sub:"دیروز · تیم محتوا",        dot:"bg-emerald-500" },
];

const WEEK = [
  { day:"شنبه",    v:6000  }, { day:"یکشنبه",  v:7000  },
  { day:"دوشنبه",  v:6500  }, { day:"سه‌شنبه", v:8000  },
  { day:"چهارشنبه",v:9000  }, { day:"پنجشنبه", v:10500 },
  { day:"جمعه",    v:12000 },
];

const WEEK_MAX = 14000;

const TOP_STORES = [
  { name:"قلب آسیا بیگ استور", city:"کابل",      amt:"۴۸۲۰۰۰", w:100 },
  { name:"فهیم سوپرمارکت",      city:"مزار شریف", amt:"۳۹۶٬۵۰۰", w:82  },
  { name:"هرات مال",            city:"هرات",       amt:"۳۱۲۲۰۰", w:65  },
  { name:"الماس شرق مارکت",     city:"کابل",       amt:"۲۴۵۰", w:51  },
  { name:"شهایی مارکت",         city:"قندهار",     amt:"۱۹۸٬۴", w:41  },
];

/* ─────────────────────── component ───────────────────── */
export default function SellerDashboard() {
  return (
    <>
      {/* ── Page heading ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
            <span>پنل مدیریت</span>
            <Icon icon="solar:alt-arrow-left-linear" className="text-[10px]" />
            <span className="text-gray-600 font-medium">داشبورد</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">داشبورد</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            نمای کلی عملکرد بازار آنلاین آریا بازار در ۳۰ روز گذشته
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all font-medium">
            <Icon icon="solar:download-minimalistic-linear" className="text-sm sm:text-base" />
            گزارش
          </button>
          <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#15803d] text-white text-xs sm:text-sm hover:bg-[#166534] active:scale-95 transition-all font-medium shadow-sm shadow-emerald-200">
            <Icon icon="solar:add-circle-linear" className="text-sm sm:text-base" />
            محصول جدید
          </button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {STATS.map((s) => (
          <div key={s.title} className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs text-gray-400 mb-1 sm:mb-1.5 font-medium truncate">{s.title}</p>
                <p className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-none truncate">
                  {s.value}{" "}
                  <span className="text-xs sm:text-sm font-normal text-gray-400">{s.unit}</span>
                </p>
              </div>
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${s.ibg} flex items-center justify-center shrink-0 ml-2`}>
                <Icon icon={s.icon} className={`text-lg sm:text-xl ${s.icolor}`} />
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className={[
                "inline-flex items-center gap-0.5 font-bold px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-[11px]",
                s.deltaUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500",
              ].join(" ")}>
                <Icon icon={s.deltaUp ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"} className="text-[9px] sm:text-[10px]" />
                {s.delta}
              </span>
              <span className="text-gray-400 text-[10px] sm:text-[11px] truncate">{s.note}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-4">

        {/* Area chart */}
        <div className="xl:col-span-7 bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-5">
            <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
              <span className="flex items-center gap-1.5 text-gray-500">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-400 inline-block" />سفارشات
              </span>
              <span className="flex items-center gap-1.5 text-gray-500">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-600 inline-block" />فروش
              </span>
            </div>
            <div className="text-right">
              <h3 className="font-bold text-gray-800 text-sm">روند فروش سالانه</h3>
              <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">مبالغ به هزار افغانی</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <svg viewBox="-30 0 640 252" className="w-full min-w-[480px]" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="gSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#15803d" stopOpacity="0.22"/>
                  <stop offset="100%" stopColor="#15803d" stopOpacity="0.01"/>
                </linearGradient>
                <linearGradient id="gOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d97706" stopOpacity="0.15"/>
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0.01"/>
                </linearGradient>
              </defs>
              {[0,100,200,300,400].map((v) => {
                const y = sy(v);
                return (
                  <g key={v}>
                    <line x1="0" y1={y} x2="600" y2={y} stroke="#f3f4f6" strokeWidth="1"/>
                    <text x="-8" y={y+4} textAnchor="end" fontSize="9" fill="#c0c0c0">{fa(v)}</text>
                  </g>
                );
              })}
              <path d={salesArea}  fill="url(#gSales)"/>
              <path d={ordersArea} fill="url(#gOrders)"/>
              <path d={ordersLine} fill="none" stroke="#d97706" strokeWidth="2"   strokeLinecap="round"/>
              <path d={salesLine}  fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round"/>
              {MONTHS.map((m,i) => (
                <text key={m} x={sx(i)} y="244" textAnchor="middle" fontSize="9" fill="#c0c0c0">{m}</text>
              ))}
            </svg>
          </div>
        </div>

        {/* Donut chart */}
        <div className="xl:col-span-5 bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col">
          <div className="text-right mb-2">
            <h3 className="font-bold text-gray-800 text-sm">سهم دسته‌بندی‌ها</h3>
            <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">بر اساس فروش ماه جاری</p>
          </div>
          <div className="flex-1 flex items-center justify-center py-3 sm:py-2">
            <svg viewBox="0 0 180 180" className="w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44">
              {CATS.map((c) => (
                <circle key={c.label} cx="90" cy="90" r="70" fill="none"
                  stroke={c.color} strokeWidth="24"
                  strokeDasharray={`${c.len} ${C-c.len}`}
                  strokeDashoffset={c.off}
                  transform="rotate(-90 90 90)"
                />
              ))}
              <text x="90" y="83" textAnchor="middle" fontSize="10" fill="#9ca3af">فروش کل</text>
              <text x="90" y="101" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1f2937">۱۰۰٪</text>
            </svg>
          </div>
          <div className="space-y-2 sm:space-y-2.5 mt-1">
            {CATS.map((c) => (
              <div key={c.label} className="flex items-center justify-between text-[11px] sm:text-xs">
                <span className="text-gray-500 font-bold w-7 sm:w-8 text-left">{fa(c.pct)}٪</span>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-end">
                  <span className="text-gray-600">{c.label}</span>
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full inline-block shrink-0" style={{background:c.color}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Middle row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-4">

        {/* Recent orders */}
        <div className="xl:col-span-7 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-gray-100">
            <button className="text-[11px] sm:text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 transition-colors">
              مشاهده همه
              <Icon icon="solar:alt-arrow-left-linear" className="text-[10px]"/>
            </button>
            <h3 className="font-bold text-gray-800 text-sm">سفارشات اخیر</h3>
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs border-b border-gray-100">
                  <th className="py-3 px-5 text-right font-medium">وضعیت</th>
                  <th className="py-3 px-4 text-right font-medium">مبلغ</th>
                  <th className="py-3 px-4 text-right font-medium">فروشگاه</th>
                  <th className="py-3 px-4 text-right font-medium">مشتری</th>
                  <th className="py-3 px-5 text-right font-medium">شناسه</th>
                </tr>
              </thead>
              <tbody>
                {ORDERS_TABLE.map((o,i) => (
                  <tr key={o.id} className={["border-b border-gray-50 hover:bg-emerald-50/30 transition-colors", i%2===1?"bg-gray-50/40":""].join(" ")}>
                    <td className="py-3.5 px-5">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap ${o.sc}`}>{o.st}</span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-700 font-semibold text-xs">{o.amt} ؋</td>
                    <td className="py-3.5 px-4 text-gray-500 text-xs">{o.store}</td>
                    <td className="py-3.5 px-4 text-gray-800 font-medium text-xs">{o.cust}</td>
                    <td className="py-3.5 px-5 text-gray-400 font-mono text-[11px]">{o.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="sm:hidden divide-y divide-gray-50">
            {ORDERS_TABLE.map((o) => (
              <div key={o.id} className="px-4 py-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-800 truncate">{o.cust}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${o.sc}`}>{o.st}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 truncate">{o.store} · {o.id}</p>
                </div>
                <span className="text-xs font-bold text-gray-700 shrink-0">{o.amt} ؋</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activities */}
        <div className="xl:col-span-5 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-sm text-right">فعالیت‌های اخیر</h3>
          </div>
          <div className="p-4 sm:p-5 flex-1">
            {ACTIVITIES.map((a,i) => (
              <div key={i} className="flex gap-2.5 sm:gap-3">
                <div className="flex flex-col items-center pt-0.5">
                  <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${a.dot} shrink-0 ring-2 sm:ring-4 ring-white`}/>
                  {i < ACTIVITIES.length-1 && <div className="w-px flex-1 bg-gray-100 my-1 min-h-5 sm:min-h-6"/>}
                </div>
                <div className={["flex-1 min-w-0", i<ACTIVITIES.length-1?"pb-3 sm:pb-4":""].join(" ")}>
                  <p className="text-xs sm:text-sm text-gray-700 font-medium leading-snug">{a.txt}</p>
                  <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5 sm:mt-1">{a.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-4 pb-2">

        {/* Weekly visits */}
        <div className="xl:col-span-7 bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
          <div className="text-right mb-4 sm:mb-6">
            <h3 className="font-bold text-gray-800 text-sm">بازدید هفتگی</h3>
            <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">تعداد بازدیدکنندگان یکتا</p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <div className="flex flex-col justify-between text-[9px] sm:text-[10px] text-gray-300 font-medium pb-5 sm:pb-6 shrink-0" style={{height:160}}>
              {[14000,10500,7000,3500,0].map((v)=><span key={v}>{fa(v/1000)}k</span>)}
            </div>
            <div className="flex-1 flex items-end justify-between gap-1.5 sm:gap-2.5 min-w-0" style={{height:160}}>
              {WEEK.map((d)=>(
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1 sm:gap-1.5 h-full justify-end min-w-0">
                  <span className="text-[9px] sm:text-[10px] text-gray-400 font-semibold">{fa(Math.round(d.v/1000))}k</span>
                  <div className="w-full rounded-t-md sm:rounded-t-lg bg-[#15803d] hover:bg-[#166534] transition-colors cursor-pointer"
                    style={{height:`${(d.v/WEEK_MAX)*120}px`, minHeight:4}}/>
                  <span className="text-[8px] sm:text-[10px] text-gray-400 truncate w-full text-center mt-0.5">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top stores */}
        <div className="xl:col-span-5 bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 text-sm text-right mb-4 sm:mb-5">فروشگاه‌های برتر</h3>
          <div className="space-y-3.5 sm:space-y-4">
            {TOP_STORES.map((s,i)=>(
              <div key={s.name}>
                <div className="flex items-center justify-between mb-1.5 sm:mb-2 gap-2">
                  <span className="text-[11px] sm:text-xs text-emerald-700 font-extrabold shrink-0">{s.amt} ؋</span>
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 justify-end">
                    <div className="text-right min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-tight truncate">{s.name}</p>
                      <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">{s.city}</p>
                    </div>
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 text-[10px] sm:text-[11px] font-extrabold shrink-0">
                      {fa(i+1)}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-[#15803d] h-1.5 rounded-full transition-all duration-500" style={{width:`${s.w}%`}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </>
  );
}