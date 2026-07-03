import  { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProduct from '../components/RelatedProduct';

const Product = () => {
  
  const {productId} = useParams();
  const {products,currency, addToCart} = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize]= useState('');

  const fetchProductData = async ()=>{
    
    products.map((item)=>{
      if(item._id === productId){
        setProductData(item)
        setImage(item.image[0])
        return null;
      }
    })

  }

    useEffect(()=>{
      fetchProductData();
    },[productId, products])

  return productData ? (
    <div className="pt-10 border-t border-premium animate-fade-in text-gray-900 dark:text-gray-100">
      
      {/* Product View Container */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

        {/* ------- Product Image Gallery ------- */}
        <div className="flex-1 flex flex-col-reverse md:flex-row gap-4">
          
          {/* Thumbnails Sidebar */}
          <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto justify-between md:justify-start gap-3 md:w-[20%] w-full h-fit max-h-[480px] pb-2 md:pb-0 scrollbar-thin">
            {productData.image.map((item, index) => (
              <button 
                onClick={() => setImage(item)} 
                key={index} 
                className={`w-[22%] md:w-full aspect-square rounded-xl overflow-hidden border bg-gray-50 dark:bg-gray-900 transition-all duration-250 flex-shrink-0 cursor-pointer ${item === image ? 'border-black dark:border-white ring-2 ring-black/10 dark:ring-white/10' : 'border-premium hover:border-border-hover'}`}
                aria-label={`View product image ${index + 1}`}
              >
                <img src={item} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>

          {/* Main Hero Showcase Image */}
          <div className="w-full md:w-[80%] aspect-[3/4] rounded-2xl border border-premium overflow-hidden bg-gray-50 dark:bg-gray-900 shadow-premium">
            <img 
              className="w-full h-full object-cover transition-all duration-500 hover:scale-105 cursor-zoom-in" 
              src={image} 
              alt={productData.name} 
            />
          </div>

        </div>
        
        {/* ----- Product Info Panel ----- */}
        <div className="flex-1 space-y-6 lg:max-w-lg">
          <div className="space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl text-gray-900 dark:text-white leading-tight">
              {productData.name}
            </h1>
            
            {/* Review Stars using vector SVGs */}
            <div className="flex items-center gap-1.5 pt-1">
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 4 }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <svg className="w-4 h-4 text-gray-300 dark:text-gray-700 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 pl-1">(122 reviews)</p>
            </div>
          </div>

          <p className="text-3xl font-semibold text-gray-900 dark:text-white">
            {currency}{productData.price.toFixed(2)}
          </p>

          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
            {productData.description}
          </p>

          {/* Size Selection */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-gray-900 dark:text-white">Select Size</h3>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button 
                  onClick={() => setSize(item)} 
                  className={`w-12 h-12 rounded-xl border text-sm font-medium tracking-wide flex items-center justify-center transition-all duration-250 cursor-pointer ${item === size ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-md' : 'bg-transparent border-premium text-gray-800 dark:text-gray-200 hover:border-black dark:hover:border-white'}`} 
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="pt-4">
            <button 
              onClick={() => addToCart(productData._id, size)} 
              className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold tracking-wider text-sm py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 cursor-pointer uppercase"
            >
              Add To Cart
            </button>
          </div>

          {/* Bullet Policy Details */}
          <div className="border-t border-premium pt-6 space-y-3 text-xs font-medium text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>100% Authentic Product Guarantee.</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Cash on Delivery option available.</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Easy return and exchange policy within 7 days.</span>
            </div>
          </div>

        </div>
      </div>

      {/* ------ Description and Review Section Tabs ------ */}
      <div className="mt-20 border-t border-premium pt-10">
        <div className="flex border-b border-premium mb-6">
          <button className="border-b-2 border-black dark:border-white px-6 py-3 text-sm font-semibold tracking-wide">
            Description
          </button>
          <button className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white px-6 py-3 text-sm font-medium tracking-wide transition">
            Reviews (122)
          </button>
        </div>
        <div className="bg-premium-card border-premium rounded-2xl p-6 sm:p-8 space-y-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400 shadow-premium">
          <p>
            An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet. It serves as a virtual marketplace where businesses and individuals can showcase their products, interact with customers, and conduct transactions without the need for a physical presence. E-commerce platforms have gained immense popularity due to their convenience, 24/7 accessibility, and the expansive global reach they offer.
          </p>
          <p>
            Each item typically features its own dedicated page with comprehensive details, zoomable images, specifications, pricing variations (sizes, color swatches), and verified customer reviews that build trust and elevate consumer shopping confidence.
          </p>
        </div>
      </div>
      
      {/* Related Products Section */}
      <RelatedProduct category={productData.category} subCategory={productData.subCategory }/>
   
    </div>
  ) : <div className="min-h-[50vh] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-premium border-t-black dark:border-t-white animate-spin"></div></div>
}

export default Product
