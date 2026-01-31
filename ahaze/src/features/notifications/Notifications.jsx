import React from 'react';
import { Bell } from 'lucide-react';

const Notifications = () => {
    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="flex items-center gap-3 mb-8">
                <Bell className="text-dark-green" size={24} />
                <h1 className="text-2xl font-black text-gray-900">Notifications</h1>
            </div>
            
            <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="text-gray-300" size={32} />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2">No notifications yet</h3>
                <p className="text-gray-500 text-sm">When you get likes, comments, or updates, they'll show up here.</p>
            </div>
        </div>
    );
};

export default Notifications;
