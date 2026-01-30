import React, { useState, useEffect } from 'react';
import { Landmark, Search, Filter, PlusCircle, Star, MapPin, Globe, Phone, Mail, Clock, Briefcase, GraduationCap, Building, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

const Organizations = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('browse');
    const [selectedIndustry, setSelectedIndustry] = useState('All');

    const tabs = [
        { id: 'browse', label: 'Browse', icon: <Search size={16} /> },
        { id: 'register', label: 'Register', icon: <PlusCircle size={16} /> },
        { id: 'office', label: 'Your Office', icon: <Briefcase size={16} /> },
        { id: 'favorites', label: 'Favorites', icon: <Star size={16} /> },
        { id: 'around', label: 'Around You', icon: <MapPin size={16} /> },
    ];

    const sidebarOptions = {
        Ownership: ['Government', 'Religious', 'Private'],
        Industry: ['Finance', 'Agriculture', 'Manufacturing', 'Service', 'Mining', 'Internet'],
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-700">
            {/* Sidebar */}
            <aside className="w-full lg:w-72 flex flex-col gap-8">
                <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
                    <h3 className="text-[10px] font-black uppercase text-gray-400 mb-6 tracking-[0.2em]">Directory Filters</h3>

                    <div className="space-y-8">
                        <div>
                            <p className="text-xs font-black text-gray-900 mb-4 flex items-center gap-2">
                                <Briefcase size={14} className="text-dark-green" /> Industries
                            </p>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setSelectedIndustry('All')}
                                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${selectedIndustry === 'All' ? 'bg-gray-100 text-dark-green' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    All Industries
                                </button>
                                {sidebarOptions.Industry.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setSelectedIndustry(opt)}
                                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${selectedIndustry === opt ? 'bg-gray-100 text-dark-green' : 'text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-black text-gray-900 mb-4 flex items-center gap-2">
                                <Building size={14} className="text-dark-green" /> Ownership
                            </p>
                            <div className="space-y-2">
                                {sidebarOptions.Ownership.map(opt => (
                                    <button key={opt} className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all flex items-center justify-between group">
                                        <span>{opt}</span>
                                        <span className="text-[10px] text-gray-300 opacity-0 group-hover:opacity-100">8+</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-6">
                {/* Tabs Header */}
                <div className="bg-white rounded-[32px] p-4 shadow-sm border border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap active:scale-95 ${activeTab === tab.id
                                ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/10 -translate-y-1'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex-1">
                    {activeTab === 'browse' && <BrowseTab industry={selectedIndustry} />}
                    {activeTab === 'register' && <RegisterTab onSuccess={() => setActiveTab('browse')} />}
                    {activeTab === 'office' && <div className="py-20 text-center text-gray-400 bg-white rounded-[40px] border-2 border-dashed border-gray-100 italic text-sm font-medium">You haven't registered any office yet.</div>}
                    {activeTab === 'favorites' && <div className="py-20 text-center text-gray-400 bg-white rounded-[40px] border-2 border-dashed border-gray-100 italic text-sm font-medium">No favorite organizations found.</div>}
                    {activeTab === 'around' && <div className="py-20 text-center text-gray-400 bg-white rounded-[40px] border-2 border-dashed border-gray-100 italic text-sm font-medium">Searching for organizations in your local area...</div>}
                </div>
            </div>
        </div>
    );
};

const BrowseTab = ({ industry }) => {
    const [orgs, setOrgs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrgs();
    }, [industry]);

    const fetchOrgs = async () => {
        setLoading(true);
        try {
            let query = supabase.from('organizations').select('*');
            if (industry !== 'All') {
                query = query.eq('industry', industry);
            }
            const { data, error } = await query.order('name');
            if (error) throw error;
            setOrgs(data || []);
        } catch (err) {
            console.error('Error fetching orgs:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-gray-900" size={40} />
        </div>
    );

    if (orgs.length === 0) return (
        <div className="py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100 italic text-gray-400 text-sm font-medium">
            No organizations found matching your filters.
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95 duration-700">
            {orgs.map((org) => (
                <div key={org.id} className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 group hover:shadow-2xl transition-all flex flex-col">
                    <div className="flex items-start justify-between mb-6">
                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-all text-gray-400">
                            {org.industry === 'Finance' ? <Building size={24} /> : org.industry === 'Service' ? <GraduationCap size={24} /> : <Landmark size={24} />}
                        </div>
                        <div className="flex gap-2">
                            <span className="text-[9px] bg-gray-50 text-gray-400 px-3 py-1.5 rounded-full font-black uppercase tracking-widest">{org.type}</span>
                            <span className="text-[9px] bg-dark-green/5 text-dark-green px-3 py-1.5 rounded-full font-black uppercase tracking-widest">{org.industry}</span>
                        </div>
                    </div>
                    <h4 className="text-xl font-black text-gray-900 group-hover:text-dark-green transition-colors mb-2 leading-tight">{org.name}</h4>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-8 leading-relaxed font-medium">
                        {org.description || 'No description provided.'}
                    </p>
                    <div className="mt-auto space-y-4 pt-6 border-t border-gray-50">
                        <div className="flex items-center gap-3 text-xs text-gray-400 font-bold uppercase tracking-widest">
                            <MapPin size={14} className="text-dark-green" /> {org.address_region}, {org.address_zone}
                        </div>
                        <div className="flex items-center gap-4 pt-2">
                            <button className="flex-1 bg-dark-green text-white py-3.5 rounded-2xl text-xs font-black shadow-xl shadow-dark-green/10 hover:bg-emerald-800 hover:-translate-y-1 transition-all">Visit Profile</button>
                            <button className="p-3 bg-gray-50 text-gray-300 hover:text-accent-yellow rounded-xl transition-all hover:scale-110"><Star size={20} /></button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
const uploadMedia = async (file, bucket, userId) => {
    try {
        // Create a unique file path: e.g., "orgs/123-1706600000-logo.png"
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (error) throw error;

        // Get the Public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

const RegisterTab = ({ onSuccess }) => {
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [logo, setLogo] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        industry: 'Service',
        type: 'Private',
        description: '',
        address_region: '',
        address_zone: '',
        address_woreda: '',
        address_kebele: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || isSubmitting) return;
        setIsSubmitting(true);

        try {
            let logoUrl = null;
            if (logo) {
                logoUrl = await uploadMedia(logo.file, 'orgs', user.id);
            }

            const { error } = await supabase
                .from('organizations')
                .insert([{
                    creator_id: user.id,
                    owner_id: user.id, // For backward compatibility if both exist
                    ...formData,
                    logo_url: logoUrl
                }]);

            if (error) throw error;
            alert('Organization registered successfully!');
            onSuccess();
        } catch (err) {
            console.error('Error registering organization:', err);
            alert('Error: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 max-w-4xl mx-auto animate-in slide-in-from-bottom-6">
            <h3 className="text-2xl font-black text-gray-900 mb-8">Register Your Organization</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="md:col-span-2 flex items-center gap-6 p-6 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center border border-gray-100 overflow-hidden text-gray-300">
                        {logo ? <img src={logo.url} className="w-full h-full object-cover" /> : <Landmark size={40} />}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-black text-gray-900 mb-1">Organization Logo</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">PNG, JPG up to 5MB</p>
                        <label className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-black transition-all">
                            Upload Logo
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) setLogo({ file, url: URL.createObjectURL(file) });
                            }} />
                        </label>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Company Name *</label>
                        <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-dark-green outline-none" placeholder="e.g. ahazeKulu Tech" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Industry</label>
                        <select name="industry" value={formData.industry} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-dark-green outline-none">
                            <option>Service</option>
                            <option>Finance</option>
                            <option>Manufacturing</option>
                            <option>Education</option>
                            <option>Health</option>
                            <option>Agriculture</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Organization Type</label>
                        <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-dark-green outline-none">
                            <option>Private</option>
                            <option>Government</option>
                            <option>Non-Profit (NGO)</option>
                            <option>Share Company</option>
                            <option>PLC</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Region</label>
                        <input required name="address_region" value={formData.address_region} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-dark-green outline-none" placeholder="e.g. Oromia" />
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-dark-green outline-none min-h-[120px] resize-none" placeholder="Tell us what your organization does..." />
                </div>

                <div className="grid grid-cols-3 gap-4 md:col-span-2">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Zone</label>
                        <input required name="address_zone" value={formData.address_zone} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-dark-green outline-none" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Woreda</label>
                        <input required name="address_woreda" value={formData.address_woreda} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-dark-green outline-none" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Kebele</label>
                        <input required name="address_kebele" value={formData.address_kebele} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-dark-green outline-none" />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-dark-green text-white py-5 rounded-[24px] font-black text-lg shadow-2xl shadow-dark-green/30 hover:-translate-y-1 active:translate-y-0 transition-all uppercase tracking-widest flex items-center justify-center gap-3"
            >
                {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <PlusCircle size={24} />}
                {isSubmitting ? 'Registering...' : 'Complete Registration'}
            </button>
        </form>
    );
};

export default Organizations;
