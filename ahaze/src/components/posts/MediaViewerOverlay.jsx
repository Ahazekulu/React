import React from 'react';
import { X, FileText, Music, Eye } from 'lucide-react';

const MediaViewerOverlay = ({ post, currentIndex, onClose, onPrev, onNext, onJump }) => {
    if (!post || !post.media_urls || post.media_urls.length === 0) return null;

    const urls = post.media_urls;
    const index = Math.min(Math.max(currentIndex, 0), urls.length - 1);
    const url = urls[index];

    const isVideo = url.endsWith('.webm') || url.endsWith('.mp4') || post.media_type === 'video';
    const isAudio = url.endsWith('.mp3') || (url.endsWith('.webm') && post.media_type === 'audio');
    const isImage = !isVideo && !isAudio && (url.match(/\.(jpeg|jpg|gif|png)$/) != null || post.media_type === 'image' || post.media_type === 'gif');
    const isDoc = !isVideo && !isAudio && !isImage;

    const getMediaTypeLabel = (type) => {
        switch (type) {
            case 'video': return 'LIVE REPLAY';
            case 'audio': return 'AUDIO';
            case 'image': return 'IMAGE';
            case 'gif': return 'GIF';
            case 'document': return 'DOCUMENT';
            default: return 'MEDIA';
        }
    };

    return (
        <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex flex-col md:flex-row items-center justify-center p-4 md:p-10">
            <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            >
                <X size={20} />
            </button>

            <div className="w-full md:w-3/4 max-w-5xl mx-auto flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs text-gray-200 mb-1">
                    <div className="flex items-center gap-3">
                        <span className="px-2 py-1 rounded-full bg-blue-600 text-[10px] font-black tracking-widest flex items-center gap-1">
                            {getMediaTypeLabel(post.media_type)}
                        </span>
                        <span className="hidden sm:inline text-gray-400 truncate max-w-[220px]">
                            {post.content?.slice(0, 60)}
                            {post.content && post.content.length > 60 ? '…' : ''}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                        <div className="flex items-center gap-1">
                            <Eye size={14} className="text-emerald-400" />
                            <span>{post.views_count || 0}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-500" />
                        <span>{index + 1}/{urls.length}</span>
                    </div>
                </div>

                <div className="relative bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl min-h-[260px] md:min-h-[420px] flex items-center justify-center">
                    {isVideo && (
                        <video
                            src={url}
                            controls
                            autoPlay
                            className="w-full h-full object-contain bg-black"
                        />
                    )}
                    {isAudio && (
                        <div className="flex flex-col items-center justify-center w-full h-full text-white p-6 gap-6">
                            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
                                <Music size={40} />
                            </div>
                            <audio
                                src={url}
                                controls
                                autoPlay
                                className="w-full max-w-md"
                            />
                        </div>
                    )}
                    {isImage && (
                        <img
                            src={url}
                            alt="Post media"
                            className="max-h-full max-w-full object-contain"
                        />
                    )}
                    {isDoc && (
                        <div className="flex flex-col items-center justify-center w-full h-full text-white p-6 gap-4">
                            <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center">
                                <FileText size={40} />
                            </div>
                            <p className="text-sm font-black">Document</p>
                            <button
                                type="button"
                                onClick={() => window.open(url, '_blank')}
                                className="px-6 py-2 rounded-full bg-white text-gray-900 text-xs font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors"
                            >
                                Open in new tab
                            </button>
                        </div>
                    )}

                    {urls.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={onPrev}
                                disabled={index === 0}
                                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 disabled:opacity-40 disabled:hover:bg-black/40 transition-colors"
                            >
                                ‹
                            </button>
                            <button
                                type="button"
                                onClick={onNext}
                                disabled={index === urls.length - 1}
                                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 disabled:opacity-40 disabled:hover:bg-black/40 transition-colors"
                            >
                                ›
                            </button>
                        </>
                    )}
                </div>

                {urls.length > 1 && (
                    <div className="flex gap-2 mt-1 overflow-x-auto scrollbar-hide">
                        {urls.map((thumbUrl, i) => (
                            <button
                                key={thumbUrl + i}
                                type="button"
                                onClick={() => onJump(i)}
                                className={`relative w-16 h-16 rounded-2xl overflow-hidden border ${i === index ? 'border-emerald-400 ring-2 ring-emerald-400/40' : 'border-white/10 opacity-70 hover:opacity-100'}`}
                            >
                                <img
                                    src={thumbUrl}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MediaViewerOverlay;
