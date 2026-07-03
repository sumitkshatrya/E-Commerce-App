import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const [method, setMethod] = useState('cod');
  const {navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext)
  const [formData, setFormData] = useState({
    firstName:'',
    lastName:'',
    email:'',
    street:'',
    city:'',
    state:'',
    zipcode:'',
    country:'',
    phone:''
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value
    setFormData(data => ({...data, [name]:value}))
  }

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name:'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async(response) =>{
        console.log(response)
        try {
          
          const {data} = await axios.post(backendUrl + '/api/order/verifyRazorpay',response,{headers:{token}})
          if (data.success) {
            navigate('/orders')
            setCartItems({})
          }

        } catch (error) {
          console.log(error)
          toast.error(error)
        }
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      
      let orderItems = []

      for(const items in cartItems){
        for(const item in cartItems[items]){
            if (cartItems[items][item] > 0) {
               const itemInfo = structuredClone(products.find(product => product._id === items))
               if (itemInfo) {
                    itemInfo.size = item
                    itemInfo.quantity = cartItems[items][item]
                    orderItems.push(itemInfo)
               }
            }
        }
      }

      let orderData = {
        // userId: token,
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      }

      switch(method){

        // Api calls for COD
        case 'cod':
          const response = await axios.post(backendUrl + '/api/order/place',orderData, {headers:{token}})
          if (response.data.success) {
            setCartItems({})
            navigate('/orders')
          } else {
            toast.error(response.data.message)
          }
        break;

        case 'stripe':
          const responseStripe = await axios.post(backendUrl + '/api/order/stripe',orderData,{headers:{token}})
          if (responseStripe.data.success) {
            const {session_url} = responseStripe.data
            window.location.replace(session_url)
          } else {
            toast.error(responseStripe.data.message)
          }
          break;

          case 'razorpay':

          const responseRazorPay = await axios.post(backendUrl + '/api/order/razorpay',orderData, {headers:{token}})
          if (responseRazorPay.data.success) {
            initPay(responseRazorPay.data.order)
          }

          break;

        default: 
            break;
      }

    } catch (error) {
       console.log(error)
      toast.error("error.message")
    }
  }

  

  return (
    <form onSubmit={onSubmitHandler} className="pt-10 border-t border-premium animate-fade-in text-gray-900 dark:text-gray-100">
      
      <div className="flex flex-col lg:flex-row justify-between gap-10 items-stretch">
        
        {/* ------- Left Column: Shipping Information Form ------- */}
        <div className="flex-1 space-y-6">
          <div>
            <Title text1={'DELIVERY'} text2={'INFORMATION'} />
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1">
              Please enter your destination shipping details to proceed.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">First Name</label>
                <input 
                  required 
                  onChange={onChangeHandler} 
                  name="firstName" 
                  value={formData.firstName} 
                  className="w-full px-4 py-3 rounded-xl border border-premium bg-premium-card text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition" 
                  type="text" 
                  placeholder="John" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Name</label>
                <input 
                  required 
                  onChange={onChangeHandler} 
                  name="lastName" 
                  value={formData.lastName} 
                  className="w-full px-4 py-3 rounded-xl border border-premium bg-premium-card text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition" 
                  type="text" 
                  placeholder="Doe" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email Address</label>
              <input 
                required 
                onChange={onChangeHandler} 
                name="email" 
                value={formData.email} 
                className="w-full px-4 py-3 rounded-xl border border-premium bg-premium-card text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition" 
                type="email" 
                placeholder="john.doe@example.com" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Street Address</label>
              <input 
                required 
                onChange={onChangeHandler} 
                name="street" 
                value={formData.street} 
                className="w-full px-4 py-3 rounded-xl border border-premium bg-premium-card text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition" 
                type="text" 
                placeholder="123 Main St, Apt 4B" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">City</label>
                <input 
                  required 
                  onChange={onChangeHandler} 
                  name="city" 
                  value={formData.city} 
                  className="w-full px-4 py-3 rounded-xl border border-premium bg-premium-card text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition" 
                  type="text" 
                  placeholder="New York" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">State</label>
                <input 
                  required 
                  onChange={onChangeHandler} 
                  name="state" 
                  value={formData.state} 
                  className="w-full px-4 py-3 rounded-xl border border-premium bg-premium-card text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition" 
                  type="text" 
                  placeholder="NY" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Zipcode</label>
                <input 
                  required 
                  onChange={onChangeHandler} 
                  name="zipcode" 
                  value={formData.zipcode} 
                  className="w-full px-4 py-3 rounded-xl border border-premium bg-premium-card text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition" 
                  type="number" 
                  placeholder="10001" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Country</label>
                <input 
                  required 
                  onChange={onChangeHandler} 
                  name="country" 
                  value={formData.country} 
                  className="w-full px-4 py-3 rounded-xl border border-premium bg-premium-card text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition" 
                  type="text" 
                  placeholder="United States" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone Number</label>
              <input 
                required 
                onChange={onChangeHandler} 
                name="phone" 
                value={formData.phone} 
                className="w-full px-4 py-3 rounded-xl border border-premium bg-premium-card text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition" 
                type="number" 
                placeholder="+1 (555) 000-0000" 
              />
            </div>
          </div>
        </div>

        {/* ------- Right Column: Checkout Summary & Payment Selection ------- */}
        <div className="w-full lg:w-[420px] flex flex-col justify-between">
          <div className="space-y-10">
            {/* Cart summary */}
            <div className="bg-premium-card border-premium rounded-2xl p-6 shadow-premium">
              <CartTotal />
            </div>

            {/* Payment options selection */}
            <div className="space-y-4">
              <div>
                <Title text1={'PAYMENT'} text2={'METHOD'} />
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  Select your preferred payment checkout channel.
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                {/* Stripe Selection Tile */}
                <div 
                  onClick={() => setMethod('stripe')} 
                  className={`flex items-center justify-between bg-premium-card border rounded-2xl p-4 cursor-pointer shadow-premium hover:shadow-premium-hover transition-all duration-200 ${method === 'stripe' ? 'border-black dark:border-white ring-2 ring-black/10 dark:ring-white/10' : 'border-premium'}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-4 h-4 rounded-full border border-premium flex items-center justify-center transition-all ${method === 'stripe' ? 'bg-black dark:bg-white border-black dark:border-white' : ''}`}>
                      {method === 'stripe' && <span className="w-1.5 h-1.5 bg-white dark:bg-black rounded-full" />}
                    </span>
                    <span className="text-sm font-semibold">Stripe Checkout</span>
                  </div>
                  <img className="h-5 filter dark:brightness-200" src={assets.stripe_logo} alt="Stripe" />
                </div>

                {/* Razorpay Selection Tile */}
                <div 
                  onClick={() => setMethod('razorpay')} 
                  className={`flex items-center justify-between bg-premium-card border rounded-2xl p-4 cursor-pointer shadow-premium hover:shadow-premium-hover transition-all duration-200 ${method === 'razorpay' ? 'border-black dark:border-white ring-2 ring-black/10 dark:ring-white/10' : 'border-premium'}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-4 h-4 rounded-full border border-premium flex items-center justify-center transition-all ${method === 'razorpay' ? 'bg-black dark:bg-white border-black dark:border-white' : ''}`}>
                      {method === 'razorpay' && <span className="w-1.5 h-1.5 bg-white dark:bg-black rounded-full" />}
                    </span>
                    <span className="text-sm font-semibold">Razorpay Secure</span>
                  </div>
                  <img className="h-5 filter dark:brightness-200" src={assets.razorpay_logo} alt="Razorpay" />
                </div>

                {/* Cash on Delivery Selection Tile */}
                <div 
                  onClick={() => setMethod('cod')} 
                  className={`flex items-center justify-between bg-premium-card border rounded-2xl p-4 cursor-pointer shadow-premium hover:shadow-premium-hover transition-all duration-200 ${method === 'cod' ? 'border-black dark:border-white ring-2 ring-black/10 dark:ring-white/10' : 'border-premium'}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-4 h-4 rounded-full border border-premium flex items-center justify-center transition-all ${method === 'cod' ? 'bg-black dark:bg-white border-black dark:border-white' : ''}`}>
                      {method === 'cod' && <span className="w-1.5 h-1.5 bg-white dark:bg-black rounded-full" />}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Cash on Delivery</span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md uppercase tracking-wider">COD</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button 
              type="submit" 
              className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold tracking-wider text-sm py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 uppercase cursor-pointer"
            >
              Place Order
            </button>
          </div>
        </div>

      </div>
    </form>
  );
}

export default PlaceOrder
