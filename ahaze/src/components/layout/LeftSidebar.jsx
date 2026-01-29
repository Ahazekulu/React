import React, { useState, useMemo } from 'react';
import { Search, PlusCircle, ChevronRight, MapPin, ChevronDown, Filter, X, Upload } from 'lucide-react';
import placesData from '../../data/places.json';

const LeftSidebar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expanded, setExpanded] = useState({});
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const toggleExpand = (id, e) => {
        e.stopPropagation();
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSelectPlace = (place) => {
        console.log("Selected Place:", place);
        // In a real app, this would update a global context or navigate
        // For now, we'll keep it as a logical selection
        setSearchQuery('');
    };

    const regions = useMemo(() => [...new Set(placesData.map(p => p["Level 2"]))].sort(), []);

    const getZones = (region) => [...new Set(placesData.filter(p => p["Level 2"] === region).map(p => p["Level 3"]))].sort();
    const getWoredas = (region, zone) => [...new Set(placesData.filter(p => p["Level 2"] === region && p["Level 3"] === zone).map(p => p["Level 4"]))].sort();
    const getKebeles = (region, zone, woreda) => [...new Set(placesData.filter(p => p["Level 2"] === region && p["Level 3"] === zone && p["Level 4"] === woreda).map(p => p["Level 5"]))].sort();

    const searchResults = useMemo(() => {
        if (!searchQuery) return [];
        return placesData
            .filter(p =>
                p["Level 2"].toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p["Level 3"] && p["Level 3"].toLowerCase().includes(searchQuery.toLowerCase())) ||
                (p["Level 4"] && p["Level 4"].toLowerCase().includes(searchQuery.toLowerCase())) ||
                (p["Level 5"] && p["Level 5"].toLowerCase().includes(searchQuery.toLowerCase()))
            )
            .slice(0, 15);
    }, [searchQuery]);

    return (
        <>
            <aside className="w-64 bg-white border-r h-screen sticky top-14 hidden xl:block p-4 overflow-y-auto no-scrollbar">
                <div className="flex flex-col gap-6">
                    {/* Search */}
                    <div>
                        <h3 className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-[0.2em]">Search Places</h3>
                        <div className="relative group">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Find a place..."
                                className="w-full bg-gray-50 border-2 border-transparent rounded-xl py-2 px-3 pl-9 focus:bg-white focus:border-dark-green transition-all text-xs outline-none"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-dark-green transition-colors" size={14} />
                        </div>
                    </div>

                    {/* Hierarchy / Search Results */}
                    <div className="flex-1">
                        {searchQuery ? (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                <h3 className="text-[10px] font-black uppercase text-dark-green tracking-[0.2em]">Results</h3>
                                <div className="space-y-2">
                                    {searchResults.length > 0 ? searchResults.map((p, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSelectPlace(p)}
                                            className="w-full text-left p-3 bg-gray-50 rounded-2xl hover:bg-dark-green/5 hover:ring-1 hover:ring-dark-green/20 transition-all group"
                                        >
                                            <p className="text-[11px] font-black text-gray-800 group-hover:text-dark-green truncate">{p["Level 5"] || p["Level 4"]}</p>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5">{p["Level 2"]} {p["Level 3"] ? `> ${p["Level 3"]}` : ''}</p>
                                        </button>
                                    )) : (
                                        <p className="text-[10px] text-gray-400 italic p-2">No matching places found.</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in fade-in duration-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">All Regions</h3>
                                    <Filter size={12} className="text-gray-300" />
                                </div>
                                <div className="space-y-1">
                                    <TreeNode
                                        label="Ethiopia (All)"
                                        icon={<MapPin size={14} className="text-dark-green" />}
                                        isExpanded={expanded['ethiopia']}
                                        onToggle={(e) => toggleExpand('ethiopia', e)}
                                        onSelect={() => handleSelectPlace({ name: "Ethiopia" })}
                                    >
                                        {regions.map(region => (
                                            <TreeNode
                                                key={region}
                                                label={region}
                                                isExpanded={expanded[region]}
                                                onToggle={(e) => toggleExpand(region, e)}
                                                onSelect={() => handleSelectPlace({ name: region })}
                                                className="ml-4"
                                            >
                                                <div className="text-[9px] font-black uppercase text-gray-300 ml-6 my-1 tracking-widest">
                                                    {region === 'Addis Ababa' ? 'Subcities' : 'Zones'}
                                                </div>
                                                {getZones(region).map(zone => (
                                                    <TreeNode
                                                        key={`${region}-${zone}`}
                                                        label={zone}
                                                        isExpanded={expanded[`${region}-${zone}`]}
                                                        onToggle={(e) => toggleExpand(`${region}-${zone}`, e)}
                                                        onSelect={() => handleSelectPlace({ name: zone })}
                                                        className="ml-4"
                                                    >
                                                        {getWoredas(region, zone).map(woreda => (
                                                            <div key={woreda} className="ml-4 p-1.5 text-[10px] text-gray-400 hover:text-dark-green hover:bg-gray-50 rounded-lg cursor-pointer truncate transition-colors" onClick={() => handleSelectPlace({ name: woreda })}>
                                                                {woreda}
                                                            </div>
                                                        ))}
                                                    </TreeNode>
                                                ))}
                                            </TreeNode>
                                        ))}
                                    </TreeNode>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Add Place Action */}
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="mt-auto group relative flex items-center gap-3 w-full p-4 bg-gray-50 text-gray-700 rounded-2xl hover:bg-dark-green hover:text-white transition-all font-black text-xs border-2 border-dashed border-gray-200 hover:border-solid hover:border-dark-green shadow-sm overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <PlusCircle size={18} className="relative z-10" />
                        <span className="relative z-10">Add New Place</span>
                    </button>
                </div>
            </aside>

            {/* Add Place Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Add New Area</h2>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-1">Request a new place to be listed</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4 text-xs font-black uppercase text-gray-400 tracking-widest">
                                <div className="space-y-2">
                                    <label>Region/City</label>
                                    <input type="text" placeholder="e.g. Oromia" className="w-full bg-gray-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-dark-green outline-none text-gray-800" />
                                </div>
                                <div className="space-y-2">
                                    <label>Place Level</label>
                                    <select className="w-full bg-gray-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-dark-green outline-none text-gray-800">
                                        <option>Zone / Subcity</option>
                                        <option>Woreda</option>
                                        <option>Kebele / Town</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Place Name</label>
                                <input type="text" placeholder="Enter name of the place..." className="w-full bg-gray-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-dark-green outline-none text-gray-800 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Upload Landmark Photo</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:bg-gray-50 transition-all cursor-pointer group">
                                    <Upload className="text-gray-300 group-hover:text-dark-green transition-colors" size={32} />
                                    <span className="text-xs font-bold text-gray-400">Click to upload image</span>
                                </div>
                            </div>
                            <button className="w-full bg-dark-green text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-dark-green/20 hover:-translate-y-1 transition-all active:translate-y-0 uppercase tracking-widest mt-4">
                                Submit for Review
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const TreeNode = ({ label, icon, isExpanded, onToggle, onSelect, children, className = "" }) => (
    <div className={className}>
        <div className="flex items-center group">
            <button
                onClick={onSelect}
                className="flex-1 flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 text-xs font-bold text-gray-700 transition-all group-hover:text-dark-green"
            >
                {icon || <div className="w-1 h-1 bg-gray-300 rounded-full ml-1" />}
                <span className="truncate">{label}</span>
            </button>
            <button
                onClick={onToggle}
                className="p-2 text-gray-300 hover:text-dark-green transition-colors"
            >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
        </div>
        {isExpanded && <div className="border-l border-gray-100 mt-1">{children}</div>}
    </div>
);

export default LeftSidebar;
