import axios from 'axios'
import { useEffect, useState } from 'react'
import { backendUrl, currency } from '../constants/adminConstants'
import { toast } from 'react-toastify'


const List = ({token}) => {

  const [list, setList] = useState([])

  const fetchList = async () =>{
    try {
      
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success){
        setList(response.data.products);
      } else {
        toast.error(response.data.message)
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

    const removeProduct = async (id) =>{
      try {
        
        const response = await axios.post(backendUrl + '/api/product/remove', {id}, {headers:{token}} )

        if (response.data.success){
          toast.success(response.data.message)
          await fetchList();
        } else {
          toast.error(response.data.message)
        }

      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }

  useEffect(()=>{
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])


  

  return (
  <div className="p-6 md:p-10 bg-admin-bg min-h-screen">
    <h2 className="text-2xl font-bold text-admin-text mb-6">
      Product Inventory
    </h2>


    {list.length === 0 ? (
      <p className="text-admin-muted text-center mt-10">
        No products available
      </p>

    ) : (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {list.map((item, index) => (
          <div
            key={index}
            className="bg-admin-surface rounded-xl shadow-md hover:shadow-xl transition p-4 border border-admin-border"

          >
            {/* Image */}
            <div className="flex justify-center">
              <img
                src={item.image[0]}
                alt={item.name}
                className="h-32 object-contain mb-4"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-1">
              <h3 className="font-semibold text-admin-text text-sm line-clamp-2">

                {item.name}
              </h3>

              <p className="text-xs text-admin-muted">

                Category: {item.category}
              </p>

              <p className="text-lg font-bold text-admin-text mt-2">

                {currency} {item.price}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-4 flex justify-between items-center">
              <span className="text-xs text-admin-success font-medium">

                In Stock
              </span>

              <button
                onClick={() => removeProduct(item._id)}
                className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"

              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
}

export default List
