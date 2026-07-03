import { assets } from '../assets/assets';

const OurPolicy = () => {
  return (
    <section className="py-20 border-t border-premium mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          
          {/* Policy Item 1 */}
          <div className="bg-premium-card border-premium rounded-2xl p-8 text-center shadow-premium hover:shadow-premium-hover hover:scale-[1.02] transition-all duration-300 group">
            <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center border border-premium transition duration-300 group-hover:rotate-6">
              <img src={assets.exchange_icon} className="w-6 h-6 filter dark:invert dark:brightness-200" alt="Exchange Icon" />
            </div>
            <h3 className="font-semibold text-base mb-2 text-gray-900 dark:text-white">Easy Exchange Policy</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              We offer hassle free exchanges on all our products within 7 days.
            </p>
          </div>

          {/* Policy Item 2 */}
          <div className="bg-premium-card border-premium rounded-2xl p-8 text-center shadow-premium hover:shadow-premium-hover hover:scale-[1.02] transition-all duration-300 group">
            <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center border border-premium transition duration-300 group-hover:-rotate-6">
              <img src={assets.quality_icon} className="w-6 h-6 filter dark:invert dark:brightness-200" alt="Quality Icon" />
            </div>
            <h3 className="font-semibold text-base mb-2 text-gray-900 dark:text-white">7 Days Return Policy</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Shop with confidence with our 7-day hassle-free return window.
            </p>
          </div>

          {/* Policy Item 3 */}
          <div className="bg-premium-card border-premium rounded-2xl p-8 text-center shadow-premium hover:shadow-premium-hover hover:scale-[1.02] transition-all duration-300 group">
            <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center border border-premium transition duration-300 group-hover:scale-110">
              <img src={assets.support_img} className="w-6 h-6 filter dark:invert dark:brightness-200" alt="Support Icon" />
            </div>
            <h3 className="font-semibold text-base mb-2 text-gray-900 dark:text-white">Best Customer Support</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Our dedicated support team is available 24/7 to assist you.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default OurPolicy;
