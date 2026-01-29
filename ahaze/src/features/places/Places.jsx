import React, { useState, useMemo, useEffect } from 'react';
import { MapPin, Info, Image as ImageIcon, MessageSquare, ShoppingBag, Landmark, Users, TrendingUp, History, Map as MapIcon, ChevronRight, Search, Camera, Video, Calendar, Star, ShieldCheck, UserPlus, Heart, Share2, X, Loader2, Zap, Building2 } from 'lucide-react';
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
        fetchPlaceInfo();
    }, [placeName]);

    const fetchPlaceInfo = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('places').select('*').eq('name', placeName).maybeSingle();
            if (error) throw error;
            setPlaceInfo(data);
        } catch (err) { console.error('Error fetching place info:', err); } finally { setLoading(false); }
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
            </div>
        </div>
    );
};

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
                                <div className="relative w-32 h-32 rounded-2xl overflow-hidden group">
                                    <img src={media.url} className="w-full h-full object-cover" />
                                    <button onClick={() => setMedia(null)} className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full"><X size={14} /></button>
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-dark-green hover:bg-dark-green/5 transition-all cursor-pointer">
                                    <ImageIcon size={20} />
                                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Add Media</span>
                                    <input type="file" className="hidden" onChange={(e) => { const file = e.target.files[0]; if (file) setMedia({ file, url: URL.createObjectURL(file) }); }} />
                                </label>
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
                    <div key={post.id} className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-black text-dark-green overflow-hidden">
                                {post.author?.avatar_url ? <img src={post.author.avatar_url} className="w-full h-full object-cover" /> : (post.author?.first_name?.charAt(0) || 'U')}
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-gray-900">{post.author?.first_name || 'Anonymous'}</h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{new Date(post.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed font-medium mb-6">{post.content}</p>
                        {post.media_urls?.[0] && (
                            <div className="rounded-3xl overflow-hidden mb-6 border border-gray-100 shadow-sm">
                                <img src={post.media_urls[0]} alt="Post media" className="w-full max-h-[400px] object-contain bg-gray-50" />
                            </div>
                        )}
                        <div className="flex items-center gap-8 pt-6 border-t border-gray-50">
                            <button className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-accent-red transition-all">
                                <Heart size={18} /> {post.likes_count || 0}
                            </button>
                            <button className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-dark-green transition-all">
                                <MessageSquare size={18} /> 0
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

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
