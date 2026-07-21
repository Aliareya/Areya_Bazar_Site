import React from "react";
import bg from "../../../../assets/images/shop.jpg";
import hero from "../../../../assets/images/hero2.jpg";
import hero1 from "../../../../assets/images/hero4.jpg";
import hero2 from "../../../../assets/images/hero3.jpg";
import { useTranslation } from "react-i18next";
import useLangStore from "../../../../stores/LangStore";

// Simple animation styles (can be moved to global CSS)
const styles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-float-delayed { animation: float 6s ease-in-out 2s infinite; }
  .animate-enter { animation: fade-in-up 0.8s ease-out forwards; }
`;

function Hero() {
  const {language} = useLangStore()
  const {t} = useTranslation('home')
  
  return (
    <>
      <style>{styles}</style>
      <section className="relative w-full  bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#40916C] text-white max-sm:pt-9 max-sm:px-3 md:px-8 max-md:px-8 lg:px-10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          
      
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-orange-100/50 rounded-full blur-3xl opacity-60 animate-pulse"></div>
          <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] bg-pink-100/50 rounded-full blur-3xl opacity-60"></div>
        </div>

        <div style={{  direction: language === "en" ? "ltr" : 'rtl' }}
            className="max-w-7xl mx-auto grid md:grid-cols-1 lg:grid-cols-2 md:gap-12 max-sm:gap-1 lg:gap-20 items-center">
          
          {/* LEFT CONTENT */}
          <div className="flex flex-col items-start  animate-enter">
            {/* Badge */}
            <span className="inline-flex font-[emogy] items-center gap-2 bg-orange-50 text-[#1f5138] border border-orange-100 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              {t('hero.badge')}
            </span>

            <span className="text-4xl font-[none] md:text-5xl lg:text-5xl xl:text-[50px] font-extrabold leading-tight text-white tracking-tight ">{t('hero.title1')}</span>{" "}<br></br>
            <div className="text-4xl font-[none] md:text-5xl lg:text-5xl xl:text-[50px] font-extrabold leading-tight text-white tracking-tight">
              <span className="!mt-2 text-transparent max-sm:text-center !text-[#ebb306] bg-clip-text bg-gradient-to-r ">
                {t('hero.title2')}
              </span>
            </div>

            <p className="mt-6 font-normal font-[none] text-gray-100 text-lg md:text-xl leading-relaxed max-w-lg">
             {t('hero.description')}
            </p>

            <div className="flex flex-wrap max-sm:flex-nowrap m items-center gap-4 max-sm:gap-3 mt-8 max-sm:mt-4">
              <button 
                type="button"
                className="bg-[#1f5138] hover:bg-[#133725] text-white max-sm:px-5 px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-medium"
              >
                {t('hero.primaryButton')}
              </button>

              <button 
                type="button"
                className="flex items-center gap-2 text-gray-800 hover:text-gray-900 bg-white border border-gray-200 max-sm:px-5 px-6 py-3.5 rounded-full hover:bg-gray-50 transition-all duration-300 font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                {t('hero.secondaryButton')}
              </button>
            </div>

            {/* Social Proof */}
            <div className="mt-10 max-sm:mt-5 flex items-center gap-4 border-t border-gray-100 pt-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-sm ml-2">
                <p className="text-gray-200 font-bold">500+ {t('hero.partners')}</p>
                <p className="text-gray-100">{t('hero.partnersDescription')}</p>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGES - BIGGER */}
          <div className="relative flex justify-center items-center min-h-[400px] max-sm:min-h-[350px] md:min-h-[500px]  max-md:min-h-[480px] lg:min-h-[600px] animate-enter" style={{ animationDelay: '0.2s' }}>
            
            {/* Decorative Background Ring - Scaled Up */}
            <div className="absolute w-[350px] h-[350px] md:w-[520px] md:h-[520px] border border-dashed border-gray-300 rounded-full animate-[spin_10s_linear_infinite]"></div>
            
            {/* Main Image Container */}
            <div className="relative z-10">
              {/* Glow Effect - Scaled */}
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-pink-500 rounded-full blur-3xl opacity-25 scale-100"></div>
              
              <img
                src={bg}
                alt="Digital Marketing Team"
                loading="eager"
                className="relative w-[280px] h-[320px] max-sm:h-[300px] max-md:w-full md:w-full lg:w-[450px] md:h-[450px] lg:h-[450px] object-cover lg:rounded-full max-sm:rounded-md max-md:rounded-xl md:rounded-xl shadow-2xl border-4 border-white"
              />

              {/* Floating Card 1 (Top Right) - Bigger */}
              <div className="absolute max-sm:hidden -top-6 -right-6 md:top-8 md:-right-12 bg-white p-4 rounded-2xl shadow-xl animate-float z-20">
                <img src={hero} alt="Campaign Results" className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl" />
              </div>

              {/* Floating Card 2 (Bottom Left) - Bigger */}
              <div className="absolute max-sm:hidden bottom-14 -left-6 md:bottom-12 md:-left-12 bg-white p-4 rounded-2xl shadow-xl animate-float-delayed z-20">
                <img src={hero2} alt="Analytics" className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-xl" />
              </div>

              {/* Floating Badge (Stats) - Repositioned for bigger layout */}
              <div className="absolute max-sm:hidden -bottom-8 -right-4 md:bottom-16 md:-right-6 bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg border border-gray-100 z-30 flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Growth Rate</p>
                  <p className="text-lg font-bold text-gray-900">+124%</p>
                </div>
              </div>

              {/* Optional: Third floating image (hero1) - Added back with better positioning */}
              <div className="absolute top-10 -left-8 md:top-16 md:-left-12 bg-white p-3 rounded-2xl shadow-xl animate-float z-20 hidden md:block">
                <img src={hero1} alt="Strategy" className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-xl" />
              </div>
            </div>
          </div>

        </div>
          </div>
      </section>
    </>
  );
}

export default Hero;