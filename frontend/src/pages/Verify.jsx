import { useContext , useEffect} from "react"
import { ShopContext } from "../context/ShopContext"
import { useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"

const Verify = () => {
     const {navigate, token, setCartItems, backendUrl} = useContext(ShopContext)
     const [searchParams, setSearchParams] = useSearchParams()

     const success = searchParams.get('success')
      const orderId = searchParams.get('orderId')

      const verifyPayment = async () => {
        try {
            
            if (!token) {
                return null
            }

            const response = await axios.post(backendUrl + '/api/order/verifyStripe', {success,orderId},{headers:{token}})

            if (response.data.success) {
                setCartItems({})
                navigate('/orders') 
            }else {
                navigate('/cart')
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
      }

      useEffect(()=>{
        verifyPayment()
      },[token])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center animate-fade-in text-gray-900 dark:text-gray-100">
      <div className="relative w-14 h-14">
        {/* Outer track */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-100 dark:border-gray-900" />
        {/* Spinning indicator */}
        <div className="absolute inset-0 rounded-full border-4 border-t-black dark:border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin" />
      </div>
      <div className="space-y-1">
        <h2 className="font-semibold text-lg">Verifying Payment</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">We are validating your transaction. Please do not close or refresh this page.</p>
      </div>
    </div>
  );
}

export default Verify
