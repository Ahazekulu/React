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
      if (error) { console.error('upload', error); continue }

      // Try public URL
      const res = supabase.storage.from('uploads').getPublicUrl(data.path)
      let publicUrl = res?.data?.publicUrl ?? res?.publicURL ?? ''

      // If bucket is private, create a signed URL fallback
      if (!publicUrl) {
        try {
          const signed = await supabase.storage.from('uploads').createSignedUrl(data.path, 60)
          publicUrl = signed?.data?.signedUrl ?? ''
        } catch (err) {
          console.error('createSignedUrl error', err)
        }
      }

      urls.push(publicUrl)
    }
    return urls
  }

  const handleSubmit = async (e) =>{
    e.preventDefault(); setLoading(true)
    const media = await uploadFiles()
    const payload = { content, media_urls: media, place_name: placeName }
    const { error } = await supabase.from('posts').insert([payload])
    if (error) {
      console.error('insert post error', error)
      alert('Failed to post: ' + error.message)
      setLoading(false)
      return
    }
    setContent(''); setFiles(null); setLoading(false)
    onPosted && onPosted()
  }

  return (
    <div className="bg-white rounded p-4 mb-4 shadow">
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea className="w-full p-3 border border-gray-200 rounded focus:ring-2 focus:ring-emerald-200" rows={3} placeholder="Share a post (text, image or video)" value={content} onChange={e=>setContent(e.target.value)} />
        <div className="flex items-center gap-3">
          <input type="file" multiple accept="image/*,video/*" onChange={e=>setFiles(e.target.files)} className="text-sm" />
          <div className="ml-auto">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
