import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Info, Image as ImageIcon, MessageSquare, ShoppingBag, Landmark, Users, TrendingUp, History, Map as MapIcon, ChevronRight, Search, Camera, Video, Calendar, Star, ShieldCheck, UserPlus, Heart, Share2, X, Loader2, Zap, Building2, Globe, Upload, Clock, Mic, Cloud, AlertTriangle, Phone, Mail, ExternalLink, Mountain, Droplets, BookOpen, Music, Flag, Radio, FileText, Paperclip, XCircle, Eye } from 'lucide-react';
import { supabase, uploadMedia } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import placesData from '../../data/places.json';

const Places = () => {
    const { user, profile } = useAuth();
    const [activeTab, setActiveTab] = useState('post');
    const [searchParams] = useSearchParams();
    const [selectedLevels, setSelectedLevels] = useState({
        region: '',
        zone: '',
        woreda: '',
        kebele: ''
    });

    useEffect(() => {
        const region = searchParams.get('region') || '';
        const zone = searchParams.get('zone') || '';
        const woreda = searchParams.get('woreda') || '';
        const kebele = searchParams.get('kebele') || '';

        if (region || zone || woreda || kebele) {
            setSelectedLevels({ region, zone, woreda, kebele });
        }
    }, [searchParams]);

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

    const handleUseMyLocation = () => {
        if (!navigator.geolocation) return alert("Geolocation is not supported by your browser.");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                alert(`Location acquired: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}. finding nearest place...`);
                // In a real app, you'd reverse geocode here. For now, we'll simulate finding "Bole".
                setSelectedLevels({ region: 'Addis Ababa', zone: 'Bole', woreda: '', kebele: '' });
            },
            (error) => {
                alert("Unable to retrieve your location.");
            }
        );
    };

    const tabs = [
        { id: 'post', label: 'Post', icon: <MessageSquare size={16} /> },
        { id: 'know', label: 'Know', icon: <Info size={16} /> },
        { id: 'map', label: 'Map', icon: <MapIcon size={16} /> },
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
                        <button onClick={handleUseMyLocation} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gray-50 border-2 border-transparent hover:border-dark-green text-gray-400 hover:text-dark-green transition-all" title="Use My Location">
                            <MapPin size={18} />
                            <span className="text-[9px] font-black uppercase tracking-widest mt-1">GPS</span>
                        </button>
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
                {activeTab === 'latest' && <LatestTab place={displayPlace} />}
                {activeTab === 'kulu' && <AtAhazeKuluTab place={displayPlace} />}
                {activeTab === 'market' && <MarketTab place={displayPlace} />}
                {activeTab === 'orgs' && <OrganizationsTab place={displayPlace} />}
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
                {/* 1. Basic Identity with Distance */}
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
                                <InfoStat label="Capital" value={placeInfo?.capital_town || "Admin Center"} icon={<Landmark size={14} />} />
                                <InfoStat label="Language" value={placeInfo?.language || "Amharic/Local"} icon={<MessageSquare size={14} />} />
                                <InfoStat label="Climate" value={placeInfo?.climate || "Dega/Weyna Dega"} icon={<Zap size={14} />} />
                                <InfoStat label="Founded" value={placeInfo?.established_date || "Historic"} icon={<Clock size={14} />} />
                            </div>

                            {/* Distance Info */}
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Distance</p>
                                <div className="flex justify-between items-center text-xs font-bold text-gray-600">
                                    <span>From Adwa Museum</span>
                                    <span>{placeInfo?.distance_adwa || "Calculated..."} km</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold text-gray-600">
                                    <span>From Regional Capital</span>
                                    <span>{placeInfo?.distance_capital || "Calculated..."} km</span>
                                </div>
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
                        <InfoStat label="Population" value={placeInfo?.population_est || "Calculated..."} icon={<Users size={16} />} />
                        <InfoStat label="Demography" value="49% M / 51% F" icon={<Users size={16} />} />
                        <InfoStat label="Latitude" value={placeInfo?.lat || "9.0300° N"} icon={<MapPin size={16} />} />
                        <InfoStat label="Longitude" value={placeInfo?.lng || "38.7400° E"} icon={<MapPin size={16} />} />
                    </div>
                </div>

                {/* 3. Deep Infrastructure Grid */}
                <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                        <Zap size={20} className="text-amber-500" /> Infrastructure Ledger
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Utilities & Telecom */}
                        <div className="space-y-6">
                            <p className="text-[11px] font-black uppercase text-dark-green tracking-widest border-b border-dark-green/10 pb-2">Utilities & Telecom</p>
                            <ul className="space-y-3">
                                <InfraItem label="Electricity" status="Grid" />
                                <InfraItem label="Internet" status="4G/Fiber" />
                                <InfraItem label="Voice" status="Mobile/Fixed" />
                                <InfraItem label="Postal" status="Available" />
                            </ul>
                        </div>
                        {/* Transport */}
                        <div className="space-y-6">
                            <p className="text-[11px] font-black uppercase text-light-blue tracking-widest border-b border-light-blue/10 pb-2">Transport</p>
                            <ul className="space-y-3">
                                <InfraItem label="Asphalt Road" status="Primary" />
                                <InfraItem label="Concrete" status="Urban" />
                                <InfraItem label="Airport" status="Regional" />
                                <InfraItem label="Train" status="Passenger" />
                            </ul>
                        </div>
                        {/* Health & Finance */}
                        <div className="space-y-6">
                            <p className="text-[11px] font-black uppercase text-gray-900 tracking-widest border-b border-gray-100 pb-2">Services</p>
                            <ul className="space-y-3">
                                <InfraItem label="Hospitals" status="2 Public" />
                                <InfraItem label="Clinics" status="8 Private" />
                                <InfraItem label="Banks" status="12 Branches" />
                                <InfraItem label="Insurances" status="4 Offices" />
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 4. History, Landscape & Events */}
                <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                        <Camera size={20} className="text-purple-500" /> History & Landscape
                    </h3>
                    <div className="space-y-8">
                        {/* History Text */}
                        <div className="bg-gray-50 rounded-[32px] p-8">
                            <p className="text-[11px] font-black text-dark-green uppercase tracking-widest mb-4">Chronicle & Origins</p>
                            <p className="text-gray-600 font-medium leading-relaxed italic">
                                {placeInfo?.history || `${placeName} has a rich history dating back to its establishment. It features distinct traditions and has been led by notable figures.`}
                            </p>
                        </div>
                        {/* Landscape Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                                <Mountain size={20} className="mx-auto text-emerald-600 mb-2" />
                                <p className="text-[9px] font-black text-emerald-600 uppercase mb-1">Landscape</p>
                                <p className="text-xs font-bold text-emerald-900">Highlands</p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                                <Droplets size={20} className="mx-auto text-blue-600 mb-2" />
                                <p className="text-[9px] font-black text-blue-600 uppercase mb-1">Rivers</p>
                                <p className="text-xs font-bold text-blue-900">2 Local Rivers</p>
                            </div>
                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                                <Flag size={20} className="mx-auto text-amber-600 mb-2" />
                                <p className="text-[9px] font-black text-amber-600 uppercase mb-1">Events</p>
                                <p className="text-xs font-bold text-amber-900">Major Battles</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 text-center">
                                <Users size={20} className="mx-auto text-purple-600 mb-2" />
                                <p className="text-[9px] font-black text-purple-600 uppercase mb-1">Notables</p>
                                <p className="text-xs font-bold text-purple-900">Various</p>
                            </div>
                        </div>

                        {/* Gallery Placeholder */}
                        <div className="p-8 bg-gray-900 text-white rounded-[32px] text-center">
                            <p className="text-xs font-black uppercase tracking-widest mb-4">Historical Gallery</p>
                            <div className="flex justify-center gap-4 opacity-50">
                                <div className="w-20 h-20 bg-white/10 rounded-xl" />
                                <div className="w-20 h-20 bg-white/10 rounded-xl" />
                                <div className="w-20 h-20 bg-white/10 rounded-xl" />
                            </div>
                            <p className="mt-4 text-[10px] uppercase tracking-widest">Videos & Photos</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Stats within Know Tab - Education & Economy */}
            <div className="space-y-8">
                <div className="bg-dark-green rounded-[40px] p-8 text-white shadow-xl shadow-dark-green/20">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-6 flex items-center gap-2"><BookOpen size={14} /> Education</p>
                    <div className="space-y-5">
                        <InfraStat label="University" count="1" />
                        <InfraStat label="Preparatory" count="2" />
                        <InfraStat label="Highschool" count="4" />
                        <InfraStat label="Elementary" count="12" />
                        <InfraStat label="Primary" count="10" />
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
    const [attachments, setAttachments] = useState([]); // Array of { file, url, type, name }
    const [isPosting, setIsPosting] = useState(false);

    // Recording & Live State
    const [recordingMode, setRecordingMode] = useState(null); // 'audio' | 'video'
    const [recordingStatus, setRecordingStatus] = useState('idle'); // 'idle' | 'recording'
    const [recordingTime, setRecordingTime] = useState(0);
    const [showAudioOptions, setShowAudioOptions] = useState(false);
    const [showGifPicker, setShowGifPicker] = useState(false);

    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null); // Keep track of stream to stop tracks later
    const chunksRef = useRef([]);
    const videoPreviewRef = useRef(null);
    const timerRef = useRef(null);
    const fileInputRef = useRef(null);

    // Sample GIFs for MVP (Real URLs)
    const sampleGifs = [
        "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDN6eHd5aGpwdGg0b3F6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKSjRrfIPjeiVyM/giphy.gif",
        "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDN6eHd5aGpwdGg0b3F6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlHJGHe3yAMhdQY/giphy.gif",
        "https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif",
        "https://media.giphy.com/media/l2JhtTt0aD2uA/giphy.gif",
        "https://media.giphy.com/media/3o7527pa7qs9kCG78A/giphy.gif",
        "https://media.giphy.com/media/26gsjCZpPolPr3sBy/giphy.gif"
    ];

    useEffect(() => { fetchPosts(); }, [place]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            // Fetch posts along with a flag if the CURRENT user has liked them.
            // Note: This requires a JOIN or a separate fetch. For simplicity/speed in this MVP, 
            // we'll fetch posts first, then we can fetch "my likes" in the PostItem or side-load them.
            // A common pattern is: select *, author:..., likes(count), my_likes:likes(user_id) eq user.id
            // But supsbase syntax for "my_likes" with filter is tricky in one go.
            // Let's stick to simple posts first.
            const { data, error } = await supabase.from('connect_posts').select('*, author:profiles(first_name, avatar_url), likes(user_id)').eq('location_name', place).order('created_at', { ascending: false });
            if (error) throw error;
            setPosts(data || []);
        } catch (err) { console.error('Error fetching posts:', err); } finally { setLoading(false); }
    };

    const handleFiles = (e, type) => {
        const files = Array.from(e.target.files || []);
        const newAttachments = files.map(file => ({
            file,
            url: URL.createObjectURL(file), // Preview URL
            type: type || (file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document'),
            name: file.name
        }));
        setAttachments(prev => [...prev, ...newAttachments]);
        e.target.value = ''; // Reset input
    };

    const removeAttachment = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const addThumbnail = (attachmentIndex, e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAttachments(prev => prev.map((att, i) =>
            i === attachmentIndex ? {
                ...att,
                thumbnail: URL.createObjectURL(file),
                thumbnailFile: file
            } : att
        ));
        e.target.value = '';
    };

    const startRecording = async (type) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: type === 'video' });
            if (type === 'video' && videoPreviewRef.current) {
                videoPreviewRef.current.srcObject = stream;
            }

            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;
            chunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: type === 'video' ? 'video/webm' : 'audio/webm' });
                const file = new File([blob], `recording_${Date.now()}.${type === 'video' ? 'webm' : 'webm'}`, { type: type === 'video' ? 'video/webm' : 'audio/webm' });

                setAttachments(prev => [...prev, {
                    file,
                    url: URL.createObjectURL(blob),
                    type: type,
                    name: `Recorded ${type === 'video' ? 'Video' : 'Audio'}`
                }]);

                // Stop tracks
                stream.getTracks().forEach(track => track.stop());
                setIsRecording(false);
                setRecordingType(null);
                setRecordingTime(0);
                clearInterval(timerRef.current);
            };

            recorder.start();
            setIsRecording(true);
            setRecordingType(type);

            // Timer
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Error starting recording:", err);
            alert("Could not access microphone/camera. Please ensure permissions are granted.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && recordingStatus === 'recording') {
            mediaRecorderRef.current.stop();
        } else {
            cleanupRecording();
        }
    };

    // New recording functions for the enhanced UI
    const initializeRecording = async (mode) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: mode === 'video'
            });

            streamRef.current = stream;
            setRecordingMode(mode);
            setRecordingStatus('idle');

            setTimeout(() => {
                if (mode === 'video' && videoPreviewRef.current) {
                    videoPreviewRef.current.srcObject = stream;
                    videoPreviewRef.current.muted = true;
                }
            }, 100);

        } catch (err) {
            console.error("Error initializing recording:", err);
            alert("Could not access microphone/camera. Please ensure permissions are granted.");
        }
    };

    const startCapture = () => {
        if (!streamRef.current) return;

        const recorder = new MediaRecorder(streamRef.current);
        mediaRecorderRef.current = recorder;
        chunksRef.current = [];

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
            const type = recordingMode;
            const blob = new Blob(chunksRef.current, { type: type === 'video' ? 'video/webm' : 'audio/webm' });
            const file = new File([blob], `recording_${Date.now()}.webm`, { type: type === 'video' ? 'video/webm' : 'audio/webm' });

            setAttachments(prev => [...prev, {
                file,
                url: URL.createObjectURL(blob),
                type: type,
                name: `Recorded ${type === 'video' ? 'Video' : 'Audio'}`
            }]);

            cleanupRecording();
        };

        recorder.start();
        setRecordingStatus('recording');

        setRecordingTime(0);
        timerRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);
    };

    const cleanupRecording = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (mediaRecorderRef.current && recordingStatus === 'recording') {
            mediaRecorderRef.current.stop();
        }
        setRecordingMode(null);
        setRecordingStatus('idle');
        setRecordingTime(0);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePost = async () => {
        if (!user || (!content.trim() && attachments.length === 0)) return;
        setIsPosting(true);
        try {
            // Upload all attachments and their thumbnails
            const uploadPromises = attachments.map(async (att) => {
                if (!att.file && att.url.startsWith('http')) return { url: att.url, thumbnail: null };
                if (att.file) {
                    const url = await uploadMedia(att.file, 'posts', user.id);
                    let thumbnail = null;

                    // Upload thumbnail if exists
                    if (att.thumbnailFile) {
                        thumbnail = await uploadMedia(att.thumbnailFile, 'posts/thumbnails', user.id);
                    }

                    return { url, thumbnail };
                }
                return null;
            });

            const uploadedData = (await Promise.all(uploadPromises)).filter(Boolean);
            const mediaUrls = uploadedData.map(d => d.url);
            const thumbnails = uploadedData.map(d => d.thumbnail);

            // Determine primary media type
            let primaryType = 'text';
            if (attachments.length > 0) {
                const types = new Set(attachments.map(a => a.type));
                if (types.size > 1) primaryType = 'mixed';
                else primaryType = attachments[0].type;
            }

            const { error } = await supabase.from('connect_posts').insert([{
                author_id: user.id,
                content: content,
                media_urls: mediaUrls,
                media_thumbnails: thumbnails,
                media_type: primaryType,
                level_scope: location.kebele ? 'kebele' : location.woreda ? 'woreda' : location.zone ? 'zone' : 'region',
                location_name: place
            }]);
            if (error) throw error;
            setContent(''); setAttachments([]); fetchPosts();
        } catch (err) { console.error('Error posting:', err); alert('Failed to post: ' + err.message); } finally { setIsPosting(false); }
    };

    if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-dark-green" size={40} /></div>;

    return (
        <div className="max-w-5xl mx-auto space-y-3 animate-in fade-in duration-700">
            {user && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 relative overflow-hidden mb-6 shadow-sm">
                    {/* Recording & Live Overlay */}
                    {recordingMode && (
                        <div className="absolute inset-0 z-50 bg-gray-900 flex flex-col items-center justify-center text-white animate-in fade-in">
                            {/* Video Preview Layer */}
                            {recordingMode === 'video' && (
                                <>
                                    <video
                                        ref={videoPreviewRef}
                                        autoPlay
                                        muted
                                        playsInline
                                        className="absolute inset-0 w-full h-full object-cover z-0"
                                    />
                                    {/* Mock Live UI Overlay */}
                                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                        <div className="bg-red-600 text-white px-3 py-1 rounded-md font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2">
                                            {recordingStatus === 'recording' ? 'LIVE' : 'PREVIEW'}
                                        </div>
                                        {recordingStatus === 'recording' && (
                                            <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-md text-xs font-bold flex items-center gap-2">
                                                <Eye size={14} /> 1.2k Viewers
                                            </div>
                                        )}
                                    </div>

                                    {/* Mock Chat Stream */}
                                    {recordingStatus === 'recording' && (
                                        <div className="absolute bottom-24 left-4 w-64 h-32 mask-image-gradient-to-t pointer-events-none opacity-80 space-y-2 flex flex-col justify-end">
                                            <div className="flex items-center gap-2 text-sm"><span className="font-bold text-yellow-400">User1</span> Amazing place!</div>
                                            <div className="flex items-center gap-2 text-sm"><span className="font-bold text-blue-400">Alex</span> Love the vibe 🔥</div>
                                            <div className="flex items-center gap-2 text-sm"><span className="font-bold text-green-400">Sarah</span> Where is this exactly?</div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Controls Layer */}
                            <div className="relative z-20 flex flex-col items-center gap-8 w-full px-8 pointer-events-auto">

                                {/* Info Display */}
                                {recordingMode === 'audio' && (
                                    <div className="w-32 h-32 rounded-full bg-dark-green/20 flex items-center justify-center animate-pulse">
                                        <Mic size={48} className="text-white" />
                                    </div>
                                )}

                                {recordingStatus === 'recording' && (
                                    <div className="text-5xl font-black font-mono tracking-widest drop-shadow-md">
                                        {formatTime(recordingTime)}
                                    </div>
                                )}

                                {/* Main Action Button */}
                                {recordingStatus === 'idle' ? (
                                    <div className="text-center space-y-4">
                                        <h3 className="text-2xl font-black">{recordingMode === 'video' ? 'Ready to go Live?' : 'Start Audio Recording'}</h3>
                                        <p className="text-gray-300 text-sm max-w-xs mx-auto mb-4">
                                            {recordingMode === 'video' ? 'Check your camera and surroundings. You are in preview mode.' : 'Tap the button below to start recording your voice note.'}
                                        </p>
                                        <button
                                            onClick={startCapture}
                                            className="px-12 py-4 bg-white text-gray-900 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                                        >
                                            {recordingMode === 'video' ? 'GO LIVE' : 'START RECORDING'}
                                        </button>
                                        <button onClick={cleanupRecording} className="block w-full text-sm text-gray-400 hover:text-white mt-4 underline">Cancel</button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={stopRecording}
                                        className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 transition-transform bg-red-500"
                                    >
                                        <div className="w-8 h-8 bg-white rounded-sm" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-dark-green/10 text-dark-green rounded-2xl flex-shrink-0 flex items-center justify-center font-black">
                            {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover rounded-2xl" /> : (profile?.first_name?.charAt(0) || 'U')}
                        </div>
                        <div className="flex-1 space-y-4">
                            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={`Talk to the community in ${place}...`} className="w-full bg-gray-50 border-none rounded-3xl p-6 text-sm font-medium focus:ring-2 focus:ring-dark-green outline-none min-h-[120px] resize-none" />

                            {/* Attachments Preview - Scrollable Row */}
                            {attachments.length > 0 && (
                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                    {attachments.map((att, index) => (
                                        <div key={index} className="relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden group border border-gray-100 bg-gray-50 flex items-center justify-center">
                                            {att.type === 'image' || att.type === 'gif' ? (
                                                <img src={att.url} className="w-full h-full object-cover" />
                                            ) : att.type === 'video' ? (
                                                <video src={att.url} className="w-full h-full object-cover opacity-80" />
                                            ) : (
                                                <div className="flex flex-col items-center text-gray-500 p-2 text-center">
                                                    <FileText size={24} className="mb-1" />
                                                    <span className="text-[8px] font-bold leading-tight line-clamp-2">{att.name}</span>
                                                </div>
                                            )}

                                            {/* Thumbnail Preview or Add Button for Audio/Documents */}
                                            {(att.type === 'audio' || att.type === 'document') && (
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {att.thumbnail ? (
                                                        <img src={att.thumbnail} className="absolute inset-0 w-full h-full object-cover" />
                                                    ) : (
                                                        <label className="absolute bottom-1 left-1 right-1 bg-white/90 backdrop-blur-sm text-gray-700 text-[8px] font-bold py-1 px-2 rounded cursor-pointer hover:bg-white transition-all text-center">
                                                            + Thumbnail
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={(e) => addThumbnail(index, e)}
                                                            />
                                                        </label>
                                                    )}
                                                </div>
                                            )}

                                            {/* Type Indicator Icon */}
                                            <div className="absolute bottom-1 right-1 bg-black/60 text-white p-1 rounded-full text-[8px]">
                                                {att.type === 'video' ? <Video size={8} /> : att.type === 'audio' ? <Mic size={8} /> : att.type === 'document' ? <FileText size={8} /> : null}
                                            </div>

                                            <button onClick={() => removeAttachment(index)} className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full hover:scale-110 transition-transform z-10"><X size={12} /></button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex flex-wrap items-center gap-2 justify-between">
                                <div className="flex flex-wrap items-center gap-2">
                                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-400 rounded-xl hover:text-dark-green hover:bg-dark-green/5 transition-all cursor-pointer">
                                        <Camera size={18} />
                                        <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Photo</span>
                                        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e, 'image')} />
                                    </label>
                                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-400 rounded-xl hover:text-dark-green hover:bg-dark-green/5 transition-all cursor-pointer">
                                        <Video size={18} />
                                        <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Video</span>
                                        <input type="file" accept="video/*" multiple className="hidden" onChange={(e) => handleFiles(e, 'video')} />
                                    </label>

                                    {/* Document Upload Button */}
                                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-400 rounded-xl hover:text-dark-green hover:bg-dark-green/5 transition-all cursor-pointer">
                                        <Paperclip size={18} />
                                        <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">File</span>
                                        <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt" multiple className="hidden" onChange={(e) => handleFiles(e, 'document')} />
                                    </label>

                                    <button onClick={() => setShowGifPicker(!showGifPicker)} className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-400 rounded-xl hover:text-dark-green hover:bg-dark-green/5 transition-all relative">
                                        <Zap size={18} />
                                        <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Gif</span>
                                        {/* GIF Picker Modal */}
                                        {showGifPicker && (
                                            <div className="absolute bottom-full mb-4 left-0 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 z-50 animate-in zoom-in-95 grid grid-cols-3 gap-2">
                                                {sampleGifs.map((gif, i) => (
                                                    <img
                                                        key={i}
                                                        src={gif}
                                                        className="w-full h-20 object-cover rounded-xl cursor-pointer hover:scale-105 transition-transform border border-transparent hover:border-dark-green"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setAttachments(prev => [...prev, { file: null, url: gif, type: 'gif', name: 'GIF' }]);
                                                            setShowGifPicker(false);
                                                        }}
                                                    />
                                                ))}
                                                <div className="col-span-3 text-center text-[10px] text-gray-400 font-bold py-2">Powered by GIPHY</div>
                                            </div>
                                        )}
                                    </button>
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowAudioOptions(!showAudioOptions)}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-400 rounded-xl hover:text-dark-green hover:bg-dark-green/5 transition-all"
                                        >
                                            <Mic size={18} />
                                            <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Audio</span>
                                        </button>
                                        {showAudioOptions && (
                                            <div className="absolute bottom-full mb-2 left-0 w-40 bg-white rounded-xl shadow-xl border border-gray-100 p-1 z-50 animate-in zoom-in-95 flex flex-col">
                                                <button
                                                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg text-xs font-bold text-gray-700 text-left"
                                                    onClick={() => { setShowAudioOptions(false); initializeRecording('audio'); }}
                                                >
                                                    <Mic size={14} /> Record Mic
                                                </button>
                                                <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg text-xs font-bold text-gray-700 text-left cursor-pointer">
                                                    <Upload size={14} /> Upload File
                                                    <input type="file" accept="audio/*" multiple className="hidden" onChange={(e) => { handleFiles(e, 'audio'); setShowAudioOptions(false); }} />
                                                </label>
                                            </div>
                                        )}
                                    </div>

                                    <button onClick={() => initializeRecording('video')} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all border border-red-100 animate-pulse">
                                        <Radio size={18} />
                                        <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Live</span>
                                    </button>
                                </div>
                                <button onClick={handlePost} disabled={isPosting || (!content.trim() && attachments.length === 0)} className="bg-dark-green text-white px-8 py-3.5 rounded-2xl text-xs font-black shadow-xl shadow-dark-green/20 hover:-translate-y-1 transition-all disabled:opacity-50">
                                    {isPosting ? 'Posting...' : 'Post News'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-1">
                {posts.map(post => (
                    <PostItem key={post.id} post={post} user={user} />
                ))}
            </div>
        </div>
    );
};

const PostItem = ({ post, user }) => {
    // Check if current user has liked based on the fetched data (simple optimistic check)
    // Adjust logic if `post.likes` is an array of objects
    const initialLiked = post.likes && post.likes.some(l => l.user_id === user?.id);
    const [liked, setLiked] = useState(initialLiked);
    const [likeCount, setLikeCount] = useState(post.likes ? post.likes.length : 0);

    const [saved, setSaved] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);

    // Effect to ensure we update if props change (though typically this component mounts once)
    useEffect(() => {
        if (post.likes) {
            const isLiked = post.likes.some(l => l.user_id === user?.id);
            setLiked(isLiked);
            setLikeCount(post.likes.length);
        }
    }, [post.likes, user?.id]);

    const handleLike = async () => {
        if (!user) return;

        // Optimistic update
        const previousLiked = liked;
        const previousCount = likeCount;
        setLiked(!liked);
        setLikeCount(prev => liked ? prev - 1 : prev + 1);

        try {
            if (previousLiked) {
                // Unlike
                const { error } = await supabase.from('likes').delete().eq('post_id', post.id).eq('user_id', user.id);
                if (error) throw error;
            } else {
                // Like
                const { error } = await supabase.from('likes').insert([{ post_id: post.id, user_id: user.id }]);
                if (error) throw error;
            }
        } catch (err) {
            console.error("Like failed:", err);
            // Revert
            setLiked(previousLiked);
            setLikeCount(previousCount);
        }
    };

    const toggleComments = async () => {
        if (!showComments) {
            setLoadingComments(true);
            try {
                const { data, error } = await supabase.from('comments').select('*, author:profiles(first_name, avatar_url)').eq('post_id', post.id).order('created_at', { ascending: true });
                if (error) throw error;
                setComments(data || []);
            } catch (err) { console.error("Error fetching comments:", err); }
            finally { setLoadingComments(false); }
        }
        setShowComments(!showComments);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;
        try {
            const { data, error } = await supabase.from('comments').insert([{
                post_id: post.id,
                user_id: user.id,
                content: newComment
            }]).select('*, author:profiles(first_name, avatar_url)').single();

            if (error) throw error;
            // Optimistically update if table works, but since we select * it should be fine
            // We might need to manually mock the author if join doesn't work on insert return immediately
            // But let's just refetch or append.
            setComments(prev => [...prev, { ...data, author: { first_name: user.user_metadata?.first_name || 'Me', avatar_url: null } }]);
            setNewComment('');
        } catch (err) { console.error("Error commenting:", err); alert("Failed to comment."); }
    };

    return (
        <div className="bg-white p-6 border-b border-gray-100 hover:bg-gray-50/30 transition-colors first:rounded-t-2xl last:rounded-b-2xl sm:border sm:rounded-2xl sm:mb-4 sm:shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center font-bold text-dark-green overflow-hidden ring-2 ring-white">
                        {post.author?.avatar_url ? <img src={post.author.avatar_url} className="w-full h-full object-cover" /> : (post.author?.first_name?.charAt(0) || 'U')}
                    </div>
                    <div>
                        <h4 className="text-[15px] font-bold text-gray-900 leading-tight">{post.author?.first_name || 'Anonymous'}</h4>
                        <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                            {new Date(post.created_at).toLocaleDateString()}
                            {post.media_type === 'video' && <span className="ml-2 text-red-500 animate-pulse font-bold tracking-wider">● LIVE</span>}
                        </p>
                    </div>
                </div>
                <button className="p-2 text-gray-300 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-all">
                    <TrendingUp className="rotate-90" size={18} />
                </button>
            </div>

            <p className="text-gray-800 text-[15px] leading-relaxed mb-5 whitespace-pre-wrap">{post.content}</p>

            {post.media_urls?.length > 0 && (
                <div className="mb-6 space-y-2">
                    {/* Render Content based on types */}
                    {/* We do a mixed grid approach */}
                    <div className={`grid gap-2 ${post.media_urls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {post.media_urls.map((url, idx) => {
                            const isVideo = url.endsWith('.webm') || url.endsWith('.mp4') || post.media_type === 'video' && idx === 0;
                            const isAudio = url.endsWith('.mp3') || url.endsWith('.webm') && post.media_type === 'audio'; // Weak check, but 'media_type' helps if single
                            const isImage = !isVideo && !isAudio && (url.match(/\.(jpeg|jpg|gif|png)$/) != null || post.media_type === 'image' || post.media_type === 'gif');
                            const isDoc = !isVideo && !isAudio && !isImage;

                            if (isDoc) {
                                return (
                                    <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="col-span-full flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:bg-gray-100 transition-colors">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm"><FileText size={24} /></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900 truncate">Attached Document</p>
                                            <p className="text-xs text-gray-500 uppercase tracking-widest">Download / View</p>
                                        </div>
                                        <Upload size={16} className="text-gray-400" />
                                    </a>
                                );
                            }

                            return (
                                <div key={idx} className={`rounded-xl overflow-hidden border border-gray-100 bg-gray-50 relative ${post.media_urls.length === 1 ? 'aspect-video' : 'aspect-square'}`}>
                                    {isVideo ? (
                                        <video src={url} controls className="w-full h-full object-cover" />
                                    ) : isAudio ? (
                                        <div className="flex items-center justify-center w-full h-full bg-gray-900 text-white">
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse"><Music size={32} /></div>
                                                <audio src={url} controls className="w-48" />
                                            </div>
                                        </div>
                                    ) : (
                                        <img src={url} alt="Post media" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-8">
                    <PostActionButton
                        icon={<Heart size={20} className={liked ? "fill-current" : ""} />}
                        label={likeCount > 0 ? likeCount : ""}
                        activeColor="text-red-500"
                        isActive={liked}
                        onClick={handleLike}
                    />
                    <PostActionButton
                        icon={<MessageSquare size={20} />}
                        label={comments.length > 0 ? comments.length : ""}
                        onClick={toggleComments}
                    />
                    <PostActionButton
                        icon={<Share2 size={20} />}
                        onClick={() => {
                            navigator.clipboard.writeText(`Check this out: ${post.content}`);
                            alert("Link copied!");
                        }}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <PostActionButton
                        icon={<Eye size={18} />}
                        label={post.views_count || 0}
                        isActive={false}
                        onClick={() => { }}
                    />
                    <PostActionButton
                        icon={<Star size={18} className={saved ? "fill-current" : ""} />}
                        isActive={saved}
                        activeColor="text-yellow-500"
                        onClick={() => setSaved(!saved)}
                    />
                    <PostActionButton
                        icon={<Upload size={18} />}
                        onClick={() => {
                            if (post.media_urls?.[0]) window.open(post.media_urls[0], '_blank');
                        }}
                    />
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="mt-8 pt-8 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 space-y-6">
                    {loadingComments ? (
                        <div className="text-center py-4"><Loader2 className="animate-spin inline text-dark-green" /></div>
                    ) : (
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                            {comments.map(comment => (
                                <div key={comment.id} className="flex gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center font-bold text-gray-500 overflow-hidden">
                                        {comment.author?.avatar_url ? <img src={comment.author.avatar_url} className="w-full h-full object-cover" /> : (comment.author?.first_name?.charAt(0) || 'U')}
                                    </div>
                                    <div className="bg-gray-50 rounded-2xl rounded-tl-none p-3 flex-1">
                                        <p className="font-bold text-gray-900 text-xs mb-1">{comment.author?.first_name || 'User'}</p>
                                        <p className="text-gray-600 font-medium">{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                            {comments.length === 0 && <p className="text-center text-gray-400 text-xs italic py-4">No comments yet. Be the first!</p>}
                        </div>
                    )}

                    <form onSubmit={handleCommentSubmit} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-dark-green outline-none"
                        />
                        <button type="submit" disabled={!newComment.trim()} className="bg-dark-green text-white p-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all">
                            <TrendingUp size={16} className="rotate-90" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

const PostActionButton = ({ icon, label, count, activeColor = "text-dark-green", isActive, onClick }) => (
    <button onClick={onClick} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${isActive ? activeColor : 'text-gray-400 hover:' + activeColor}`}>
        {icon}
        <span className="hidden sm:inline">{label}</span>
        {count !== undefined && <span className="ml-1 opacity-60">{count}</span>}
    </button>
);



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

const LatestTab = ({ place }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-700">
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
            <div className="flex items-center gap-3 text-blue-500">
                <Cloud size={24} />
                <h3 className="font-black text-lg text-gray-900">Weather</h3>
            </div>
            <div className="text-center py-8">
                <p className="text-5xl font-black text-gray-900 mb-2">22°C</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Partly Cloudy</p>
            </div>
        </div>
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
            <div className="flex items-center gap-3 text-emerald-500">
                <ShieldCheck size={24} />
                <h3 className="font-black text-lg text-gray-900">Security</h3>
            </div>
            <div className="py-2 space-y-4">
                <div className="flex items-center gap-3 text-sm font-bold text-gray-900">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" /> Stable Condition
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">No incidents reported in {place} in the last 24 hours.</p>
            </div>
        </div>
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
            <div className="flex items-center gap-3 text-amber-500">
                <AlertTriangle size={24} />
                <h3 className="font-black text-lg text-gray-900">Traffic</h3>
            </div>
            <div className="py-2 space-y-4">
                <div className="flex items-center gap-3 text-sm font-bold text-gray-900">
                    <div className="w-2 h-2 bg-amber-500 rounded-full" /> Moderate Flow
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">Main road from Capital to {place} is clear. Minor congestion at entry.</p>
            </div>
        </div>
    </div>
);

const AtAhazeKuluTab = ({ place }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-700">
        <div className="bg-white rounded-[40px] p-10 text-center shadow-sm border border-gray-100">
            <Users size={32} className="mx-auto text-dark-green mb-4" />
            <p className="text-4xl font-black text-gray-900 mb-1">2,450</p>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Citizens</p>
        </div>
        <div className="bg-white rounded-[40px] p-10 text-center shadow-sm border border-gray-100">
            <Building2 size={32} className="mx-auto text-blue-500 mb-4" />
            <p className="text-4xl font-black text-gray-900 mb-1">128</p>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Organizations</p>
        </div>
        <div className="bg-white rounded-[40px] p-10 text-center shadow-sm border border-gray-100">
            <ShoppingBag size={32} className="mx-auto text-amber-500 mb-4" />
            <p className="text-4xl font-black text-gray-900 mb-1">8,900</p>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Products Listed</p>
        </div>
    </div>
);

const OrganizationsTab = ({ place }) => {
    const [orgs, setOrgs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrgs = async () => {
            setLoading(true);
            try {
                // Filter by the most specific location available
                // For this demo, we use a simple logic: in a real app, you'd filter by address_zone, address_woreda matching 'place'
                const { data, error } = await supabase
                    .from('organizations')
                    .select('*')
                    .or(`address_region.ilike.%${place}%,address_zone.ilike.%${place}%,address_woreda.ilike.%${place}%`)
                    .limit(10);

                if (error) throw error;
                setOrgs(data || []);
            } catch (err) {
                console.error("Error fetching orgs:", err);
            } finally {
                setLoading(false);
            }
        };

        if (place) fetchOrgs();
    }, [place]);

    if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-dark-green" size={32} /></div>;

    if (orgs.length === 0) return (
        <div className="bg-white rounded-[40px] p-12 text-center border border-gray-100">
            <Building2 size={48} className="mx-auto text-dark-green opacity-20 mb-6" />
            <h3 className="text-xl font-black text-gray-900 mb-2">No Organizations Found</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">We couldn't find any registered organizations in {place}. Be the first to register!</p>
            <button className="bg-dark-green text-white px-8 py-3 rounded-2xl text-xs font-black shadow-xl shadow-dark-green/20">Register Organization</button>
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-700">
            {orgs.map(org => (
                <div key={org.id} className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start gap-6 group hover:shadow-xl transition-all">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 overflow-hidden">
                        {org.logo_url ? <img src={org.logo_url} className="w-full h-full object-cover" /> : <Landmark size={24} />}
                    </div>
                    <div className="flex-1 space-y-4">
                        <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-dark-green bg-dark-green/5 px-2 py-1 rounded-md">{org.industry}</span>
                            <h4 className="text-lg font-black text-gray-900 mt-2">{org.name}</h4>
                            <p className="text-xs text-gray-500 font-medium mt-1">{org.type} • {org.description?.substring(0, 60)}...</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                <MapPin size={12} className="text-gray-400" /> {org.address_zone || place}
                            </div>
                            {org.phone && (
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                    <Phone size={12} className="text-gray-400" /> {org.phone}
                                </div>
                            )}
                        </div>
                    </div>
                    <button className="bg-gray-900 text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap hover:bg-dark-green transition-colors mt-auto">Visit Office</button>
                </div>
            ))}
        </div>
    );
};

const MarketTab = ({ place }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Fetch products that might be relevant to this place
                // In a real app, 'location' field would be matched.
                // We'll simulate by just fetching latest active products
                const { data, error } = await supabase
                    .from('products')
                    .select('*, seller:profiles(first_name)')
                    .eq('status', 'active')
                    // .ilike('location', `%${place}%`) // Uncomment if location column exists in products and matches place format
                    .limit(6);

                if (error) throw error;
                setProducts(data || []);
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [place]);

    if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-dark-green" size={32} /></div>;

    if (products.length === 0) return (
        <div className="bg-white rounded-[40px] p-12 text-center border border-gray-100">
            <ShoppingBag size={48} className="mx-auto text-dark-green opacity-20 mb-6" />
            <h3 className="text-xl font-black text-gray-900 mb-2">Marketplace Empty</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">No products listed in {place} yet.</p>
            <button className="bg-dark-green text-white px-8 py-3 rounded-2xl text-xs font-black shadow-xl shadow-dark-green/20">Sell Item</button>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
            {products.map(product => (
                <div key={product.id} className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100 group relative flex flex-col hover:shadow-xl transition-all">
                    <div className="aspect-square bg-gray-50 relative overflow-hidden">
                        <img src={product.image_urls?.[0] || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e'} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-4 left-4">
                            <span className="bg-white/80 backdrop-blur-md text-gray-900 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                                {product.price} ETB
                            </span>
                        </div>
                    </div>
                    <div className="p-6">
                        <h4 className="font-black text-gray-900 mb-1 truncate">{product.name}</h4>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">{product.category}</p>
                        <button className="w-full bg-gray-50 text-gray-900 py-3 rounded-xl text-xs font-black hover:bg-dark-green hover:text-white transition-colors">View Details</button>
                    </div>
                </div>
            ))}
            <div className="col-span-full mt-6 text-center">
                <button className="bg-gray-900 text-white px-8 py-3 rounded-2xl text-xs font-black shadow-xl hover:bg-dark-green transition-all">View All in {place}</button>
            </div>
        </div>
    );
};

const AgentsTab = ({ place }) => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock fetching agents for now, or real if table exists
        const fetchAgents = async () => {
            setLoading(true);
            // Simulate network delay
            await new Promise(r => setTimeout(r, 1000));
            setAgents([
                { id: 1, name: "Abebe Kebede", role: "Local Guide", rating: 4.8, users: 120, image: null },
                { id: 2, name: "Sara Tadesse", role: "Real Estate", rating: 4.9, users: 85, image: null },
            ]);
            setLoading(false);
        };
        fetchAgents();
    }, [place]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Become Agent CTA */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                    <h3 className="text-2xl font-black mb-2">Represent {place}</h3>
                    <p className="text-white/60 text-sm font-medium max-w-md">Become an official ahaze agent. Help locals, verify businesses, and earn income.</p>
                </div>
                <button className="bg-white text-gray-900 px-8 py-4 rounded-[24px] text-xs font-black uppercase tracking-widest hover:bg-accent-yellow hover:scale-105 transition-all shadow-xl relative z-10 whitespace-nowrap">
                    Apply Now
                </button>
            </div>

            {/* Agent List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map(agent => (
                    <div key={agent.id} className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-all">
                        <div className="w-24 h-24 bg-gray-50 rounded-full mb-4 flex items-center justify-center text-gray-400 font-black text-2xl border-4 border-white shadow-lg">
                            {agent.name.charAt(0)}
                        </div>
                        <h4 className="text-lg font-black text-gray-900">{agent.name}</h4>
                        <p className="text-green-600 text-[10px] font-black uppercase tracking-widest mb-4">{agent.role}</p>

                        <div className="grid grid-cols-2 gap-4 w-full mb-6">
                            <div className="bg-gray-50 rounded-2xl p-3">
                                <p className="text-lg font-black text-gray-900">{agent.rating}</p>
                                <p className="text-[9px] text-gray-400 uppercase font-black">Rating</p>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-3">
                                <p className="text-lg font-black text-gray-900">{agent.users}</p>
                                <p className="text-[9px] text-gray-400 uppercase font-black">Clients</p>
                            </div>
                        </div>
                        <button className="w-full bg-dark-green text-white py-3 rounded-2xl text-xs font-black hover:bg-gray-900 transition-colors">Contact Agent</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const InfoStat = ({ label, value, icon }) => (
    <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-gray-400 uppercase text-[9px] font-black tracking-widest">{icon} {label}</div>
        <div className="text-gray-900 font-black text-base">{value}</div>
    </div>
);

export default Places;
