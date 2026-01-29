import React from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Settings, ShieldCheck, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, profile, loading } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <Loader2 className="animate-spin text-dark-green" size={48} />
        </div>
    );

    if (!user) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300">
                    <User size={40} />
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-black text-gray-900">Not Logged In</h2>
                    <p className="text-sm text-gray-500 font-medium mt-2">Please login to view your profile.</p>
                </div>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-sm hover:-translate-y-1 transition-all"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-6 animate-in fade-in duration-700">
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                {/* Profile Header */}
                <div className="h-56 bg-dark-green relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-dark-green to-emerald-900 opacity-50" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 transition-transform duration-1000 group-hover:scale-125" />

                    <div className="absolute -bottom-16 left-8 flex items-end gap-6 z-10">
                        <div className="w-36 h-36 bg-white rounded-[40px] p-1.5 shadow-2xl">
                            <div className="w-full h-full bg-gray-50 rounded-[32px] flex items-center justify-center text-dark-green overflow-hidden">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={80} strokeWidth={1.5} />
                                )}
                            </div>
                        </div>
                        <div className="mb-6">
                            <h1 className="text-4xl font-black text-white drop-shadow-lg tracking-tight">
                                {profile?.first_name || 'Citizen'} {profile?.father_name || ''}
                            </h1>
                            <p className="text-emerald-50 font-black flex items-center gap-2 uppercase text-[10px] tracking-[0.2em] mt-2">
                                <ShieldCheck size={16} /> Verified Citizen
                            </p>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="pt-24 p-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-12">
                        <section>
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                                <User size={14} className="text-dark-green" /> Identity Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                <InfoItem label="First Name" value={profile?.first_name || '-'} />
                                <InfoItem label="Father's Name" value={profile?.father_name || '-'} />
                                <InfoItem label="Gender" value={profile?.gender || '-'} />
                                <InfoItem label="Member Type" value="Citizen" />
                                <InfoItem label="Email Address" value={user.email} />
                                <InfoItem label="Mobile Number" value={profile?.mobile || '-'} />
                            </div>
                        </section>

                        <section className="bg-gray-50 rounded-[32px] p-8 border border-gray-100">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Security & Account</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-black text-gray-900">Account Security</p>
                                    <p className="text-xs text-gray-500 font-medium mt-1">Manage your password and authentication methods</p>
                                </div>
                                <button className="bg-white px-6 py-2.5 rounded-xl text-xs font-black text-dark-green border border-gray-200 hover:bg-dark-green hover:text-white hover:border-dark-green transition-all shadow-sm">Update</button>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Settings size={14} className="text-dark-green" /> Toolbox
                            </h4>
                            <div className="space-y-2">
                                <ActionButton label="Your Activities" />
                                <ActionButton label="Saved Connects" />
                                <ActionButton label="Market Orders" />
                                <button
                                    onClick={handleSignOut}
                                    className="w-full text-left p-4 rounded-2xl hover:bg-red-50 text-xs font-black text-red-500 transition-all flex items-center justify-between group"
                                >
                                    Sign Out
                                    <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({ label, value }) => (
    <div className="space-y-1.5">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-base font-black text-gray-800">{value}</p>
    </div>
);

const ActionButton = ({ label }) => (
    <button className="w-full text-left p-4 rounded-xl hover:bg-gray-50 text-xs font-black text-gray-700 transition-all border border-transparent hover:border-gray-100 flex items-center justify-between group">
        {label}
        <ChevronRight size={14} className="text-gray-300 group-hover:text-dark-green transition-colors" />
    </button>
);

export default Profile;
