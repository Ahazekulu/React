import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import PostCard from '../../components/posts/PostCard';
import PostInputArea from '../../components/posts/PostInputArea';
import MediaViewerOverlay from '../../components/posts/MediaViewerOverlay';

const PlacePosts = ({ place }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);
    const [mediaUrls, setMediaUrls] = useState([]);
    const [currentPostIndex, setCurrentPostIndex] = useState(0);
    const containerRef = useRef(null);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            // Fetch posts for the selected place
            // This assumes you have a way to filter posts by place
            // For now, we'll fetch all posts and filter client-side
            const { data, error } = await supabase
                .from('connect_posts')
                .select(`
                    *,
                    author:profiles(first_name, avatar_url),
                    likes(*),
                    saves_count
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Filter posts by place if place is selected
            // For now, show all posts since we don't have place filtering in the database
            setPosts(data || []);
        } catch (err) {
            console.error('Error fetching posts:', err);
            alert('Failed to load posts. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [place]);

    const handlePostCreated = () => {
        fetchPosts();
    };

    const handleOpenMedia = (index) => {
        setSelectedMediaIndex(index);
        setMediaUrls(posts[currentPostIndex]?.media_urls || []);
    };

    const handleCloseMedia = () => {
        setSelectedMediaIndex(null);
        setMediaUrls([]);
    };

    // Handle vertical scrolling for TikTok/YouTube Shorts style
    const handleScroll = useCallback((e) => {
        const container = e.currentTarget;
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        
        // Calculate which post is currently in view
        const postHeight = clientHeight;
        const newIndex = Math.round(scrollTop / postHeight);
        
        if (newIndex !== currentPostIndex && newIndex >= 0 && newIndex < posts.length) {
            setCurrentPostIndex(newIndex);
        }
        
        // Load more posts when reaching the bottom
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            // Implement pagination or infinite scroll here if needed
        }
    }, [currentPostIndex, posts.length]);

    // Enhanced scrolling functionality
    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            // Add scroll event listener
            container.addEventListener('scroll', handleScroll, { passive: true });
            
            // Add keyboard navigation
            const handleKeyDown = (e) => {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    container.scrollBy({ top: 400, behavior: 'smooth' });
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    container.scrollBy({ top: -400, behavior: 'smooth' });
                } else if (e.key === ' ') {
                    e.preventDefault();
                    container.scrollBy({ top: 400, behavior: 'smooth' });
                }
            };
            
            window.addEventListener('keydown', handleKeyDown);
            
            return () => {
                container.removeEventListener('scroll', handleScroll);
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [handleScroll]);

    return (
        <div className="w-full">
            {/* Post Input Area */}
            <div className="mb-3 lg:mb-4">
                <PostInputArea onPostCreated={handlePostCreated} />
            </div>

            {/* Vertical Scrolling Posts */}
            <div 
                ref={containerRef}
                className="w-full h-[calc(100vh-200px)] lg:h-[calc(100vh-220px)] overflow-y-auto snap-y snap-mandatory scroll-smooth"
                onScroll={handleScroll}
            >
                {loading ? (
                    <div className="text-center py-6 lg:py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-green mx-auto"></div>
                        <p className="text-gray-500 text-sm mt-2">Loading posts...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-8 lg:py-12 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No posts yet</h3>
                        <p className="text-gray-500 mb-4 lg:mb-6">
                            {place 
                                ? `Be the first to share something about ${place.name}!`
                                : "Share something about Ethiopia to get started."}
                        </p>
                        <div className="text-sm text-gray-400">
                            Posts will appear here when people share updates, photos, and stories.
                        </div>
                    </div>
                ) : (
                    posts.map((post) => (
                        <div 
                            key={post.id} 
                            className="snap-start w-full min-h-[calc(100vh-200px)] lg:min-h-[calc(100vh-220px)] pb-4"
                        >
                            <PostCard 
                                post={post} 
                                onOpenMedia={handleOpenMedia}
                            />
                        </div>
                    ))
                )}
            </div>

            {/* Media Viewer Overlay */}
            {selectedMediaIndex !== null && (
                <MediaViewerOverlay
                    mediaUrls={mediaUrls}
                    currentIndex={selectedMediaIndex}
                    onClose={handleCloseMedia}
                />
            )}
        </div>
    );
};

export default PlacePosts;