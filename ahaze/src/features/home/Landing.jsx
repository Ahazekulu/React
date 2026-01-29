import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, ArrowRight, MapPin, Users, ShoppingBag, BookOpen } from 'lucide-react';

const Landing = () => {
    return (
        <div className="flex flex-col gap-16 py-10">
            {/* Hero Section */}
            <section className="text-center relative px-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-dark-green/5 blur-3xl -z-10" />
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
                    Welcome to <span className="text-dark-green">ahazeKulu</span>
                </h1>
                <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-10 leading-relaxed">
                    The ultimate platform for Ethiopian communities. Connect, discover places, trade in the market,
                    and share knowledge - all in one place.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link to="/signup" className="bg-dark-green text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-dark-green/90 transition-all shadow-xl shadow-dark-green/20 flex items-center gap-2">
                        Get Started Now <ArrowRight size={20} />
                    </Link>
                    <Link to="/login" className="bg-white text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-all">
                        Login to Account
                    </Link>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                {[
                    { title: 'ahazePlaces', icon: <MapPin className="text-dark-green" size={24} />, desc: 'Explore and discover locations across Ethiopia with detailed insights.', link: '/places' },
                    { title: 'ahazeConnect', icon: <Users className="text-light-blue" size={24} />, desc: 'Connect with people from your hometown, workplace, or school.', link: '/connect' },
                    { title: 'ahazeMarket', icon: <ShoppingBag className="text-accent-yellow" size={24} />, desc: 'Buy and sell products within your community with localized delivery.', link: '/market' },
                    { title: 'ahazeOrganizations', icon: <Landmark className="text-gray-700" size={24} />, desc: 'Find and interact with government, private, and religious organizations.', link: '/organizations' },
                    { title: 'ahazeKnowledge', icon: <BookOpen className="text-accent-red" size={24} />, desc: 'Access a wealth of knowledge from various categories and teachers.', link: '/knowledge' },
                ].map((feature, i) => (
                    <Link key={i} to={feature.link} className="group p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                    </Link>
                ))}
            </section>

            {/* Statistics / Trust Section */}
            <section className="bg-dark-green text-white rounded-3xl p-12 mx-4 text-center">
                <h2 className="text-3xl font-bold mb-8">Growing Every Day</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { label: 'Active Users', value: '10k+' },
                        { label: 'Places Listed', value: '5k+' },
                        { label: 'Products', value: '2.5k+' },
                        { label: 'Organizations', value: '1.2k+' },
                    ].map((stat, i) => (
                        <div key={i}>
                            <p className="text-4xl font-extrabold mb-1">{stat.value}</p>
                            <p className="text-white/60 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Landing;
