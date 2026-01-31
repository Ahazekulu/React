import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="flex items-center gap-3 mb-8">
                <ShoppingBag className="text-dark-green" size={24} />
                <h1 className="text-2xl font-black text-gray-900">Your Cart</h1>
            </div>
            
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="text-amber-500" size={40} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">Your cart is empty</h3>
                <p className="text-gray-500 font-medium mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Explore the market to find unique Ethiopian products.</p>
                
                <Link to="/market" className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-dark-green transition-all flex items-center gap-3">
                    Start Shopping
                    <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
};

export default Cart;
