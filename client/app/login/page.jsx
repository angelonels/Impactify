"use client"
import {useState} from 'react';
import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai';
import {MdLock,MdEmail} from 'react-icons/md';
import {FaGoogle,FaGithub} from 'react-icons/fa';

export default function Login(){
  const[showPassword,setShowPassword]=useState(false);
  const[email,setEmail] =useState('');
  const[password,setPassword]=useState('');
  const[rememberMe,setRememberMe]=useState(false);

  const handleSubmit=(e)=>{
    e.preventDefault();
    console.log('Login attempt:', {email,rememberMe});
  };

  return(
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:`url('https://images.unsplash.com/photo-1744782211816-c5224434614f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGNoYXJ0c3xlbnwxfHx8fDE3NjI3OTM0MTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
        }
      }
        />
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"/>

        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-8">
          <div className="space-y-2 text-center">
            <div className= "flex items-center justify-center gap-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back!</h1>
            <p className="text-slate-600">Enter your credentials to access your account</p>
          </div>


          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-slate-900">
                  Email
                  </label>
                <div className="relative">
                  <MdEmail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400'/>
                  <input
                  id="email"
                  type='email'
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                  />
                </div>
              </div>
              

              <div className='space-y-2'>
                <label htmlFor="password" className="block text-slate-900">
                  Password
                  </label>
                <div className='relative'>
                  <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/>
                  <input
                  id="password"
                  type={showPassword?'text':'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  className="w-full h-10 pl-10 pr-10 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                  />
                  <button
                  type="button"
                  onClick={()=>setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword?
                    (<AiOutlineEyeInvisible className="w-5 h-5"/>):
                    (<AiOutlineEye className='w-5 h-5'/>

                    )}

                  </button>
                </div>
              </div>
            </div>


            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e)=>setRememberMe(e.target.checked)}
                className="w-4 h-4 border-slate-300 rounded text-indigo-600 focus:ring-2 focus:ring-indigo-500 cursor-pointer"

                />
                <label
                htmlFor="remember"
                className="text-slate-700 cursor-pointer select-none"
                >
                  Remember me
                  </label>
              </div>
              <a href="#" className="text-indigo-600 hover:text-indigo-700 transition-colors">
                Forgot password?
                </a>
            </div>

            <button
              type="submit"
              className="w-full h-10 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >Sign in</button>



            <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"/>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-slate-500">Or continue with</span>
            </div>
            </div>



            <div className="grid grid-cols-2 gap-4">
              <button
              type="button"
              className="h-10 flex items-center justify-center border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
              >
                <FaGoogle className="w-5 h-5 mr-2 text-slate-600" />
                Google
              
              </button>

              <button
              type='button'
              className="h-10 flex items-center justify-center border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
              >
                <FaGithub className="w-5 h-5 mr-2 text-slate-600"/>
                Github
              </button>
            </div>
          </form>


          <p className='text-center text-slate-600'>
            Don't have an account? {' '}
            <a href='#' className="text-indigo-600 hover:text-indigo-700 transition-colors">
              Sign up
            </a>
          </p>

        </div>
        
    </div>
  );
}