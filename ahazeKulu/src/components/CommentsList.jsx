import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function CommentsList({ postId }){
  const [comments, setComments] = useState([])
  useEffect(()=>{ async function load(){
    const { data } = await supabase.from('comments').select('*').eq('post_id', postId).order('created_at', { ascending: true })
    setComments(data || [])
  } load();
    const onReload = ()=> load()
    window.addEventListener('reloadPosts', onReload)
    return ()=> window.removeEventListener('reloadPosts', onReload)
  },[postId])

  return (
    <div className="mt-2">
      {comments.map(c=> (
        <div key={c.id} className="text-sm p-1">{c.content}</div>
      ))}
    </div>
  )
}
