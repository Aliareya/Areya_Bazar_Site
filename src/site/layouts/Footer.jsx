import React from "react";
import { Icon } from "@iconify/react";
import bg from '../../assets/images/logo.png';
// import {useLanguageStore} from "../../store/LanguageStore";

function Footer() {
//   const content = useLanguageStore((state)=>state.lang)
  const lang = 'en'
  const f_data = {
    brand: {
        logo: bg,
        name: "AreyaBazar",
        description: "Easy, fast and reliable shopping like Amazon",
    },
    sections: [
        {
            title: "Get to Know Us",
            links: [
                { label: "About Us", path: "/about" },
                { label: "Careers", path: "/careers" },
                { label: "Terms & Conditions", path: "/rules" },
                { label: "Privacy Policy", path: "/privacy" },
            ],
        },
        {
            title: "Customer Service",
            links: [
                { label: "FAQ", path: "/faq" },
                { label: "Returns", path: "/returns" },
                { label: "Order Tracking", path: "/tracking" },
                { label: "Contact Us", path: "/contact" },
            ],
        },
        {
            title: "Work With Us",
            links: [
                { label: "Sell on AreyaBazar", path: "/sell" },
                { label: "Affiliate Program", path: "/affiliate" },
                { label: "Advertising", path: "/ads" },
            ],
        },
        {
            title: "Quick Access",
            links: [
                { label: "Home", path: "/" },
                { label: "Shop", path: "/shop" },
                { label: "Categories", path: "/categories" },
                { label: "Special Offers", path: "/offers" },
            ],
        },
    ],
    newsletter: {
        title: "Newsletter",
        description: "Subscribe to get latest updates and discounts.",
        placeholder: "Your email",
        button: "Subscribe",
    },
    bottom: {
        copyright: "© 2026 AreyaBazar. All rights reserved.",
    },
};
  return (
    <footer className="bg-[#1b4332] text-white">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-5 lg:px-6 xl:px-10 py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 text-sm">
        {f_data.sections.map((item, index) => {
          return (
            <div key={index}>
              <h3 className="font-bold mb-4">{item.title}</h3>
              <ul className="space-y-2 text-gray-200">
                {item.links.map((item , index)=>{
                  return(
                    <li key={index} className="hover:text-white cursor-pointer">{item.label}</li>
                  )
                })}
              </ul>
            </div>
          );
        })}



        {/* Column 5 (Logo + Newsletter) */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <img src={bg} alt="" className="w-auto h-20" />
          </div>

          <p className="text-gray-200 text-sm mb-4">
            {f_data.brand.description}
          </p>

          <div className="flex overflow-hidden rounded-md">
            <button className="bg-yellow-500 px-4 text-sm">عضویت</button>
            <input
              type="email"
              placeholder="ایمیل شما"
              className="w-full px-3 py-2 text-black text-sm outline-none"
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-400/30"></div>

      {/* Bottom Section */}
      <div className="px-6 md:px-16 py-6 flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
        {/* Copyright */}
        <p className="text-gray-200 text-center">
          {f_data.bottom.copyright}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
