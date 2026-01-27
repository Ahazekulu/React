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
    await supabase.from('comments').insert([payload])
    setContent(''); setLoading(false)
    onCommented && onCommented()
  }

  return (
    <form onSubmit={submit} className="mt-2">
      <input className="w-full p-2 text-black" placeholder="Write a comment" value={content} onChange={e=>setContent(e.target.value)} />
      <div className="mt-2">
        <button disabled={loading}>{loading? 'Posting...' : 'Comment'}</button>
      </div>
    </form>
  )
}
