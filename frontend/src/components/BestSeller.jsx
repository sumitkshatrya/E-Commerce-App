import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (products?.length) {
      const bestProduct = products.filter((item) => item.bestSeller);
      setBestSeller(bestProduct.slice(0, 5));
      setLoading(false);
    }
  }, [products]);

  return (
    <section className="my-16">
      <div className="text-center py-8">
        <Title text1={'BEST'} text2={'SELLERS'} />
        <p className="mt-2 max-w-xl mx-auto text-gray-500 dark:text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed">
          Our most loved styles, chosen for their quality, comfort, and timeless appeal.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {loading ? (
          // Shimmer loading skeletons
          Array.from({ length: 5 }).map((_, index) => (
            <div 
              key={index}
              className="flex flex-col h-full bg-premium-card border-premium rounded-2xl overflow-hidden shadow-premium"
            >
              <div className="aspect-[3/4] shimmer" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-3/4 shimmer" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-1/4 shimmer" />
              </div>
            </div>
          ))
        ) : (
          bestSeller.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default BestSeller;
