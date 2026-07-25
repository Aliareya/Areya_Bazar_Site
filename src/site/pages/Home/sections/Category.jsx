import React from "react";

// ---- Iconify helper ---------------------------------------------------
// Renders any Iconify icon (https://icon-sets.iconify.design) as an <img>,
// no bundler/plugin required.
const Icon = ({ icon, className = "w-5 h-5" }) => (
  <img
    src={`https://api.iconify.design/${icon}.svg`}
    alt=""
    className={className}
    style={{ filter: "var(--icon-filter, none)" }}
  />
);

// ---- Data ---------------------------------------------------------------
const brands = [
  { name: "Qalbe Asia Big Store", img: "https://picsum.photos/seed/store1/200/200" },
  { name: "Fahim Super Market", img: "https://picsum.photos/seed/store2/200/200" },
  { name: "Herat Mall", img: "https://picsum.photos/seed/store3/200/200" },
  { name: "Almas Sharq Market", img: "https://picsum.photos/seed/store4/200/200" },
  { name: "Shahabi Market", img: "https://picsum.photos/seed/store5/200/200" },
  { name: "MalKet", img: "https://picsum.photos/seed/store6/200/200" },
  { name: "Digikala", img: "https://picsum.photos/seed/store7/200/200" },
];

const products = [
  { badge: "15% off", category: "Furniture", name: "Modern Wooden Chair", price: 102, old: 120, rating: 4.7, img: "https://picsum.photos/seed/chair/400/320" },
  { badge: "10% off", category: "Lighting", name: "Minimal Table Lamp", price: 58.5, old: 65, rating: 4.5, img: "https://picsum.photos/seed/lamp/400/320" },
  { badge: "20% off", category: "Living Room", name: "Luxury Sofa", price: 360, old: 450, rating: 4.9, img: "https://picsum.photos/seed/sofa/400/320" },
  { badge: "5% off", category: "Office", name: "Office Desk", price: 209, old: 220, rating: 4.3, img: "https://picsum.photos/seed/desk/400/320" },
  { badge: "25% off", category: "Bedroom", name: "Comfort Bed", price: 510, old: 680, rating: 5.0, img: "https://picsum.photos/seed/bed/400/320" },
  { badge: "12% off", category: "Kitchen", name: "Kitchen Shelf", price: 123.2, old: 140, rating: 4.4, img: "https://picsum.photos/seed/kitchen/400/320" },
  { badge: "20% off", category: "Decoration", name: "Decor Vase", price: 28, old: 35, rating: 4.6, img: "https://picsum.photos/seed/vase/400/320" },
  { badge: "18% off", category: "Accessories", name: "Classic Clock", price: 77.9, old: 95, rating: 4.2, img: "https://picsum.photos/seed/clock/400/320" },
];

const categories = [
  { name: "Women's Fashion", desc: "Discover elegant and trending pieces", img: "https://picsum.photos/seed/women/400/500" },
  { name: "Men's Fashion", desc: "Modern styles for every occasion", img: "https://picsum.photos/seed/men/400/500" },
  { name: "Shoes", desc: "Comfort meets style in every step", img: "https://picsum.photos/seed/shoes/400/500" },
  { name: "Accessories", desc: "Complete your look with detail", img: "https://picsum.photos/seed/access/400/500" },
];

const sellingPoints = [
  { icon: "solar:rocket-bold", title: "Easy Setup", desc: "Create your seller account and launch your store in minutes." },
  { icon: "solar:users-group-rounded-bold", title: "More Customers", desc: "Reach thousands of buyers and grow your business faster." },
  { icon: "solar:wallet-money-bold", title: "Secure Earnings", desc: "Get safe payments directly to your account without hassle." },
];

const testimonials = [
  { name: "John Doe", role: "Customer", text: "The product quality is amazing and delivery was super fast. I will definitely buy again!", img: "https://i.pravatar.cc/100?img=12" },
  { name: "Sarah Smith", role: "Verified Buyer", text: "Excellent customer service and high quality products. Everything was smooth from order to delivery.", img: "https://i.pravatar.cc/100?img=32" },
  { name: "Ali Reza", role: "Regular Customer", text: "I love this store. The prices are fair and the products match the description perfectly.", img: "https://i.pravatar.cc/100?img=51" },
  { name: "John Doe", role: "Customer", text: "The product quality is amazing and delivery was super fast. I will definitely buy again!", img: "https://i.pravatar.cc/100?img=15" },
];

// ---- Small building blocks ----------------------------------------------

const SectionHeading = ({ eyebrow, title, subtitle }) => (
  <div className="text-center max-w-2xl mx-auto mb-10">
    <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">{title}</h2>
    {subtitle && <p className="text-gray-500 mt-3">{subtitle}</p>}
  </div>
);

const RatingStars = ({ rating }) => (
  <span className="flex items-center gap-1 text-sm text-gray-600">
    <Icon icon="solar:star-bold" className="w-4 h-4" />
    <span className="font-medium">{rating}</span>
  </span>
);

const ProductCard = ({ p }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden group">
    <div className="relative">
      <img src={p.img} alt={p.name} className="w-full h-44 object-cover" />
      <span className="absolute top-3 left-3 bg-emerald-800 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
        {p.badge}
      </span>
      <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white">
        <Icon icon="solar:heart-linear" className="w-4 h-4" />
      </button>
      <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="w-8 h-8 rounded-lg bg-white shadow flex items-center justify-center">
          <Icon icon="solar:cart-plus-linear" className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 rounded-lg bg-white shadow flex items-center justify-center">
          <Icon icon="solar:maximize-square-linear" className="w-4 h-4" />
        </button>
      </div>
    </div>
    <div className="p-4">
      <p className="text-xs text-gray-400">{p.category}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="font-bold text-gray-900">${p.price.toFixed(2)}</span>
        <span className="text-xs text-gray-400 line-through">${p.old.toFixed(2)}</span>
      </div>
      <h3 className="font-semibold text-gray-800 mt-1">{p.name}</h3>
      <div className="flex items-center justify-between mt-3">
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-5 h-5 rounded-full bg-gray-300 inline-block" />
          Alireza
        </span>
        <RatingStars rating={p.rating} />
      </div>
    </div>
  </div>
);

// ---- Main content ---------------------------------------------------------

export default function Category() {
  return (
    <div className="bg-white font-sans">
      {/* Trusted Brands */}
      <section className="py-16 px-6 bg-gray-50">
        <SectionHeading
          title={
            <>
              Trusted by Leading Brands in <span className="text-emerald-700">Afghanistan</span>
            </>
          }
          subtitle="We collaborate with top local and regional stores to deliver quality products."
        />
        <div className="max-w-6xl mx-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-6">
          {brands.map((b) => (
            <div key={b.name} className="flex flex-col items-center text-center gap-2">
              <img src={b.img} alt={b.name} className="w-16 h-16 rounded-xl object-cover shadow" />
              <span className="text-xs text-gray-600">{b.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 px-6">
        <SectionHeading
          title="Best Sellers"
          subtitle="Discover our most popular products loved by customers. High quality, trendy, and best-selling items just for you."
        />
        <div className="flex justify-center -mt-4 mb-10">
          <button className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors">
            View All <Icon icon="solar:arrow-right-linear" className="w-4 h-4 invert" />
          </button>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((p, i) => (
            <ProductCard key={i} p={p} />
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <button className="flex items-center gap-2 border border-emerald-800 text-emerald-800 hover:bg-emerald-800 hover:text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors">
            View All <Icon icon="solar:arrow-left-linear" className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-6 bg-gray-50">
        <SectionHeading
          title="Categories"
          subtitle="Browse our curated categories and discover products tailored to your style."
        />
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {categories.map((c) => (
            <div key={c.name} className="relative rounded-2xl overflow-hidden group cursor-pointer">
              <img src={c.img} alt={c.name} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute top-3 right-3 w-7 h-7 rounded-full bg-emerald-800 flex items-center justify-center">
                <Icon icon="solar:check-circle-bold" className="w-4 h-4 invert" />
              </span>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-semibold">{c.name}</h3>
                <p className="text-xs text-white/80 mt-1 line-clamp-1">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newest Products */}
      <section className="py-16 px-6">
        <SectionHeading
          title="Newest Products"
          subtitle="Check out our latest arrivals. Fresh styles and modern products just for you."
        />
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((p, i) => (
            <ProductCard key={i} p={p} />
          ))}
        </div>
      </section>

      {/* Start Selling CTA */}
      <section className="py-16 px-6 bg-emerald-900 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-emerald-800/40 blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Start Selling Your Products Today</h2>
          <p className="text-emerald-100 mt-4 max-w-xl mx-auto">
            Join our marketplace and turn your products into income. Create your store, upload products, and start selling easily.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mt-10 text-left">
            {sellingPoints.map((s) => (
              <div key={s.title} className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center mb-3">
                  <Icon icon={s.icon} className="w-5 h-5" />
                </div>
                <h3 className="text-white font-semibold">{s.title}</h3>
                <p className="text-emerald-100 text-sm mt-1">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-10">
            <button className="bg-white text-emerald-900 font-medium px-6 py-3 rounded-full hover:bg-gray-100 transition-colors">
              Become a Seller
            </button>
            <button className="border border-white/60 text-white font-medium px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
              How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-white">
        <SectionHeading title="What Our Customers Say" subtitle="Real feedback from real customers" />
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="relative bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <div
                className="absolute top-0 right-0 w-0 h-0 border-t-[28px] border-l-[28px] border-t-emerald-800 border-l-transparent rounded-tr-2xl"
              />
              <div className="flex items-center gap-3">
                <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-sm text-gray-800">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4 leading-relaxed">{t.text}</p>
              <div className="flex gap-0.5 mt-4 text-amber-400">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Icon key={s} icon="solar:star-bold" className="w-4 h-4" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}