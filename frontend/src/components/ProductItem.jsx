import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link 
      className="group flex flex-col h-full bg-premium-card border-premium rounded-2xl overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300 transform hover:-translate-y-0.5" 
      to={`/product/${id}`}
    >
      {/* Product Image Frame with Dual-Image Hover Transition */}
      <div className="relative aspect-[3/4] bg-gray-50 dark:bg-gray-900 overflow-hidden border-b border-premium">
        {/* Primary Image */}
        <img 
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${image[1] ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-110'}`} 
          src={image[0]} 
          alt={name} 
          loading="lazy"
        />
        {/* Secondary Image for Hover Swap */}
        {image[1] && (
          <img 
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 scale-100 group-hover:scale-105 transition-all duration-700 ease-out" 
            src={image[1]} 
            alt={name} 
            loading="lazy"
          />
        )}
      </div>

      {/* Details Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 leading-tight group-hover:text-black dark:group-hover:text-white transition-colors duration-200">
          {name}
        </h3>
        
        <div className="flex items-center justify-between pt-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {currency}{price.toFixed(2)}
          </p>
          <span className="text-[10px] uppercase font-semibold text-gray-400 dark:text-gray-500 tracking-wider group-hover:text-black dark:group-hover:text-white transition duration-200">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
