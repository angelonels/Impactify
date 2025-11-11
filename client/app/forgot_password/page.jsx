'use client';
import {useState} from 'react';
import {MdEmail} from 'react-icons/md';

export default function ForgotPassword(){
    const[email,setEmail]=useState('');
    const[isSubmitted,setIsSubmitted]=useState(false);

    const handleSubmit=(e)=>{
        e.preventDefault();
        console.log("Password reset requested for:",email);
        setIsSubmitted(true);
    };

    if(isSubmitted){
        
        return(
            <div className="min-h-screen flex items-center justify-center p-4 relative">
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{backgroundImage: `url('https://images.unsplash.com/photo-1744782211816-c5224434614f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGNoYXJ0c3xlbnwxfHx8fDE3NjI3OTM0MTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`                  
                }}
                />
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"/>
                <div className='relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6 text-center'>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
                    </div>  
                    <h1 className="text-2xl font-bold text-slate-900">Check Your Email</h1>
                    <p className='text-slate-600'>
                        we have sent a password reset link to <br/>
                        <span className="font-medium text-slate-900">{email}</span>
                    </p>
                    <button
                    onClick={()=>setIsSubmitted(false)}
                    className='w-full h-10 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center'
                    >Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen flex items-center justify-center p-4 relative'>
            <div
            className='absolute inset-0 bg-cover bg-center bg-no-repeat'
            style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1744782211816-c5224434614f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGNoYXJ0c3xlbnwxfHx8fDE3NjI3OTM0MTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
            }}/>
            <div className='absolute inset-0 bg-slate-900/80 backdrop-blur-sm'/>
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
                <div className='space-y-2 text-center'>
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl"/>
                    </div>
                    <h1 className='text-2xl font-bold text-slate-900'>Reset Your Password</h1>
                    <p  className="text-slate-600">
                        Enter your email to receive a reset link</p>
                </div>

                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <label htmlFor="email" className="block text-slate-900"
                            >Email Address</label>
                            <div className='relative'>
                                <MdEmail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400'
                                />
                                <input
                                id='email'
                                type='email'
                                placeholder='Enter your email'
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                className='w-full h-10 pl-10 pr-4 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
                                required
                                />
                            </div>
                        </div>
                    </div>


                    <button
                    type='submit'
                    className="w-full h-10 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
                    >Send Reset Link</button>

                    <div className='text-center'>
                        <a
                        href='/login'
                        className='text-indigo-600 hover:text-indigo-700 transition-colors inline-flex items-center'
                        >← Back to Login</a>
                    </div>

                </form>
            </div>
        </div>
    );
}