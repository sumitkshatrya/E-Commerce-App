import { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal'

const Cart = () => {

const {products, currency, cartItems, updateQuantity, navigate} = useContext(ShopContext);

  const [cartData, setCartData]= useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  return (
    <div className="pt-10 border-t border-premium animate-fade-in text-gray-900 dark:text-gray-100">
      
      <div className="mb-8">
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      {cartData.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Cart Items List */}
          <div className="flex-1 w-full space-y-4">
            {cartData.map((item, index) => {
              const productData = products.find((product) => product._id === item._id);
              if (!productData) return null;

              return (
                <div 
                  key={index} 
                  className="bg-premium-card border-premium rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-premium hover:shadow-premium-hover transition-all duration-200"
                >
                  <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
                    <img 
                      className="w-16 sm:w-20 aspect-square object-cover rounded-xl border border-premium bg-gray-50 dark:bg-gray-900" 
                      src={productData.image[0]} 
                      alt={productData.name} 
                    />
                    <div className="min-w-0 space-y-1.5">
                      <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                        {productData.name}
                      </p>
                      <div className="flex items-center gap-3.5 text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {currency}{productData.price.toFixed(2)}
                        </span>
                        <span className="px-2 py-0.5 rounded-md border border-premium bg-gray-50 dark:bg-gray-900 font-medium">
                          Size: {item.size}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper Control */}
                  <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
                    <div className="flex items-center border border-premium bg-gray-50 dark:bg-gray-900 rounded-xl h-9 overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item._id, item.size, Math.max(1, item.quantity - 1))}
                        className="px-3 h-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition font-medium"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-semibold text-gray-900 dark:text-white min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                        className="px-3 h-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition font-medium"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Delete Item Button */}
                    <button 
                      onClick={() => updateQuantity(item._id, item.size, 0)}
                      className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 text-gray-400 hover:text-red-500 transition duration-200"
                      aria-label="Remove item"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Cart Summary Panel */}
          <div className="w-full lg:w-[380px] bg-premium-card border-premium rounded-2xl p-6 shadow-premium lg:sticky lg:top-24">
            <CartTotal />
            <div className="mt-8">
              <button 
                onClick={() => navigate('/place-order')} 
                className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold tracking-wider text-sm py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 uppercase cursor-pointer"
              >
                Proceed To Checkout
              </button>
            </div>
          </div>

        </div>
      ) : (
        // Premium Empty Cart State
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-5 bg-premium-card border-premium rounded-3xl p-8 max-w-xl mx-auto shadow-premium">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-900 border border-premium flex items-center justify-center text-gray-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div className="space-y-1.5">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Your cart is empty</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">
              Looks like you haven't added anything to your cart yet. Explore our latest arrivals.
            </p>
          </div>
          <button 
            onClick={() => navigate('/collection')}
            className="px-6 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-sm hover:scale-105 active:scale-95 transition duration-200 shadow-md cursor-pointer"
          >
            Start Shopping
          </button>
        </div>
      )}

    </div>
  );
}

export default Cart
