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
    const { data } = await supabase.from('posts').select('*, user:users(email)').eq('place_id', placeId).order('created_at', { ascending: false })
    setPosts(data || [])
    setLoading(false)
  }

  useEffect(()=>{ 
    loadPosts();
    
    const subscription = supabase
      .channel('posts-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts', filter: `place_id=eq.${placeId}` }, payload => {
        loadPosts()
      })
      .subscribe()

    return ()=> {
      supabase.removeChannel(subscription)
    }
  },[placeId])

  return (
    <div className="space-y-6">
      <PostForm placeName={placeId} onPosted={loadPosts} />
      
      {loading && <p>Loading posts...</p>}

      {!loading && posts.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p>No posts yet in {placeId.split('/').pop()}.</p>
          <p>Be the first to share something!</p>
        </div>
      )}

      {posts.map(p=> (
        <div key={p.id} className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-2">Posted by: {p.user?.email || 'Anonymous'}</p>
          <div className="mb-4">{p.content}</div>
          {p.media_urls && p.media_urls.map((m,i)=> (
            <div key={i} className="mb-2 rounded-lg overflow-hidden">
              {m.match(/\.(mp4|webm|ogg)$/i) ? 
                <video src={m} controls className="max-w-full w-full" /> : 
                <img src={m} alt="media" className="max-w-full w-full object-cover" />
              }
            </div>
          ))}
          <div className="border-t border-gray-100 pt-2 flex items-center">
            <ReactionButton postId={p.id} />
          </div>
          <div className="mt-4">
            <CommentsList postId={p.id} />
            <CommentForm postId={p.id} onCommented={loadPosts} />
          </div>
        </div>
      ))}
    </div>
  )
}
