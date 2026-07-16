import { Icon } from "@iconify/react";
import LanguageIcon from "../components/ui/LanguageIcon";

const socials = [
  {
    icon: "mdi:facebook",
    url: "https://facebook.com",
  },
  {
    icon: "mdi:instagram",
    url: "https://instagram.com",
  },
  {
    icon: "ic:round-telegram",
    url: "https://twitter.com",
  },
  {
    icon: "mingcute:whatsapp-line",
    url: "https://linkedin.com",
  },
];

const topbar_desc = "همین حالا ثبت نام کرده و فروشگاه خود را آنلاین بسازید";
const register_text = "ثبت نام رایگان";

function TopBar() {
  return (
    <div className="bg-primary w-full px-3  lg:px-10 py-2">
      <div className="flex items-center justify-between">

        {/* Social Icons */}
        <div className="flex items-center gap-2">
          {socials.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon
                icon={item.icon}
                className="text-white w-6 h-6 md:w-6 md:h-6"
              />
            </a>
          ))}
          <a className="hidden max-sm:flex" href="#">
              <Icon
                icon="f7:phone-circle-fill"
                className="text-white  max-sm:w-6 max-sm:h-6 md:w-6 md:h-6 max-md:w-6 max-md:h-6"
              />
            </a>

          {/* Phone icon only on mobile */}

        </div>

        {/* Center Promo - Hidden on tablets & mobiles */}
        <div className="hidden lg:flex justify-center flex-1">
          <span className="text-sm font-semibold text-white">
            {topbar_desc}
            <span className="text-orang pr-1 underline cursor-pointer">
              {register_text}
            </span>
          </span>
        </div>

        <div className="hidden max-sm:flex">
          <LanguageIcon myclass={'py-1'}/>
        </div>

        {/* Contact - Hidden on mobile */}
        <div className=" md:flex max-md:flex max-sm:hidden items-center flex-row-reverse">
          <span className="text-white pl-1 max-sm:hidden font-semibold">
            تماس با ما
          </span>

          <span className="text-white font-bold pl-2 max-sm:hidden">:</span>

          <div className="flex items-center ">
            <a href="#">
              <Icon
                icon="f7:phone-circle-fill"
                className="text-white  max-sm:w-6 max-sm:h-6 md:w-6 md:h-6 max-md:w-6 max-md:h-6"
              />
            </a>

            <span className="text-white font-semibold max-sm:hidden px-1">
              (+93)
            </span>

            <span className="text-white max-sm:hidden font-semibold">
              0701615005
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;