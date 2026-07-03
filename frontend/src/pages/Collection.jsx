import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";


const Collection = () => {
  const { products , search , showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([])
  const [category,setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortType, setSortType] = useState('relevant')

    const toggleCategory = (e) =>{

      if(category.includes(e.target.value)) {
          setCategory(prev=>prev.filter(item => item !== e.target.value))
      }
      else{
        setCategory(prev => [...prev,e.target.value])
      }
    }

    const toggleSubCategory = (e) => {

      if (subCategory.includes(e.target.value)){
        setSubCategory(prev=>prev.filter(item=>item !== e.target.value))
      }
      else{
        setSubCategory(prev => [...prev,e.target.value])
      }
    }

    const applyFilter = ()=>{
    
      let productsCopy = products.slice();

      if (showSearch && search) {
          productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
      }

      if(category.length > 0){
        productsCopy = productsCopy.filter(item =>category.includes(item.category))
      }

      if(subCategory.length > 0 ){
        productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
      }

      setFilterProducts(productsCopy)

    }

    const sortProduct = () => {

      let fpCopy = filterProducts.slice();
      
      switch (sortType){
        case 'low-high':
          setFilterProducts(fpCopy.sort((a,b)=>(a.price - b.price)));
          break;

          case 'high-low':
            setFilterProducts(fpCopy.sort((a,b)=>(b.price - a.price)));
            break;

            default:
              applyFilter();
              break;
      }

    }


 useEffect(()=>{
  applyFilter();
 },[category,subCategory,search,showSearch,products])

 useEffect(()=>{
  sortProduct();
 },[sortType])


  return (
    <div className="flex flex-col md:flex-row gap-8 pt-10 border-t border-premium animate-fade-in">
      
      {/* Filter Sidebar Container */}
      <div className="min-w-[240px] md:sticky md:top-24 h-fit">
        {/* Title for filter toggler */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-lg font-semibold tracking-wide flex items-center justify-between w-full md:cursor-default"
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            FILTERS
          </span>
          <svg 
            className={`h-4 w-4 md:hidden transition-transform duration-300 ${showFilter ? "rotate-180" : ""}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Filters Group (Hidden on mobile by default) */}
        <div className={`space-y-6 mt-6 ${showFilter ? "block animate-slide-down" : "hidden"} md:block`}>
          
          {/* Category Filter Card */}
          <div className="bg-premium-card border-premium rounded-2xl p-5 shadow-premium">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Categories
            </h3>
            <div className="flex flex-col gap-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  className="rounded border-gray-300 dark:border-gray-800 text-black dark:text-white focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer" 
                  type="checkbox" 
                  value="Men" 
                  onChange={toggleCategory}
                />
                <span className="group-hover:text-black dark:group-hover:text-white transition">Men</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  className="rounded border-gray-300 dark:border-gray-800 text-black dark:text-white focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer" 
                  type="checkbox" 
                  value="Women" 
                  onChange={toggleCategory}
                />
                <span className="group-hover:text-black dark:group-hover:text-white transition">Women</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  className="rounded border-gray-300 dark:border-gray-800 text-black dark:text-white focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer" 
                  type="checkbox" 
                  value="Kids" 
                  onChange={toggleCategory} 
                />
                <span className="group-hover:text-black dark:group-hover:text-white transition">Kids</span>
              </label>
            </div>
          </div>

          {/* SubCategories Filter Card */}
          <div className="bg-premium-card border-premium rounded-2xl p-5 shadow-premium">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Type
            </h3>
            <div className="flex flex-col gap-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  className="rounded border-gray-300 dark:border-gray-800 text-black dark:text-white focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer" 
                  type="checkbox" 
                  value="Topwear" 
                  onChange={toggleSubCategory}
                />
                <span className="group-hover:text-black dark:group-hover:text-white transition">Topwear</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  className="rounded border-gray-300 dark:border-gray-800 text-black dark:text-white focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer" 
                  type="checkbox" 
                  value="Bottomwear" 
                  onChange={toggleSubCategory}
                />
                <span className="group-hover:text-black dark:group-hover:text-white transition">Bottomwear</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  className="rounded border-gray-300 dark:border-gray-800 text-black dark:text-white focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer" 
                  type="checkbox" 
                  value="Winterwear" 
                  onChange={toggleSubCategory}
                />
                <span className="group-hover:text-black dark:group-hover:text-white transition">Winterwear</span>
              </label>
            </div>
          </div>

        </div>
      </div>

      {/* Right Product Grid Column */}
      <div className="flex-1 space-y-6">
        
        {/* Header Options Panel */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-premium pb-4">
          <Title text1={'ALL'} text2={'COLLECTIONS'} />
          
          {/* Sorting Dropdown selector */}
          <div className="relative w-fit">
            <select 
              onChange={(e) => setSortType(e.target.value)} 
              className="appearance-none bg-premium-card border-premium hover:border-border-hover text-sm py-2 px-4 pr-10 rounded-xl outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition cursor-pointer"
            >
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
            <svg 
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Map Products List Grid */}
        {filterProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filterProducts.map((item, index) => (
              <ProductItem 
                key={index} 
                name={item.name} 
                id={item._id} 
                price={item.price} 
                image={item.image}
              />
            ))}
          </div>
        ) : (
          // Beautiful Empty State
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 animate-fade-in bg-premium-card border-premium rounded-3xl p-8">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-900 border border-premium flex items-center justify-center text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">No products found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
              We couldn't find any products matching your active filters. Try clearing some search fields or adjusting categories.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Collection;
