import React, { useState, useEffect } from 'react';
import { TrendingUp, Award, ShoppingCart, Briefcase, ExternalLink, Star, ChevronRight, Users, MapPin, ShoppingBag } from 'lucide-react';

const RightSidebar = () => {
    const [currentAd, setCurrentAd] = useState(0);
    const ads = [
        { id: 1, title: 'Fly Ethiopian', desc: 'The New Spirit of Africa. Book your flight to Addis now.', color: 'bg-emerald-700', cta: 'Book Now' },
        { id: 2, title: 'Abyssinia Bank', desc: 'Secure your future with our digital banking solutions.', color: 'bg-blue-600', cta: 'Open Account' },
        { id: 3, title: 'Ethio Telecom', desc: 'Experience 5G speed across Addis Ababa and beyond.', color: 'bg-amber-400', cta: 'Learn More', textColor: 'text-gray-900' }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentAd(prev => (prev + 1) % ads.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [ads.length]);

    return (
        <aside className="w-64 bg-white border-l h-screen sticky top-14 hidden lg:block p-4 overflow-y-auto no-scrollbar">
            <div className="flex flex-col gap-8">
                {/* Dynamic Ads */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase text-gray-400 tracking-widest flex items-center justify-between">
                        Global Advertising <span className="text-[8px] bg-gray-100 px-1 rounded">AD</span>
                    </h3>
                    <div className={`rounded-2xl p-6 ${ads[currentAd].color} ${ads[currentAd].textColor || 'text-white'} transition-all duration-700 shadow-xl relative overflow-hidden group min-h-[140px]`}>
                        <div className="relative z-10">
                            <h4 className="font-black text-lg mb-1 leading-tight">{ads[currentAd].title}</h4>
                            <p className="text-[11px] opacity-80 mb-4 line-clamp-2">{ads[currentAd].desc}</p>
                            <button className="bg-white/20 backdrop-blur-md text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1 hover:bg-white/30 transition-all">
                                {ads[currentAd].cta} <ExternalLink size={10} />
                            </button>
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                    </div>
                    <div className="flex justify-center gap-1">
                        {ads.map((_, i) => (
                            <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === currentAd ? 'w-4 bg-dark-green' : 'w-1 bg-gray-200'}`} />
                        ))}
                    </div>
                </div>

                {/* Top Performers */}
                <div className="space-y-6">
                    <section>
                        <h3 className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-4 flex items-center gap-2">
                            <Award size={12} className="text-amber-500" /> Top Performers
                        </h3>

                        <div className="space-y-4">
                            <h4 className="text-[9px] font-black text-gray-300 uppercase tracking-tighter mb-2">Most Followed People</h4>
                            <PerformerItem icon={<Users size={12} />} name="Ato Belay" value="1.2M" />

                            <h4 className="text-[9px] font-black text-gray-300 uppercase tracking-tighter mb-2 mt-4">Most Loved Places</h4>
                            <PerformerItem icon={<MapPin size={12} />} name="Lalibela" value="450k" />

                            <h4 className="text-[9px] font-black text-gray-300 uppercase tracking-tighter mb-2 mt-4">Most Sold Products</h4>
                            <PerformerItem icon={<ShoppingBag size={12} />} name="Premium Coffee" value="2.5k" />

                            <h4 className="text-[9px] font-black text-gray-300 uppercase tracking-tighter mb-2 mt-4">Most Browsed Orgs</h4>
                            <PerformerItem icon={<Briefcase size={12} />} name="Ethio Telecom" value="10M+" />

                            <h4 className="text-[9px] font-black text-gray-300 uppercase tracking-tighter mb-2 mt-4">Most Followed Teachers</h4>
                            <PerformerItem icon={<Award size={12} />} name="Dr. Abera" value="85k" />
                        </div>
                    </section>
                </div>

                {/* Footer Links */}
                <div className="pt-8 border-t border-gray-50 text-[10px] text-gray-400 font-medium space-y-2">
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                        <a href="#" className="hover:text-dark-green underline decoration-gray-200 underline-offset-2">Privacy</a>
                        <a href="#" className="hover:text-dark-green underline decoration-gray-200 underline-offset-2">Terms</a>
                        <a href="#" className="hover:text-dark-green underline decoration-gray-200 underline-offset-2">Help</a>
                    </div>
                    <p>© 2026 ahazeKulu Inc.</p>
                </div>
            </div>
        </aside>
    );
};

const PerformerItem = ({ icon, name, value }) => (
    <div className="group cursor-pointer flex justify-between items-center p-2 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
        <div className="flex items-center gap-2">
            <span className="text-gray-300 group-hover:text-dark-green transition-colors">{icon}</span>
            <span className="text-xs font-bold text-gray-700">{name}</span>
        </div>
        <span className="text-[10px] font-black text-dark-green">{value}</span>
    </div>
);

export default RightSidebar;
