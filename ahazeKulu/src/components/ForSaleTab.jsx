import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import ProductForm from './ProductForm'

export default function ForSaleTab({ placeId }){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  async function loadProducts(){
    setLoading(true)
    const { data } = await supabase.from('products').select('*').eq('place_name', placeId).order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  useEffect(()=>{ 
    loadProducts()

    const channel = supabase.channel('products-channel')
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'products', filter: `place_name=eq.${placeId}` }, () => {
      loadProducts()
    })
    channel.subscribe()

    return ()=> {
      supabase.removeChannel(channel)
    }
  },[placeId])

  const handleAddToCart = (product) => {
    // A more robust cart implementation would be needed for a real app
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart.push({ id: product.id, title: product.title, price: product.price })
    localStorage.setItem('cart', JSON.stringify(cart))
    alert(`${product.title} added to cart!`)
  }

  return (
    <div className="space-y-6">
      <ProductForm placeName={placeId} onCreated={loadProducts} />
      
      {loading && <p>Loading products...</p>}

      {!loading && products.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p>No products for sale in {placeId.split('/').pop()} yet.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition">
            {p.media_urls && p.media_urls.length > 0 && (
              <img src={p.media_urls[0]} alt={p.title} className="w-full h-44 object-cover"/>
            )}
            <div className="p-4">
              <h3 className="font-bold text-lg">{p.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{p.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">{p.currency ? `${p.currency} ${p.price}` : `$${p.price}`}</span>
                <button 
                  onClick={() => handleAddToCart(p)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
