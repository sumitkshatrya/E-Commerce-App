import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';

const About = () => {
  return (
    <div className="animate-fade-in text-gray-900 dark:text-gray-100">

      {/* Page Header */}
      <div className="pt-10 pb-6 border-t border-premium text-center">
        <Title text1="ABOUT" text2="US" />
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-lg mx-auto mt-2 leading-relaxed">
          Thoughtfully designed clothing for the modern individual.
        </p>
      </div>

      {/* Story Section */}
      <div className="my-12 flex flex-col md:flex-row gap-12 lg:gap-16 items-center">
        <div className="w-full md:w-[45%] flex-shrink-0">
          <div className="relative rounded-2xl overflow-hidden shadow-premium border border-premium aspect-[4/3]">
            <img
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
              src={assets.about_img}
              alt="ZenTra story — our team and workspace"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
            ZenTra was born out of a passion for innovation and a desire to revolutionize the way
            people shop online. Our journey began with a simple idea: to provide a platform where
            customers can easily discover, explore, and purchase a wide range of products from the
            comfort of their homes.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
            Since our inception, we've worked tirelessly to curate a diverse selection of
            high-quality products that cater to every taste and preference. From fashion and beauty
            to electronics and home essentials, we offer an extensive collection sourced from
            trusted brands and suppliers.
          </p>

          <div className="pt-2 space-y-2">
            <p className="font-semibold text-gray-900 dark:text-white text-base">Our Mission</p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
              Our mission at ZenTra is to empower customers with choice, convenience, and
              confidence. We're dedicated to providing a seamless shopping experience that exceeds
              expectations, from browsing and ordering to delivery and beyond.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="my-16">
        <div className="text-center mb-10">
          <Title text1="WHY" text2="CHOOSE US" />
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-lg mx-auto mt-2 leading-relaxed">
            We go beyond just selling products — we craft an experience worth returning to.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-premium-card border-premium rounded-2xl p-8 shadow-premium hover:shadow-premium-hover hover:scale-[1.02] transition-all duration-300 group">
            <div className="w-12 h-12 mb-6 rounded-xl bg-gray-100 dark:bg-gray-900 border border-premium flex items-center justify-center text-gray-900 dark:text-white group-hover:rotate-6 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-2">Quality Assurance</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              We meticulously select and vet each product to ensure it meets our stringent quality standards.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-premium-card border-premium rounded-2xl p-8 shadow-premium hover:shadow-premium-hover hover:scale-[1.02] transition-all duration-300 group">
            <div className="w-12 h-12 mb-6 rounded-xl bg-gray-100 dark:bg-gray-900 border border-premium flex items-center justify-center text-gray-900 dark:text-white group-hover:-rotate-6 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-2">Convenience</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              With our user-friendly interface and hassle-free ordering process, shopping has never been easier.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-premium-card border-premium rounded-2xl p-8 shadow-premium hover:shadow-premium-hover hover:scale-[1.02] transition-all duration-300 group">
            <div className="w-12 h-12 mb-6 rounded-xl bg-gray-100 dark:bg-gray-900 border border-premium flex items-center justify-center text-gray-900 dark:text-white group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-2">Exceptional Support</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Our dedicated team is here to assist you every step of the way, ensuring your satisfaction is our top priority.
            </p>
          </div>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default About;
