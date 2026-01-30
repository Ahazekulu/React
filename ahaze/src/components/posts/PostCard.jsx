import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Heart, Share2, Star, Upload, FileText, Music, Eye, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const PostActionButton = ({ icon, label, isActive, activeColor = "text-dark-green", onClick }) => (
    <button onClick={onClick} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${isActive ? activeColor : 'text-gray-400 hover:' + activeColor}`}>
        {icon}
        {label && <span className="hidden sm:inline">{label}</span>}
    </button>
);

const PostCard = ({ post, user, onOpenMedia }) => {
    const initialLiked = post.likes && post.likes.some(l => l.user_id === user?.id);
    const [liked, setLiked] = useState(initialLiked);
    const [likeCount, setLikeCount] = useState(post.likes ? post.likes.length : 0);
    const [saved, setSaved] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);

    useEffect(() => {
        if (post.likes) {
            const isLiked = post.likes.some(l => l.user_id === user?.id);
            setLiked(isLiked);
            setLikeCount(post.likes.length);
        }
        // This part is now handled by the separate useEffect for saved status
        // if (post.saves_count !== undefined && post.saves_count !== null) {
        //     setSaved(post.saves_count > 0 && post.saved_by_user);
        //     setSaveCount(post.saves_count);
        // }
    }, [post.likes, user?.id]);

    const handleLike = async () => {
        if (!user) return;

        const previousLiked = liked;
        const previousCount = likeCount;
        setLiked(!liked);
        setLikeCount(prev => liked ? prev - 1 : prev + 1);

        try {
            if (previousLiked) {
                const { error } = await supabase.from('likes').delete().eq('post_id', post.id).eq('user_id', user.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('likes').insert([{ post_id: post.id, user_id: user.id }]);
                if (error) throw error;
            }
        } catch (err) {
            console.error("Like failed:", err);
            setLiked(previousLiked);
            setLikeCount(previousCount);
        }
    };

    const handleToggleSave = useCallback(async () => {
        if (!user) return;

        const previousSaved = saved;
        const previousCount = saveCount;
        setSaved(!saved);
        setSaveCount(prev => saved ? Math.max(prev - 1, 0) : prev + 1);

        try {
            if (previousSaved) {
                // If it was previously saved, attempt to delete (unsave)
                const { error } = await supabase
                    .from('saved_posts')
                    .delete()
                    .eq('post_id', post.id)
                    .eq('user_id', user.id);
                if (error) throw error;
            } else {
                // If it was previously unsaved, attempt to insert (save)
                const { error } = await supabase
                    .from('saved_posts')
                    .insert([{ post_id: post.id, user_id: user.id }]);
                if (error) throw error;
            }

            // Update the global saves_count on the connect_posts table
            const { data, error: updateError } = await supabase
                .from('connect_posts')
                .update({ saves_count: previousSaved ? previousCount - 1 : previousCount + 1 })
                .eq('id', post.id)
                .select('saves_count')
                .single();

            if (!updateError && data) {
                setSaveCount(data.saves_count || 0);
            }
        } catch (err) {
            console.error('Save toggle failed:', err);
            // Revert optimistic UI update on error
            setSaved(previousSaved);
            setSaveCount(previousCount);
            alert('Failed to toggle save status. Please try again.');
        }
    }, [saved, saveCount, user, post.id]);

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
                    <MessageSquare size={18} />
                </button>
            </div>

            <p className="text-gray-800 text-[15px] leading-relaxed mb-5 whitespace-pre-wrap">{post.content}</p>

            {post.media_urls?.length > 0 && (
                <div className="mb-6 space-y-2">
                    <div className={`grid gap-2 ${post.media_urls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {post.media_urls.map((url, idx) => {
                            const isVideo = url.endsWith('.webm') || url.endsWith('.mp4') || (post.media_type === 'video' && idx === 0);
                            const isAudio = url.endsWith('.mp3') || (url.endsWith('.webm') && post.media_type === 'audio');
                            const isImage = !isVideo && !isAudio && (url.match(/\.(jpeg|jpg|gif|png)$/) != null || post.media_type === 'image' || post.media_type === 'gif');
                            const isDoc = !isVideo && !isAudio && !isImage;

                            const handleClick = () => {
                                if (onOpenMedia) onOpenMedia(idx);
                            };

                            if (isDoc) {
                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={handleClick}
                                        className="col-span-full flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:bg-gray-100 transition-colors text-left"
                                    >
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm"><FileText size={24} /></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900 truncate">Attached Document</p>
                                            <p className="text-xs text-gray-500 uppercase tracking-widest">Tap to preview</p>
                                        </div>
                                        <Upload size={16} className="text-gray-400" />
                                    </button>
                                );
                            }

                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={handleClick}
                                    className={`rounded-xl overflow-hidden border border-gray-100 bg-gray-50 relative ${post.media_urls.length === 1 ? 'aspect-video' : 'aspect-square'}`}
                                >
                                    {isVideo ? (
                                        <video src={url} className="w-full h-full object-cover" />
                                    ) : isAudio ? (
                                        <div className="flex items-center justify-center w-full h-full bg-gray-900 text-white">
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse"><Music size={32} /></div>
                                                <audio src={url} className="w-48" />
                                            </div>
                                        </div>
                                    ) : (
                                        <img src={url} alt="Post media" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    )}
                                </button>
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
                        label={saveCount > 0 ? saveCount : ""}
                        isActive={saved}
                        activeColor="text-yellow-500"
                        onClick={handleToggleSave}
                    />
                    <PostActionButton
                        icon={<Upload size={18} />}
                        onClick={() => {
                            if (post.media_urls?.[0]) window.open(post.media_urls[0], '_blank');
                        }}
                    />
                </div>
            </div>

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
                            <Send size={16} className="rotate-90" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PostCard;
