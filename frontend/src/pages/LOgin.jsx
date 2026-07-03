import { useContext, useEffect, useRef, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useLocation } from 'react-router-dom'

const LOgin = () => {

  const [currentState, setCurrentState] = useState('Login')
  const {token, setToken, navigate, backendUrl, resolvePendingCartAction } = useContext(ShopContext)
  const location = useLocation()

  const [name, setName] = useState('')
  const [password, setPassword] = useState('') 
  const [email, setEmail] = useState('') 
  const hasCompletedAuthRedirect = useRef(false)

  const completeLoginFlow = async (authToken) => {
    if (hasCompletedAuthRedirect.current) {
      return
    }

    hasCompletedAuthRedirect.current = true
    const pendingAction = await resolvePendingCartAction(authToken)
    const returnPath = pendingAction?.returnPath || location.state?.from || '/'

    if (pendingAction) {
      toast.success('Item added to cart successfully')
    }

    navigate(returnPath, { replace: true })
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      
          if (currentState === 'Sign Up') {

             const response = await axios.post(backendUrl + '/api/user/register', {name,email,password})
             if (response.data.success){
               setToken(response.data.token)
               localStorage.setItem("token",response.data.token)
               await completeLoginFlow(response.data.token)
             } else {
              toast.error(response.data.message)
             }

          } else{

            const response = await axios.post(backendUrl + '/api/user/login', {email,password})
            if (response.data.success) {
              setToken(response.data.token)
              localStorage.setItem("token",response.data.token)
              await completeLoginFlow(response.data.token)
            } else {
              toast.error(response.data.message)
            }
             
          }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if (token){
        completeLoginFlow(token)
    }
  },[token])

  return (
    <div className="min-h-[70vh] flex items-center justify-center pt-10 text-gray-900 dark:text-gray-100">
      <form 
        onSubmit={onSubmitHandler} 
        className="w-full max-w-md bg-premium-card border-premium rounded-2xl p-8 sm:p-10 shadow-premium animate-fade-in space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="font-serif text-3xl tracking-tight text-gray-900 dark:text-white">
            {currentState}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {currentState === 'Login' ? 'Welcome back! Please enter your details.' : 'Create an account to start shopping.'}
          </p>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          {currentState !== 'Login' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Name</label>
              <input 
                onChange={(e) => setName(e.target.value)} 
                value={name} 
                className="w-full px-4 py-3 rounded-xl border border-premium bg-transparent text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition" 
                type="text" 
                placeholder="John Doe" 
                required 
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email Address</label>
            <input 
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              className="w-full px-4 py-3 rounded-xl border border-premium bg-transparent text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition" 
              type="email" 
              placeholder="john.doe@example.com" 
              required 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Password</label>
            <input 
              onChange={(e) => setPassword(e.target.value)} 
              value={password} 
              className="w-full px-4 py-3 rounded-xl border border-premium bg-transparent text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition" 
              type="password" 
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" 
              required 
            />
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="hover:text-black dark:hover:text-white transition underline underline-offset-4"
            aria-label="Go to forgot password"
          >
            Forgot Password?
          </button>
          {currentState === 'Login' ? (
            <button 
              type="button" 
              onClick={() => setCurrentState('Sign Up')} 
              className="hover:text-black dark:hover:text-white transition font-semibold text-black dark:text-white underline underline-offset-4"
            >
              Create Account
            </button>
          ) : (
            <button 
              type="button" 
              onClick={() => setCurrentState('Login')} 
              className="hover:text-black dark:hover:text-white transition font-semibold text-black dark:text-white underline underline-offset-4"
            >
              Sign In Here
            </button>
          )}
        </div>

        {/* Submit CTA */}
        <div className="pt-2">
          <button 
            type="submit" 
            className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold tracking-wider text-sm py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 uppercase cursor-pointer"
          >
            {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LOgin
