const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex gap-2 items-center mb-3">
      <h2 className="text-gray-500 dark:text-gray-400 font-medium tracking-wide">
        {text1}{' '}
        <span className="text-gray-900 dark:text-white font-semibold">{text2}</span>
      </h2>
      <span className="w-8 sm:w-12 h-[2px] bg-gray-900 dark:bg-white inline-block" />
    </div>
  );
};

export default Title;
