import logo from "../../assets/images/logo.png";
import { Icon } from "@iconify/react";
import Search from "../components/ui/Serach";
import LanguageIcon from "../components/ui/LanguageIcon";
import ProfileIcon from "../components/ui/ProfileIcon";
import MobileMunuIcon from "../components/ui/MobileMunuIcon";

function Header() {
    const headerMenu = [
        { label: "Home", url: "/" },
        { label: "Shop", url: "/shop" },
        { label: "About", url: "/about" },
        { label: "Contact", url: "/contact" },
    ];

    const is_login = true;

    return (
        <header className="w-full h-[70px] flex justify-between items-center bg-white shadow-md xl:px-10 lg:px-6 md:px-3 max-md:px-5 max-sm:px-3">
            <div className="">
                <img className="w-auto xl:h-26 md:h-24 max-md:h-24 max-sm:h-20 lg:h-[85px] object-contain" src={logo} alt="" />
            </div>

            <div className={` items-center xl:gap-8 lg:gap-6 hidden lg:flex `}>
                {headerMenu?.map((item, index) => (
                    <li onClick={() => handleClickMenuItem(item.url)}
                        key={index} className="cursor-pointer hover:font-semibold text-[#1f5138] list-none text-base font-normal">
                        {item.label}
                    </li>
                ))}
            </div>

            <div className={` flex items-center justify-between lg:gap-1 md:gap-2 max-md:gap-2 max-sm:`}>
                <span className="hover:bg-gray-100 cursor-pointer p-1 rounded-full">
                    <Icon icon="mdi:cart" width="22" height="22" color="#1f5138" />
                </span>
                <span className="hover:bg-gray-100 cursor-pointer p-1 rounded-full">
                    <Icon icon="line-md:heart" width="22" height="22" color="#1f5138" />
                </span>

                <div className={`${is_login ? ' max-sm:hidden' : 'flex'}`}>
                    <Search />
                </div>
                <div className="flex max-sm:hidden">
                    <LanguageIcon />
                </div>
                <div className="">
                    <ProfileIcon />
                </div>
                <div className="lg:hidden ">
                    <MobileMunuIcon />
                </div>
            </div>

        </header>
    );
}

export default Header;