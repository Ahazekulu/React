import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Landmark, ArrowLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import placesData from '../../data/places.json';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        fatherName: '',
        grandFatherName: '',
        email: '',
        mobileNumber: '',
        gender: 'male',
        country: 'Ethiopia',
        region: '',
        zone: '',
        woreda: '',
        kebele: '',
        mender: '',
        building: '',
        password: '',
        confirmPassword: '',
        securityQuestion: '',
        securityHint: '',
        suggestion: ''
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Dynamic Address Lists
    const regions = useMemo(() => [...new Set(placesData.map(p => p["Level 2"]))].sort(), []);

    const zones = useMemo(() => {
        if (!formData.region) return [];
        return [...new Set(placesData.filter(p => p["Level 2"] === formData.region).map(p => p["Level 3"]))].sort();
    }, [formData.region]);

    const woredas = useMemo(() => {
        if (!formData.region || !formData.zone) return [];
        return [...new Set(placesData.filter(p => p["Level 2"] === formData.region && p["Level 3"] === formData.zone).map(p => p["Level 4"]))].sort();
    }, [formData.region, formData.zone]);

    const kebeles = useMemo(() => {
        if (!formData.region || !formData.zone || !formData.woreda) return [];
        return [...new Set(placesData.filter(p => p["Level 2"] === formData.region && p["Level 3"] === formData.zone && p["Level 4"] === formData.woreda).map(p => p["Level 5"]))].sort();
    }, [formData.region, formData.zone, formData.woreda]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const update = { ...prev, [name]: value };
            // Reset dependent fields
            if (name === 'region') { update.zone = ''; update.woreda = ''; update.kebele = ''; }
            if (name === 'zone') { update.woreda = ''; update.kebele = ''; }
            if (name === 'woreda') { update.kebele = ''; }
            return update;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            // 1. Signup in Supabase Auth
            // Note: Since ahazeKulu uses Mobile Number, but Supabase Auth defaults to Email,
            // we use the email if provided, or fallback to mobile-based email placeholder.
            const authEmail = formData.email || `${formData.mobileNumber}@ahazekulu.com`;

            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: authEmail,
                password: formData.password,
                options: {
                    data: {
                        first_name: formData.firstName,
                        mobile: formData.mobileNumber
                    }
                }
            });

            if (authError) throw authError;

            if (authData.user) {
                // 2. Create Profile in 'profiles' table
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: authData.user.id,
                        first_name: formData.firstName,
                        father_name: formData.fatherName,
                        grand_father_name: formData.grandFatherName,
                        mobile_number: formData.mobileNumber,
                        gender: formData.gender,
                        region: formData.region,
                        zone: formData.zone,
                        woreda: formData.woreda,
                        kebele: formData.kebele,
                        updated_at: new Date().toISOString(),
                    });

                if (profileError) throw profileError;

                console.log('Signup Successful:', authData.user);
                alert('Success! Please check your email to verify your account.');
                navigate('/login');
            }

        } catch (err) {
            setError(err.message);
            console.error('Signup Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-dark-green p-8 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <Link to="/" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-dark-green">
                            <Landmark size={24} />
                        </Link>
                        <h1 className="text-2xl font-bold">Welcome to ahazeKulu</h1>
                    </div>
                    <p className="text-white/80">Please read our Terms of Service before signing up.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

                    {/* Basic Info */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">First Name *</label>
                                <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full border-gray-200 rounded-lg p-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-dark-green transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Father Name *</label>
                                <input required name="fatherName" value={formData.fatherName} onChange={handleChange} className="w-full border-gray-200 rounded-lg p-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-dark-green transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Grand Father Name *</label>
                                <input required name="grandFatherName" value={formData.grandFatherName} onChange={handleChange} className="w-full border-gray-200 rounded-lg p-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-dark-green transition-all" />
                            </div>
                        </div>
                    </section>

                    {/* Contact & Gender */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mobile Number *</label>
                            <input required type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="w-full border-gray-200 rounded-lg p-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-dark-green transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email (Optional)</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border-gray-200 rounded-lg p-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-dark-green transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border-gray-200 rounded-lg p-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-dark-green transition-all">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </section>

                    {/* Address */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Preferred Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Country</label>
                                <input readOnly value="Ethiopia" className="w-full border-gray-200 rounded-lg p-2 bg-gray-100 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Region | City *</label>
                                <select required name="region" value={formData.region} onChange={handleChange} className="w-full border-gray-200 rounded-lg p-2 bg-gray-50">
                                    <option value="">Select Region</option>
                                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Zone | Subcity *</label>
                                <select required name="zone" value={formData.zone} onChange={handleChange} className="w-full border-gray-200 rounded-lg p-2 bg-gray-50" disabled={!formData.region}>
                                    <option value="">Select Zone</option>
                                    {zones.map(z => <option key={z} value={z}>{z}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Woreda *</label>
                                <select required name="woreda" value={formData.woreda} onChange={handleChange} className="w-full border-gray-200 rounded-lg p-2 bg-gray-50" disabled={!formData.zone}>
                                    <option value="">Select Woreda</option>
                                    {woredas.map(w => <option key={w} value={w}>{w}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kebele *</label>
                                <select required name="kebele" value={formData.kebele} onChange={handleChange} className="w-full border-gray-200 rounded-lg p-2 bg-gray-50" disabled={!formData.woreda}>
                                    <option value="">Select Kebele</option>
                                    {kebeles.map(k => <option key={k} value={k}>{k}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mender (Optional)</label>
                                <input name="mender" value={formData.mender} onChange={handleChange} className="w-full border-gray-200 rounded-lg p-2 bg-gray-50" />
                            </div>
                        </div>
                    </section>

                    {/* Security */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Security</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password *</label>
                                <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full border-gray-200 rounded-lg p-2 bg-gray-50" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Confirm Password *</label>
                                <input required type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full border-gray-200 rounded-lg p-2 bg-gray-50" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                                    Security Question <HelpCircle size={14} className="text-gray-400" />
                                </label>
                                <input required name="securityQuestion" placeholder="e.g. Your first car?" value={formData.securityQuestion} onChange={handleChange} className="w-full border-gray-200 rounded-lg p-2 bg-gray-50" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Security Hint</label>
                                <input name="securityHint" value={formData.securityHint} onChange={handleChange} className="w-full border-gray-200 rounded-lg p-2 bg-gray-50" />
                            </div>
                        </div>
                    </section>

                    {/* Finish */}
                    <div className="pt-4 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Suggestions (Optional)</label>
                            <textarea name="suggestion" value={formData.suggestion} onChange={handleChange} rows="3" className="w-full border-gray-200 rounded-lg p-2 bg-gray-50" />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-dark-green text-white py-3 rounded-xl font-bold hover:bg-dark-green/90 transition-all shadow-lg shadow-dark-green/20"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up Now'}
                        </button>

                        <div className="flex flex-col items-center gap-2 text-sm">
                            <p className="text-gray-500">
                                Already have an account? <Link to="/login" className="text-light-blue font-bold hover:underline">Login here</Link>
                            </p>
                            <Link to="/" className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors">
                                <ArrowLeft size={14} /> Back to Landing Page
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
