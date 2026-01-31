import React from 'react';
import { MessageSquare } from 'lucide-react';

const Messages = () => {
    return (
        <div className="max-w-4xl mx-auto py-8 h-[calc(100vh-140px)] flex flex-col">
            <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="text-dark-green" size={24} />
                <h1 className="text-2xl font-black text-gray-900">Messages</h1>
            </div>
            
            <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-80 border-r border-gray-100 p-4 bg-gray-50/50">
                    <input 
                        type="text" 
                        placeholder="Search messages..." 
                        className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-bold shadow-sm mb-4 outline-none focus:ring-2 focus:ring-dark-green/10"
                    />
                    <div className="space-y-2">
                        {/* Placeholder items */}
                        {[1, 2, 3].map(i => (
                            <div key={i} className="p-3 hover:bg-white rounded-xl cursor-pointer transition-all flex items-center gap-3 group">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                                <div className="min-w-0">
                                    <h4 className="font-bold text-xs text-gray-900 truncate">User Name {i}</h4>
                                    <p className="text-[10px] text-gray-500 truncate">Hey, how are you doing?</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Chat Area */}
                <div className="flex-1 flex flex-col items-center justify-center bg-white p-8 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <MessageSquare className="text-gray-300" size={40} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">Your Messages</h3>
                    <p className="text-gray-500 text-sm max-w-xs">Select a conversation from the left to start chatting with your connections.</p>
                </div>
            </div>
        </div>
    );
};

export default Messages;
