import React, { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function CommentForm({ postId, onCommented }){
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e)=>{
    e.preventDefault(); if(!content.trim()) return
    setLoading(true)
    const userResp = await supabase.auth.getUser()
    const user = userResp.data?.user
    const payload = { post_id: postId, content, user_id: user?.id }
    const { error } = await supabase.from('comments').insert([payload])
    if (error) {
      console.error('comment insert error', error)
      alert('Failed to post comment: ' + error.message)
    } else {
      setContent('')
      onCommented && onCommented()
      // notify comment lists to reload
      try { window.dispatchEvent(new Event('reloadPosts')) } catch(e) { /* ignore */ }
    }
    setLoading(false)
  }

  return (
    <form onSubmit={submit} className="mt-2">
      <div className="flex gap-2">
        <input className="flex-1 p-2 border border-gray-200 rounded" placeholder="Write a comment" value={content} onChange={e=>setContent(e.target.value)} />
        <button disabled={loading} className="btn btn-primary">{loading? 'Posting...' : 'Comment'}</button>
      </div>
    </form>
  )
}
