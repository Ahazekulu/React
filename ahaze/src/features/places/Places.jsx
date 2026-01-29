import React, { useState, useMemo, useEffect } from 'react';
import { MapPin, Info, Image as ImageIcon, MessageSquare, ShoppingBag, Landmark, Users, TrendingUp, History, Map as MapIcon, ChevronRight, Search, Camera, Video, Calendar, Star, ShieldCheck, UserPlus, Heart, Share2, X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
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

    // Extract hierarchical data
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
        { id: 'events', label: 'Events', icon: <Calendar size={16} /> },
        { id: 'agents', label: 'Our Agents', icon: <Users size={16} /> },
        { id: 'market', label: 'Market', icon: <ShoppingBag size={16} /> },
    ];

    return (
        <div className="space-y-6">
            {/* Header & Location Selector */}
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
                            <select
                                value={selectedLevels.region}
                                onChange={(e) => handleLevelChange('region', e.target.value)}
                                className="bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3 text-xs font-black text-gray-700 outline-none focus:bg-white focus:border-dark-green transition-all"
                            >
                                <option value="">Select Region</option>
                                {regions.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{selectedLevels.region === 'Addis Ababa' ? 'Subcity' : 'Zone'}</span>
                            <select
                                value={selectedLevels.zone}
                                onChange={(e) => handleLevelChange('zone', e.target.value)}
                                className="bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3 text-xs font-black text-gray-700 outline-none focus:bg-white focus:border-dark-green transition-all disabled:opacity-50"
                                disabled={!selectedLevels.region}
                            >
                                <option value="">Select {selectedLevels.region === 'Addis Ababa' ? 'Subcity' : 'Zone'}</option>
                                {zones.map(z => <option key={z} value={z}>{z}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Woreda</span>
                            <select
                                value={selectedLevels.woreda}
                                onChange={(e) => handleLevelChange('woreda', e.target.value)}
                                className="bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3 text-xs font-black text-gray-700 outline-none focus:bg-white focus:border-dark-green transition-all disabled:opacity-50"
                                disabled={!selectedLevels.zone}
                            >
                                <option value="">Select Woreda</option>
                                {woredas.map(w => <option key={w} value={w}>{w}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kebele</span>
                            <select
                                value={selectedLevels.kebele}
                                onChange={(e) => handleLevelChange('kebele', e.target.value)}
                                className="bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3 text-xs font-black text-gray-700 outline-none focus:bg-white focus:border-dark-green transition-all disabled:opacity-50"
                                disabled={!selectedLevels.woreda}
                            >
                                <option value="">Select Kebele</option>
                                {kebeles.map(k => <option key={k} value={k}>{k}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-gray-100 pt-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-8 py-4 rounded-2xl text-xs font-black transition-all whitespace-nowrap active:scale-95 ${activeTab === tab.id
                                ? 'bg-dark-green text-white shadow-xl shadow-dark-green/20 -translate-y-1'
                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Dynamic Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'know' && <KnowTab placeName={displayPlace} location={selectedLevels} />}
                {activeTab === 'map' && <MapTab place={displayPlace} />}
                {activeTab === 'post' && <PostTab place={displayPlace} location={selectedLevels} />}
                {activeTab === 'events' && <EventsTab place={displayPlace} location={selectedLevels} />}
                {activeTab === 'agents' && <AgentsTab place={displayPlace} location={selectedLevels} />}
                {activeTab === 'market' && <PlaceholderTab name="Local Market" />}
            </div>
        </div>
    );
};

/* Sub-components */

const KnowTab = ({ placeName, location }) => {
    const [placeInfo, setPlaceInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlaceInfo();
    }, [placeName]);

    const fetchPlaceInfo = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('places')
                .select('*')
                .eq('name', placeName)
                .maybeSingle();

            if (error) throw error;
            setPlaceInfo(data);
        } catch (err) {
            console.error('Error fetching place info:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-dark-green" size={40} /></div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                    <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                        <History className="text-dark-green" size={24} /> About {placeName}
                    </h3>
                    <p className="text-gray-500 leading-relaxed font-medium">
                        {placeInfo?.history || `${placeName} is a vibrant community in the ${location.region} region of Ethiopia. Known for its strong cultural roots and economic potential.`}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mt-10 p-8 bg-gray-50 rounded-[32px]">
                        <InfoStat label="Population" value={placeInfo?.population || "Growing"} icon={<Users size={18} />} />
                        <InfoStat label="Focus Area" value={placeInfo?.primary_sector || "Community"} icon={<TrendingUp size={18} />} />
                        <InfoStat label="Status" value={placeInfo?.status || "Active"} icon={<Landmark size={18} />} />
                    </div>
                </div>

                <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                    <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                        <ImageIcon className="text-dark-green" size={24} /> Community Gallery
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-square bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 hover:border-dark-green hover:bg-white hover:text-dark-green transition-all cursor-pointer group">
                                <ImageIcon size={40} className="group-hover:scale-110 transition-transform" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div className="bg-dark-green text-white rounded-[40px] p-8 shadow-2xl shadow-dark-green/30 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
                    <h4 className="text-xl font-black mb-6 relative z-10">Quick Stats</h4>
                    <ul className="space-y-6 text-sm font-bold relative z-10">
                        <li className="flex justify-between items-center border-b border-white/10 pb-3">
                            <span className="text-white/60 text-[10px] uppercase tracking-widest">Type</span>
                            <span className="text-light-blue">{location.kebele ? 'Kebele' : location.woreda ? 'Woreda' : 'Region'}</span>
                        </li>
                        <li className="flex justify-between items-center border-b border-white/10 pb-3">
                            <span className="text-white/60 text-[10px] uppercase tracking-widest">Climate</span>
                            <span>Moderate</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="text-white/60 text-[10px] uppercase tracking-widest">Founded</span>
                            <span>Historical</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const PostTab = ({ place, location }) => {
    const { user, profile } = useAuth();
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, [place]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('connect_posts')
                .select('*, author:profiles(first_name)')
                .eq('level_value', place)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (err) {
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePost = async () => {
        if (!user || !content.trim()) return;
        setIsPosting(true);

        try {
            const { error } = await supabase
                .from('connect_posts')
                .insert([{
                    author_id: user.id,
                    content: content,
                    level_scope: location.kebele ? 'kebele' : location.woreda ? 'woreda' : location.zone ? 'zone' : 'region',
                    level_value: place
                }]);

            if (error) throw error;
            setContent('');
            fetchPosts();
        } catch (err) {
            console.error('Error posting:', err);
        } finally {
            setIsPosting(false);
        }
    };

    if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-dark-green" size={40} /></div>;

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-700">
            {user && (
                <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-dark-green/10 text-dark-green rounded-2xl flex-shrink-0 flex items-center justify-center font-black">
                            {profile?.first_name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 space-y-4">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder={`Talk to the community in ${place}...`}
                                className="w-full bg-gray-50 border-none rounded-3xl p-6 text-sm font-medium focus:ring-2 focus:ring-dark-green outline-none min-h-[120px] resize-none"
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={handlePost}
                                    disabled={isPosting || !content.trim()}
                                    className="bg-dark-green text-white px-10 py-3.5 rounded-2xl text-xs font-black shadow-xl shadow-dark-green/20 hover:-translate-y-1 transition-all disabled:opacity-50"
                                >
                                    {isPosting ? 'Posting...' : 'Post News'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {posts.length === 0 ? (
                    <div className="p-32 text-center text-gray-400 bg-white rounded-[50px] border border-dashed border-gray-200">
                        <MessageSquare className="mx-auto mb-4 opacity-10" size={48} />
                        <span className="font-black uppercase tracking-widest text-xs">Be the first to post about {place}</span>
                    </div>
                ) : (
                    posts.map(post => (
                        <div key={post.id} className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-black text-dark-green">
                                    {post.author?.first_name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-gray-900">{post.author?.first_name || 'Anonymous'}</h4>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-600 leading-relaxed font-medium mb-6">{post.content}</p>
                            <div className="flex items-center gap-8 pt-6 border-t border-gray-50">
                                <button className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-accent-red transition-all">
                                    <Heart size={18} /> {post.likes_count || 0}
                                </button>
                                <button className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-dark-green transition-all">
                                    <MessageSquare size={18} /> 0
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const AgentsTab = ({ place }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in zoom-in-95 duration-500">
        {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-dark-green font-black text-xl">
                        A
                    </div>
                    <div>
                        <h4 className="font-black text-gray-900 flex items-center gap-1 leading-tight">Resident Agent</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Certified Representative</p>
                    </div>
                </div>
                <div className="flex items-center justify-between mb-6 bg-gray-50 p-3 rounded-2xl">
                    <div className="flex items-center gap-1">
                        <Star size={14} className="text-accent-yellow fill-accent-yellow" />
                        <span className="text-xs font-black text-gray-900">4.9</span>
                    </div>
                    <span className="text-[10px] bg-dark-green/10 text-dark-green px-2 py-1 rounded-lg font-black uppercase tracking-widest">Verified</span>
                </div>
                <button className="w-full bg-dark-green text-white py-3.5 rounded-2xl text-xs font-black shadow-xl shadow-dark-green/10 hover:bg-emerald-800 transition-all">Message Agent</button>
            </div>
        ))}
    </div>
);

const EventsTab = ({ place }) => (
    <div className="py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100 italic text-gray-400 text-sm font-medium">
        No upcoming events found for {place}. Check back soon!
    </div>
);

const MapTab = ({ place }) => (
    <div className="bg-white rounded-[40px] p-4 shadow-sm border border-gray-100 h-[500px] flex flex-col items-center justify-center gap-6 animate-in fade-in duration-700">
        <MapIcon size={64} className="text-dark-green opacity-20" />
        <div className="text-center">
            <p className="text-gray-900 font-black uppercase tracking-widest text-sm">Map View: {place}</p>
            <p className="text-xs text-gray-400 font-medium mt-2">Integrating local spatial data...</p>
        </div>
    </div>
);

const PlaceholderTab = ({ name }) => (
    <div className="py-32 text-center text-gray-400 bg-white rounded-[40px] border-2 border-dashed border-gray-100 animate-pulse italic font-medium">
        Curating {name} for this location...
    </div>
);

const InfoStat = ({ label, value, icon }) => (
    <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-gray-400 uppercase text-[9px] font-black tracking-widest">
            {icon} {label}
        </div>
        <div className="text-gray-900 font-black text-base">{value}</div>
    </div>
);

export default Places;
