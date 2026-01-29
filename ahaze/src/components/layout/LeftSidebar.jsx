import React, { useState, useMemo } from 'react';
import { Search, PlusCircle, ChevronRight, MapPin, ChevronDown, Filter, X, Upload, Home, Globe, Compass } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import placesData from '../../data/places.json';

const LeftSidebar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expanded, setExpanded] = useState({});
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newPlace, setNewPlace] = useState({ region: '', zone: '', woreda: '', level: 'Zone', name: '' });
    const location = useLocation();

    const toggleExpand = (id, e) => {
        e.stopPropagation();
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const navigate = useNavigate();

    const handleSelectPlace = (place) => {
        // Construct query params based on the place level
        const params = new URLSearchParams();
        if (place["Level 2"]) params.set('region', place["Level 2"]);
        if (place["Level 3"]) params.set('zone', place["Level 3"]);
        if (place["Level 4"]) params.set('woreda', place["Level 4"]);
        if (place["Level 5"]) params.set('kebele', place["Level 5"]);

        // If it's a simple name object (from tree view)
        if (place.name && !place["Level 2"]) {
            // Try to infer or just set basic name if logic allows, 
            // but for now let's assume standard placesData object for search
            // For tree view which passes {name: ...}, we might need to be smarter.
            // Let's rely on the search result full object for best accuracy.
        }

        navigate(`/places?${params.toString()}`);
    };

    const handleSubmitPlace = async () => {
        if (!newPlace.level || !newPlace.name) return alert("Please fill in required fields (Level and Name)");

        const { error } = await supabase.from('place_requests').insert([{
            ...newPlace,
            status: 'pending'
        }]);

        if (error) {
            alert("Error submitting request: " + error.message);
        } else {
            alert("Location submitted for verification! Thank you.");
            setIsAddModalOpen(false);
            setNewPlace({ region: '', zone: '', woreda: '', level: 'Zone', name: '' });
        }
    };

    const regions = useMemo(() => [...new Set(placesData.map(p => p["Level 2"]))].sort(), []);
    const getZones = (region) => [...new Set(placesData.filter(p => p["Level 2"] === region).map(p => p["Level 3"]))].sort();
    const getWoredas = (region, zone) => [...new Set(placesData.filter(p => p["Level 2"] === region && p["Level 3"] === zone).map(p => p["Level 4"]))].sort();

    const searchResults = useMemo(() => {
        if (!searchQuery) return [];
        return placesData
            .filter(p =>
                p["Level 2"].toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p["Level 3"] && p["Level 3"].toLowerCase().includes(searchQuery.toLowerCase())) ||
                (p["Level 4"] && p["Level 4"].toLowerCase().includes(searchQuery.toLowerCase())) ||
                (p["Level 5"] && p["Level 5"].toLowerCase().includes(searchQuery.toLowerCase()))
            )
            .slice(0, 10);
    }, [searchQuery]);

    return (
        <>
            <aside className="w-[300px] h-[calc(100vh-80px)] sticky top-20 hidden lg:flex flex-col gap-8 p-8 overflow-y-auto no-scrollbar">

                {/* Global Explore */}
                <div className="space-y-3">
                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] ml-2">National Hub</h3>
                    <div className="space-y-1">
                        <NavLink to="/" icon={<Home size={18} />} label="Discover Today" active={location.pathname === '/'} />
                        <NavLink to="/places" icon={<Globe size={18} />} label="Explore Regions" active={location.pathname === '/places'} />
                        <NavLink to="/connect" icon={<Compass size={18} />} label="Community Feed" active={location.pathname === '/connect'} />
                    </div>
                </div>

                {/* Geography Browser */}
                <div className="flex-1 flex flex-col gap-6">
                    <div className="flex items-center justify-between ml-2">
                        <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Places Ledger</h3>
                        <Filter size={14} className="text-gray-300 hover:text-dark-green cursor-pointer transition-colors" />
                    </div>

                    <div className="relative group">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search locations..."
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold outline-none focus:ring-4 focus:ring-dark-green/5 focus:bg-white focus:border-dark-green/20 transition-all shadow-sm"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-dark-green transition-colors" size={16} />
                    </div>

                    <div className="flex-1 space-y-1">
                        {searchQuery ? (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                <div className="space-y-2">
                                    {searchResults.length > 0 ? searchResults.map((p, i) => {
                                        // Determine relevant level for display
                                        let mainText = "";
                                        let subText = "";
                                        const q = searchQuery.toLowerCase();

                                        if (p["Level 5"]?.toLowerCase().includes(q)) {
                                            mainText = `${p["Level 5"]} is a Kebele`;
                                            subText = `in ${p["Level 4"]}, ${p["Level 3"]}`;
                                        } else if (p["Level 4"]?.toLowerCase().includes(q)) {
                                            mainText = `${p["Level 4"]} is a Woreda`;
                                            subText = `in ${p["Level 3"]}, ${p["Level 2"]}`;
                                        } else if (p["Level 3"]?.toLowerCase().includes(q)) {
                                            mainText = `${p["Level 3"]} is a Zone`;
                                            subText = `in ${p["Level 2"]}`;
                                        } else {
                                            mainText = `${p["Level 2"]} is a Region`;
                                            subText = "Ethiopia";
                                        }

                                        return (
                                            <button key={i} onClick={() => handleSelectPlace(p)} className="w-full text-left p-3.5 bg-white border border-gray-100 rounded-2xl hover:border-dark-green/30 hover:shadow-lg hover:shadow-dark-green/5 transition-all group active:scale-95">
                                                <p className="text-[11px] font-black text-gray-800 group-hover:text-dark-green truncate">{mainText}</p>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter mt-1">{subText}</p>
                                            </button>
                                        );
                                    }) : (
                                        <div className="text-center py-10">
                                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3"><X className="text-gray-300" size={20} /></div>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">No Matches</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <TreeNode label="Ethiopia" icon={<MapPin size={16} className="text-dark-green" />} isExpanded={expanded['ethiopia']} onToggle={(e) => toggleExpand('ethiopia', e)} onSelect={() => handleSelectPlace({ name: "Ethiopia" })}>
                                    {regions.map(region => (
                                        <TreeNode key={region} label={region} isExpanded={expanded[region]} onToggle={(e) => toggleExpand(region, e)} onSelect={() => handleSelectPlace({ name: region })} className="ml-4">
                                            {getZones(region).map(zone => (
                                                <TreeNode key={`${region}-${zone}`} label={zone} isExpanded={expanded[`${region}-${zone}`]} onToggle={(e) => toggleExpand(`${region}-${zone}`, e)} onSelect={() => handleSelectPlace({ name: zone })} className="ml-4">
                                                    <div className="py-2 pl-4 border-l border-gray-100 space-y-2">
                                                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em] mb-3 ml-2">Woredas</p>
                                                        {getWoredas(region, zone).slice(0, 5).map(woreda => (
                                                            <div key={woreda} onClick={() => handleSelectPlace({ name: woreda })} className="p-2 text-[10px] font-bold text-gray-500 hover:text-dark-green hover:bg-dark-green/5 rounded-xl cursor-pointer truncate transition-all active:scale-95">
                                                                {woreda}
                                                            </div>
                                                        ))}
                                                        {getWoredas(region, zone).length > 5 && <button className="text-[9px] font-black text-dark-green/60 uppercase tracking-widest ml-2 py-1">View {getWoredas(region, zone).length - 5} More...</button>}
                                                    </div>
                                                </TreeNode>
                                            ))}
                                        </TreeNode>
                                    ))}
                                </TreeNode>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Action */}
                <button onClick={() => setIsAddModalOpen(true)} className="group relative flex items-center gap-3 w-full p-5 bg-dark-green/5 text-dark-green rounded-[24px] hover:bg-dark-green hover:text-white transition-all font-black text-xs border border-dark-green/10 shadow-sm active:scale-95 overflow-hidden">
                    <PlusCircle size={20} />
                    <span>List New Location</span>
                </button>
            </aside>

            {/* Modal - Dynamic Place Addition */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[48px] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
                        <div className="p-10 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Expand the Map</h2>
                                <p className="text-gray-400 text-xs font-black uppercase tracking-widest mt-2 ml-1">Submit a missing location for verification</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all"><X size={24} /></button>
                        </div>
                        <div className="p-10 space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Place Level</label>
                                    <select
                                        value={newPlace.level}
                                        onChange={(e) => setNewPlace({ ...newPlace, level: e.target.value })}
                                        className="w-full bg-gray-50 p-4 rounded-2xl border-none focus:ring-4 focus:ring-dark-green/5 focus:bg-white outline-none text-gray-900 font-bold"
                                    >
                                        <option value="Region">Region</option>
                                        <option value="Zone">Zone / Subcity</option>
                                        <option value="Woreda">Woreda</option>
                                        <option value="Kebele">Kebele</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Parent Region</label>
                                    <select
                                        value={newPlace.region}
                                        onChange={(e) => setNewPlace({ ...newPlace, region: e.target.value })}
                                        className="w-full bg-gray-50 p-4 rounded-2xl border-none focus:ring-4 focus:ring-dark-green/5 focus:bg-white outline-none text-gray-900 font-bold"
                                    >
                                        <option value="">Select Region</option>
                                        {regions.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Dynamic Parent Selectors */}
                            {(newPlace.level === 'Woreda' || newPlace.level === 'Kebele') && (
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Parent Zone</label>
                                    <select
                                        value={newPlace.zone}
                                        onChange={(e) => setNewPlace({ ...newPlace, zone: e.target.value })}
                                        disabled={!newPlace.region}
                                        className="w-full bg-gray-50 p-4 rounded-2xl border-none focus:ring-4 focus:ring-dark-green/5 focus:bg-white outline-none text-gray-900 font-bold"
                                    >
                                        <option value="">Select Zone</option>
                                        {newPlace.region && getZones(newPlace.region).map(z => <option key={z} value={z}>{z}</option>)}
                                    </select>
                                </div>
                            )}

                            {newPlace.level === 'Kebele' && (
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Parent Woreda</label>
                                    <select
                                        value={newPlace.woreda}
                                        onChange={(e) => setNewPlace({ ...newPlace, woreda: e.target.value })}
                                        disabled={!newPlace.zone}
                                        className="w-full bg-gray-50 p-4 rounded-2xl border-none focus:ring-4 focus:ring-dark-green/5 focus:bg-white outline-none text-gray-900 font-bold"
                                    >
                                        <option value="">Select Woreda</option>
                                        {newPlace.zone && getWoredas(newPlace.region, newPlace.zone).map(w => <option key={w} value={w}>{w}</option>)}
                                    </select>
                                </div>
                            )}

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Location Name</label>
                                <input
                                    type="text"
                                    value={newPlace.name}
                                    onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
                                    placeholder={`Name of the ${newPlace.level}...`}
                                    className="w-full bg-gray-50 p-5 rounded-2xl border-none focus:ring-4 focus:ring-dark-green/5 focus:bg-white outline-none text-gray-900 font-black shadow-sm"
                                />
                            </div>

                            <button onClick={handleSubmitPlace} className="w-full bg-gray-900 text-white py-5 rounded-[24px] font-black text-sm shadow-2xl shadow-gray-200 hover:bg-dark-green hover:shadow-dark-green/20 hover:-translate-y-1 transition-all active:scale-95 uppercase tracking-[0.2em]">Submit for verification</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const NavLink = ({ to, icon, label, active }) => (
    <Link to={to} className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${active ? 'bg-dark-green text-white shadow-lg shadow-dark-green/20 -translate-y-0.5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/80'}`}>
        <span className={`${active ? 'text-white' : 'text-gray-400 group-hover:text-dark-green'} transition-colors`}>{icon}</span>
        <span className="text-xs font-black tracking-tight">{label}</span>
        {!active && <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-gray-300" />}
    </Link>
);

const TreeNode = ({ label, icon, isExpanded, onToggle, onSelect, children, className = "" }) => (
    <div className={className}>
        <div className="flex items-center group/node">
            <button onClick={onSelect} className={`flex-1 flex items-center gap-3 p-3 rounded-2xl text-[13px] font-black transition-all group-hover/node:text-dark-green ${isExpanded ? 'text-gray-900' : 'text-gray-500'}`}>
                {icon || <div className="w-1.5 h-1.5 bg-gray-200 rounded-full ml-1" />}
                <span className="truncate">{label}</span>
            </button>
            <button onClick={onToggle} className={`p-3 rounded-xl transition-all ${isExpanded ? 'text-dark-green bg-dark-green/5' : 'text-gray-300 hover:bg-gray-50 hover:text-dark-green'}`}>
                {isExpanded ? <ChevronDown size={14} className="animate-in fade-in zoom-in" /> : <ChevronRight size={14} />}
            </button>
        </div>
        {isExpanded && <div className="border-l-2 border-dark-green/10 mt-1 animate-in slide-in-from-left-2 duration-300">{children}</div>}
    </div>
);

export default LeftSidebar;
