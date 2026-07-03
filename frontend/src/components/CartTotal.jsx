import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

  return (
    <div className="w-full text-gray-900 dark:text-gray-100">
      <div className="mb-4">
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className="flex flex-col gap-3.5 text-sm">
        {/* Subtotal */}
        <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
          <span>Subtotal</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {currency}{getCartAmount().toFixed(2)}
          </span>
        </div>
        
        <div className="border-t border-premium"></div>
        
        {/* Shipping */}
        <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
          <span>Shipping Fee</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {currency}{Number(delivery_fee).toFixed(2)}
          </span>
        </div>
        
        <div className="border-t border-premium"></div>
        
        {/* Total */}
        <div className="flex justify-between items-center text-base pt-1">
          <span className="font-medium">Total</span>
          <span className="font-bold text-lg text-black dark:text-white">
            {currency}{getCartAmount() === 0 ? '0.00' : (getCartAmount() + delivery_fee).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
