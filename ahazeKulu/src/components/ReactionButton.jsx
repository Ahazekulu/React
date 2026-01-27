import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function ReactionButton({ postId }){
  const [count, setCount] = useState(0)
  useEffect(()=>{ async function load(){
    const { data } = await supabase.from('reactions').select('id').eq('post_id', postId)
    setCount((data||[]).length)
  } load() },[postId])

  const react = async ()=>{
    const userResp = await supabase.auth.getUser()
    const user = userResp.data?.user
    if(!user) return alert('Login to react')
    await supabase.from('reactions').insert([{ post_id: postId, user_id: user.id, type: 'like' }])
    setCount(c=>c+1)
  }
  return (
    <button
      onClick={react}
      aria-label="Like post"
      className="mr-2 inline-flex items-center gap-2 px-3 py-1 rounded bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-100"
    >
      <span className="text-lg">❤️</span>
      <span className="text-sm font-medium">{count}</span>
    </button>
  )
}
