import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, MessageSquare, ShoppingBag, Landmark, BookOpen } from 'lucide-react';

const MobileBottomNav = ({ onOpenPlaces }) => {
    const location = useLocation();

    const items = [
        { name: 'Places', path: '#', icon: <MapPin size={18} />, action: onOpenPlaces },
        { name: 'Connect', path: '/connect', icon: <MessageSquare size={18} /> },
        { name: 'Market', path: '/market', icon: <ShoppingBag size={18} /> },
        { name: 'Organizations', path: '/organizations', icon: <Landmark size={18} /> },
        { name: 'Knowledge', path: '/knowledge', icon: <BookOpen size={18} /> },
    ];

    return (
        <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 border-t border-gray-200 shadow-[0_-2px_10px_rgba(15,23,42,0.04)] md:hidden">
            <div className="max-w-[640px] mx-auto flex items-stretch justify-between px-1 py-1">
                {items.map(item => {
                    const active = location.pathname === item.path;
                    
                    if (item.action) {
                        return (
                            <button
                                key={item.name}
                                onClick={item.action}
                                className={`flex-1 mx-0.5 flex flex-col items-center justify-center rounded-xl px-0.5 py-1 text-[9px] font-black tracking-tight transition-all text-gray-500 hover:text-gray-900 hover:bg-gray-50`}
                            >
                                <span className="mb-0.5 text-gray-400">
                                    {item.icon}
                                </span>
                                <span className="truncate">{item.name}</span>
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex-1 mx-0.5 flex flex-col items-center justify-center rounded-xl px-0.5 py-1 text-[9px] font-black tracking-tight transition-all
                                ${active
                                    ? 'bg-dark-green text-white shadow-lg shadow-dark-green/30 scale-[0.98]'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <span className={`mb-0.5 ${active ? 'text-white' : 'text-gray-400'}`}>
                                {item.icon}
                            </span>
                            <span className="truncate">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <div className="flex flex-1 max-w-[1920px] mx-auto w-full relative">
                <LeftSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="flex-1 min-w-0 bg-[#f9fafb] min-h-[calc(100vh-64px)] rounded-[12px] md:rounded-[16px] my-0.5 md:my-0.5 mr-0.5 md:mr-0.5 ml-0.5 md:ml-0.5 shadow-sm border border-gray-100/50 overflow-hidden relative pb-14 md:pb-0">
                    <div className="h-full overflow-y-auto no-scrollbar scroll-smooth p-1 sm:p-2 md:p-3 lg:p-4">
                        <Outlet />
                    </div>
                </main>
                <RightSidebar />
            </div>
            <MobileBottomNav onOpenPlaces={() => setSidebarOpen(true)} />
        </div>
    );
};

export default MainLayout;
