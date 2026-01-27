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
      if(!error){
        const res = supabase.storage.from('uploads').getPublicUrl(data.path)
        let publicUrl = res?.data?.publicUrl ?? res?.publicURL ?? ''
        if (!publicUrl) {
          try {
            const signed = await supabase.storage.from('uploads').createSignedUrl(data.path, 60)
            publicUrl = signed?.data?.signedUrl ?? ''
          } catch (err) {
            console.error('createSignedUrl error', err)
          }
        }
        media.push(publicUrl)
      }
    }
    // normalize public url response for different supabase client versions
    for (let i = 0; i < media.length; i++) {
      const entry = media[i]
      if (!entry) continue
      // if entry is already a string url, keep it
      if (typeof entry === 'string') continue
      // otherwise try to extract publicUrl
      media[i] = entry?.data?.publicUrl ?? entry?.publicURL ?? ''
    }
    const payload = { title, description, price: parseFloat(price)||0, media_urls: media, place_name: placeName }
    const { error } = await supabase.from('products').insert([payload])
    if (error) {
      console.error('insert product error', error)
      alert('Failed to create product: ' + error.message)
      setLoading(false)
      return
    }
    setTitle(''); setDescription(''); setPrice(''); setFile(null); setLoading(false)
    onCreated && onCreated()
  }

  return (
    <div className="bg-white rounded p-4 shadow">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full p-2 border border-gray-200 rounded" placeholder="Product title" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className="w-full p-2 border border-gray-200 rounded" rows={2} placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <div className="flex gap-2 items-center">
          <input className="p-2 border border-gray-200 rounded w-28" placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)} />
          <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])} />
        </div>
        <div className="flex justify-end">
          <button disabled={loading} className="btn btn-primary">
            {loading? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  )
}
