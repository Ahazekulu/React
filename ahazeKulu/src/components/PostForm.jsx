import React, { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function PostForm({ placeName, onPosted }){
  const [content, setContent] = useState('')
  const [files, setFiles] = useState(null)
  const [loading, setLoading] = useState(false)

  const uploadFiles = async () => {
    if(!files || files.length===0) return []
    const urls = []
    for(const file of files){
      const path = `${Date.now()}_${file.name}`
      const { data, error } = await supabase.storage.from('uploads').upload(path, file, { upsert: false })
      if(error){ console.error('upload', error); continue }
      const publicUrl = supabase.storage.from('uploads').getPublicUrl(data.path).publicURL
      urls.push(publicUrl)
    }
    return urls
  }

  const handleSubmit = async (e) =>{
    e.preventDefault(); setLoading(true)
    const media = await uploadFiles()
    const payload = { content, media_urls: media, place_id: placeName }
    await supabase.from('posts').insert([payload])
    setContent(''); setFiles(null); setLoading(false)
    onPosted && onPosted()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-4">
      <textarea className="w-full p-2 text-black" rows={3} placeholder="What's happening?" value={content} onChange={e=>setContent(e.target.value)} />
      <input type="file" multiple accept="image/*,video/*" onChange={e=>setFiles(e.target.files)} />
      <div>
        <button disabled={loading} className="mt-2">{loading? 'Posting...' : 'Post'}</button>
      </div>
    </form>
  )
}
