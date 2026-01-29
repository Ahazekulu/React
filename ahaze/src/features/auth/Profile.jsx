import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Settings, ShieldCheck, LogOut, Loader2, ChevronRight, Camera, X, Check, Landmark } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase, uploadMedia } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, profile, loading } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (profile) setEditForm(profile);
    }, [profile]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !user) return;

        try {
            setIsUpdating(true);
            const publicUrl = await uploadMedia(file, 'avatars', user.id);
            const { error } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
            if (error) throw error;
            window.location.reload();
        } catch (err) {
            console.error('Avatar update failed:', err);
            alert('Upload failed');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!user || isUpdating) return;
        setIsUpdating(true);
        try {
            const { error } = await supabase.from('profiles').update({
                first_name: editForm.first_name,
                father_name: editForm.father_name,
                grand_father_name: editForm.grand_father_name,
                gender: editForm.gender,
                region: editForm.region,
                zone: editForm.zone,
                woreda: editForm.woreda,
                kebele: editForm.kebele,
                updated_at: new Date().toISOString()
            }).eq('id', user.id);
            if (error) throw error;
            setIsEditing(false);
        } catch (err) {
            console.error('Update failed:', err);
            alert('Update failed: ' + err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-dark-green" size={48} /></div>;
    if (!user) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300"><User size={40} /></div>
            <div>
                <h2 className="text-xl font-black text-gray-900">Not Logged In</h2>
                <p className="text-sm text-gray-500 font-medium mt-2">Please login to view your profile.</p>
            </div>
            <button onClick={() => navigate('/login')} className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-sm hover:-translate-y-1 transition-all">Go to Login</button>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto py-6 animate-in fade-in duration-700">
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-56 bg-dark-green relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-dark-green to-emerald-900 opacity-50" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 transition-transform duration-1000 group-hover:scale-125" />
                    <div className="absolute -bottom-16 left-8 flex items-end gap-6 z-10">
                        <div className="relative">
                            <div className="w-36 h-36 bg-white rounded-[40px] p-1.5 shadow-2xl relative overflow-hidden">
                                <div className="w-full h-full bg-gray-50 rounded-[32px] flex items-center justify-center text-dark-green overflow-hidden">
                                    {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <User size={80} strokeWidth={1.5} />}
                                </div>
                                {isUpdating && <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm"><Loader2 className="animate-spin text-white" size={24} /></div>}
                            </div>
                            <label className="absolute bottom-2 right-2 w-10 h-10 bg-white shadow-xl rounded-xl flex items-center justify-center text-gray-900 cursor-pointer hover:bg-gray-50 active:scale-90 transition-all z-20">
                                <Camera size={18} /><input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                            </label>
                        </div>
                        <div className="mb-6">
                            <h1 className="text-4xl font-black text-white drop-shadow-lg tracking-tight">{profile?.first_name || 'Citizen'} {profile?.father_name || ''}</h1>
                            <p className="text-emerald-50 font-black flex items-center gap-2 uppercase text-[10px] tracking-[0.2em] mt-2">
                                <ShieldCheck size={16} /> Verified Citizen
                                <span className="w-1 h-1 bg-white/40 rounded-full" />
                                <MapPin size={12} /> {profile?.region || 'Ethiopia'}
                            </p>
                        </div>
                        <div className="mb-6 ml-auto mr-8">
                            {!isEditing ? (
                                <button onClick={() => setIsEditing(true)} className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2.5 rounded-2xl flex items-center gap-2 text-xs font-black hover:bg-white/20 transition-all"><Edit3 size={16} /> Edit Profile</button>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setIsEditing(false)} className="bg-red-500 text-white p-2.5 rounded-2xl shadow-xl active:scale-95 transition-all"><X size={20} /></button>
                                    <button onClick={handleUpdateProfile} disabled={isUpdating} className="bg-white text-dark-green px-8 py-2.5 rounded-2xl flex items-center gap-2 text-xs font-black shadow-xl active:scale-95 transition-all">{isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save Changes</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-24 p-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="md:col-span-2 space-y-12">
                            <section>
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3"><User size={14} className="text-dark-green" /> Identity Details</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                    {isEditing ? (
                                        <>
                                            <EditField label="First Name" name="first_name" value={editForm.first_name} onChange={setEditForm} />
                                            <EditField label="Father Name" name="father_name" value={editForm.father_name} onChange={setEditForm} />
                                            <EditField label="Grand Father Name" name="grand_father_name" value={editForm.grand_father_name} onChange={setEditForm} />
                                            <EditField label="Gender" name="gender" value={editForm.gender} onChange={setEditForm} type="select" options={['male', 'female']} />
                                        </>
                                    ) : (
                                        <>
                                            <InfoItem label="First Name" value={profile?.first_name || '-'} />
                                            <InfoItem label="Father's Name" value={profile?.father_name || '-'} />
                                            <InfoItem label="Grand Father's" value={profile?.grand_father_name || '-'} />
                                            <InfoItem label="Gender" value={profile?.gender || '-'} />
                                        </>
                                    )}
                                    <InfoItem label="Email Account" value={user.email} />
                                    <InfoItem label="Joined ahazeKulu" value={new Date(profile?.created_at).toLocaleDateString()} />
                                </div>
                            </section>
                            <section>
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3"><MapPin size={14} className="text-dark-green" /> Living In</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                    {isEditing ? (
                                        <>
                                            <EditField label="Region" name="region" value={editForm.region} onChange={setEditForm} />
                                            <EditField label="Zone / Subcity" name="zone" value={editForm.zone} onChange={setEditForm} />
                                            <EditField label="Woreda" name="woreda" value={editForm.woreda} onChange={setEditForm} />
                                            <EditField label="Kebele" name="kebele" value={editForm.kebele} onChange={setEditForm} />
                                        </>
                                    ) : (
                                        <>
                                            <InfoItem label="Region" value={profile?.region || '-'} />
                                            <InfoItem label="Zone / Subcity" value={profile?.zone || '-'} />
                                            <InfoItem label="Woreda" value={profile?.woreda || '-'} />
                                            <InfoItem label="Kebele" value={profile?.kebele || '-'} />
                                        </>
                                    )}
                                </div>
                            </section>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2"><Settings size={14} className="text-dark-green" /> Toolbox</h4>
                                <div className="space-y-2">
                                    <ActionButton label="Your Activities" />
                                    <ActionButton label="Saved Connects" />
                                    <ActionButton label="Market Orders" />
                                    <button onClick={handleSignOut} className="w-full text-left p-4 rounded-2xl hover:bg-red-50 text-xs font-black text-red-500 transition-all flex items-center justify-between group">Sign Out<LogOut size={16} className="group-hover:translate-x-1 transition-transform" /></button>
                                </div>
                            </div>
                            <div className="bg-dark-green text-white rounded-[32px] p-8 shadow-xl shadow-dark-green/20">
                                <Landmark className="mb-4 opacity-40" />
                                <h4 className="text-sm font-black mb-2 uppercase tracking-widest">Community Badge</h4>
                                <p className="text-[10px] font-bold text-white/60 leading-relaxed uppercase tracking-widest">You are a recognized citizen of ahazeKulu. Your contributions matter!</p>
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

const EditField = ({ label, name, value, onChange, type = 'text', options = [] }) => (
    <div className="space-y-1.5">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</p>
        {type === 'select' ? (
            <select value={value || ''} onChange={(e) => onChange(prev => ({ ...prev, [name]: e.target.value }))} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-black focus:ring-2 focus:ring-dark-green outline-none">
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        ) : (
            <input type={type} value={value || ''} onChange={(e) => onChange(prev => ({ ...prev, [name]: e.target.value }))} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-black focus:ring-2 focus:ring-dark-green outline-none" />
        )}
    </div>
);

const ActionButton = ({ label }) => (
    <button className="w-full text-left p-4 rounded-xl hover:bg-gray-50 text-xs font-black text-gray-700 transition-all border border-transparent hover:border-gray-100 flex items-center justify-between group">
        {label}<ChevronRight size={14} className="text-gray-300 group-hover:text-dark-green transition-colors" />
    </button>
);

export default Profile;
