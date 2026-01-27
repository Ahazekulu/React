import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import PostForm from './PostForm'
import CommentForm from './CommentForm'
import ReactionButton from './ReactionButton'
import CommentsList from './CommentsList'

export default function PostsTab({ placeId }){
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  async function loadPosts(){
    setLoading(true)
    if (!placeId) {
      setPosts([])
      setLoading(false)
      return
    }

    const { data, error } = await supabase.from('posts').select('*, user:users(email)').eq('place_name', placeId).order('created_at', { ascending: false })
    if (error) {
      console.error('loadPosts error (with join):', error)
      // fallback to a simpler select without joining users
      const { data: fallback, error: fbErr } = await supabase.from('posts').select('*').eq('place_name', placeId).order('created_at', { ascending: false })
      if (fbErr) {
        console.error('loadPosts fallback error:', fbErr)
        setPosts([])
      } else {
        setPosts(fallback || [])
      }
    } else {
      setPosts(data || [])
    }
    setLoading(false)
  }

  useEffect(()=>{ 
    loadPosts()

    if (!placeId) return

    const channel = supabase.channel('posts-channel')
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'posts', filter: `place_name=eq.${placeId}` }, () => {
      loadPosts()
    })
    channel.subscribe()

    return ()=> {
      supabase.removeChannel(channel)
    }
  },[placeId])

  return (
    <div className="space-y-6">
      <PostForm placeName={placeId} onPosted={loadPosts} />

      {loading && <p className="text-center text-gray-500">Loading posts...</p>}

      {!loading && posts.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p className="text-lg font-semibold">No posts yet in {placeId.split('/').pop()}.</p>
          <p className="mt-2">Be the first to share something!</p>
        </div>
      )}

      {posts.map(p=> (
        <article key={p.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
          <header className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600">{p.user?.email || 'Anonymous'}</p>
              <p className="text-xs text-gray-400">{new Date(p.created_at).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <ReactionButton postId={p.id} />
            </div>
          </header>

          <div className="prose max-w-full mb-4 text-gray-800">{p.content}</div>

          {p.media_urls && p.media_urls.map((m,i)=> (
            <div key={i} className="mb-3 rounded-lg overflow-hidden">
              {m.match(/\.(mp4|webm|ogg)$/i) ? 
                <video src={m} controls className="w-full max-h-[480px] object-contain" /> : 
                <img src={m} alt="media" className="w-full h-64 object-cover" />
              }
            </div>
          ))}

          <div className="mt-4">
            <CommentsList postId={p.id} />
            <CommentForm postId={p.id} onCommented={loadPosts} />
          </div>
        </article>
      ))}
    </div>
  )
}
