import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const payload = isLogin ? { email, password } : { email, password, name };

        try {
            const response = await fetch(`http://localhost:5001${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/')
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Auth error:', error);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5001/api/auth/google';
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="auth-btn">{isLogin ? 'Login' : 'Sign Up'}</button>
                </form>

                <div className="divider">OR</div>

                <button onClick={handleGoogleLogin} className="google-btn">
                    Continue with Google
                </button>

                <p className="toggle-text">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Sign Up' : 'Login'}</span>
                </p>
            </div>
        </div>
    );
};

export default Login;
