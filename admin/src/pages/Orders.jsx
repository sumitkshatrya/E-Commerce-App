import { useEffect } from "react"
import { useState } from "react"
import axios from 'axios'
import {backendUrl, currency} from '../App'
import {toast} from  'react-toastify'
import { assets } from "../assets/assets"

const Orders = ({token}) => {

  const [orders, setOrders] = useState([])

  const fetchAllOrders  = async () => {

    if (!token) {
      return null;
    } 
    try {

      const response = await axios.post(backendUrl + '/api/order/list',{},{headers:{token}})
      if(response.data.success){
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }

  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', {orderId, status:event.target.value},{headers: {token}})
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error)
      toast.error(response.data.message)
    }
  }

  useEffect(()=>{
    fetchAllOrders();
  }, [token])

  return (
  <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
    <h3 className="text-2xl font-bold mb-6 text-gray-800">Orders Dashboard</h3>

    <div className="space-y-5">
      {orders.map((order, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md border border-gray-200 p-5 md:p-6 grid 
          grid-cols-1 lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-5 items-start hover:shadow-lg transition"
        >
          {/* Icon */}
          <div className="flex justify-center lg:justify-start">
            <img className="w-12 opacity-80" src={assets.parcel_icon} alt="" />
          </div>

          {/* Order Details */}
          <div>
            <div className="text-sm text-gray-700 space-y-1">
              {order.items.map((item, i) => (
                <p key={i}>
                  <span className="font-medium">{item.name}</span> × {item.quantity}
                  <span className="text-gray-500"> ({item.size})</span>
                </p>
              ))}
            </div>

            <p className="mt-4 font-semibold text-gray-800">
              {order.address.firstName} {order.address.lastName}
            </p>

            <div className="text-gray-500 text-sm">
              <p>{order.address.street}</p>
              <p>
                {order.address.city}, {order.address.state},{" "}
                {order.address.country} - {order.address.zipcode}
              </p>
            </div>

            <p className="text-sm mt-1 text-gray-600">
              📞 {order.address.phone}
            </p>
          </div>

          {/* Info */}
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <span className="font-medium">Items:</span> {order.items.length}
            </p>
            <p>
              <span className="font-medium">Method:</span>{" "}
              {order.paymentMethod}
            </p>
            <p>
              <span className="font-medium">Payment:</span>{" "}
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  order.payment
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {order.payment ? "Paid" : "Pending"}
              </span>
            </p>
            <p>
              <span className="font-medium">Date:</span>{" "}
              {new Date(order.date).toLocaleDateString()}
            </p>
          </div>

          {/* Amount */}
          <div className="flex items-center justify-start lg:justify-center">
            <p className="text-lg font-bold text-gray-800">
              {currency} {order.amount}
            </p>
          </div>

          {/* Status Dropdown */}
          <div>
            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium"
            >
              <option value="OrderPlaced">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  </div>
);
}

export default Orders
