import React, { useState, useEffect } from 'react';
import { Flag, MapPin, Building2, School, Share2, MessageSquare, Heart, Bookmark, Download, Camera, Video, Mic, Send, MoreHorizontal, Loader2, X, Globe, Sparkles } from 'lucide-react';
import { supabase, uploadMedia } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

const Connect = () => {
    const { user, profile } = useAuth();
    const [activeTab, setActiveTab] = useState('country');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPostContent, setNewPostContent] = useState('');
    const [media, setMedia] = useState(null);
    const [isPosting, setIsPosting] = useState(false);

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

    useEffect(() => {
        fetchPosts();
    }, [activeTab]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
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
        if ((!newPostContent.trim() && !media) || !user) return;
        setIsPosting(true);

        try {
            let mediaUrl = null;
            if (media) {
                mediaUrl = await uploadMedia(media.file, 'posts', user.id);
            }

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
                    media_urls: mediaUrl ? [mediaUrl] : [],
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
            setMedia(null);
        } catch (err) {
            console.error('Error creating post:', err);
            alert('Failed to post: ' + err.message);
        } finally {
            setIsPosting(false);
        }
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

            {/* Premium Tab Navigation */}
            <div className="bg-white/50 backdrop-blur-xl rounded-[32px] p-2 border border-gray-100 flex items-center gap-1 overflow-x-auto no-scrollbar shadow-sm">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 rounded-[24px] text-xs font-black transition-all whitespace-nowrap active:scale-95 ${activeTab === tab.id
                            ? 'bg-gray-900 text-white shadow-2xl shadow-gray-200 -translate-y-0.5'
                            : 'text-gray-400 hover:text-gray-900 hover:bg-white'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Create Post Card */}
            {user && (
                <div className="bg-white rounded-[48px] p-10 shadow-2xl shadow-gray-200/40 border border-gray-100/50 group transition-all">
                    <div className="flex gap-6">
                        <div className="relative">
                            <div className="w-14 h-14 bg-gray-50 rounded-3xl flex-shrink-0 flex items-center justify-center font-black text-gray-900 overflow-hidden shadow-sm border border-gray-100">
                                {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : (profile?.first_name?.charAt(0) || 'U')}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full" />
                        </div>
                        <div className="flex-1 space-y-6">
                            <textarea
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                placeholder={`What's happening in ${tabs.find(t => t.id === activeTab)?.label}?`}
                                disabled={isPosting}
                                className="w-full bg-gray-50/50 border-none rounded-[32px] p-8 text-base font-medium placeholder:text-gray-400 focus:ring-4 focus:ring-gray-900/5 focus:bg-white transition-all min-h-[160px] resize-none outline-none shadow-inner"
                            />

                            {media && (
                                <div className="relative w-full aspect-video rounded-3xl overflow-hidden group/media shadow-xl border border-gray-100">
                                    <img src={media.url} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/media:opacity-100 transition-opacity" />
                                    <button onClick={() => setMedia(null)} className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md text-gray-900 rounded-2xl flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all transform hover:scale-110 active:scale-90">
                                        <X size={20} />
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <label className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 rounded-2xl hover:text-gray-900 hover:bg-white hover:shadow-lg transition-all active:scale-90 cursor-pointer">
                                        <Camera size={22} />
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) setMedia({ file, url: URL.createObjectURL(file), type: 'image' });
                                        }} />
                                    </label>
                                    <label className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 rounded-2xl hover:text-gray-900 hover:bg-white hover:shadow-lg transition-all active:scale-90 cursor-pointer">
                                        <Video size={22} />
                                        <input type="file" className="hidden" accept="video/*" onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) setMedia({ file, url: URL.createObjectURL(file), type: 'video' });
                                        }} />
                                    </label>
                                    <button className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 rounded-2xl hover:text-gray-900 hover:bg-white hover:shadow-lg transition-all active:scale-90">
                                        <Mic size={22} />
                                    </button>
                                </div>
                                <button
                                    onClick={handleCreatePost}
                                    disabled={(!newPostContent.trim() && !media) || isPosting}
                                    className={`px-12 py-4 rounded-[24px] text-sm font-black transition-all shadow-2xl flex items-center gap-3 active:scale-95 ${(!newPostContent.trim() && !media) || isPosting
                                        ? 'bg-gray-100 text-gray-300 shadow-none'
                                        : 'bg-gray-900 text-white shadow-gray-200 hover:-translate-y-1'
                                        }`}
                                >
                                    {isPosting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                    {isPosting ? 'Publishing...' : 'Share Update'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Indicator */}
            <div className="flex items-center gap-4 px-6">
                <div className="flex-1 h-[1px] bg-gray-100" />
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">
                    <Sparkles size={12} className="text-amber-400" /> Recent Content
                </div>
                <div className="flex-1 h-[1px] bg-gray-100" />
            </div>

            {/* Feed Content */}
            <div className="space-y-10">
                {loading ? (
                    <div className="grid gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-gray-50 h-64 rounded-[48px] animate-pulse border border-gray-100/50" />
                        ))}
                    </div>
                ) : posts.length > 0 ? (
                    posts.map((post, i) => (
                        <PostCard key={post.id} post={post} index={i} user={user} />
                    ))
                ) : (
                    <div className="py-32 text-center bg-white rounded-[48px] border-2 border-dashed border-gray-100 flex flex-col items-center gap-6">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                            <MessageSquare size={40} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Peace and Quiet</p>
                            <p className="text-xs text-gray-400 font-bold mt-2">Be the first to break the silence in this circle.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const PostCard = ({ post, index, user }) => {
    return (
        <div
            className="bg-white rounded-[56px] p-10 md:p-12 shadow-xl shadow-gray-100 border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all group animate-in slide-in-from-bottom-8 duration-700"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="w-14 h-14 bg-gray-50 text-gray-900 rounded-[24px] overflow-hidden flex items-center justify-center font-black shadow-sm border border-gray-100 transition-transform group-hover:scale-105 duration-500">
                            {post.author?.avatar_url ? (
                                <img src={post.author.avatar_url} className="w-full h-full object-cover" />
                            ) : (
                                post.author?.first_name?.charAt(0) || 'U'
                            )}
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-50">
                            <Sparkles size={10} className="text-amber-400" />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-[17px] font-black text-gray-900 tracking-tight">{post.author?.first_name || 'Citizen'}</h4>
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.15em] mt-1.5">
                            <span className="text-gray-300 flex items-center gap-1.5"><Clock size={12} className="text-gray-200" /> {new Date(post.created_at).toLocaleDateString()}</span>
                            <span className="w-1 h-1 bg-gray-200 rounded-full" />
                            <span className="flex items-center gap-1.5 text-gray-900 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                <MapPin size={10} className="text-dark-green" /> {post.location_name}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="relative group/menu">
                    <button className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all">
                        <MoreHorizontal size={24} />
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-3xl shadow-2xl border border-gray-100 p-2 hidden group-hover/menu:block z-20 animate-in zoom-in-95">
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

            {/* Content */}
            <div className="space-y-8">
                <p className="text-gray-700 text-lg leading-relaxed font-medium tracking-tight">
                    {post.content}
                </p>

                {post.media_urls && post.media_urls.length > 0 && (
                    <div className="rounded-[40px] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm transition-transform duration-700 group-hover:scale-[1.01]">
                        <img
                            src={post.media_urls[0]}
                            alt="Post media"
                            className="w-full max-h-[600px] object-cover mx-auto"
                        />
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-10 pt-8 border-t border-gray-50">
                <div className="flex items-center gap-10">
                    <button className="flex items-center gap-3 text-[13px] font-black text-gray-400 hover:text-accent-red transition-all group/btn active:scale-90">
                        <div className="w-11 h-11 rounded-2xl bg-gray-50 group-hover/btn:bg-red-50 flex items-center justify-center transition-colors">
                            <Heart size={22} className="group-hover/btn:fill-accent-red transition-all" />
                        </div>
                        <span className="group-hover/btn:text-gray-900 transition-colors">{post.likes_count || 0}</span>
                    </button>
                    <button className="flex items-center gap-3 text-[13px] font-black text-gray-400 hover:text-blue-500 transition-all group/btn active:scale-90">
                        <div className="w-11 h-11 rounded-2xl bg-gray-50 group-hover/btn:bg-blue-50 flex items-center justify-center transition-colors">
                            <MessageSquare size={22} className="transition-all" />
                        </div>
                        <span className="group-hover/btn:text-gray-900 transition-colors">48</span>
                    </button>
                    <button className="flex items-center gap-3 text-[13px] font-black text-gray-400 hover:text-dark-green transition-all group/btn active:scale-90">
                        <div className="w-11 h-11 rounded-2xl bg-gray-50 group-hover/btn:bg-emerald-50 flex items-center justify-center transition-colors">
                            <Share2 size={22} className="transition-all" />
                        </div>
                        <span className="group-hover/btn:text-gray-900 transition-colors">Share</span>
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <button className="w-12 h-12 flex items-center justify-center text-gray-300 hover:text-emerald-500 bg-gray-50 hover:bg-emerald-50 rounded-2xl transition-all shadow-sm active:scale-90">
                        <Download size={22} />
                    </button>
                    <button className="w-12 h-12 flex items-center justify-center text-gray-300 hover:text-amber-500 bg-gray-50 hover:bg-amber-50 rounded-2xl transition-all shadow-sm active:scale-90">
                        <Bookmark size={22} />
                    </button>
                </div>
            </div>
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
