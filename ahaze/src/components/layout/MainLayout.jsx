import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, MessageSquare, ShoppingBag, Landmark, BookOpen } from 'lucide-react';

const MobileBottomNav = () => {
    const location = useLocation();

    const items = [
        { name: 'Places', path: '/places', icon: <MapPin size={18} /> },
        { name: 'Connect', path: '/connect', icon: <MessageSquare size={18} /> },
        { name: 'Market', path: '/market', icon: <ShoppingBag size={18} /> },
        { name: 'Organizations', path: '/organizations', icon: <Landmark size={18} /> },
        { name: 'Knowledge', path: '/knowledge', icon: <BookOpen size={18} /> },
    ];

    return (
        <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 border-t border-gray-200 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] md:hidden">
            <div className="max-w-[640px] mx-auto flex items-stretch justify-between px-2 py-1.5">
                {items.map(item => {
                    const active = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex-1 mx-0.5 flex flex-col items-center justify-center rounded-2xl px-1 py-1.5 text-[10px] font-black tracking-tight transition-all
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
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <div className="flex flex-1 max-w-[1920px] mx-auto w-full relative">
                <LeftSidebar />
                <main className="flex-1 min-w-0 bg-[#f9fafb] min-h-[calc(100vh-80px)] rounded-[24px] md:rounded-[48px] my-2 md:my-4 mr-2 md:mr-4 ml-2 md:ml-0 shadow-sm border border-gray-100/50 overflow-hidden relative pb-16 md:pb-0">
                    <div className="h-full overflow-y-auto no-scrollbar scroll-smooth p-4 sm:p-6 md:p-8">
                        <Outlet />
                    </div>
                </main>
                <RightSidebar />
            </div>
            <MobileBottomNav />
        </div>
    );
};

export default MainLayout;
