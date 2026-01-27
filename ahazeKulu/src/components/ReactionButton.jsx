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
    <button onClick={react} className="mr-2">❤️ {count}</button>
  )
}
