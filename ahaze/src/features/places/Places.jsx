import React, { useState, useMemo, useEffect } from 'react';
import { MapPin, Info, Image as ImageIcon, MessageSquare, ShoppingBag, Landmark, Users, TrendingUp, History, Map as MapIcon, ChevronRight, Search, Camera, Video, Calendar, Star, ShieldCheck, UserPlus, Heart, Share2, X, Loader2, Zap, Building2, Globe, Upload, Clock } from 'lucide-react';
import { supabase, uploadMedia } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import placesData from '../../data/places.json';

const Places = () => {
    const { user, profile } = useAuth();
    const [activeTab, setActiveTab] = useState('know');
    const [selectedLevels, setSelectedLevels] = useState({
        region: 'Addis Ababa',
        zone: 'Bole',
        woreda: 'Woreda 03',
        kebele: 'Kebele 12'
    });

    const displayPlace = selectedLevels.kebele || selectedLevels.woreda || selectedLevels.zone || selectedLevels.region || "Ethiopia";

    const regions = useMemo(() => [...new Set(placesData.map(p => p["Level 2"]))].sort(), []);
    const zones = useMemo(() => selectedLevels.region ? [...new Set(placesData.filter(p => p["Level 2"] === selectedLevels.region).map(p => p["Level 3"]))].sort() : [], [selectedLevels.region]);
    const woredas = useMemo(() => (selectedLevels.region && selectedLevels.zone) ? [...new Set(placesData.filter(p => p["Level 2"] === selectedLevels.region && p["Level 3"] === selectedLevels.zone).map(p => p["Level 4"]))].sort() : [], [selectedLevels.region, selectedLevels.zone]);
    const kebeles = useMemo(() => (selectedLevels.region && selectedLevels.zone && selectedLevels.woreda) ? [...new Set(placesData.filter(p => p["Level 2"] === selectedLevels.region && p["Level 3"] === selectedLevels.zone && p["Level 4"] === selectedLevels.woreda).map(p => p["Level 5"]))].sort() : [], [selectedLevels.region, selectedLevels.zone, selectedLevels.woreda]);

    const handleLevelChange = (level, value) => {
        setSelectedLevels(prev => {
            const update = { ...prev, [level]: value };
            if (level === 'region') { update.zone = ''; update.woreda = ''; update.kebele = ''; }
            if (level === 'zone') { update.woreda = ''; update.kebele = ''; }
            if (level === 'woreda') { update.kebele = ''; }
            return update;
        });
    };

    const tabs = [
        { id: 'know', label: 'Know', icon: <Info size={16} /> },
        { id: 'map', label: 'Map', icon: <MapIcon size={16} /> },
        { id: 'post', label: 'Post', icon: <MessageSquare size={16} /> },
        { id: 'latest', label: 'Latest', icon: <Zap size={16} /> },
        { id: 'kulu', label: 'At ahazeKulu', icon: <Landmark size={16} /> },
        { id: 'market', label: 'Market', icon: <ShoppingBag size={16} /> },
        { id: 'orgs', label: 'Organizations', icon: <Building2 size={16} /> },
        { id: 'events', label: 'Events', icon: <Calendar size={16} /> },
        { id: 'agents', label: 'Our Agents', icon: <Users size={16} /> },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-dark-green mb-1">
                            <MapPin size={18} />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">Exploring Locally</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">{displayPlace}</h1>
                        <p className="text-gray-500 text-sm font-medium flex items-center gap-1 mt-2">
                            Ethiopia <ChevronRight size={14} className="text-gray-300" /> {selectedLevels.region}
                            {selectedLevels.zone && <><ChevronRight size={14} className="text-gray-300" /> {selectedLevels.zone}</>}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Region</span>
                            <select value={selectedLevels.region} onChange={(e) => handleLevelChange('region', e.target.value)} className="bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3 text-xs font-black text-gray-700 outline-none focus:bg-white focus:border-dark-green transition-all">
                                <option value="">Select Region</option>
                                {regions.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{selectedLevels.region === 'Addis Ababa' ? 'Subcity' : 'Zone'}</span>
                            <select value={selectedLevels.zone} onChange={(e) => handleLevelChange('zone', e.target.value)} className="bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3 text-xs font-black text-gray-700 outline-none focus:bg-white focus:border-dark-green transition-all" disabled={!selectedLevels.region}>
                                <option value="">Select {selectedLevels.region === 'Addis Ababa' ? 'Subcity' : 'Zone'}</option>
                                {zones.map(z => <option key={z} value={z}>{z}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Woreda</span>
                            <select value={selectedLevels.woreda} onChange={(e) => handleLevelChange('woreda', e.target.value)} className="bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3 text-xs font-black text-gray-700 outline-none focus:bg-white focus:border-dark-green transition-all" disabled={!selectedLevels.zone}>
                                <option value="">Select Woreda</option>
                                {woredas.map(w => <option key={w} value={w}>{w}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kebele</span>
                            <select value={selectedLevels.kebele} onChange={(e) => handleLevelChange('kebele', e.target.value)} className="bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3 text-xs font-black text-gray-700 outline-none focus:bg-white focus:border-dark-green transition-all" disabled={!selectedLevels.woreda}>
                                <option value="">Select Kebele</option>
                                {kebeles.map(k => <option key={k} value={k}>{k}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-gray-100 pt-6">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-8 py-4 rounded-2xl text-xs font-black transition-all whitespace-nowrap active:scale-95 ${activeTab === tab.id ? 'bg-dark-green text-white shadow-xl shadow-dark-green/20 -translate-y-1' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'know' && <KnowTab placeName={displayPlace} location={selectedLevels} />}
                {activeTab === 'map' && <MapTab place={displayPlace} />}
                {activeTab === 'post' && <PostTab place={displayPlace} location={selectedLevels} user={user} profile={profile} />}
                {activeTab === 'latest' && <PlaceholderTab name="Latest (Weather, Security, Traffic)" />}
                {activeTab === 'kulu' && <PlaceholderTab name="At ahazeKulu (Users, Orgs, Products)" />}
                {activeTab === 'market' && <PlaceholderTab name="Local Market" />}
                {activeTab === 'orgs' && <PlaceholderTab name="Organizations" />}
                {activeTab === 'events' && <EventsTab place={displayPlace} />}
                {activeTab === 'agents' && <AgentsTab place={displayPlace} />}
            </div>
        </div>
    );
};

/* Sub-components */

const KnowTab = ({ placeName, location }) => {
    const [placeInfo, setPlaceInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (placeName) fetchPlaceInfo();
    }, [placeName]);

    const fetchPlaceInfo = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('places').select('*').eq('name', placeName).maybeSingle();
            if (error) throw error;
            setPlaceInfo(data);
        } catch (err) {
            console.error('Error fetching place info:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-dark-green" size={40} /></div>;

    const parentStructures = [
        { label: 'Region', value: location.region },
        { label: 'Zone', value: location.zone || 'N/A' },
        { label: 'Woreda', value: location.woreda || 'N/A' },
        { label: 'Kebele', value: location.kebele || 'N/A' },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
            <div className="lg:col-span-2 space-y-8">
                {/* 1. Basic Identity */}
                <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                    <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                        <History className="text-dark-green" size={24} /> {placeName} Identity Ledger
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Parent Structures</p>
                                <div className="flex flex-wrap gap-2">
                                    {parentStructures.map((s, i) => (
                                        <div key={i} className="px-3 py-1.5 bg-gray-50 rounded-xl text-[10px] font-bold text-gray-500 border border-gray-100">
                                            {s.label}: <span className="text-dark-green">{s.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <InfoStat label="Capital Town" value={placeInfo?.capital_town || "Admin Center"} icon={<Landmark size={14} />} />
                                <InfoStat label="Language" value={placeInfo?.language || "Amharic/Local"} icon={<MessageSquare size={14} />} />
                                <InfoStat label="Climate" value={placeInfo?.climate || "Dega/Weyna Dega"} icon={<Zap size={14} />} />
                                <InfoStat label="Since" value={placeInfo?.established_date || "Historic"} icon={<Clock size={14} />} />
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 flex items-center gap-6">
                            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-dark-green shadow-sm border border-gray-100 overflow-hidden">
                                {placeInfo?.leader_photo ? <img src={placeInfo.leader_photo} className="w-full h-full object-cover" /> : <Users size={32} />}
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Current Leader</p>
                                <p className="text-lg font-black text-gray-900 underline decoration-dark-green/30">{placeInfo?.leader_name || "Regional Administrator"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Population & Geography */}
                <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                        <Globe size={20} className="text-light-blue" /> Demographics & Geospatial
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                        <InfoStat label="Total Population" value={placeInfo?.population_est || "Calculated..."} icon={<Users size={16} />} />
                        <InfoStat label="Male / Female" value="49% / 51%" icon={<Users size={16} />} />
                        <InfoStat label="Latitude" value={placeInfo?.lat || "9.0300° N"} icon={<MapPin size={16} />} />
                        <InfoStat label="Longitude" value={placeInfo?.lng || "38.7400° E"} icon={<MapPin size={16} />} />
                    </div>
                </div>

                {/* 3. Infrastructure Grid (Section 1-7-2-2-1-10) */}
                <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                        <Zap size={20} className="text-amber-500" /> Infrastructure Ledger
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="space-y-6">
                            <p className="text-[11px] font-black uppercase text-dark-green tracking-widest border-b border-dark-green/10 pb-2">Utilities</p>
                            <ul className="space-y-3">
                                <InfraItem label="Electricity" status="Grid Connected" />
                                <InfraItem label="Internet" status="4G / Fiber" />
                                <InfraItem label="Voice" status="Standard Mobile" />
                                <InfraItem label="Postal" status="Branch Office" />
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <p className="text-[11px] font-black uppercase text-light-blue tracking-widest border-b border-light-blue/10 pb-2">Transport</p>
                            <ul className="space-y-3">
                                <InfraItem label="Asphalt Road" status="Primary Access" />
                                <InfraItem label="Airport" status="Regional Hub" />
                                <InfraItem label="Train" status="Cargo/Passenger" />
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <p className="text-[11px] font-black uppercase text-gray-900 tracking-widest border-b border-gray-100 pb-2">Health & Finance</p>
                            <ul className="space-y-3">
                                <InfraItem label="Hospitals" status="2 Primary" />
                                <InfraItem label="Clinics" status="8 Public" />
                                <InfraItem label="Banks" status="12 Branches" />
                                <InfraItem label="Insurances" status="4 Offices" />
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 4. History & Nature */}
                <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                        <Camera size={20} className="text-purple-500" /> History & Landscape
                    </h3>
                    <div className="space-y-8">
                        <div className="bg-gray-50 rounded-[32px] p-8">
                            <p className="text-[11px] font-black text-dark-green uppercase tracking-widest mb-4">Chronicle & Origins</p>
                            <p className="text-gray-600 font-medium leading-relaxed italic">
                                {placeInfo?.history || `${placeName} emerged as a significant administrative and cultural hub. Its history is deeply intertwined with the development of the ${location.region} region and its unique traditions.`}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                <p className="text-[9px] font-black text-emerald-600 uppercase mb-1">Nature Parks</p>
                                <p className="text-xs font-bold text-emerald-900">3 Conservation Zones</p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                <p className="text-[9px] font-black text-blue-600 uppercase mb-1">Water Sources</p>
                                <p className="text-xs font-bold text-blue-900">2 Rivers, 1 Lake</p>
                            </div>
                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                <p className="text-[9px] font-black text-amber-600 uppercase mb-1">Landscape</p>
                                <p className="text-xs font-bold text-amber-900">Massive Mountains</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                                <p className="text-[9px] font-black text-purple-600 uppercase mb-1">Estab. Year</p>
                                <p className="text-xs font-bold text-purple-900">Circa 1892</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Stats within Know Tab */}
            <div className="space-y-8">
                <div className="bg-dark-green rounded-[40px] p-8 text-white shadow-xl shadow-dark-green/20">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-6">Education Portfolio</p>
                    <div className="space-y-5">
                        <InfraStat label="University" count="1" />
                        <InfraStat label="Highschool" count="4" />
                        <InfraStat label="Elementary" count="12" />
                        <InfraStat label="Kindergarten" count="8" />
                    </div>
                </div>

                <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Economy Snapshot</p>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-2xl">
                            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Main Income</p>
                            <p className="text-sm font-black text-gray-900">{placeInfo?.economy_type || "Trade & Agriculture"}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl">
                            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Primary Sector</p>
                            <p className="text-sm font-black text-gray-900">{placeInfo?.primary_sector || "Value Addition"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfraItem = ({ label, status }) => (
    <li className="flex items-center justify-between text-xs">
        <span className="font-bold text-gray-400 uppercase tracking-tighter">{label}</span>
        <span className="font-black text-gray-900">{status}</span>
    </li>
);

const InfraStat = ({ label, count }) => (
    <div className="flex items-center justify-between group cursor-default">
        <span className="text-[11px] font-bold opacity-60 group-hover:opacity-100 transition-opacity">{label}</span>
        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center font-black text-xs border border-white/10">
            {count}
        </div>
    </div>
);

const PostTab = ({ place, user, profile, location }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [media, setMedia] = useState(null);
    const [isPosting, setIsPosting] = useState(false);

    useEffect(() => { fetchPosts(); }, [place]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('connect_posts').select('*, author:profiles(first_name, avatar_url)').eq('location_name', place).order('created_at', { ascending: false });
            if (error) throw error;
            setPosts(data || []);
        } catch (err) { console.error('Error fetching posts:', err); } finally { setLoading(false); }
    };

    const handlePost = async () => {
        if (!user || (!content.trim() && !media)) return;
        setIsPosting(true);
        try {
            let mediaUrl = null;
            if (media) { mediaUrl = await uploadMedia(media.file, 'posts', user.id); }
            const { error } = await supabase.from('connect_posts').insert([{
                author_id: user.id,
                content: content,
                media_urls: mediaUrl ? [mediaUrl] : [],
                level_scope: location.kebele ? 'kebele' : location.woreda ? 'woreda' : location.zone ? 'zone' : 'region',
                location_name: place
            }]);
            if (error) throw error;
            setContent(''); setMedia(null); fetchPosts();
        } catch (err) { console.error('Error posting:', err); alert('Failed to post: ' + err.message); } finally { setIsPosting(false); }
    };

    if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-dark-green" size={40} /></div>;

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-700">
            {user && (
                <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-dark-green/10 text-dark-green rounded-2xl flex-shrink-0 flex items-center justify-center font-black">
                            {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover rounded-2xl" /> : (profile?.first_name?.charAt(0) || 'U')}
                        </div>
                        <div className="flex-1 space-y-4">
                            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={`Talk to the community in ${place}...`} className="w-full bg-gray-50 border-none rounded-3xl p-6 text-sm font-medium focus:ring-2 focus:ring-dark-green outline-none min-h-[120px] resize-none" />

                            {media && (
                                <div className="relative w-32 h-32 rounded-2xl overflow-hidden group border border-gray-100">
                                    {media.type === 'video' ? <video src={media.url} className="w-full h-full object-cover" /> : <img src={media.url} className="w-full h-full object-cover" />}
                                    <button onClick={() => setMedia(null)} className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full"><X size={14} /></button>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-400 rounded-xl hover:text-dark-green hover:bg-dark-green/5 transition-all cursor-pointer">
                                        <Camera size={18} />
                                        <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Photo</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files[0]; if (file) setMedia({ file, url: URL.createObjectURL(file), type: 'image' }); }} />
                                    </label>
                                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-400 rounded-xl hover:text-dark-green hover:bg-dark-green/5 transition-all cursor-pointer">
                                        <Video size={18} />
                                        <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Video</span>
                                        <input type="file" accept="video/*" className="hidden" onChange={(e) => { const file = e.target.files[0]; if (file) setMedia({ file, url: URL.createObjectURL(file), type: 'video' }); }} />
                                    </label>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-400 rounded-xl hover:text-dark-green hover:bg-dark-green/5 transition-all">
                                        <Zap size={18} />
                                        <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Gif</span>
                                    </button>
                                </div>
                                <button onClick={handlePost} disabled={isPosting || (!content.trim() && !media)} className="bg-dark-green text-white px-10 py-3.5 rounded-2xl text-xs font-black shadow-xl shadow-dark-green/20 hover:-translate-y-1 transition-all disabled:opacity-50">
                                    {isPosting ? 'Posting...' : 'Post News'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {posts.map(post => (
                    <PostItem key={post.id} post={post} user={user} />
                ))}
            </div>
        </div>
    );
};

const PostItem = ({ post, user }) => (
    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-black text-dark-green overflow-hidden">
                    {post.author?.avatar_url ? <img src={post.author.avatar_url} className="w-full h-full object-cover" /> : (post.author?.first_name?.charAt(0) || 'U')}
                </div>
                <div>
                    <h4 className="text-sm font-black text-gray-900">{post.author?.first_name || 'Anonymous'}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                        {new Date(post.created_at).toLocaleDateString()} • {post.location_name}
                    </p>
                </div>
            </div>
            <div className="relative group/menu">
                <button className="p-2 text-gray-300 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">
                    <TrendingUp className="rotate-90" size={18} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-3xl shadow-2xl border border-gray-100 p-2 hidden group-hover/menu:block z-10 animate-in zoom-in-95">
                    {user?.id === post.author_id ? (
                        <>
                            <button className="w-full text-left p-3 text-xs font-black text-gray-700 hover:bg-gray-50 rounded-2xl transition-all">Edit Post</button>
                            <button className="w-full text-left p-3 text-xs font-black text-red-500 hover:bg-red-50 rounded-2xl transition-all">Delete Post</button>
                        </>
                    ) : (
                        <>
                            <button className="w-full text-left p-3 text-xs font-black text-gray-700 hover:bg-gray-50 rounded-2xl transition-all">Hide Post</button>
                            <button className="w-full text-left p-3 text-xs font-black text-gray-700 hover:bg-gray-50 rounded-2xl transition-all">Report Content</button>
                        </>
                    )}
                </div>
            </div>
        </div>

        <p className="text-gray-600 leading-relaxed font-medium mb-6 text-lg">{post.content}</p>

        {post.media_urls?.[0] && (
            <div className="rounded-[32px] overflow-hidden mb-6 border border-gray-100 shadow-sm transition-transform hover:scale-[1.01] duration-500">
                <img src={post.media_urls[0]} alt="Post media" className="w-full max-h-[500px] object-contain bg-gray-50" />
            </div>
        )}

        <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-50">
            <PostActionButton icon={<Heart size={18} />} label="Like" count={post.likes_count} activeColor="text-accent-red" />
            <PostActionButton icon={<MessageSquare size={18} />} label="Comment" count={0} />
            <PostActionButton icon={<Share2 size={18} />} label="Share" />
            <PostActionButton icon={<Star size={18} />} label="Save" />
            <PostActionButton icon={<Upload size={18} />} label="Download" />
        </div>
    </div>
);

const PostActionButton = ({ icon, label, count, activeColor = "text-dark-green" }) => (
    <button className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:${activeColor} transition-all`}>
        {icon}
        <span className="hidden sm:inline">{label}</span>
        {count !== undefined && <span className="ml-1 opacity-60">{count}</span>}
    </button>
);

const AgentsTab = ({ place }) => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchAgents = async () => {
            const { data } = await supabase.from('agents').select('*, profile:profiles(*)').eq('location_name', place);
            setAgents(data || []);
            setLoading(false);
        };
        fetchAgents();
    }, [place]);
    if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-dark-green" size={40} /></div>;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {agents.map(agent => (
                <div key={agent.id} className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-dark-green font-black overflow-hidden">
                            {agent.profile?.avatar_url ? <img src={agent.profile.avatar_url} className="w-full h-full object-cover" /> : 'A'}
                        </div>
                        <div>
                            <h4 className="font-black text-gray-900">{agent.profile?.first_name || 'Resident Agent'}</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{agent.specialty}</p>
                        </div>
                    </div>
                    <button className="w-full bg-dark-green text-white py-3.5 rounded-2xl text-xs font-black">Message Agent</button>
                </div>
            ))}
        </div>
    );
};

const EventsTab = ({ place }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchEvents = async () => {
            const { data } = await supabase.from('events').select('*').eq('location_name', place).order('event_date', { ascending: true });
            setEvents(data || []);
            setLoading(false);
        };
        fetchEvents();
    }, [place]);
    if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-dark-green" size={40} /></div>;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map(event => (
                <div key={event.id} className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row">
                    {event.media_url && <img src={event.media_url} className="md:w-48 h-48 md:h-auto object-cover" />}
                    <div className="p-8 flex-1">
                        <div className="flex items-center gap-2 text-[10px] font-black text-accent-red uppercase tracking-[0.2em] mb-3">
                            <Calendar size={12} /> {event.event_date} @ {event.event_time}
                        </div>
                        <h4 className="text-xl font-black text-gray-900 mb-3">{event.title}</h4>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-6">{event.description}</p>
                        <button className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-xs font-black">Attend Event</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

const MapTab = ({ place }) => (
    <div className="bg-white rounded-[40px] p-4 shadow-sm border border-gray-100 h-[500px] flex flex-col items-center justify-center gap-6">
        <MapIcon size={64} className="text-dark-green opacity-20" />
        <p className="text-gray-900 font-black uppercase tracking-widest text-sm">Map View: {place}</p>
    </div>
);

const PlaceholderTab = ({ name }) => (
    <div className="py-32 text-center text-gray-400 bg-white rounded-[40px] border-2 border-dashed border-gray-100 italic font-medium">
        Curating {name} for this location...
    </div>
);

const InfoStat = ({ label, value, icon }) => (
    <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-gray-400 uppercase text-[9px] font-black tracking-widest">{icon} {label}</div>
        <div className="text-gray-900 font-black text-base">{value}</div>
    </div>
);

export default Places;
