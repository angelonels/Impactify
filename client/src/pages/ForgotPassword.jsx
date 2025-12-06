import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';

const INPUT_CLASSES = "w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 transition-all";
const BUTTON_CLASSES = "w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 group";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://impactify.onrender.com/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email
                }),
            });

            setIsSubmitted(true);
        } catch (error) {
            console.error('Auth error:', error);
            setIsSubmitted(true);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.6,
                    ease: "easeOut"
                }}
                className="w-full max-w-md p-8 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl relative z-10 mx-4"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        Reset Password
                    </h2>
                    <p className="text-gray-400">
                        Enter your email to receive a reset link
                    </p>
                </div>

                {!isSubmitted ? (
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">
                                Email
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={INPUT_CLASSES}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={BUTTON_CLASSES}
                        >
                            Send Reset Link
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                ) : (
                    <div className="text-center space-y-6">
                        <div className="bg-green-500/10 text-green-400 p-4 rounded-xl border border-green-500/20">
                            <p>
                                If an account exists for <b>{email}</b>, you will receive a password reset link shortly.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="text-gray-400 hover:text-white text-sm transition-colors"
                        >
                            Try another email
                        </button>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <Link
                        to="/login"
                        className="inline-flex items-center text-gray-400 hover:text-white transition-colors gap-2 text-sm group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
