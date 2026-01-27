import React, { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function ProductForm({ placeName, onCreated }){
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e)=>{
    e.preventDefault(); setLoading(true)
    let media = []
    if(file){
      const path = `${Date.now()}_${file.name}`
      const { data, error } = await supabase.storage.from('uploads').upload(path, file)
      if(!error){ media.push(supabase.storage.from('uploads').getPublicUrl(data.path).publicURL) }
    }
    const payload = { title, description, price: parseFloat(price)||0, media_urls: media, place_id: placeName }
    await supabase.from('products').insert([payload])
    setTitle(''); setDescription(''); setPrice(''); setFile(null); setLoading(false)
    onCreated && onCreated()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-4">
      <input className="w-full p-2 text-black" placeholder="Product title" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea className="w-full p-2 text-black" rows={2} placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
      <input className="p-2" placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)} />
      <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])} />
      <div>
        <button className="mt-2" disabled={loading}>{loading? 'Creating...' : 'Create Product'}</button>
      </div>
    </form>
  )
}
