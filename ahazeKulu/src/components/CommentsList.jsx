import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function CommentsList({ postId }){
  const [comments, setComments] = useState([])
  useEffect(()=>{ async function load(){
    const { data } = await supabase.from('comments').select('*, user:users(email)').eq('post_id', postId).order('created_at', { ascending: true })
    setComments(data || [])
  } load();
    const onReload = ()=> load()
    window.addEventListener('reloadPosts', onReload)
    return ()=> window.removeEventListener('reloadPosts', onReload)
  },[postId])

  return (
    <div className="mt-3 space-y-2">
      {comments.map(c=> (
        <div key={c.id} className="flex items-start gap-3 text-sm">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">{(c.user?.email || 'U')[0].toUpperCase()}</div>
          <div>
            <div className="text-xs text-gray-600">{c.user?.email || 'Anonymous'} • <span className="text-gray-400">{new Date(c.created_at).toLocaleString()}</span></div>
            <div className="text-sm text-gray-800">{c.content}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
