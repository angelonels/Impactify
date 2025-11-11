"use client"
import {useState} from 'react';
import {AiOutlineEye,AiOutlineEyeInvisible} from 'react-icons/ai';
import {MdLock,MdEmail,MdPerson} from 'react-icons/md';
import {FaGoogle,FaGithub} from 'react-icons/fa';

export default function SignUp({onSwitchToLogin}){
  const[showPassword,setShowPassword]=useState(false);
  const[showConfirmPassword,setShowConfirmPassword]=useState(false);
  const[name,setName]=useState('');
  const[email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  const[confirmPassword,setConfirmPassword]=useState('');
  const[agreeToTerms,setAgreeToTerms]=useState(false);

  const handleSubmit=(e)=>{
    e.preventDefault();
    if(password!==confirmPassword){
      alert('Password do not match!');
      return;
    }
    console.log('Sign up attempt:',{name,email,agreeToTerms});
  };


  return(
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:`url('https://images.unsplash.com/photo-1744782211816-c5224434614f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGNoYXJ0c3xlbnwxfHx8fDE3NjI3OTM0MTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
      }}
      />
      <div className='absolute inset-0 bg-slate-900/80 backdrop-blur-sm'/>

      <div className='relative  w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-8'>
        <div className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create an account</h1>
          <p className="text-slate-600">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor='name' className="block text-slate-900">
                Full Name
              </label>
              <div className='relative'>
              <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/>
              <input 
                id='name'
                type='text'
                placeholder='Enter your full name'
                value={name}
                onChange={(e)=>setName(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
              </div>
            </div>

            <div className='space-y-2'>
              <label htmlFor='email' className='block test-slate-900'>
                Email
              </label>
              <div className='relative'>
              <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/>
              <input
              id='email'
              type="email"
              placeholder='Enter your email'
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full h-10 pl-10 pr-4 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
              />

              </div>
            </div>

            <div className='space-y-2'>
              <label htmlFor='password' className='block text-slate-900'>
                Password
              </label>
              <div className='relative'>
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/>
                <input
                  id="password"
                  type={showPassword?'text':'password'}
                  placeholder="Create a password"
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
            

              <div className='space-y-2'>
                <label htmlFor='confirmPassword' className='block text-slate-900'>
                  Confirm Password
                </label>
                <div className='relative'>
                  <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword?'text':'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                    className="w-full h-10 pl-10 pr-10 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                    />
                    <button
                    type="button"
                    onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword?
                      (<AiOutlineEyeInvisible className="w-5 h-5"/>):
                      (<AiOutlineEye className='w-5 h-5'/>

                      )}

                    </button>
                  </div>
                </div>

              </div>
            
            <div  className="flex items-start space-x-2">
              <input
              id="terms"
              type='checkbox'
              checked={agreeToTerms}
              
              onChange={(e)=>setAgreeToTerms(e.target.checked)}
              className="w-4 h-4 mt-1 border-slate-300 rounded text-indigo-600 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              required

              />
              <label 
              htmlFor="terms"
              className="text-slate-700 cursor-pointer select-none">
                I agree to the{' '}
                <a href='#' className="text-indigo-600 hover:text-indigo-700">Terms and Conditions</a>
                {' '}
                and{' '}
                <a href='#' className='text-indigo-600 hover:text-indigo-700'>Privacy Policy</a>
              </label>

          </div>


          <button
          type='submit'
          className="w-full h-10 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center">
            Sign up
          </button>

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
            Already have an account? {' '}
            <button
            onClick={onSwitchToLogin}
            className="text-indigo-600 hover:text-indigo-700 transition-colors"
            >Login</button>
          </p>

      </div>
    
    </div>

  );




}

