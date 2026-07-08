import React from "react";
import { Icon } from "@iconify/react";

function Topbar() {
  const topbar = {
    contact: {
      label: "تماس با ما",
      code: "(+93)",
      phone: "0701615005",
    },
    promo: {
      text: "ثبت‌نام کنید و ۲۵٪ تخفیف برای اولین سفارش بگیرید",
      cta: "همین الان ثبت‌نام کنید",
    },
    socials: [
      {
        name: "Instagram",
        icon: "icon-park-twotone:instagram",
        url: "https://instagram.com",
      },
      {
        name: "Telegram",
        icon: "ic:sharp-telegram",
        url: "https://t.me",
      },
      {
        name: "Facebook",
        icon: "mdi:facebook",
        url: "https://facebook.com",
      },
      {
        name: "Twitter",
        icon: "mdi:twitter",
        url: "https://twitter.com",
      },
    ],
  };

  return (
    <div className="w-full bg-primary px-12 max-sm:px-3">
      <div className="text-white text-sm h-10 flex justify-between items-center gap-5">

        {/* Contact */}
        <div className="flex flex-row-reverse items-center gap-2">
          <span className="text-base font-semibold max-sm:hidden">
            {topbar.contact.label}
          </span>
          <span className="text-base font-semibold max-sm:hidden">
            :
          </span>

          <div className="flex items-center">
            <a
              key=''
              href=''
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ebb306] transition-colors pt-1"
            >
              <Icon icon='f7:phone-circle-fill' width="24" height="24" />
            </a>
            <span className="text-base font-semibold px-1">
              {topbar.contact.code}
            </span>
            <span className="text-base font-semibold">
              {topbar.contact.phone}
            </span>
          </div>
        </div>

        {/* Promotion */}
        <div className="max-sm:hidden">
          <div className="flex gap-2">
            <span>{topbar.promo.text}</span>
            <span className="font-bold text-[#ebb306] underline cursor-pointer">
              {topbar.promo.cta}
            </span>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-3">
          {topbar.socials.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ebb306] transition-colors"
            >
              <Icon icon={item.icon} width="22" height="22" />
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Topbar;