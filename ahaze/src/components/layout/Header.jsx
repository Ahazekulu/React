import React, { useState, useEffect } from 'react';
import { Search, User, MapPin, MessageSquare, ShoppingBag, Landmark, BookOpen, Clock, ChevronDown, Bell, Info } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
    const [time, setTime] = useState(new Date());
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const { user, profile } = useAuth();

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => {
            clearInterval(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const navItems = [
        { name: 'ahazePlaces', path: '/places', icon: <MapPin size={14} /> },
        { name: 'ahazeConnect', path: '/connect', icon: <MessageSquare size={14} /> },
        { name: 'ahazeMarket', path: '/market', icon: <ShoppingBag size={14} /> },
        { name: 'ahazeOrganizations', path: '/organizations', icon: <Landmark size={14} /> },
        { name: 'ahazeKnowledge', path: '/knowledge', icon: <BookOpen size={14} /> },
        { name: 'Know us', path: '/know-us', icon: <Info size={14} /> },
        { name: 'Contact us', path: '/contact', icon: <MessageSquare size={14} /> },
    ];

    return (
        <header className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled ? 'py-3' : 'py-5'}`}>
            <div className="max-w-[1920px] mx-auto px-6">
                <div className={`bg-white/80 backdrop-blur-2xl border border-white/20 rounded-[32px] px-6 py-3 flex items-center justify-between shadow-2xl shadow-gray-200/50 transition-all ${isScrolled ? 'shadow-lg' : ''}`}>

                    {/* Brand Section */}
                    <div className="flex items-center gap-10">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-12 h-12 bg-dark-green rounded-2xl flex items-center justify-center shadow-lg shadow-dark-green/20 group-hover:rotate-12 transition-transform duration-500">
                                <Landmark className="text-white" size={24} />
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-2xl font-black tracking-tighter text-gray-900 block leading-none">ahazeKulu</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-green opacity-60">Citizen Portal</span>
                            </div>
                        </Link>

                        {/* Navigation */}
                        <nav className="hidden xl:flex items-center gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`px-5 py-2.5 rounded-2xl text-[13px] font-black transition-all flex items-center gap-2 ${location.pathname === item.path
                                        ? 'bg-dark-green text-white shadow-lg shadow-dark-green/20 -translate-y-0.5'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    {item.icon}
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Middle: Search bar with premium feel */}
                    <div className="hidden lg:flex flex-1 max-w-md mx-8">
                        <div className="w-full relative group">
                            <input
                                type="text"
                                placeholder="Search everything in Ethiopia..."
                                className="w-full bg-gray-50/50 border border-transparent rounded-[20px] py-3.5 pl-12 pr-6 text-sm font-bold placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-dark-green/20 focus:ring-4 focus:ring-dark-green/5 transition-all"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-dark-green transition-colors" size={18} />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 bg-gray-200 rounded-md text-[9px] font-black text-gray-500">
                                <ChevronDown size={10} />
                                CTRL K
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions & User */}
                    <div className="flex items-center gap-6">
                        {/* Status Bar */}
                        <div className="hidden lg:flex flex-col items-end gap-1">
                            <div className="flex items-center gap-2 text-xs font-black text-gray-900">
                                <span className="text-dark-green opacity-40 uppercase tracking-tighter mr-2">
                                    {location.pathname === '/' ? 'Home' : navItems.find(n => n.path === location.pathname)?.name || 'Page'}
                                </span>
                                <Clock size={14} className="text-dark-green" />
                                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Public Live</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-dark-green hover:bg-dark-green/5 transition-all">
                                <Bell size={20} />
                            </button>

                            {user ? (
                                <Link to="/profile" className="flex items-center gap-3 p-1 pr-4 bg-gray-50 rounded-[20px] hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200">
                                    <div className="w-10 h-10 bg-dark-green rounded-2xl flex items-center justify-center text-white font-black overflow-hidden shadow-lg shadow-dark-green/10">
                                        {profile?.avatar_url ? (
                                            <img src={profile.avatar_url} className="w-full h-full object-cover" />
                                        ) : (
                                            (profile?.first_name?.charAt(0) || 'U')
                                        )}
                                    </div>
                                    <div className="hidden md:block">
                                        <p className="text-[11px] font-black text-gray-900 leading-tight">{profile?.first_name || 'Citizen'}</p>
                                        <p className="text-[9px] font-black text-dark-green uppercase tracking-widest opacity-60">Verified</p>
                                    </div>
                                </Link>
                            ) : (
                                <Link to="/login" className="bg-dark-green text-white px-8 py-3.5 rounded-2xl text-xs font-black shadow-xl shadow-dark-green/20 hover:-translate-y-0.5 active:scale-95 transition-all">
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
