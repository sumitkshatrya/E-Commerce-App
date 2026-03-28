import  { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({token}) => {

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] =  useState("Topwear");
  const [bestSeller, setBestSeller] = useState(false);
  const [sizes, setSizes] = useState([]);

  

  const onSubmitHandler = async (e)=>{
      e.preventDefault();

      try {
        
        const formData = new FormData()

        formData.append("name", name)
        formData.append("description", description)
        formData.append("category", category)
        formData.append("subCategory",subCategory)
        formData.append("price",price)
        formData.append("sizes",JSON.stringify(sizes))
        formData.append("bestSeller",bestSeller ? "true" : "false")

        image1 && formData.append("image1",image1)
        image2 && formData.append("image2",image2)
        image3 && formData.append("image3",image3)
        image4 && formData.append("image4",image4)

        const response = await axios.post(backendUrl + '/api/product/add', formData, {headers:{token}})
        
        if (response.data.success){
            toast.success(response.data.message)
            setName('')
            setDescription('')
            setImage1(false)
            setImage2(false)
            setImage3(false)
            setImage4(false)
            setPrice('')
        }else{
          toast.error(response.data.message)
        }

      } catch (error) {
        console.log(error);
        toast.error(error.message)
        
      }
  }

  return (
  <div className="p-6 md:p-10 bg-gray-50 min-h-screen flex justify-center">
    <form
      onSubmit={onSubmitHandler}
      className="w-full max-w-4xl bg-white p-6 md:p-8 rounded-xl shadow-md space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800">
        Add New Product
      </h2>

      {/* IMAGE UPLOAD */}
      <div>
        <p className="font-medium mb-3 text-gray-700">Upload Images</p>
        <div className="flex gap-3 flex-wrap">
          {[image1, image2, image3, image4].map((img, i) => (
            <label
              key={i}
              htmlFor={`image${i + 1}`}
              className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-black transition"
            >
              <img
                src={
                  !img ? assets.upload_area : URL.createObjectURL(img)
                }
                alt=""
                className="object-cover w-full h-full rounded-lg"
              />
              <input
                type="file"
                id={`image${i + 1}`}
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (i === 0) setImage1(file);
                  if (i === 1) setImage2(file);
                  if (i === 2) setImage3(file);
                  if (i === 3) setImage4(file);
                }}
              />
            </label>
          ))}
        </div>
      </div>

      {/* PRODUCT NAME */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Product Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Enter product name"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
          required
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write product description..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
          rows={4}
          required
        />
      </div>

      {/* CATEGORY + PRICE */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Sub Category
          </label>
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black"
          >
            <option value="TopWear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="₹ 999"
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* SIZES */}
      <div>
        <p className="font-medium text-gray-700 mb-2">Sizes</p>
        <div className="flex gap-3 flex-wrap">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <button
              type="button"
              key={size}
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((item) => item !== size)
                    : [...prev, size]
                )
              }
              className={`px-4 py-1 rounded-full text-sm border transition ${
                sizes.includes(size)
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* BEST SELLER */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={bestSeller}
          onChange={() => setBestSeller((prev) => !prev)}
        />
        <label className="text-sm text-gray-700">
          Add to Bestseller
        </label>
      </div>

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
      >
        Add Product
      </button>
    </form>
  </div>
);
}

export default Add
