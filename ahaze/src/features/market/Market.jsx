import React, { useState, useMemo, useEffect } from 'react';
import {
    ShoppingBag, Tag, Search, Filter, PlusCircle, ShoppingCart,
    Truck, Inbox, Heart, Star, MapPin, Share2, Plus, Minus,
    Trash2, X, Upload, ChevronRight, TrendingUp, Sparkles,
    ShieldCheck, Clock, Zap, Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import placesData from '../../data/places.json';

const Market = () => {
    const { user, profile } = useAuth();
    const [activeTab, setActiveTab] = useState('buy');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [zembil, setZembil] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('Addis Ababa');

    const categories = [
        { name: 'All', icon: <Sparkles size={14} /> },
        { name: 'Electronics', icon: <Zap size={14} /> },
        { name: 'Clothing', icon: <Tag size={14} /> },
        { name: 'Home & Garden', icon: <Inbox size={14} /> },
        { name: 'Food', icon: <ShoppingBag size={14} /> },
        { name: 'Agriculture', icon: <TrendingUp size={14} /> },
        { name: 'Services', icon: <ShieldCheck size={14} /> },
        { name: 'Vehicles', icon: <Truck size={14} /> }
    ];

    const tabs = [
        { id: 'buy', label: 'Buy Items', icon: <ShoppingBag size={18} /> },
        { id: 'sell', label: 'Sell / List', icon: <PlusCircle size={18} /> },
        { id: 'zembil', label: 'My Zembil', icon: <ShoppingCart size={18} /> },
        { id: 'deliver', label: 'Delivery Pack', icon: <Truck size={18} /> },
        { id: 'receive', label: 'Receiving', icon: <Inbox size={18} /> },
        { id: 'yours', label: 'Your Products', icon: <Tag size={18} /> },
        { id: 'saved', label: 'Saved', icon: <Heart size={18} /> },
    ];

    const regions = useMemo(() => [...new Set(placesData.map(p => p["Level 2"]))].sort(), []);

    const addToZembil = (product) => {
        setZembil(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromZembil = (id) => {
        setZembil(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id, delta) => {
        setZembil(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 min-h-screen animate-in fade-in duration-700 pb-20">
            {/* Market Sidebar - Premium Faceted Nav */}
            <aside className="lg:w-72 flex flex-col gap-8">
                <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex flex-col gap-8">
                    {/* Location Filter */}
                    <div>
                        <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-[0.2em] flex items-center gap-2">
                            <MapPin size={12} className="text-dark-green" /> Local Market
                        </h3>
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="w-full bg-gray-50 border-2 border-transparent rounded-[20px] px-4 py-3 text-xs font-black text-gray-800 outline-none focus:bg-white focus:border-dark-green transition-all"
                        >
                            <option value="All Ethiopia">All Ethiopia</option>
                            {regions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-[0.2em]">Departments</h3>
                        <div className="space-y-2">
                            {categories.map(cat => (
                                <button
                                    key={cat.name}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black transition-all active:scale-95 ${selectedCategory === cat.name
                                        ? 'bg-accent-yellow text-gray-900 shadow-lg shadow-accent-yellow/10 -translate-y-0.5'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-dark-green'
                                        }`}
                                >
                                    <span className={selectedCategory === cat.name ? 'text-gray-900' : 'text-gray-300'}>{cat.icon}</span>
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Filter Mockup */}
                    <div>
                        <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-[0.2em]">Price Range</h3>
                        <div className="px-2">
                            <input type="range" className="w-full accent-dark-green" />
                            <div className="flex justify-between mt-2 text-[10px] font-black text-gray-400">
                                <span>0 ETB</span>
                                <span>100K+ ETB</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sell CTA Banner */}
                <div className="bg-gradient-to-br from-dark-green to-emerald-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
                    <h4 className="text-xl font-black mb-2 relative z-10">Start Selling</h4>
                    <p className="text-white/60 text-xs font-medium mb-6 relative z-10 leading-relaxed">List your products and services to reach thousands of buyers locally.</p>
                    <button
                        onClick={() => setActiveTab('sell')}
                        className="w-full bg-white text-dark-green py-3 rounded-2xl text-xs font-black shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all relative z-10"
                    >
                        List My Item
                    </button>
                </div>
            </aside>

            {/* Main Market Space */}
            <div className="flex-1 flex flex-col gap-8">
                {/* Search & Global Tabs */}
                <div className="bg-white rounded-[40px] p-4 shadow-sm border border-gray-100 flex flex-col gap-4 animate-in slide-in-from-top-8 duration-700">
                    <div className="relative group">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={`Looking for something in ${selectedLocation}...`}
                            className="w-full bg-gray-50 border-2 border-transparent rounded-[24px] py-4 px-12 text-sm font-medium focus:bg-white focus:border-accent-yellow transition-all outline-none"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent-yellow transition-colors" size={20} />
                    </div>

                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2.5 px-6 py-4 rounded-[20px] text-xs font-black transition-all whitespace-nowrap active:scale-95 ${activeTab === tab.id
                                    ? 'bg-dark-green text-white shadow-xl shadow-dark-green/20 -translate-y-1'
                                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                                {tab.id === 'zembil' && zembil.length > 0 && (
                                    <span className="bg-accent-yellow text-gray-900 text-[9px] w-5 h-5 rounded-lg flex items-center justify-center ml-1 animate-bounce">
                                        {zembil.reduce((acc, curr) => acc + curr.quantity, 0)}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area Rendering */}
                <div className="flex-1">
                    {activeTab === 'buy' && <BuyTab category={selectedCategory} onAddToZembil={addToZembil} location={selectedLocation} searchQuery={searchQuery} />}
                    {activeTab === 'sell' && <SellTab onSuccess={() => setActiveTab('buy')} />}
                    {activeTab === 'zembil' && <ZembilTab items={zembil} updateQuantity={updateQuantity} remove={removeFromZembil} />}
                    {activeTab === 'deliver' && <OrdersTab type="Delivery Pack" icon={<Truck size={48} />} />}
                    {activeTab === 'receive' && <OrdersTab type="Incoming Orders" icon={<Inbox size={48} />} />}
                    {activeTab === 'yours' && <OrdersTab type="Your Products" icon={<Tag size={48} />} />}
                    {activeTab === 'saved' && <OrdersTab type="Saved Items" icon={<Heart size={48} />} />}
                </div>
            </div>
        </div>
    );
};

/* Sub-components with Premium Polish */

const BuyTab = ({ category, onAddToZembil, location, searchQuery }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, [category, location, searchQuery]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('products')
                .select(`
                    *,
                    seller:profiles(first_name)
                `)
                .eq('status', 'active');

            if (category !== 'All') {
                query = query.eq('category', category);
            }

            if (searchQuery) {
                query = query.ilike('name', `%${searchQuery}%`);
            }

            // In a real localized app, we'd also filter by seller's region
            // query = query.filter('seller.region', 'eq', location);

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-dark-green" size={40} />
        </div>
    );

    if (products.length === 0) return (
        <div className="py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100 italic text-gray-400 text-sm font-medium">
            No items found matching your criteria.
        </div>
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 animate-in zoom-in-95 duration-700">
            {products.map(product => (
                <div key={product.id} className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100 group relative flex flex-col">
                    <div className="aspect-[4/5] bg-gray-50 relative overflow-hidden">
                        <img src={product.image_urls?.[0] || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=400'} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />

                        {/* Tags & Actions */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {product.is_hot && (
                                <span className="bg-accent-red text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-accent-red/20">TRENDING</span>
                            )}
                            <span className="bg-white/80 backdrop-blur-md text-gray-900 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-sm">
                                <Clock size={10} className="text-dark-green" /> New
                            </span>
                        </div>

                        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
                            <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-center text-gray-400 hover:text-accent-red hover:scale-110 active:scale-95 transition-all shadow-xl">
                                <Heart size={18} />
                            </button>
                            <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-center text-gray-400 hover:text-light-blue hover:scale-110 active:scale-95 transition-all shadow-xl">
                                <Share2 size={18} />
                            </button>
                        </div>

                        {/* Quick View Overlay */}
                        <div className="absolute inset-0 bg-dark-green/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <div className="bg-white/90 border border-white backdrop-blur px-4 py-2 rounded-full text-[10px] font-black text-dark-green uppercase tracking-widest shadow-xl">
                                View Details
                            </div>
                        </div>
                    </div>

                    <div className="p-8 flex flex-col flex-1">
                        <div className="flex justify-between items-start gap-2 mb-4">
                            <h4 className="text-base font-black text-gray-900 line-clamp-2 leading-tight flex-1">{product.name}</h4>
                            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                                <Star size={12} className="text-accent-yellow fill-accent-yellow" />
                                <span className="text-[11px] font-black text-gray-900">4.8</span>
                            </div>
                        </div>

                        <div className="mt-auto space-y-4">
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                                        <Clock size={10} /> Local in {location}
                                    </p>
                                    <span className="text-2xl font-black text-dark-green tracking-tight">{product.price} <span className="text-xs uppercase ml-1">ETB</span></span>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Seller</p>
                                    <p className="text-[11px] font-black text-gray-700 underline decoration-accent-yellow decoration-2 underline-offset-4">{product.seller?.first_name || 'Anonymous'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => onAddToZembil(product)}
                                    className="bg-gray-50 text-gray-600 py-3.5 rounded-2xl text-xs font-black hover:bg-accent-yellow hover:text-gray-900 hover:-translate-y-1 active:translate-y-0 transition-all border-2 border-transparent"
                                >
                                    To Zembil
                                </button>
                                <button className="bg-dark-green text-white py-3.5 rounded-2xl text-xs font-black shadow-xl shadow-dark-green/10 hover:bg-emerald-800 hover:-translate-y-1 active:translate-y-0 transition-all">
                                    Buy Instant
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const SellTab = ({ onSuccess }) => {
    const { user } = useAuth();
    const [media, setMedia] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Electronics',
        price: '',
        description: ''
    });

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMedia({
                file,
                url: URL.createObjectURL(file),
                type: file.type.startsWith('video') ? 'video' : 'image'
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || isSubmitting) return;
        setIsSubmitting(true);

        try {
            let imageUrls = [];

            if (media?.file) {
                const publicUrl = await uploadMedia(media.file, 'products', user.id);
                imageUrls = [publicUrl];
            }

            const { error } = await supabase
                .from('products')
                .insert([{
                    owner_id: user.id,
                    ...formData,
                    images: imageUrls,
                    is_hot: true // New products are hot!
                }]);

            if (error) throw error;
            alert('Product listed successfully!');
            onSuccess();
        } catch (err) {
            console.error('Error listing product:', err);
            alert('Error: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-12 duration-700">
            <div className="bg-white rounded-[50px] p-12 shadow-sm border border-gray-100">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Sell Your Treasure</h2>
                    <p className="text-gray-500 text-sm font-medium">Capture details, set your price, and find a neighbor buyer.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Media Upload */}
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] ml-2">Product Media</label>
                            <label className="block w-full h-[280px] border-2 border-dashed border-gray-100 rounded-[40px] bg-gray-50 hover:bg-white hover:border-dark-green transition-all cursor-pointer relative overflow-hidden group">
                                <input type="file" className="hidden" onChange={handleMediaChange} />
                                {media ? (
                                    media.type === 'image' ? (
                                        <img src={media.url} alt="Listing" className="w-full h-full object-cover" />
                                    ) : (
                                        <video src={media.url} className="w-full h-full object-cover" />
                                    )
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                        <div className="p-5 bg-white rounded-3xl shadow-sm text-dark-green group-hover:scale-110 transition-transform">
                                            <Upload size={32} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-black text-gray-700">Add Photos or Video</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">High quality raises interest</p>
                                        </div>
                                    </div>
                                )}
                            </label>
                        </div>

                        {/* Details */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] ml-2">Item Title</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-black focus:ring-2 focus:ring-dark-green outline-none"
                                    placeholder="What are you selling?"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] ml-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 text-xs font-black outline-none focus:ring-2 focus:ring-dark-green"
                                    >
                                        <option>Electronics</option>
                                        <option>Clothing</option>
                                        <option>Home & Garden</option>
                                        <option>Food</option>
                                        <option>Agriculture</option>
                                        <option>Services</option>
                                        <option>Vehicles</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] ml-2">Price (ETB)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-black focus:ring-2 focus:ring-dark-green outline-none"
                                        placeholder="2500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] ml-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows="4"
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-dark-green outline-none resize-none"
                                    placeholder="Describe condition, features, etc..."
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !user}
                        className={`w-full text-white py-5 rounded-[24px] font-black text-lg shadow-2xl transition-all uppercase tracking-widest mt-4 ${isSubmitting || !user ? 'bg-gray-300 shadow-none' : 'bg-dark-green shadow-dark-green/30 hover:-translate-y-1 active:translate-y-0'
                            }`}
                    >
                        {isSubmitting ? 'Launching...' : 'Launch Listing'}
                    </button>
                    {!user && <p className="text-center text-xs text-red-500 font-bold mt-2">Please login to sell items.</p>}
                </form>
            </div>
        </div>
    );
};

const ZembilTab = ({ items, updateQuantity, remove }) => {
    const total = useMemo(() => items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0), [items]);

    if (items.length === 0) return (
        <div className="max-w-2xl mx-auto p-32 text-center text-gray-400 bg-white rounded-[60px] border-2 border-dashed border-gray-100 animate-in fade-in duration-700">
            <ShoppingCart size={64} className="mx-auto mb-6 opacity-10" />
            <p className="text-sm font-black uppercase tracking-widest">Your Zembil is empty</p>
            <p className="text-xs font-medium mt-2">Start exploring the local market to add items.</p>
        </div>
    );

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8 duration-700">
            <div className="xl:col-span-2 space-y-4">
                <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-black text-gray-900">Cart Items ({items.length})</h3>
                        <button className="text-[10px] font-black uppercase tracking-widest text-accent-red">Clear All</button>
                    </div>

                    <div className="space-y-4">
                        {items.map(item => (
                            <div key={item.id} className="flex flex-col sm:items-center sm:flex-row gap-6 p-4 bg-gray-50/50 hover:bg-gray-50 rounded-[32px] transition-colors group">
                                <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gray-200">
                                    <img src={item.image_urls?.[0] || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e'} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-black text-gray-900 text-lg mb-1 leading-tight">{item.name}</h4>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">{item.seller?.first_name || 'Anonymous'}</p>
                                    <p className="text-xl font-black text-dark-green">{item.price} ETB</p>
                                </div>
                                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-50">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"><Minus size={16} /></button>
                                    <span className="text-base font-black w-6 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"><Plus size={16} /></button>
                                </div>
                                <button onClick={() => remove(item.id)} className="p-3 text-gray-300 hover:text-accent-red hover:bg-white rounded-2xl transition-all"><Trash2 size={20} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="xl:col-span-1">
                <div className="bg-dark-green text-white rounded-[50px] p-10 shadow-2xl shadow-dark-green/30 sticky top-24">
                    <h3 className="text-2xl font-black mb-8">Summary</h3>

                    <div className="space-y-6 text-sm font-bold">
                        <div className="flex justify-between items-center opacity-60">
                            <span className="uppercase tracking-widest text-[10px]">Subtotal</span>
                            <span>{total} ETB</span>
                        </div>
                        <div className="flex justify-between items-center opacity-60">
                            <span className="uppercase tracking-widest text-[10px]">Service Fee</span>
                            <span>{Math.round(total * 0.02)} ETB</span>
                        </div>
                        <div className="flex justify-between items-center opacity-60">
                            <span className="uppercase tracking-widest text-[10px]">Local Taxes</span>
                            <span>Calculated at checkout</span>
                        </div>
                        <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                            <div className="flex flex-col">
                                <span className="uppercase tracking-[0.2em] text-[10px] opacity-60 mb-2">Grand Total</span>
                                <span className="text-4xl font-black">{Math.round(total * 1.02)} ETB</span>
                            </div>
                        </div>
                    </div>

                    <button className="w-full bg-white text-dark-green py-5 rounded-[24px] font-black text-lg shadow-xl mt-10 hover:-translate-y-1 active:translate-y-0 transition-all uppercase tracking-[0.1em]">
                        Place Your Order
                    </button>

                    <p className="text-[10px] text-center mt-6 text-white/40 font-bold uppercase tracking-widest">Secure Checkout by ahazePay</p>
                </div>
            </div>
        </div>
    );
};

const OrdersTab = ({ type, icon }) => (
    <div className="max-w-2xl mx-auto p-40 text-center text-gray-400 bg-white rounded-[60px] border-2 border-dashed border-gray-100 animate-pulse">
        <div className="mb-6 opacity-10 flex justify-center">{icon}</div>
        <p className="text-sm font-black uppercase tracking-widest">No Active {type}</p>
        <p className="text-xs font-medium mt-2">Transactions you start will appear here for tracking.</p>
    </div>
);

const InfoStat = ({ label, value, icon }) => (
    <div className="space-y-1 text-center">
        <div className="flex items-center justify-center gap-1.5 text-gray-400 uppercase text-[9px] font-black tracking-widest">
            {icon} {label}
        </div>
        <div className="text-gray-900 font-black text-lg">{value}</div>
    </div>
);

export default Market;

