import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Landmark, ArrowLeft, Mail, Lock, Phone } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        identifier: '', // Email or Mobile
        password: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Handle both email and mobile-based identifier
            let authEmail = formData.identifier;
            if (!authEmail.includes('@')) {
                authEmail = `${formData.identifier.replace(/\s+/g, '')}@ahazekulu.com`;
            }

            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: authEmail,
                password: formData.password
            });

            if (authError) throw authError;

            console.log('Login successful:', data.user);
            navigate('/');
        } catch (err) {
            setError(err.message === 'Invalid login credentials' ? 'Login failed. Please check your credentials.' : err.message);
            console.error('Login Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-10 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-dark-green p-8 text-white text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full text-dark-green mb-4 shadow-lg">
                        <Landmark size={32} />
                    </div>
                    <h1 className="text-2xl font-bold">ahazeKulu Login</h1>
                    <p className="text-white/80 text-sm mt-2">Connect with your community</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mobile Number or Email</label>
                            <div className="relative">
                                <input
                                    required
                                    name="identifier"
                                    value={formData.identifier}
                                    onChange={handleChange}
                                    className="w-full border-gray-200 rounded-lg p-3 pl-10 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-dark-green transition-all"
                                    placeholder="Enter your email or phone"
                                />
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase">Password</label>
                                <Link to="/forgot-password" size="sm" className="text-[10px] font-bold text-light-blue hover:underline uppercase">Forgot Password?</Link>
                            </div>
                            <div className="relative">
                                <input
                                    required
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full border-gray-200 rounded-lg p-3 pl-10 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-dark-green transition-all"
                                    placeholder="••••••••"
                                />
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-dark-green text-white py-3 rounded-xl font-bold hover:bg-dark-green/90 transition-all shadow-lg shadow-dark-green/20"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <div className="flex flex-col items-center gap-3 pt-2">
                        <p className="text-sm text-gray-500">
                            New to ahazeKulu? <Link to="/signup" className="text-light-blue font-bold hover:underline">Create an account</Link>
                        </p>
                        <div className="w-full flex items-center gap-4 py-2">
                            <div className="flex-1 h-px bg-gray-100" />
                            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">OR</span>
                            <div className="flex-1 h-px bg-gray-100" />
                        </div>
                        <Link to="/" className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors font-medium">
                            <ArrowLeft size={14} /> Back to Landing Page
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
