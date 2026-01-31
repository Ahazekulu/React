import React, { useState, useEffect, useCallback } from 'react';
import { Flag, MapPin, Building2, School, Sparkles, Globe, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

import PostInputArea from '../../components/posts/PostInputArea';
import PostCard from '../../components/posts/PostCard';
import MediaViewerOverlay from '../../components/posts/MediaViewerOverlay';

const Connect = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('country');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerPost, setViewerPost] = useState(null);
    const [viewerIndex, setViewerIndex] = useState(0);
    const [viewedPostIds, setViewedPostIds] = useState([]);

    const tabs = [
        { id: 'country', label: 'My Country', icon: <Flag size={14} />, color: 'bg-emerald-500' },
        { id: 'region', label: 'My Region', icon: <Globe size={14} />, color: 'bg-blue-500' },
        { id: 'zone', label: 'My Zone', icon: <MapPin size={14} />, color: 'bg-amber-500' },
        { id: 'woreda', label: 'My Woreda', icon: <MapPin size={14} />, color: 'bg-rose-500' },
        { id: 'kebele', label: 'My Kebele', icon: <MapPin size={14} />, color: 'bg-indigo-500' },
        { id: 'community', label: 'My Community', icon: <Building2 size={14} />, color: 'bg-cyan-500' },
        { id: 'workplace', label: 'Workplace', icon: <Building2 size={14} />, color: 'bg-slate-500' },
        { id: 'school', label: 'My School', icon: <School size={14} />, color: 'bg-purple-500' },
    ];

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('connect_posts')
                .select('*, author:profiles(first_name, avatar_url), likes(user_id), saves_count, views_count')
                .eq('level_scope', activeTab)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (err) {
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => { fetchPosts(); }, [fetchPosts]);

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

    const handlePostSuccess = () => {
        fetchPosts();
    };

    return (
        <div className="max-w-3xl mx-auto flex flex-col gap-10 animate-in fade-in duration-1000 pb-20">
            {/* Contextual Header */}
            <div className="flex flex-col gap-2 ml-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${tabs.find(t => t.id === activeTab)?.color || 'bg-dark-green'} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-dark-green/10`}>
                        {tabs.find(t => t.id === activeTab)?.icon}
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">{tabs.find(t => t.id === activeTab)?.label}</h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Connect with your local circle</p>
                    </div>
                </div>
            </div>

            {/* Premium Tab Navigation (flex-wrap for better responsive) */}
            <div className="bg-white/50 backdrop-blur-xl rounded-[32px] p-3 border border-gray-100 shadow-sm">
                <div className="flex flex-wrap gap-2 sm:gap-3">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-3 rounded-[20px] text-[11px] sm:text-xs font-black transition-all active:scale-95 ${
                                activeTab === tab.id
                                    ? 'bg-gray-900 text-white shadow-md shadow-gray-300/40'
                                    : 'text-gray-500 bg-gray-50 hover:bg-white hover:text-gray-900'
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

            {user && (
                <PostInputArea
                    place={tabs.find(t => t.id === activeTab)?.label}
                    levelScope={activeTab}
                    onPostSuccess={handlePostSuccess}
                />
            )}

            <div className="space-y-10">
                {loading ? (
                    <div className="grid gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-gray-50 h-64 rounded-[48px] animate-pulse border border-gray-100/50" />
                        ))}
                    </div>
                ) : posts.length > 0 ? (
                    posts.map((post, i) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            index={i}
                            user={user}
                            onOpenMedia={(index) => openMediaViewer(post, index)}
                        />
                    ))
                ) : (
                    <div className="py-32 text-center bg-white rounded-[48px] border-2 border-dashed border-gray-100 flex flex-col items-center gap-6">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                            <Sparkles size={40} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Peace and Quiet</p>
                            <p className="text-xs text-gray-400 font-bold mt-2">Be the first to break the silence in this circle.</p>
                        </div>
                    </div>
                )}
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

const Clock = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
);

export default Connect;
