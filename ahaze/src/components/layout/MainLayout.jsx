import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <div className="flex flex-1 max-w-[1920px] mx-auto w-full relative">
                <LeftSidebar />
                <main className="flex-1 min-w-0 bg-[#f9fafb] min-h-[calc(100vh-80px)] rounded-[32px] md:rounded-[48px] my-2 md:my-4 mr-2 md:mr-4 ml-2 md:ml-0 shadow-sm border border-gray-100/50 overflow-hidden relative">
                    <div className="h-full overflow-y-auto no-scrollbar scroll-smooth p-6 md:p-8">
                        <Outlet />
                    </div>
                </main>
                <RightSidebar />
            </div>
        </div>
    );
};

export default MainLayout;
