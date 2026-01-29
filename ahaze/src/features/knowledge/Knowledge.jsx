import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, Users, Star, GraduationCap, Atom, Book, Globe, Heart, MessageSquare, Share2, Bookmark, Download, Loader2, Sparkles, TrendingUp, Flag, MapPin, Building2, ShoppingBag, Landmark, Calendar, History, Zap, Camera, Mic, Home, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Knowledge = () => {
    const [activeTab, setActiveTab] = useState('new');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const tabs = [
        { id: 'new', label: 'New', icon: <Sparkles size={16} /> },
        { id: 'trends', label: 'Trends', icon: <TrendingUp size={16} /> },
        { id: 'country', label: 'Country', icon: <Flag size={16} /> },
        { id: 'region', label: 'Region', icon: <Globe size={16} /> },
        { id: 'zone', label: 'Zone', icon: <MapPin size={16} /> },
        { id: 'woreda', label: 'Woreda', icon: <MapPin size={16} /> },
        { id: 'kebele', label: 'Kebele', icon: <MapPin size={16} /> },
        { id: 'community', label: 'Community', icon: <Building2 size={16} /> },
        { id: 'market', label: 'Marketplace', icon: <ShoppingBag size={16} /> },
        { id: 'orgs', label: 'Organizations', icon: <Landmark size={16} /> },
        { id: 'academic', label: 'Academic Events', icon: <Calendar size={16} /> },
    ];

    const categories = [
        { name: 'All', icon: <Globe size={14} /> },
        { name: 'Religion', icon: <Book size={14} /> },
        { name: 'History', icon: <History size={14} /> },
        { name: 'Philosophy', icon: <GraduationCap size={14} /> },
        { name: 'Science & Engineering', icon: <Atom size={14} /> },
        { name: 'Agriculture', icon: <Zap size={14} /> },
        { name: 'Manufacturing', icon: <Building2 size={14} /> },
        { name: 'Art', icon: <Camera size={14} /> },
        { name: 'Music', icon: <Mic size={14} /> },
        { name: 'Health', icon: <Heart size={14} /> },
        { name: 'Leadership & Politics', icon: <Landmark size={14} /> },
        { name: 'Business & Trading', icon: <ShoppingBag size={14} /> },
        { name: 'IT & Tech', icon: <Zap size={14} /> },
        { name: 'Nature & Environment', icon: <Globe size={14} /> },
        { name: 'Tourism', icon: <MapPin size={14} /> },
        { name: 'Archeology', icon: <Clock size={14} /> },
        { name: 'Teaching', icon: <BookOpen size={14} /> },
        { name: 'Home Making', icon: <Home size={14} /> },
        { name: 'Architecture', icon: <Landmark size={14} /> },
        { name: 'Civil & Town Living', icon: <Users size={14} /> },
        { name: 'Construction', icon: <Building2 size={14} /> },
        { name: 'Language', icon: <MessageSquare size={14} /> },
        { name: 'Physical & Math', icon: <Atom size={14} /> },
        { name: 'Sports', icon: <Zap size={14} /> },
    ];

    useEffect(() => {
        fetchArticles();
    }, [selectedCategory, searchQuery, activeTab]);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('knowledge_articles')
                .select(`
                    *,
                    author:profiles(first_name, avatar_url)
                `);

            if (selectedCategory !== 'All') {
                query = query.eq('category', selectedCategory);
            }

            if (searchQuery) {
                query = query.ilike('title', `%${searchQuery}%`);
            }

            // Simple scoping logic based on tab
            // This section would be expanded to filter articles based on activeTab (e.g., 'new', 'trends', 'country', etc.)
            // For example:
            // if (activeTab === 'new') {
            //     query = query.order('created_at', { ascending: false });
            // } else if (activeTab === 'trends') {
            //     query = query.order('views', { ascending: false }); // Assuming a 'views' column
            // }
            // ... and so on for other tabs

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) throw error;
            setArticles(data || []);
        } catch (err) {
            console.error('Error fetching articles:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-700">
            {/* Sidebar */}
            <aside className="w-full lg:w-72 flex flex-col gap-8">
                <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 max-h-[800px] overflow-y-auto no-scrollbar">
                    <h3 className="text-[10px] font-black uppercase text-gray-400 mb-6 tracking-[0.2em]">Knowledge Hub</h3>
                    <div className="relative mb-8">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search wisdom..."
                            className="w-full bg-gray-50 border-none rounded-2xl py-3 px-10 text-xs font-bold focus:ring-2 focus:ring-accent-red outline-none transition-all"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    </div>

                    <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-[0.2em]">Categories</h3>
                    <div className="space-y-2">
                        {categories.map(cat => (
                            <button
                                key={cat.name}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[11px] font-black transition-all active:scale-95 ${selectedCategory === cat.name
                                    ? 'bg-accent-red text-white shadow-lg shadow-accent-red/20 -translate-y-1'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-accent-red'
                                    }`}
                            >
                                {cat.icon} {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-6">
                {/* Tabs Header */}
                <div className="bg-white rounded-[32px] p-4 shadow-sm border border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap active:scale-95 ${activeTab === tab.id
                                ? 'bg-accent-red text-white shadow-xl shadow-accent-red/20 -translate-y-1'
                                : 'bg-gray-50 text-gray-400 hover:bg-gray-100 group-hover:text-accent-red'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex-1 space-y-6">
                    {loading ? (
                        <div className="py-20 flex justify-center">
                            <Loader2 className="animate-spin text-accent-red" size={40} />
                        </div>
                    ) : articles.length > 0 ? (
                        articles.map(article => (
                            <KnowledgeCard
                                key={article.id}
                                article={article}
                            />
                        ))
                    ) : (
                        <div className="py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100 italic text-gray-400 text-sm font-medium">
                            No articles found in this category.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const KnowledgeCard = ({ article }) => {
    return (
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 hover:shadow-2xl transition-all group animate-in slide-in-from-bottom-6">
            <div className="flex items-center justify-between mb-6">
                <span className="text-[9px] bg-accent-red/10 text-accent-red px-3 py-1 rounded-full font-black uppercase tracking-[0.2em]">{article.category}</span>
                <button className="p-2 text-gray-300 hover:text-accent-red transition-all active:scale-90"><Bookmark size={20} /></button>
            </div>
            <h3 className="text-3xl font-black text-gray-900 group-hover:text-accent-red transition-colors mb-6 leading-tight max-w-2xl">{article.title}</h3>
            <p className="text-gray-500 leading-relaxed font-medium mb-8 line-clamp-3">
                {article.content}
            </p>
            <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent-red/5 text-accent-red rounded-2xl flex items-center justify-center font-black">
                        {article.author?.first_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <p className="text-sm font-black text-gray-900">{article.author?.first_name || 'System Scholar'}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{new Date(article.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-8">
                    <button className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-accent-red transition-all hover:scale-110 active:scale-90 group-hover:opacity-100">
                        <Heart size={20} /> 1.2k
                    </button>
                    <button className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-light-blue transition-all hover:scale-110 active:scale-90">
                        <MessageSquare size={20} /> 85
                    </button>
                    <button className="p-3 bg-gray-50 text-gray-300 hover:text-dark-green rounded-2xl transition-all hover:scale-110 active:scale-90">
                        <Download size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Knowledge;
