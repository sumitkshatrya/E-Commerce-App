import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-premium bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900/40 dark:to-gray-950/40 shadow-premium flex flex-col md:flex-row items-stretch min-h-[420px] md:min-h-[500px] mt-6 animate-fade-in">
      
      {/* Decorative Grid Overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      {/* Left Editorial Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 z-10">
        <div className="space-y-6 max-w-md">
          {/* Label */}
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1.5px] bg-black dark:bg-white" />
            <p className="font-semibold text-xs tracking-widest text-gray-700 dark:text-gray-300 uppercase">
              OUR BESTSELLERS
            </p>
          </div>

          {/* Main Editorial Header */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-gray-900 dark:text-white leading-[1.15] tracking-tight">
            Latest <br />
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">Arrivals</span>
          </h1>

          {/* Subtext description */}
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-sm">
            Discover thoughtfully curated everyday essentials designed with refined details, clean cuts, and absolute comfort in mind.
          </p>

          {/* Call-to-Action Link */}
          <div className="pt-2">
            <Link 
              to="/collection" 
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-medium text-sm tracking-wide shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 group"
            >
              <span>SHOP NOW</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Asset Showcase Section */}
      <div className="w-full md:w-1/2 relative h-[280px] md:h-auto overflow-hidden">
        {/* Soft Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-gray-50 via-transparent to-transparent dark:from-gray-900/40 pointer-events-none z-10" />
        <img
          src={assets.hero_img}
          alt="Modern fashion arrivals banner image"
          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>

    </section>
  );
};

export default Hero;