import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Info, MessageSquare, ShoppingBag, Landmark, Users, History, Map as MapIcon, ChevronRight, Search, Calendar, Star, ShieldCheck, Zap, Building2, Globe, Cloud, AlertTriangle, Phone, Mail, ExternalLink, Mountain, Droplets, BookOpen, Loader2, Clock, Camera, Flag } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import placesData from '../../data/places.json';

import PostInputArea from '../../components/posts/PostInputArea';
import PostCard from '../../components/posts/PostCard';
import MediaViewerOverlay from '../../components/posts/MediaViewerOverlay';

const Places = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('post');
    const [searchParams] = useSearchParams();
    const [selectedLevels, setSelectedLevels] = useState({
        region: '',
        zone: '',
        woreda: '',
        kebele: ''
    });
    const [posts, setPosts] = useState([]);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerPost, setViewerPost] = useState(null);
    const [viewerIndex, setViewerIndex] = useState(0);
    const [viewedPostIds, setViewedPostIds] = useState([]); // Track viewed posts for view count

    // Custom hook to handle URL state synchronization without ESLint warnings
    const useUrlStateSync = (searchParams) => {
        const [isInitialized, setIsInitialized] = useState(false);
        
        useEffect(() => {
            const region = searchParams.get('region') || '';
            const zone = searchParams.get('zone') || '';
            const woreda = searchParams.get('woreda') || '';
            const kebele = searchParams.get('kebele') || '';

            if ((region || zone || woreda || kebele) && !isInitialized) {
                const newState = { region, zone, woreda, kebele };
                
                // Apply cascading logic
                if (region && !zone && !woreda && !kebele) { 
                    newState.zone = ''; 
                    newState.woreda = ''; 
                    newState.kebele = ''; 
                }
                if (zone && !woreda && !kebele) { 
                    newState.woreda = ''; 
                    newState.kebele = ''; 
                }
                if (woreda && !kebele) { 
                    newState.kebele = ''; 
                }
                
                setSelectedLevels(newState);
                setIsInitialized(true);
            }
        }, [searchParams, isInitialized]);

        return isInitialized;
    };

    // Initialize URL state sync
    useUrlStateSync(searchParams, selectedLevels);

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
            () => {
                alert("Unable to retrieve your location.");
            }
        );
    };

    const tabs = [
        { id: 'post', label: 'Post', icon: <MessageSquare size={16} /> },
        { id: 'saved', label: 'Saved', icon: <Star size={16} /> },
        { id: 'know', label: 'Know', icon: <Info size={16} /> },
        { id: 'map', label: 'Map', icon: <MapIcon size={16} /> },
        { id: 'latest', label: 'Latest', icon: <Zap size={16} /> },
        { id: 'kulu', label: 'At ahazeKulu', icon: <Landmark size={16} /> },
        { id: 'market', label: 'Market', icon: <ShoppingBag size={16} /> },
        { id: 'orgs', label: 'Organizations', icon: <Building2 size={16} /> },
        { id: 'events', label: 'Events', icon: <Calendar size={16} /> },
        { id: 'agents', label: 'Our Agents', icon: <Users size={16} /> },
    ];

    const fetchPosts = useCallback(async () => {
        try {
            const { data } = await supabase
                .from('connect_posts')
                .select('*, author:profiles(first_name, avatar_url), likes(user_id), saves_count, views_count')
                .eq('location_name', displayPlace)
                .order('created_at', { ascending: false });
            setPosts(data || []);
        } catch (err) { console.error('Error fetching posts:', err); }
    }, [displayPlace]);

    // Increment view count when media viewer is opened
    const incrementViewsIfNeeded = async (post) => {
        if (!user || !post?.id) return;
        if (viewedPostIds.includes(post.id)) return; // Only count once per session

        setViewedPostIds(prev => [...prev, post.id]);
        try {
            const currentViews = post.views_count || 0;
            const { data, error } = await supabase
                .from('connect_posts')
                .update({ views_count: currentViews + 1 })
                .eq('id', post.id)
                .select('id, views_count')
                .single();

            if (!error && data) {
                setPosts(prev =>
                    prev.map(p => p.id === data.id ? { ...p, views_count: data.views_count } : p)
                ); // Update local state with new view count
            }
        } catch (err) {
            console.error('Error incrementing views:', err);
        }
    };

    const openMediaViewer = async (post, index) => {
        if (!post || !post.media_urls || post.media_urls.length === 0) return;
        setViewerPost(post);
        setViewerIndex(index);
        setViewerOpen(true);
        await incrementViewsIfNeeded(post);
    };

    const closeMediaViewer = () => {
        setViewerOpen(false);
        setViewerPost(null);
        setViewerIndex(0);
    };

    const goToMediaIndex = (nextIndex) => {
        if (!viewerPost || !viewerPost.media_urls) return;
        if (nextIndex < 0 || nextIndex >= viewerPost.media_urls.length) return;
        setViewerIndex(nextIndex);
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchPosts();
        };
        fetchData();
    }, [fetchPosts]); // Re-fetch on place or user change

    const handlePostSuccess = () => {
        fetchPosts(); // Refresh posts after a successful submission
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
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

                    <div className="flex flex-wrap items-center gap-1.5">
                        <button onClick={handleUseMyLocation} className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-gray-50 border-2 border-transparent hover:border-dark-green text-gray-400 hover:text-dark-green transition-all" title="Use My Location">
                            <MapPin size={18} />
                            <span className="text-[7px] font-black uppercase tracking-widest mt-0.5">GPS</span>
                        </button>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Region</span>
                            <select value={selectedLevels.region} onChange={(e) => handleLevelChange('region', e.target.value)} className="bg-gray-50 border-2 border-transparent rounded-lg px-3 py-2 text-xs font-black text-gray-700 outline-none focus:bg-white focus:border-dark-green transition-all">
                                <option value="">Select Region</option>
                                {regions.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{selectedLevels.region === 'Addis Ababa' ? 'Subcity' : 'Zone'}</span>
                            <select value={selectedLevels.zone} onChange={(e) => handleLevelChange('zone', e.target.value)} className="bg-gray-50 border-2 border-transparent rounded-xl px-4 py-2.5 text-xs font-black text-gray-700 outline-none focus:bg-white focus:border-dark-green transition-all" disabled={!selectedLevels.region}>
                                <option value="">Select {selectedLevels.region === 'Addis Ababa' ? 'Subcity' : 'Zone'}</option>
                                {zones.map(z => <option key={z} value={z}>{z}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Woreda</span>
                            <select value={selectedLevels.woreda} onChange={(e) => handleLevelChange('woreda', e.target.value)} className="bg-gray-50 border-2 border-transparent rounded-xl px-4 py-2.5 text-xs font-black text-gray-700 outline-none focus:bg-white focus:border-dark-green transition-all" disabled={!selectedLevels.zone}>
                                <option value="">Select Woreda</option>
                                {woredas.map(w => <option key={w} value={w}>{w}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kebele</span>
                            <select value={selectedLevels.kebele} onChange={(e) => handleLevelChange('kebele', e.target.value)} className="bg-gray-50 border-2 border-transparent rounded-xl px-4 py-2.5 text-xs font-black text-gray-700 outline-none focus:bg-white focus:border-dark-green transition-all" disabled={!selectedLevels.woreda}>
                                <option value="">Select Kebele</option>
                                {kebeles.map(k => <option key={k} value={k}>{k}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-3 rounded-2xl text-[11px] sm:text-xs font-black transition-all active:scale-95 ${
                                activeTab === tab.id
                                    ? 'bg-dark-green text-white shadow-md shadow-dark-green/20'
                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                            }`}
                        >
                            <span className="text-gray-400 sm:inline-block hidden">
                                {tab.icon}
                            </span>
                            <span className="truncate">{tab.label}</span>
                        </button>
                    ))}
                </div>
                </div>
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'post' && (
                    <PostInputArea
                        place={displayPlace}
                        locationData={selectedLevels}
                        levelScope={selectedLevels.kebele || selectedLevels.woreda || selectedLevels.zone ? (selectedLevels.kebele ? 'kebele' : selectedLevels.woreda ? 'woreda' : 'zone') : 'region'}
                        onPostSuccess={handlePostSuccess}
                    />
                )}
                {activeTab === 'saved' && <SavedTab user={user} onOpenMedia={openMediaViewer} />}
                {activeTab === 'know' && <KnowTab placeName={displayPlace} location={selectedLevels} />}
                {activeTab === 'map' && <MapTab place={displayPlace} />}
                {activeTab === 'latest' && <LatestTab place={displayPlace} />}
                {activeTab === 'kulu' && <AtAhazeKuluTab place={displayPlace} />}
                {activeTab === 'market' && <MarketTab place={displayPlace} />}
                {activeTab === 'orgs' && <OrganizationsTab place={displayPlace} />}
                {activeTab === 'events' && <EventsTab place={displayPlace} />}
                {activeTab === 'agents' && <AgentsTab place={displayPlace} />}
            </div>

            <div className="space-y-1">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} user={user} onOpenMedia={(index) => openMediaViewer(post, index)} />
                ))}
            </div>

            {viewerOpen && viewerPost && (
                <MediaViewerOverlay
                    post={viewerPost}
                    currentIndex={viewerIndex}
                    onClose={closeMediaViewer}
                    onPrev={() => goToMediaIndex(viewerIndex - 1)}
                    onNext={() => goToMediaIndex(viewerIndex + 1)}
                    onJump={goToMediaIndex}
                />
            )}
        </div>
    );
};

/* Sub-components */

const KnowTab = ({ placeName, location }) => {
    const [placeInfo, setPlaceInfo] = useState(null);

    const fetchPlaceInfo = useCallback(async () => {
        try {
            const { data } = await supabase.from('places').select('*').eq('name', placeName).maybeSingle();
            setPlaceInfo(data);
        } catch (err) {
            console.error('Error fetching place info:', err);
        }
    }, [placeName]);

    useEffect(() => {
        if (placeName) {
            const timer = setTimeout(() => {
                fetchPlaceInfo();
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [placeName, fetchPlaceInfo]);

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
                    <div className="space-y-3">
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

const EventsTab = ({ place }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            setError(null);
            try {
                // Try different query approaches to handle potential table structure issues
                let query = supabase.from('events').select('*');
                
                // Check if location_name column exists, otherwise try location
                if (place && place !== 'Ethiopia') {
                    query = query.or(`location_name.eq.${place},location.eq.${place}`);
                }
                
                query = query.order('event_date', { ascending: true });
                
                const { data, error: fetchError } = await query;
                
                if (fetchError) {
                    console.error('Error fetching events:', fetchError);
                    setError('Failed to load events');
                    setEvents([]);
                } else {
                    setEvents(data || []);
                }
            } catch (err) {
                console.error('Error fetching events:', err);
                setError('Failed to load events');
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [place]);

    if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-dark-green" size={40} /></div>;
    if (error) return <div className="py-20 flex justify-center text-red-500 text-sm">{error}</div>;
    if (events.length === 0) return (
        <div className="bg-white rounded-[40px] p-12 text-center border border-gray-100">
            <Calendar size={48} className="mx-auto text-dark-green opacity-20 mb-6" />
            <h3 className="text-xl font-black text-gray-900 mb-2">No Events Found</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">No events scheduled for {place} at this time.</p>
            <button className="bg-dark-green text-white px-8 py-3 rounded-2xl text-xs font-black shadow-xl shadow-dark-green/20">Create Event</button>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map(event => (
                <div key={event.id} className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row">
                    {event.media_url && <img src={event.media_url} className="md:w-48 h-48 md:h-auto object-cover" />}
                    <div className="p-8 flex-1">
                        <div className="flex items-center gap-2 text-[10px] font-black text-accent-red uppercase tracking-[0.2em] mb-3">
                            <Calendar size={12} /> {event.event_date || 'TBD'} @ {event.event_time || 'TBD'}
                        </div>
                        <h4 className="text-xl font-black text-gray-900 mb-3">{event.title || 'Event Title'}</h4>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-6">{event.description || 'Event description not available.'}</p>
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
        <p className="text-gray-500 text-sm">Interactive map will be implemented here</p>
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

const AtAhazeKuluTab = () => (
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

    useEffect(() => {
        const fetchOrgs = async () => {
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
            }
        };

        if (place) fetchOrgs();
    }, [place]);

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

    useEffect(() => {
        const fetchProducts = async () => {
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
            }
        };
        fetchProducts();
    }, [place]);

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

    useEffect(() => {
        // Mock fetching agents for now, or real if table exists
        const fetchAgents = async () => {
            // Simulate network delay
            await new Promise(r => setTimeout(r, 1000));
            setAgents([
                { id: 1, name: "Abebe Kebede", role: "Local Guide", rating: 4.8, users: 120, image: null },
                { id: 2, name: "Sara Tadesse", role: "Real Estate", rating: 4.9, users: 85, image: null },
            ]);
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

const SavedTab = ({ user, onOpenMedia }) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const loadSaved = async () => {
            if (!user) {
                setPosts([]);
                return;
            }
            try {
                const { data: savedRows, error: savedError } = await supabase
                    .from('saved_posts')
                    .select('post_id')
                    .eq('user_id', user.id);

                if (savedError) throw savedError;
                const ids = (savedRows || []).map(r => r.post_id);
                if (ids.length === 0) {
                    setPosts([]);
                    return;
                }

                const { data: postData, error: postsError } = await supabase
                    .from('connect_posts')
                    .select('*, author:profiles(first_name, avatar_url), likes(user_id), saves_count, views_count')
                    .in('id', ids)
                    .order('created_at', { ascending: false });

                if (postsError) throw postsError;
                setPosts(postData || []);
            } catch (err) {
                console.error('Error loading saved posts:', err);
            }
        };

        loadSaved();
    }, [user]);

    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerPost, setViewerPost] = useState(null);
    const [viewerIndex, setViewerIndex] = useState(0);

    const closeMediaViewer = () => {
        setViewerOpen(false);
        setViewerPost(null);
        setViewerIndex(0);
    };

    const goToMediaIndex = (nextIndex) => {
        if (!viewerPost || !viewerPost.media_urls) return;
        if (nextIndex < 0 || nextIndex >= viewerPost.media_urls.length) return;
        setViewerIndex(nextIndex);
    };

    if (!user) {
        return (
            <div className="bg-white rounded-[32px] p-10 border border-gray-100 text-center">
                <p className="text-sm font-black text-gray-900 mb-2">Sign in to view saved content</p>
                <p className="text-xs text-gray-500">Your saved posts across ahazePlaces will appear here.</p>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="bg-white rounded-[32px] p-10 border border-gray-100 text-center">
                <Star size={32} className="mx-auto text-yellow-400 mb-3" />
                <p className="text-sm font-black text-gray-900 mb-1">No saved posts yet</p>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                    Tap the star icon on any post in ahazePlaces or ahazeConnect to save it here for later.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {posts.map(post => (
                <PostCard
                    key={post.id}
                    post={post}
                    user={user}
                    onOpenMedia={(index) => onOpenMedia(post, index)}
                />
            ))}

            {viewerOpen && viewerPost && (
                <MediaViewerOverlay
                    post={viewerPost}
                    currentIndex={viewerIndex}
                    onClose={closeMediaViewer}
                    onPrev={() => goToMediaIndex(viewerIndex - 1)}
                    onNext={() => goToMediaIndex(viewerIndex + 1)}
                    onJump={goToMediaIndex}
                />
            )}
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
