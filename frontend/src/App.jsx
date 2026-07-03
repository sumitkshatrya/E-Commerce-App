import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import LOgin from './pages/LOgin'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import ScrollToTop from './components/ScrollToTop'
import SupportAssistant from './components/SupportAssistant'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Verify from './pages/Verify'
import { useContext } from 'react'
import { ShopContext } from './context/ShopContext'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'


const App = () => {
  const { theme } = useContext(ShopContext)

  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === 'dark' ? 'dark' : 'light'}
        toastClassName="!font-sans !text-sm !rounded-xl !shadow-lg"
      />
      <ScrollToTop />
      <Navbar />
      <SearchBar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LOgin />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </main>
      <Footer />
      <SupportAssistant />
    </div>
  )
}

export default App
