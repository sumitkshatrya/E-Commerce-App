import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

export const ShopContext = createContext();
const pendingCartActionKey = 'pendingCartAction';

const getInitialTheme = () => {
  const stored = localStorage.getItem('theme');
  if (stored) return stored;
  // Detect system preference on first load
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const ShopContextProvider = (props) => {

  const currency = '$';
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([])
  const [token, setToken] = useState('')
  const [theme, setTheme] = useState(getInitialTheme)
  const navigate = useNavigate()
  const location = useLocation()

   useEffect(() => {
     if (theme === 'dark') {
       document.documentElement.classList.add('dark');
     } else {
       document.documentElement.classList.remove('dark');
     }
     localStorage.setItem('theme', theme);
   }, [theme]);

   const toggleTheme = () => {
     setTheme(prev => prev === 'light' ? 'dark' : 'light');
   };

   const getCurrentPath = () => `${location.pathname}${location.search}${location.hash}`;

   const storePendingCartAction = (itemId, size) => {
    sessionStorage.setItem(
      pendingCartActionKey,
      JSON.stringify({
        itemId,
        size,
        returnPath: getCurrentPath(),
      })
    );
   };

   const getPendingCartAction = () => {
    const savedAction = sessionStorage.getItem(pendingCartActionKey);
    return savedAction ? JSON.parse(savedAction) : null;
   };

   const clearPendingCartAction = () => {
    sessionStorage.removeItem(pendingCartActionKey);
   };

   const performAddToCart = async (itemId, size, authToken = token) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]){
      if (cartData[itemId][size]){
        cartData[itemId][size] += 1;
      }
      else{
        cartData[itemId][size] = 1;
      }
    }
    else{
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);

    if (authToken) {
      try {
        await axios.post(backendUrl + '/api/cart/add', {itemId, size}, {headers:{token: authToken}})
        return true;
      } catch (error) {
        console.log(error)
        toast.error(error.message)
        return false;
      }
    }

    return true;
   };

   const addToCart = async (itemId,size) =>{

    if (!size){
        toast.error('Select Product Size')
        return;
    }

    if (!token) {
      storePendingCartAction(itemId, size);
      navigate('/login', { state: { from: getCurrentPath() } });
      return;
    }

    await performAddToCart(itemId, size);
   }

   const resolvePendingCartAction = async (authToken) => {
    const pendingAction = getPendingCartAction();

    if (!pendingAction?.itemId || !pendingAction?.size) {
      return null;
    }

    const isAdded = await performAddToCart(pendingAction.itemId, pendingAction.size, authToken);
    if (isAdded) {
      clearPendingCartAction();
      return pendingAction;
    }

    return null;
   };

   const getCartCount = () =>{
        let totalCount = 0;
      for (const items in cartItems){
        for( const item in cartItems[items]){
          
            if (cartItems[items][item] > 0){
                totalCount += cartItems[items][item];
            }
          } 
        }
     
      return totalCount; 
   } 

   const updateQuantity = async(itemId,size,quantity)=>{

    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;

    setCartItems(cartData);

    if (token) {

      try {
        
          await axios.post(backendUrl + '/api/cart/update', {itemId, size, quantity}, {headers:{token}})

      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }

    }
   }

    const getCartAmount = () =>{
      let totalAmount = 0;
      for(const items in cartItems){
        let itemInfo = products.find((product)=> product._id === items);
        for(const item in cartItems[items]){
            if (cartItems[items][item] > 0){
              totalAmount += itemInfo.price * cartItems[items][item];
            }
          } 
        }
      
      return totalAmount;
    }

    const  getProductsData = async () => {
      try {
        
        const response = await axios.get(backendUrl + '/api/product/list')
        if(response.data.success){
          setProducts(response.data.products)
        } else {
          toast.error(response.data.message)
        }

      } catch (error) {
         console.log(error)
         toast.error(error.message)
      }
    }

    const getUserCart =  async ( token ) => {
      try {
        
        const response = await axios.post(backendUrl + '/api/cart/get', {},{headers: {token}})
        if(response.data.success) {
          setCartItems(response.data.cartData)
        }

      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }

    useEffect (()=> {
     getProductsData()
    },[])

    useEffect(()=>{
      if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
      }

    },[])

    const value = {
        products, currency, delivery_fee, search, setSearch, showSearch, setShowSearch, cartItems, setCartItems, addToCart, getCartCount,updateQuantity,
        getCartAmount, navigate, backendUrl, setToken, token, theme, toggleTheme, resolvePendingCartAction, getPendingCartAction
    }


    return (
      <ShopContext.Provider value={value}>
         {props.children}
      </ShopContext.Provider>
    )
 }

 export default ShopContextProvider;
