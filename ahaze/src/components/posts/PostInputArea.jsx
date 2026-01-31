import React, { useState, useRef } from 'react';
import { Camera, Video, Mic, Paperclip, Zap, Upload, Send, X, Loader2, Eye, FileText } from 'lucide-react';
import { supabase, uploadMedia } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

const sampleGifs = [
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDN6eHd5aGpwdGg0b3F6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKSjRrfIPjeiVyM/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDN6eHd5aGpwdGg0b3F6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eHl6eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlHJGHe3yAMhdQY/giphy.gif",
    "https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif",
    "https://media.giphy.com/media/l2JhtTt0aD2uA/giphy.gif",
    "https://media.giphy.com/media/3o7527pa7qs9kCG78A/giphy.gif",
    "https://media.giphy.com/media/26gsjCZpPolPr3sBy/giphy.gif"
];

const PostInputArea = ({ place, locationData, levelScope, onPostSuccess }) => {
    const { user, profile } = useAuth();
    const [content, setContent] = useState('');
    const [attachments, setAttachments] = useState([]); // Array of { file, url, type, name }
    const [isPosting, setIsPosting] = useState(false);

    // Debug props
    console.log('🔧 PostInputArea Props:', { place, locationData, levelScope });

    // Recording & Live State
    const [recordingMode, setRecordingMode] = useState(null); // 'audio' | 'video'
    const [recordingStatus, setRecordingStatus] = useState('idle'); // 'idle' | 'recording' | 'live'
    const [recordingTime, setRecordingTime] = useState(0);
    const [showAudioOptions, setShowAudioOptions] = useState(false);
    const [showGifPicker, setShowGifPicker] = useState(false);
    const [liveViewers, setLiveViewers] = useState(0);
    const [liveComments, setLiveComments] = useState([]);
    const [liveReactions, setLiveReactions] = useState([]);

    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null); // Keep track of stream to stop tracks later
    const chunksRef = useRef([]);
    const videoPreviewRef = useRef(null);
    const timerRef = useRef(null);

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
            const url = URL.createObjectURL(blob);
            const file = new File([blob], `live_${type}_${Date.now()}.${type === 'video' ? 'webm' : 'webm'}`, { type: blob.type });
            
            setAttachments(prev => [...prev, { file, url, type, name: `Live ${type}` }]);
            setRecordingStatus('idle');
            setRecordingMode(null);
            setRecordingTime(0);
            cleanupRecording();
        };

        recorder.start(1000);
        setRecordingStatus('live');
        startTimer();
        
        // Simulate live viewers joining
        simulateLiveStream();
    };

    const simulateLiveStream = () => {
        // Simulate viewers joining
        let viewerCount = Math.floor(Math.random() * 50) + 10;
        setLiveViewers(viewerCount);
        
        const viewerInterval = setInterval(() => {
            viewerCount += Math.floor(Math.random() * 5) - 2;
            viewerCount = Math.max(5, viewerCount);
            setLiveViewers(viewerCount);
        }, 3000);

        // Simulate live comments
        const sampleComments = [
            { user: "Abeba", message: "Amazing stream! 🔥", color: "text-yellow-400" },
            { user: "Kenna", message: "Where is this location?", color: "text-blue-400" },
            { user: "Sara", message: "Love the content!", color: "text-green-400" },
            { user: "Mike", message: "First time here, great vibe!", color: "text-purple-400" },
            { user: "Tigist", message: "Can you show more around?", color: "text-pink-400" },
            { user: "Dawit", message: "This is incredible! 🙌", color: "text-orange-400" }
        ];

        const commentInterval = setInterval(() => {
            const randomComment = sampleComments[Math.floor(Math.random() * sampleComments.length)];
            setLiveComments(prev => [...prev.slice(-4), { ...randomComment, timestamp: Date.now() }]);
        }, 4000);

        // Cleanup intervals when recording stops
        setTimeout(() => {
            clearInterval(viewerInterval);
            clearInterval(commentInterval);
            setLiveViewers(0);
            setLiveComments([]);
        }, 60000); // Auto-cleanup after 1 minute max
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && (recordingStatus === 'recording' || recordingStatus === 'live')) {
            mediaRecorderRef.current.stop();
        } else {
            cleanupRecording();
        }
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
        
        console.log('🚀 Starting post creation...');
        console.log('User:', user);
        console.log('Content:', content);
        console.log('Attachments:', attachments);
        console.log('Props - place:', place);
        console.log('Props - levelScope:', levelScope);
        console.log('Props - locationData:', locationData);
        
        try {
            const uploadPromises = attachments.map(async (att) => {
                if (!att.file && att.url.startsWith('http')) return { url: att.url, thumbnail: null }; // Existing GIF
                if (att.file) {
                    console.log('📤 Uploading file:', att.name);
                    const url = await uploadMedia(att.file, 'posts', user.id);
                    console.log('✅ File uploaded:', url);
                    let thumbnail = null;
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

            let primaryType = 'text';
            if (attachments.length > 0) {
                const types = new Set(attachments.map(a => a.type));
                if (types.size > 1) primaryType = 'mixed';
                else primaryType = attachments[0].type;
            }
            
            // Determine location_name and level_scope dynamically or from props
            let postLocationName = place || 'Ethiopia';
            let postLevelScope = levelScope || 'country'; // Default to 'country' if not provided

            // If locationData is provided, derive it from there
            if (locationData) {
                if (locationData.kebele) { postLevelScope = 'kebele'; postLocationName = locationData.kebele; }
                else if (locationData.woreda) { postLevelScope = 'woreda'; postLocationName = locationData.woreda; }
                else if (locationData.zone) { postLevelScope = 'zone'; postLocationName = locationData.zone; }
                else if (locationData.region) { postLevelScope = 'region'; postLocationName = locationData.region; }
                else { postLevelScope = 'country'; postLocationName = 'Ethiopia'; }
            }

            // Ensure levelScope is never null
            if (!postLevelScope) {
                postLevelScope = 'country';
            }

            const postData = {
                author_id: user.id,
                content: content,
                media_urls: mediaUrls,
                media_thumbnails: thumbnails,
                media_type: primaryType,
                level_scope: postLevelScope,
                location_name: postLocationName
            };

            console.log('📝 Final post data:', postData);
            console.log('📍 postLocationName:', postLocationName);
            console.log('🎯 postLevelScope:', postLevelScope);

            const { data, error } = await supabase.from('connect_posts').insert([postData]);
            
            if (error) {
                console.error('❌ Supabase error:', error);
                throw error;
            }
            
            console.log('✅ Post created successfully:', data);
            setContent('');
            setAttachments([]);
            if (onPostSuccess) onPostSuccess();
        } catch (err) {
            console.error('❌ Error posting:', err);
            alert('Failed to post: ' + err.message);
        } finally {
            setIsPosting(false);
        }
    };

    if (!user) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center text-gray-500">
                <p>Sign in to create a post.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-3 relative overflow-hidden mb-3 shadow-sm">
            {recordingMode && (
                <div className="absolute inset-0 z-50 bg-gray-900 flex flex-col items-center justify-center text-white animate-in fade-in">
                    {recordingMode === 'video' && (
                        <>
                            <video
                                ref={videoPreviewRef}
                                autoPlay
                                muted
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover z-0"
                            />
                            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                <div className="bg-red-600 text-white px-3 py-1 rounded-md font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2 animate-pulse">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                    {recordingStatus === 'live' ? 'LIVE' : 'PREVIEW'}
                                </div>
                                {recordingStatus === 'live' && (
                                    <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-xs font-bold flex items-center gap-2">
                                        <Eye size={14} /> {liveViewers} watching
                                    </div>
                                )}
                            </div>
                            {recordingStatus === 'live' && (
                                <div className="absolute bottom-24 left-4 right-4 max-w-sm">
                                    <div className="bg-black/40 backdrop-blur-md rounded-2xl p-3 space-y-2 max-h-32 overflow-y-auto">
                                        {liveComments.map((comment, idx) => (
                                            <div key={idx} className="flex items-start gap-2 text-sm animate-in slide-in-from-left-2 duration-300">
                                                <span className={`font-bold ${comment.color} text-xs`}>{comment.user}:</span>
                                                <span className="text-white text-xs flex-1">{comment.message}</span>
                                            </div>
                                        ))}
                                        {liveComments.length === 0 && (
                                            <div className="text-gray-300 text-xs italic">Say hi to your viewers! 👋</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <div className="relative z-20 flex flex-col items-center gap-8 w-full px-8 pointer-events-auto">
                        {recordingMode === 'audio' && (
                            <div className="w-32 h-32 rounded-full bg-dark-green/20 flex items-center justify-center animate-pulse">
                                <Mic size={48} className="text-white" />
                            </div>
                        )}

                        {recordingStatus === 'live' && (
                            <div className="text-5xl font-black font-mono tracking-widest drop-shadow-md flex items-center gap-4">
                                {formatTime(recordingTime)}
                                <div className="flex gap-1">
                                    {['❤️', '🔥', '👏', '😮', '😂'].map((emoji, idx) => (
                                        <span key={idx} className="text-2xl animate-bounce" style={{ animationDelay: `${idx * 0.1}s` }}>{emoji}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {recordingStatus === 'idle' ? (
                            <div className="text-center space-y-4">
                                <h3 className="text-2xl font-black">{recordingMode === 'video' ? 'Ready to go Live?' : 'Start Audio Live'}</h3>
                                <p className="text-gray-300 text-sm max-w-xs mx-auto mb-4">
                                    {recordingMode === 'video' ? 'Check your camera and surroundings. You are in preview mode.' : 'Tap the button below to start your live audio session.'}
                                </p>
                                <button
                                    onClick={startCapture}
                                    className="px-12 py-4 bg-white text-gray-900 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                                >
                                    {recordingMode === 'video' ? 'GO LIVE' : 'START LIVE AUDIO'}
                                </button>
                                <button onClick={cleanupRecording} className="block w-full text-sm text-gray-400 hover:text-white mt-4 underline">Cancel</button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <button
                                    onClick={stopRecording}
                                    className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 transition-transform bg-red-500"
                                >
                                    <div className="w-8 h-8 bg-white rounded-sm" />
                                </button>
                                <p className="text-white text-xs font-black uppercase tracking-widest">End Live Stream</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="flex gap-2">
                <div className="w-9 h-9 bg-dark-green/10 text-dark-green rounded-lg flex-shrink-0 flex items-center justify-center font-black">
                    {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover rounded-2xl" /> : (profile?.first_name?.charAt(0) || 'U')}
                </div>
                <div className="flex-1 space-y-2">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={`Talk to the community in ${place}...`}
                        className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-dark-green outline-none min-h-[80px] resize-none"
                    />

                    {attachments.length > 0 && (
                        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
                            {attachments.map((att, index) => (
                                <div key={index} className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden group border border-gray-100 bg-gray-50 flex items-center justify-center">
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

                            <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-400 rounded-xl hover:text-dark-green hover:bg-dark-green/5 transition-all cursor-pointer">
                                <Paperclip size={18} />
                                <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">File</span>
                                <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt" multiple className="hidden" onChange={(e) => handleFiles(e, 'document')} />
                            </label>

                            <button onClick={() => setShowGifPicker(!showGifPicker)} className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-400 rounded-xl hover:text-dark-green hover:bg-dark-green/5 transition-all relative">
                                <Zap size={18} />
                                <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Gif</span>
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

                            <button onClick={() => initializeRecording('video')} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all border border-red-400 shadow-lg shadow-red-500/20 animate-pulse">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                <Video size={18} />
                                <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Go Live</span>
                            </button>
                        </div>
                        <button
                            onClick={handlePost}
                            disabled={isPosting || (!content.trim() && attachments.length === 0)}
                            className="bg-dark-green text-white px-8 py-3.5 rounded-2xl text-xs font-black shadow-xl shadow-dark-green/20 hover:-translate-y-1 transition-all disabled:opacity-50"
                        >
                            {isPosting ? 'Posting...' : 'Post News'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostInputArea;
