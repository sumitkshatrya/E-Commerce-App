import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProduct] = useState([]);

  useEffect(() => {
    if (products?.length) {
      setLatestProduct(products.slice(0, 10));
    }
  }, [products]);

  return (
    <section className="my-10 px-4 sm:px-6 md:px-10 lg:px-16">

      <div className="text-center text-3xl mx-auto py-8">
        <Title text1={"LATEST"} text2={"COLLECTIONS"} />
        <p className="mt-3 text-gray-500 text-sm sm:text-base leading-relaxed">
          Explore the newest drops crafted to elevate your look and keep your
          style ahead of the curve.
        </p>
      </div>

      {/* Products Grid */}
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {latestProducts.map((item, index) => (
          <div
            key={index}
            className="group transition-all duration-300"
          >
            <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden">
              
              {/* Product */}
              <ProductItem
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestCollection;