import React, { useState } from 'react';
import { usePlace } from '../../context/PlaceContext';
import Connect from '../connect/Connect';
import Market from '../market/Market';
import Organizations from '../organizations/Organizations';
import Knowledge from '../knowledge/Knowledge';
import { MessageSquare, Users, Info, ShoppingBag, Landmark, BookOpen, MapPin, Sparkles } from 'lucide-react';
import PlacePosts from './PlacePosts';

const PlaceInfo = ({ place }) => (
    <div className="w-full bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl lg:text-2xl font-black mb-3 lg:mb-4">About {place?.name || "Ethiopia"}</h2>
        <p className="text-gray-600 text-sm lg:text-base">
            {place 
                ? `Detailed information about ${place.name} (${place.level}) will appear here. Demographics, history, and key facts.`
                : "Welcome to the National Hub. Select a place from the left sidebar to see more details."}
        </p>
    </div>
);

const NearbyYou = ({ place }) => (
    <div className="w-full bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl lg:text-2xl font-black mb-3 lg:mb-4">Nearby {place?.name || "You"}</h2>
        <p className="text-gray-600 text-sm lg:text-base">Map and list of nearby attractions, services, and events.</p>
    </div>
);

const Home = () => {
    const { selectedPlace } = usePlace();
    const [activeTab, setActiveTab] = useState('Posts');

    const tabs = [
        { id: 'Posts', label: 'Posts', icon: <MessageSquare size={18} /> },
        { id: 'Connect', label: 'Connect', icon: <Users size={18} /> },
        { id: 'Know', label: 'Know', icon: <Info size={18} /> },
        { id: 'Market', label: 'Market', icon: <ShoppingBag size={18} /> },
        { id: 'Organizations', label: 'Organizations', icon: <Landmark size={18} /> },
        { id: 'Knowledge', label: 'Knowledge', icon: <BookOpen size={18} /> },
        { id: 'Nearby You', label: 'Nearby You', icon: <MapPin size={18} /> },
    ];

    // Determine what to render
    const renderContent = () => {
        switch (activeTab) {
            case 'Posts': return <PlacePosts place={selectedPlace} />;
            case 'Connect': return <Connect />; // Connect handles its own state
            case 'Know': return <PlaceInfo place={selectedPlace} />;
            case 'Market': return <Market />;
            case 'Organizations': return <Organizations />;
            case 'Knowledge': return <Knowledge />;
            case 'Nearby You': return <NearbyYou place={selectedPlace} />;
            default: return <PlacePosts place={selectedPlace} />;
        }
    };


    return (
        <div className="flex flex-col gap-3 lg:gap-4">
            {/* Header / Title Area for Selected Place */}
            <div className="flex flex-col gap-1 lg:gap-2">
                 <div className="flex items-center gap-2 text-dark-green/60 font-bold text-xs uppercase tracking-widest">
                    <MapPin size={14} />
                    <span>{selectedPlace?.level || "National"} Level</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
                    {selectedPlace?.name || "Ethiopia"}
                </h1>
                <p className="text-gray-500 font-medium text-sm lg:text-base">
                    {selectedPlace 
                        ? `Explore updates, connections, and opportunities in ${selectedPlace.name}.`
                        : "Welcome to your digital portal for Ethiopia."}
                </p>
            </div>

            {/* Tabs Navigation */}
            <div className="flex flex-wrap items-center gap-1 lg:gap-2 sticky top-0 bg-[#f9fafb] z-30 py-1 lg:py-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${
                            activeTab === tab.id
                                ? 'bg-dark-green text-white shadow-lg shadow-dark-green/20 scale-105'
                                : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-100'
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[400px] lg:min-h-[500px]">
                {renderContent()}
            </div>
        </div>
    );
};

export default Home;
