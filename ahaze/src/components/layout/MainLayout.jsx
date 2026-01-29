import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-1 max-w-[1920px] mx-auto w-full">
                <LeftSidebar />
                <main className="flex-1 min-w-0 p-4 md:p-6 bg-gray-50/50">
                    <Outlet />
                </main>
                <RightSidebar />
            </div>
        </div>
    );
};

export default MainLayout;
