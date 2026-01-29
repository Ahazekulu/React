import React, { useState, useEffect } from 'react';
import { Search, User, MapPin, MessageSquare, ShoppingBag, Landmark, BookOpen, Info, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const [time, setTime] = useState(new Date());
    const location = useLocation();

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/') return 'Landing';
        if (path.includes('places')) return 'ahazePlaces';
        if (path.includes('connect')) return 'ahazeConnect';
        if (path.includes('market')) return 'ahazeMarket';
        if (path.includes('organizations')) return 'ahazeOrganizations';
        if (path.includes('knowledge')) return 'ahazeKnowledge';
        return 'ahazeKulu';
    };

    return (
        <header className="bg-dark-green text-white p-2 sticky top-0 z-50 shadow-md">
            <div className="flex items-center justify-between gap-4">
                {/* Logo & Name */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                        {/* Placeholder for Logo Image */}
                        <Landmark className="text-dark-green" size={24} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">ahazeKulu</span>
                </Link>

                {/* Search */}
                <div className="flex-1 max-w-md relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-white/10 border border-white/20 rounded-full py-1 px-4 pr-10 focus:outline-none focus:bg-white/20 transition-all text-sm"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60" size={16} />
                </div>

                {/* Navigation */}
                <nav className="hidden lg:flex items-center gap-4 text-sm font-medium">
                    <Link to="/places" className="hover:text-light-blue transition-colors">ahazePlaces</Link>
                    <Link to="/connect" className="hover:text-light-blue transition-colors">ahazeConnect</Link>
                    <Link to="/market" className="hover:text-light-blue transition-colors">ahazeMarket</Link>
                    <Link to="/organizations" className="hover:text-light-blue transition-colors">ahazeOrganizations</Link>
                    <Link to="/knowledge" className="hover:text-light-blue transition-colors">ahazeKnowledge</Link>
                    <Link to="/know-us" className="hover:text-light-blue transition-colors">Know us</Link>
                    <Link to="/contact" className="hover:text-light-blue transition-colors">Contact us</Link>
                </nav>

                {/* Right Section: Clock, Title, Profile */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-xs font-mono">{time.toLocaleTimeString()}</span>
                        <span className="text-[10px] uppercase font-bold text-accent-yellow">{getPageTitle()}</span>
                    </div>
                    <Link to="/profile" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                        <User size={18} />
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
