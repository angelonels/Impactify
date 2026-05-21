import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const AuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState(null);

    useEffect(() => {
        const code = searchParams.get('code');
        const legacyToken = searchParams.get('token'); // backwards compat during rollout

        const finish = async () => {
            try {
                if (code) {
                    const data = await api.post('/api/auth/exchange', { code }, { auth: false });
                    login(data.token, data.user);
                    navigate('/dashboard');
                    return;
                }
                if (legacyToken) {
                    login(legacyToken, null);
                    navigate('/dashboard');
                    return;
                }
                navigate('/login');
            } catch (e) {
                setError(e.message || 'Login failed');
                setTimeout(() => navigate('/login'), 2000);
            }
        };

        finish();
    }, [searchParams, navigate, login]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            {error ? `Login failed: ${error}` : 'Processing Login…'}
        </div>
    );
};

export default AuthSuccess;
