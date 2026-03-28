import { assets } from "../assets/assets";

const Hero = () => {
  return (
    <section className="flex flex-col sm:flex-row border border-gray-300">

      {/* Left Section */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-16 sm:py-0">
        <div className="text-[#414141] space-y-4">

          {/* Bestseller Label */}
          <div className="flex items-center gap-3">
            <span className="w-8 md:w-11 h-[1px] bg-[#414141]" />
            <p className="font-medium text-sm md:text-base tracking-wide">
              OUR BESTSELLERS
            </p>
          </div>

          {/* Main Heading */}
          <h1 className="prata-regular text-3xl lg:text-5xl leading-relaxed">
            Latest Arrivals
          </h1>

          {/* Shop Now CTA */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <p className="font-semibold text-sm md:text-base">
              SHOP NOW
            </p>
            <span className="w-8 md:w-11 h-[2px] bg-[#414141] group-hover:w-14 transition-all duration-300" />
          </div>

        </div>
      </div>

      {/* Right Section */}
      <div className="w-full sm:w-1/2 h-[300px] sm:h-auto">
        <img
          src={assets.hero_img}
          alt="Hero"
          className="w-full h-full object-cover"
        />
      </div>

    </section>
  );
};

export default Hero;