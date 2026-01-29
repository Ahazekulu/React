import React, { useState, useEffect } from 'react';
import { TrendingUp, Award, ShoppingCart, Briefcase, ExternalLink, Star, ChevronRight, Users, MapPin, ShoppingBag, Zap, Flame, Crown } from 'lucide-react';

const RightSidebar = () => {
    const [currentAd, setCurrentAd] = useState(0);
    const ads = [
        { id: 1, title: 'Fly Ethiopian', desc: 'The New Spirit of Africa. Experience world-class hospitality on your next journey.', color: 'bg-[#1b4332]', cta: 'Book Flight' },
        { id: 2, title: 'Bank of Abyssinia', desc: 'Smarter digital banking for a brighter future. Elevate your financial freedom.', color: 'bg-[#003566]', cta: 'Visit Portal' },
        { id: 3, title: 'Ethio Telecom', desc: 'Connecting Ethiopia with 5G. The fastest network in the Horn of Africa.', color: 'bg-[#ffc300]', cta: 'Upgrade Now', textColor: 'text-gray-900' }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentAd(prev => (prev + 1) % ads.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [ads.length]);

    return (
        <aside className="w-[300px] h-[calc(100vh-80px)] sticky top-20 hidden lg:flex flex-col gap-10 p-8 overflow-y-auto no-scrollbar">

            {/* Sponsorship Display */}
            <div className="space-y-4">
                <div className="flex items-center justify-between ml-2">
                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Featured Partners</h3>
                    <div className="px-2 py-0.5 bg-gray-100 rounded-md text-[8px] font-black text-gray-400">PARTNER</div>
                </div>

                <div className={`rounded-[32px] p-8 ${ads[currentAd].color} ${ads[currentAd].textColor || 'text-white'} transition-all duration-1000 shadow-2xl relative overflow-hidden group min-h-[180px] flex flex-col justify-end`}>
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Crown size={48} />
                    </div>

                    <div className="relative z-10 animate-in fade-in slide-in-from-right-4 duration-700">
                        <h4 className="font-black text-2xl mb-2 tracking-tighter leading-none">{ads[currentAd].title}</h4>
                        <p className="text-xs font-medium opacity-70 mb-5 leading-relaxed">{ads[currentAd].desc}</p>
                        <button className="w-full bg-white/10 backdrop-blur-xl text-[10px] font-black uppercase tracking-widest py-3 rounded-2xl border border-white/20 flex items-center justify-center gap-2 hover:bg-white/20 transition-all active:scale-95">
                            {ads[currentAd].cta} <ExternalLink size={12} />
                        </button>
                    </div>

                    {/* Progress indicators inside the ad */}
                    <div className="flex gap-1.5 mt-6 relative z-10">
                        {ads.map((_, i) => (
                            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === currentAd ? 'w-6 bg-white' : 'w-1 bg-white/20'}`} />
                        ))}
                    </div>

                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
                </div>
            </div>

            {/* Trending / Social Proof */}
            <div className="space-y-8">
                <section>
                    <div className="flex items-center gap-2 mb-6 ml-2">
                        <Flame size={14} className="text-accent-red" />
                        <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Trending Now</h3>
                    </div>

                    <div className="space-y-2">
                        <TrendingCard icon={<Users className="text-dark-green" />} title="Influencers" name="Ato Belay" growth="+24%" value="1.2M Citizens" />
                        <TrendingCard icon={<MapPin className="text-light-blue" />} title="Locations" name="Lalibela" growth="+12%" value="450k Love" />
                        <TrendingCard icon={<ShoppingBag className="text-amber-500" />} title="Marketplace" name="Premium Coffee" growth="+38%" value="2.5k Sales" />
                        <TrendingCard icon={<Briefcase className="text-gray-900" />} title="Organizations" name="Ethio Telecom" growth="+5%" value="Active" />
                    </div>
                </section>

                {/* Newsletter / System Updates */}
                <div className="bg-gray-50 rounded-[32px] p-6 border border-gray-100 group hover:border-dark-green/20 transition-all cursor-pointer">
                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:bg-dark-green group-hover:text-white transition-all">
                        <Zap size={20} />
                    </div>
                    <h4 className="text-sm font-black text-gray-900 mb-1">Weekly Digest</h4>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Stay updated with the latest community news and trends.</p>
                </div>
            </div>

            {/* Legal / Metadata Footer */}
            <div className="mt-auto pt-8 border-t border-gray-50">
                <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
                    {['Security', 'Privacy', 'Legal', 'Contact'].map(link => (
                        <a key={link} href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-dark-green transition-colors">{link}</a>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-900 rounded-lg flex items-center justify-center text-white text-[8px] font-black italic">ak</div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">© 2026 ahazeKulu Enterprise</p>
                </div>
            </div>
        </aside>
    );
};

const TrendingCard = ({ icon, title, name, growth, value }) => (
    <div className="group cursor-pointer p-4 rounded-2xl bg-white border border-transparent hover:border-gray-100 hover:bg-gray-50/50 hover:shadow-xl hover:shadow-gray-200/20 transition-all active:scale-[0.98]">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-100 shadow-sm animate-in zoom-in-50">
                    {React.cloneElement(icon, { size: 14 })}
                </div>
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{title}</span>
            </div>
            <div className="text-[8px] font-black text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-lg">{growth}</div>
        </div>
        <div className="flex items-center justify-between">
            <span className="text-xs font-black text-gray-800">{name}</span>
            <span className="text-[10px] font-black text-dark-green opacity-60 tracking-tighter">{value}</span>
        </div>
    </div>
);

export default RightSidebar;
