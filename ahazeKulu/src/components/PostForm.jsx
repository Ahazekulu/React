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
    <div className="card mb-4">
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea className="w-full p-2" rows={3} placeholder="Share a post (text, image or video)" value={content} onChange={e=>setContent(e.target.value)} />
        <div className="flex items-center gap-2">
          <input type="file" multiple accept="image/*,video/*" onChange={e=>setFiles(e.target.files)} />
          <div style={{marginLeft:'auto'}}>
            <button disabled={loading}>{loading? 'Posting...' : 'Post'}</button>
          </div>
        </div>
      </form>
    </div>
  )
}
