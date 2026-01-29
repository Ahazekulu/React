import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, ArrowRight, MapPin, Users, ShoppingBag, BookOpen, Sparkles, Globe, ShieldCheck, Zap } from 'lucide-react';

const Landing = () => {
    return (
        <div className="flex flex-col gap-24 py-16 overflow-hidden">
            {/* Hero Section */}
            <section className="relative px-6 text-center min-h-[70vh] flex flex-col items-center justify-center">
                {/* Animated Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-dark-green/10 rounded-full blur-[120px] -z-10 animate-pulse" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-light-blue/10 rounded-full blur-[100px] -z-10" />

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-green/5 border border-dark-green/10 text-dark-green text-xs font-black uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                    <Sparkles size={14} />
                    Everything Ethiopia, All in One Place
                </div>

                <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-top-8 duration-1000">
                    Your Digital Portal to <span className="text-dark-green relative">
                        Ethiopia
                        <svg className="absolute -bottom-4 left-0 w-full" viewBox="0 0 358 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 17C118.333 5.66667 239.667 5.66667 355 17" stroke="#006600" strokeWidth="6" strokeLinecap="round" />
                        </svg>
                    </span>
                </h1>

                <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-12 leading-relaxed font-medium animate-in fade-in slide-in-from-top-12 duration-1000 delay-200">
                    Connect with your community, discover hidden gems, trade locally, and master new skills. ahazeKulu is the heartbeat of modern Ethiopia.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-6 animate-in fade-in slide-in-from-top-16 duration-1000 delay-300">
                    <Link to="/signup" className="group bg-dark-green text-white px-10 py-5 rounded-[24px] font-black text-lg hover:bg-emerald-800 transition-all shadow-[0_20px_50px_rgba(0,102,0,0.3)] hover:-translate-y-1 flex items-center gap-3 active:scale-95">
                        Get Started Free
                        <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                    <Link to="/know-us" className="bg-white text-gray-900 border-2 border-gray-100 px-10 py-5 rounded-[24px] font-black text-lg hover:border-dark-green/20 hover:bg-gray-50 transition-all active:scale-95">
                        How it Works
                    </Link>
                </div>

                {/* Floating Badges */}
                <div className="mt-20 flex flex-wrap justify-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                    <FeatureBadge icon={<ShieldCheck size={16} />} label="Secure & Private" />
                    <FeatureBadge icon={<Globe size={16} />} label="National Coverage" />
                    <FeatureBadge icon={<Zap size={16} />} label="Real-time Updates" />
                </div>
            </section>

            {/* Feature Bento Grid */}
            <section className="px-6 max-w-7xl mx-auto w-full">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">One App, Limitless Possibilities</h2>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Explore the ahazeKulu Ecosystem</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <FeatureCard
                        className="md:col-span-8 bg-emerald-50 border-emerald-100"
                        title="ahazePlaces"
                        desc="Detailed insights into every Region, Zone, Woreda, and Kebele in Ethiopia. From historical landmarks to local services, finding your way has never been easier."
                        icon={<MapPin size={32} className="text-dark-green" />}
                        link="/places"
                    />
                    <FeatureCard
                        className="md:col-span-4 bg-blue-50 border-blue-100"
                        title="ahazeConnect"
                        desc="Share news, updates, and stories with the people that matter most – your neighbors, coworkers, and schoolmates."
                        icon={<Users size={32} className="text-light-blue" />}
                        link="/connect"
                    />
                    <FeatureCard
                        className="md:col-span-4 bg-amber-50 border-amber-100"
                        title="ahazeMarket"
                        desc="The community marketplace for everything from unique crafts to everyday essentials. Support local businesses directly."
                        icon={<ShoppingBag size={32} className="text-amber-600" />}
                        link="/market"
                    />
                    <FeatureCard
                        className="md:col-span-8 bg-rose-50 border-rose-100"
                        title="ahazeKnowledge"
                        desc="Learn from Ethiopia's brightest minds. Our educational repository covers agriculture, technology, history, and community leadership."
                        icon={<BookOpen size={32} className="text-accent-red" />}
                        link="/knowledge"
                    />
                </div>
            </section>

            {/* Organizations Teaser */}
            <section className="px-6">
                <div className="bg-gray-900 rounded-[60px] p-12 md:p-24 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />

                    <div className="max-w-3xl relative z-10">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-10">
                            <Landmark size={32} className="text-light-blue" />
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Digital Infrastructure for Organizations</h2>
                        <p className="text-xl text-white/60 mb-12 leading-relaxed">
                            Whether you're a Government Agency, a Private Enterprise, or a Non-Profit, ahazeKulu gives you the tools to reach your constituents and customers directly.
                        </p>
                        <Link to="/organizations" className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-2xl font-black hover:bg-light-blue hover:text-white transition-all">
                            Register Your Org <ArrowRight size={20} />
                        </Link>
                    </div>

                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/10 pt-16">
                        <Stat label="Active Users" value="25,000+" />
                        <Stat label="Verified Orgs" value="1,200+" />
                        <Stat label="Communities" value="450+" />
                        <Stat label="Total Trades" value="E-1.2M" />
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <section className="text-center py-20 px-6">
                <h3 className="text-4xl font-black text-gray-900 mb-8">Ready to join the community?</h3>
                <Link to="/signup" className="bg-dark-green text-white px-12 py-6 rounded-[32px] font-black text-2xl hover:scale-105 transition-all shadow-2xl shadow-dark-green/30 inline-block">
                    Register Your Identity Today
                </Link>
                <p className="mt-8 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Joined by 100+ new citizens every hour</p>
            </section>
        </div>
    );
};

const FeatureBadge = ({ icon, label }) => (
    <div className="flex items-center gap-2 text-gray-900 font-black uppercase text-[10px] tracking-widest border border-gray-200 px-4 py-2 rounded-full">
        {icon} {label}
    </div>
);

const FeatureCard = ({ title, desc, icon, link, className = "" }) => (
    <div className={`p-10 rounded-[48px] border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group flex flex-col items-start ${className}`}>
        <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-3xl font-black text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 font-medium leading-relaxed mb-8">{desc}</p>
        <Link to={link} className="mt-auto flex items-center gap-2 text-gray-900 font-black uppercase text-xs tracking-widest hover:gap-4 transition-all">
            Explore <ArrowRight size={16} />
        </Link>
    </div>
);

const Stat = ({ label, value }) => (
    <div>
        <p className="text-3xl md:text-4xl font-black mb-1">{value}</p>
        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{label}</p>
    </div>
);

export default Landing;
