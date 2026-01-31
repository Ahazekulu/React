import React, { useEffect, useRef, useState, useMemo } from 'react';
import { X, FileText, Music, Eye, Heart, MessageSquare, Share2, MoreVertical } from 'lucide-react';

const MediaViewerOverlay = ({ posts, post, initialPostId, currentIndex, initialMediaIndex = 0, onClose }) => {
    // Handle both old format (single post) and new format (posts array)
    const mediaPosts = useMemo(() => {
        if (posts) {
            // New format: filter posts array
            return posts.filter(p => p.media_urls && p.media_urls.length > 0);
        } else if (post) {
            // Old format: single post
            return post.media_urls && post.media_urls.length > 0 ? [post] : [];
        }
        return [];
    }, [posts, post]);

    const initialIndex = useMemo(() => {
        if (posts && initialPostId) {
            return mediaPosts.findIndex(p => p.id === initialPostId);
        } else if (post) {
            return 0; // For single post, always start at 0
        }
        return 0;
    }, [posts, initialPostId, post, mediaPosts]);
    const [currentPostIndex, setCurrentPostIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
    const containerRef = useRef(null);

    // Scroll to initial post on mount
    useEffect(() => {
        if (containerRef.current && initialIndex >= 0) {
            const element = containerRef.current.children[initialIndex];
            if (element) {
                element.scrollIntoView({ behavior: 'auto' });
            }
        }
    }, [initialIndex]);

    // Track current visible post for auto-play
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const index = Math.round(container.scrollTop / container.clientHeight);
            if (index !== currentPostIndex && index >= 0 && index < mediaPosts.length) {
                setCurrentPostIndex(index);
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [currentPostIndex, mediaPosts.length]);

    if (mediaPosts.length === 0) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-black/20 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/40 transition-colors"
            >
                <X size={24} />
            </button>

            {/* Vertical Feed Container */}
            <div 
                ref={containerRef}
                className="flex-1 overflow-y-auto snap-y snap-mandatory scrollbar-hide"
                style={{ scrollBehavior: 'smooth' }}
            >
                {mediaPosts.map((post, index) => (
                    <div 
                        key={post.id} 
                        className="w-full h-full snap-start relative flex items-center justify-center bg-black"
                    >
                        <PostMediaItem 
                            post={post} 
                            isActive={index === currentPostIndex} 
                            initialMediaIndex={posts && initialPostId === post.id ? initialMediaIndex : (post && currentIndex !== undefined ? currentIndex : 0)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

const PostMediaItem = ({ post, isActive, initialMediaIndex = 0 }) => {
    const [currentMediaIndex, setCurrentMediaIndex] = useState(initialMediaIndex);
    const mediaContainerRef = useRef(null);

    // Scroll to initial media index on mount if needed
    useEffect(() => {
        if (initialMediaIndex > 0 && mediaContainerRef.current) {
            const element = mediaContainerRef.current.children[initialMediaIndex];
            if (element) {
                element.scrollIntoView({ behavior: 'auto' });
            }
        }
    }, [initialMediaIndex]);

    // Handle horizontal scroll for multiple media
    useEffect(() => {
        const container = mediaContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const index = Math.round(container.scrollLeft / container.clientWidth);
            if (index !== currentMediaIndex) {
                setCurrentMediaIndex(index);
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [currentMediaIndex]);

    const urls = post.media_urls || [];
    const hasMultiple = urls.length > 1;

    return (
        <div className="relative w-full h-full max-w-md mx-auto md:max-w-full md:flex md:items-center md:justify-center bg-black">
            {/* Media Carousel */}
            <div 
                ref={mediaContainerRef}
                className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            >
                {urls.map((url, idx) => (
                    <div key={idx} className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center relative">
                        <MediaContent 
                            url={url} 
                            type={post.media_type} 
                            isActive={isActive && idx === currentMediaIndex} 
                        />
                    </div>
                ))}
            </div>

            {/* Pagination Dots (if multiple) */}
            {hasMultiple && (
                <div className="absolute top-4 right-4 z-10 bg-black/30 px-3 py-1 rounded-full text-xs font-bold text-white backdrop-blur-sm">
                    {currentMediaIndex + 1}/{urls.length}
                </div>
            )}

            {/* Overlay Info (TikTok style sidebar/bottom) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-20 text-white">
                <div className="flex items-end justify-between">
                    <div className="flex-1 mr-12">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden border-2 border-white">
                                {post.author?.avatar_url 
                                    ? <img src={post.author.avatar_url} className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex items-center justify-center text-xs font-bold">{post.author?.first_name?.[0]}</div>
                                }
                            </div>
                            <div>
                                <h3 className="font-bold text-sm shadow-black drop-shadow-md">@{post.author?.first_name || 'User'}</h3>
                                <p className="text-[10px] opacity-80">{new Date(post.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <p className="text-sm font-medium leading-relaxed drop-shadow-md line-clamp-3 mb-2">
                            {post.content}
                        </p>
                        {/* Music/Audio Tag (Fake for now) */}
                        <div className="flex items-center gap-2 text-xs opacity-80 mb-4">
                            <Music size={12} />
                            <div className="animate-marquee whitespace-nowrap overflow-hidden max-w-[150px]">
                                <span>Original Audio • {post.author?.first_name}'s Post</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Action Sidebar */}
                    <div className="flex flex-col items-center gap-6 pb-4">
                        <ActionButton icon={<Heart size={28} />} label={post.likes?.length || 0} />
                        <ActionButton icon={<MessageSquare size={28} />} label="Comment" />
                        <ActionButton icon={<Share2 size={28} />} label="Share" />
                        <ActionButton icon={<MoreVertical size={24} />} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ActionButton = ({ icon, label }) => (
    <button className="flex flex-col items-center gap-1 group">
        <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 backdrop-blur-sm transition-all text-white shadow-lg">
            {icon}
        </div>
        {label && <span className="text-[10px] font-bold text-white drop-shadow-md">{label}</span>}
    </button>
);

const MediaContent = ({ url, type, isActive }) => {
    const videoRef = useRef(null);
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (videoRef.current) {
            if (isActive && isPlaying) {
                videoRef.current.play().catch(e => console.log("Autoplay blocked", e));
            } else {
                videoRef.current.pause();
            }
        }
        if (audioRef.current) {
            if (isActive && isPlaying) {
                audioRef.current.play().catch(e => console.log("Autoplay blocked", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isActive, isPlaying]);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (videoRef.current) videoRef.current.muted = !isMuted;
        if (audioRef.current) audioRef.current.muted = !isMuted;
    };

    const handleTimeUpdate = (e) => {
        setCurrentTime(e.target.currentTime);
    };

    const handleLoadedMetadata = (e) => {
        setDuration(e.target.duration);
    };

    const handleSeek = (e) => {
        const target = e.target;
        const rect = target.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const newTime = (clickX / width) * duration;
        
        if (videoRef.current) videoRef.current.currentTime = newTime;
        if (audioRef.current) audioRef.current.currentTime = newTime;
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const isVideo = url.endsWith('.webm') || url.endsWith('.mp4') || type === 'video';
    const isAudio = url.endsWith('.mp3') || (url.endsWith('.webm') && type === 'audio');
    const isImage = !isVideo && !isAudio && (url.match(/\.(jpeg|jpg|gif|png)$/) != null || type === 'image' || type === 'gif');
    
    if (isVideo) {
        return (
            <div className="relative w-full h-full">
                <video 
                    ref={videoRef}
                    src={url} 
                    className="w-full h-full object-contain" 
                    loop 
                    muted={isMuted}
                    playsInline
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                />
                
                {/* Video Controls Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                        {/* Progress Bar */}
                        <div className="w-full bg-white/20 rounded-full h-1 mb-2 cursor-pointer" onClick={handleSeek}>
                            <div 
                                className="bg-white h-1 rounded-full" 
                                style={{ width: `${(currentTime / duration) * 100}%` }}
                            />
                        </div>
                        
                        {/* Controls */}
                        <div className="flex items-center justify-between text-white">
                            <div className="flex items-center gap-4">
                                <button onClick={togglePlay} className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors">
                                    {isPlaying ? '❚❚' : '▶'}
                                </button>
                                <button onClick={toggleMute} className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors">
                                    {isMuted ? '🔇' : '🔊'}
                                </button>
                                <span className="text-xs">{formatTime(currentTime)} / {formatTime(duration)}</span>
                            </div>
                            <div className="text-xs opacity-75">Video</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (isAudio) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 relative overflow-hidden">
                {/* Animated Background */}
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent ${isActive && isPlaying ? 'animate-pulse' : ''}`} />
                
                <div className="relative z-10 text-center">
                    <div className={`w-32 h-32 rounded-full bg-white/20 flex items-center justify-center mb-8 ${isActive && isPlaying ? 'animate-spin' : ''}`}>
                        <Music size={48} className="text-white" />
                    </div>
                    
                    {/* Audio Controls */}
                    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 w-3/4 max-w-sm">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <button onClick={togglePlay} className="p-3 bg-white rounded-full text-black hover:scale-110 transition-transform">
                                {isPlaying ? '❚❚' : '▶'}
                            </button>
                            <button onClick={toggleMute} className="p-3 bg-white/80 rounded-full text-black hover:bg-white transition-colors">
                                {isMuted ? '🔇' : '🔊'}
                            </button>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-white/30 rounded-full h-2 mb-2 cursor-pointer" onClick={handleSeek}>
                            <div 
                                className="bg-white h-2 rounded-full" 
                                style={{ width: `${(currentTime / duration) * 100}%` }}
                            />
                        </div>
                        
                        <div className="flex justify-between text-xs text-white/80">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                        
                        <p className="text-xs text-white/70 mt-2 text-center">Audio Player</p>
                    </div>
                </div>
                
                {/* Audio Visualization */}
                {isActive && isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <div 
                                    key={i}
                                    className="w-2 bg-white rounded-full animate-audio-visualize"
                                    style={{ 
                                        animationDelay: `${i * 0.1}s`,
                                        animationDuration: '1s'
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (isImage) {
        return <img src={url} className="w-full h-full object-contain" />;
    }

    return (
        <div className="flex flex-col items-center justify-center text-white">
            <FileText size={48} className="mb-4" />
            <p>Document Attachment</p>
            <button onClick={() => window.open(url, '_blank')} className="mt-4 px-4 py-2 bg-white text-black rounded-full text-xs font-bold">
                View File
            </button>
        </div>
    );
};

export default MediaViewerOverlay;
