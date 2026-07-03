const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="max-w-4xl mx-auto my-20 p-8 sm:p-12 bg-gradient-to-br from-gray-50/50 to-gray-100/30 dark:from-gray-900/30 dark:to-gray-950/30 border border-premium rounded-2xl sm:rounded-3xl shadow-premium text-center relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-gray-200/40 dark:bg-gray-800/20 rounded-full blur-3xl pointer-events-none" />

      <h2 className="text-2xl sm:text-3xl font-serif text-gray-900 dark:text-white">
        Subscribe now & get 20% off
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
        Be the first to know about new drops, exclusive collections, and receive custom member benefits.
      </p>
      
      <form 
        onSubmit={onSubmitHandler} 
        className="w-full sm:max-w-md flex flex-col sm:flex-row items-stretch gap-2.5 mx-auto mt-8 z-10 relative"
      >
        <input 
          className="flex-1 px-4 py-3 rounded-xl border border-premium bg-white dark:bg-gray-950 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200 placeholder-gray-400" 
          type="email" 
          placeholder="Enter your email address" 
          required
        />
        <button 
          type="submit" 
          className="bg-black dark:bg-white text-white dark:text-black font-semibold text-xs tracking-wider uppercase px-8 py-3.5 sm:py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-250 cursor-pointer"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
