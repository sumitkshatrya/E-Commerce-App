import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import Title from "../components/Title";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([])

  const loadOrderData = async () => {
    try {
      if(!token) {
        return null
      } 

      const response = await axios.post(backendUrl + '/api/order/userorders', {}, {headers:{token}})
      if (response.data.success) {
        let allOrdersItem = []
        response.data.orders.forEach((order)=>{
           order.items.forEach((item)=>{
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            allOrdersItem.push(item)
           })
        })
        setOrderData(allOrdersItem.reverse())
      }
      
    } catch (error) {
      
    }
  }

  useEffect(() => {
    loadOrderData()
  },[token])

  // Helper to color-code order status pills
  const getStatusStyle = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('delivered')) {
      return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/50';
    }
    if (s.includes('shipped')) {
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50';
    }
    return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50';
  };

  return (
    <div className="pt-10 border-t border-premium animate-fade-in text-gray-900 dark:text-gray-100">
      
      <div className="mb-8">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      {orderData.length > 0 ? (
        <div className="space-y-4">
          {orderData.map((item, index) => (
            <div
              key={index}
              className="bg-premium-card border-premium rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-premium hover:shadow-premium-hover transition-all duration-200"
            >
              {/* Product Info Block */}
              <div className="flex items-start gap-5 text-sm flex-1 min-w-0">
                <img 
                  className="w-16 sm:w-20 aspect-square object-cover rounded-xl border border-premium bg-gray-50 dark:bg-gray-900" 
                  src={item.image?.[0]} 
                  alt={item.name} 
                />
                <div className="min-w-0 space-y-1.5">
                  <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                    {item.name}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-gray-950 dark:text-white">
                      {currency}{item.price.toFixed(2)}
                    </span>
                    <span>Qty: {item.quantity}</span>
                    <span className="px-2 py-0.5 rounded-md border border-premium bg-gray-50 dark:bg-gray-900 font-medium">
                      Size: {item.size}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 pt-1 text-xs text-gray-400 dark:text-gray-500">
                    <p className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4v4m0 0V7m0 4h.01M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Date: <span className="font-medium text-gray-500 dark:text-gray-400">{new Date(item.date).toDateString()}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Payment: <span className="font-medium text-gray-500 dark:text-gray-400 uppercase">{item.paymentMethod}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 border-premium pt-4 md:pt-0">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${getStatusStyle(item.status)}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span>{item.status || 'Order Placed'}</span>
                </div>

                <button 
                  onClick={loadOrderData} 
                  className="px-4 py-2 border border-premium hover:border-border-hover dark:hover:border-gray-700 bg-white dark:bg-gray-900 rounded-xl text-xs font-semibold tracking-wide shadow-sm hover:shadow transition cursor-pointer"
                >
                  Track Order
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        // Beautiful Empty State
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-5 bg-premium-card border-premium rounded-3xl p-8 max-w-xl mx-auto shadow-premium animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-900 border border-premium flex items-center justify-center text-gray-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div className="space-y-1.5">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">No orders placed yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">
              Once you purchase items from our catalog, you can track their status and history here.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default Orders;
