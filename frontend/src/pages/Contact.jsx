import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';

const Contact = () => {
  return (
    <div className="animate-fade-in text-gray-900 dark:text-gray-100">

      {/* Page Header */}
      <div className="pt-10 pb-6 border-t border-premium text-center">
        <Title text1="CONTACT" text2="US" />
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-lg mx-auto mt-2 leading-relaxed">
          Have a question or need help? We'd love to hear from you.
        </p>
      </div>

      {/* Contact Body */}
      <div className="my-12 flex flex-col md:flex-row gap-12 lg:gap-16 items-start">

        {/* Image Block */}
        <div className="w-full md:w-[45%] flex-shrink-0">
          <div className="relative rounded-2xl overflow-hidden shadow-premium border border-premium aspect-[4/3]">
            <img
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
              src={assets.contact_img}
              alt="ZenTra store front"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Info Block */}
        <div className="flex-1 flex flex-col gap-8">

          {/* Store Info */}
          <div className="space-y-4">
            <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Our Store</h2>
            <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="leading-relaxed">
                  244001 Ashiyana Phase - 1<br />
                  MDA Office U.P, India.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+919528865099" className="hover:text-black dark:hover:text-white transition">
                  (+91) 9528865099
                </a>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:admin@ZenTra.com" className="hover:text-black dark:hover:text-white transition break-all">
                  admin@ZenTra.com
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-premium" />

          {/* Careers Block */}
          <div className="space-y-3">
            <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Careers at ZenTra</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              We're always looking for passionate, talented people to join our growing team.
              Learn more about our culture, teams, and open positions.
            </p>
            <button
              type="button"
              className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-900 dark:border-white bg-transparent text-gray-900 dark:text-white font-semibold text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 group cursor-pointer"
            >
              Explore Jobs
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Contact;
