import React from 'react';
import { Landmark, Globe, Heart, ShieldCheck, TrendingUp, Users } from 'lucide-react';

const KnowUs = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 space-y-12 px-4">
            <section className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-dark-green text-white rounded-3xl shadow-xl shadow-dark-green/20 mb-4">
                    <Landmark size={40} />
                </div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Know ahazeKulu</h1>
                <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
                    Empowering Ethiopian communities through digital connectivity, knowledge sharing, and localized marketplaces.
                </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-4">
                    <div className="w-12 h-12 bg-light-blue/10 text-light-blue rounded-2xl flex items-center justify-center">
                        <Globe size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Our Vision</h3>
                    <p className="text-gray-500 leading-relaxed">
                        To become the digital backbone of Ethiopian society, where every citizen can access resources,
                        connect with their local community, and participate in a flourishing digital economy.
                    </p>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-4">
                    <div className="w-12 h-12 bg-accent-red/10 text-accent-red rounded-2xl flex items-center justify-center">
                        <Heart size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Our Mission</h3>
                    <p className="text-gray-500 leading-relaxed">
                        To provide a seamless, secure, and intuitive platform that bridges the gap between traditional
                        community values and modern technological capabilities.
                    </p>
                </div>
            </div>

            <section className="bg-dark-green text-white rounded-[40px] p-12 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div>
                        <p className="text-4xl font-black mb-1">100k+</p>
                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Places Mapped</p>
                    </div>
                    <div>
                        <p className="text-4xl font-black mb-1">1M+</p>
                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Active Connects</p>
                    </div>
                    <div>
                        <p className="text-4xl font-black mb-1">ETB 0</p>
                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Platform Fees</p>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            </section>

            <section className="space-y-8">
                <h2 className="text-2xl font-black text-gray-900 text-center">Core Principles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Principle icon={<ShieldCheck size={20} />} title="Trust" desc="Verified users and verified locations." />
                    <Principle icon={<Users size={20} />} title="Community" desc="Focused on your local Kebele and Woreda." />
                    <Principle icon={<TrendingUp size={20} />} title="Growth" desc="Supporting local businesses and teachers." />
                    <Principle icon={<Landmark size={20} />} title="Heritage" desc="Preserving Ethiopian culture and history." />
                </div>
            </section>
        </div>
    );
};

const Principle = ({ icon, title, desc }) => (
    <div className="bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100 text-center group">
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-dark-green mx-auto mb-4 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
        <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
    </div>
);

export default KnowUs;
