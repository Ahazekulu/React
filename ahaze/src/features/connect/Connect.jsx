import React, { useState, useEffect } from 'react';
import { Flag, MapPin, Building2, School, Share2, MessageSquare, Heart, Bookmark, Download, Camera, Video, Mic, Send, MoreHorizontal, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

const Connect = () => {
    const { user, profile } = useAuth();
    const [activeTab, setActiveTab] = useState('country');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPostContent, setNewPostContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    const tabs = [
        { id: 'country', label: 'My Country', icon: <Flag size={16} /> },
        { id: 'region', label: 'My Region', icon: <MapPin size={16} /> },
        { id: 'zone', label: 'My Zone', icon: <MapPin size={16} /> },
        { id: 'woreda', label: 'My Woreda', icon: <MapPin size={16} /> },
        { id: 'kebele', label: 'My Kebele', icon: <MapPin size={16} /> },
        { id: 'community', label: 'Community', icon: <Building2 size={16} /> },
        { id: 'workplace', label: 'WorkPlace', icon: <Building2 size={16} /> },
        { id: 'school', label: 'My School', icon: <School size={16} /> },
    ];

    useEffect(() => {
        fetchPosts();
    }, [activeTab]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            // In a real app, we'd filter by the user's actual location levels
            // For now, we fetch posts matching the level_scope
            const { data, error } = await supabase
                .from('connect_posts')
                .select(`
                    *,
                    author:profiles(first_name, avatar_url)
                `)
                .eq('level_scope', activeTab)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (err) {
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async () => {
        if (!newPostContent.trim() || !user) return;
        setIsPosting(true);

        try {
            // Determine location name based on profile data
            let locationName = 'Ethiopia';
            if (activeTab === 'region') locationName = profile?.region || 'Unknown Region';
            if (activeTab === 'zone') locationName = profile?.zone || 'Unknown Zone';
            if (activeTab === 'woreda') locationName = profile?.woreda || 'Unknown Woreda';
            if (activeTab === 'kebele') locationName = profile?.kebele || 'Unknown Kebele';

            const { data, error } = await supabase
                .from('connect_posts')
                .insert([{
                    author_id: user.id,
                    content: newPostContent,
                    level_scope: activeTab,
                    location_name: locationName,
                }])
                .select(`
                    *,
                    author:profiles(first_name, avatar_url)
                `)
                .single();

            if (error) throw error;

            setPosts([data, ...posts]);
            setNewPostContent('');
        } catch (err) {
            console.error('Error creating post:', err);
            alert('Failed to post: ' + err.message);
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto flex flex-col gap-6 animate-in fade-in duration-700">
            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 overflow-x-auto no-scrollbar sticky top-[72px] z-10">
                <div className="flex items-center gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black transition-all whitespace-nowrap active:scale-95 ${activeTab === tab.id
                                ? 'bg-light-blue text-white shadow-lg shadow-light-blue/20 -translate-y-0.5'
                                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Create Post */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                <div className="flex gap-4">
                    <div className="w-12 h-12 bg-light-blue/10 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-light-blue">
                        {profile?.first_name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 space-y-4">
                        <textarea
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            placeholder={user ? `Share something with ${tabs.find(t => t.id === activeTab).label}...` : "Please login to share..."}
                            disabled={!user || isPosting}
                            className="w-full bg-gray-50 border-none rounded-3xl p-6 text-sm font-medium focus:ring-2 focus:ring-light-blue transition-all min-h-[120px] resize-none outline-none"
                        />
                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2">
                                <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-light-blue hover:bg-light-blue/5 transition-all active:scale-90">
                                    <Camera size={20} />
                                </button>
                                <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-light-blue hover:bg-light-blue/5 transition-all active:scale-90">
                                    <Video size={20} />
                                </button>
                                <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-light-blue hover:bg-light-blue/5 transition-all active:scale-90">
                                    <Mic size={20} />
                                </button>
                            </div>
                            <button
                                onClick={handleCreatePost}
                                disabled={!newPostContent.trim() || isPosting || !user}
                                className={`px-10 py-3.5 rounded-2xl text-sm font-black transition-all shadow-xl flex items-center gap-2 active:scale-95 ${!newPostContent.trim() || !user || isPosting
                                    ? 'bg-gray-100 text-gray-300 shadow-none'
                                    : 'bg-light-blue text-white shadow-light-blue/20 hover:-translate-y-1'
                                    }`}
                            >
                                {isPosting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                                {isPosting ? 'Posting...' : 'Post News'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feed Content */}
            <div className="space-y-6">
                {loading ? (
                    <div className="py-20 flex justify-center">
                        <Loader2 className="animate-spin text-light-blue" size={40} />
                    </div>
                ) : posts.length > 0 ? (
                    posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))
                ) : (
                    <div className="py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100 italic text-gray-400 text-sm font-medium">
                        No posts in this circle yet. Be the first to share!
                    </div>
                )}
            </div>
        </div>
    );
};

const PostCard = ({ post }) => {
    return (
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all group animate-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-light-blue/5 text-light-blue rounded-2xl overflow-hidden flex items-center justify-center font-black">
                        {post.author?.first_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h4 className="font-black text-gray-900">{post.author?.first_name || 'System User'}</h4>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] mt-1 shrink-0">
                            <span className="text-gray-400">{new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="w-1 h-1 bg-gray-200 rounded-full" />
                            <span className="flex items-center gap-1 text-light-blue bg-light-blue/10 px-2 py-0.5 rounded-md">
                                <MapPin size={10} /> {post.location_name}
                            </span>
                        </div>
                    </div>
                </div>
                <button className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="space-y-6">
                <p className="text-gray-600 leading-relaxed font-medium">
                    {post.content}
                </p>

                {post.media_urls && post.media_urls.length > 0 && (
                    <div className="rounded-[32px] overflow-hidden bg-gray-50 border border-gray-100 max-h-[500px]">
                        <img src={post.media_urls[0]} alt="Post media" className="w-full h-full object-contain mx-auto" />
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-50">
                <div className="flex items-center gap-8">
                    <button className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-accent-red transition-all hover:scale-110 active:scale-90 group">
                        <Heart size={20} className="group-hover:fill-accent-red" /> 1.2k
                    </button>
                    <button className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-light-blue transition-all hover:scale-110 active:scale-90">
                        <MessageSquare size={20} /> 48
                    </button>
                    <button className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-dark-green transition-all hover:scale-110 active:scale-90">
                        <Share2 size={20} /> Share
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-3 text-gray-300 hover:text-light-blue bg-gray-50 rounded-2xl transition-all hover:scale-110 active:scale-90">
                        <Bookmark size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Connect;
