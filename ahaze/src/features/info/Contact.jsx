import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Facebook, Twitter, Linkedin } from 'lucide-react';

const Contact = () => {
    return (
        <div className="max-w-5xl mx-auto py-12 px-4">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl font-black text-gray-900">Get in Touch</h1>
                <p className="text-gray-500 font-medium max-w-xl mx-auto">
                    Have questions about ahazeKulu? Whether you're a user, a business, or interested in becoming an agent, we're here to help.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                    <ContactMethod
                        icon={<Phone size={24} />}
                        title="Call Us"
                        detail="+251 11 667 8899"
                        sub="Mon-Fri 8:30 AM - 5:30 PM"
                    />
                    <ContactMethod
                        icon={<Mail size={24} />}
                        title="Email Us"
                        detail="info@ahazekulu.com"
                        sub="Support within 24 hours"
                    />
                    <ContactMethod
                        icon={<MapPin size={24} />}
                        title="Our Office"
                        detail="Bole, Addis Ababa, Ethiopia"
                        sub="First Floor, ABC Building"
                    />

                    <div className="pt-8 border-t border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Follow Us</p>
                        <div className="flex gap-4">
                            <SocialLink icon={<Facebook size={20} />} />
                            <SocialLink icon={<Twitter size={20} />} />
                            <SocialLink icon={<Linkedin size={20} />} />
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2 bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100">
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Your Name</label>
                                <input placeholder="John Doe" className="w-full bg-gray-50 border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-dark-green transition-all outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
                                <input type="email" placeholder="john@example.com" className="w-full bg-gray-50 border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-dark-green transition-all outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Subject</label>
                            <select className="w-full bg-gray-50 border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-dark-green transition-all outline-none">
                                <option>General Inquiry</option>
                                <option>Business Partnership</option>
                                <option>Agent Registration</option>
                                <option>Technical Support</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Message</label>
                            <textarea rows="5" placeholder="How can we help you?" className="w-full bg-gray-50 border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-dark-green transition-all outline-none resize-none"></textarea>
                        </div>
                        <button type="button" className="w-full bg-dark-green text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-dark-green/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                            <Send size={20} /> Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const ContactMethod = ({ icon, title, detail, sub }) => (
    <div className="flex gap-6 items-start group">
        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-dark-green group-hover:bg-dark-green group-hover:text-white transition-all duration-300 transform group-hover:-rotate-6">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-gray-900 group-hover:text-dark-green transition-colors">{title}</h4>
            <p className="text-lg font-black text-gray-900">{detail}</p>
            <p className="text-xs text-gray-400 font-medium">{sub}</p>
        </div>
    </div>
);

const SocialLink = ({ icon }) => (
    <button className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:bg-dark-green hover:text-white transition-all">
        {icon}
    </button>
);

export default Contact;
