import React, { useEffect, useState } from 'react'
import placesData from '../data/places.json'
import { supabase } from '../supabaseClient'
import PostForm from '../components/PostForm'
import ProductForm from '../components/ProductForm'
import CommentForm from '../components/CommentForm'
import ReactionButton from '../components/ReactionButton'
import CommentsList from '../components/CommentsList'

function PostsTab({ placeId }){
  const [posts, setPosts] = useState([])
  useEffect(()=>{ async function load(){
    const { data } = await supabase.from('posts').select('*').eq('place_id', placeId).order('created_at', { ascending: false })
    setPosts(data || [])
  } load();
    const onReload = ()=> load()
    window.addEventListener('reloadPosts', onReload)
    return ()=> window.removeEventListener('reloadPosts', onReload)
  },[placeId])
  return (
    <div>
      <PostForm placeName={placeId} onPosted={()=>{ const ev = new Event('reloadPosts'); window.dispatchEvent(ev)}} />
      {posts.length===0 && <p>No posts yet.</p>}
      {posts.map(p=> (
        <div key={p.id} className="p-2 rounded bg-slate-800 mb-3">
          <div className="mb-2">{p.content}</div>
          {p.media_urls && p.media_urls.map((m,i)=> (
            <div key={i} className="mb-2">
              {m.match(/\.(mp4|webm|ogg)$/i) ? <video src={m} controls className="max-w-full" /> : <img src={m} alt="media" className="max-w-full" />}
            </div>
          ))}
          <div className="mt-2 flex items-center">
            <ReactionButton postId={p.id} />
          </div>
          <CommentsList postId={p.id} />
          <CommentForm postId={p.id} onCommented={()=>{ const ev = new Event('reloadPosts'); window.dispatchEvent(ev)}} />
        </div>
      ))}
    </div>
  )
}

function SellTab({ placeId }){
  const [products, setProducts] = useState([])
  useEffect(()=>{ async function load(){
    const { data } = await supabase.from('products').select('*').eq('place_id', placeId).order('created_at', { ascending: false })
    setProducts(data || [])
  } load() },[placeId])
  return (
    <div>
      <ProductForm placeName={placeId} onCreated={()=>{ const ev = new Event('reloadProducts'); window.dispatchEvent(ev)}} />
      {products.length===0 && <p>No products listed.</p>}
      {products.map(p=> (
        <div key={p.id} className="p-2 rounded bg-slate-800 mb-3 flex items-center justify-between">
          <div>
            <div className="font-semibold">{p.title}</div>
            <div className="text-sm">{p.description}</div>
            <div className="text-sm mt-1">Price: {p.price}</div>
          </div>
          <div>
            <button onClick={async ()=>{
              const cart = JSON.parse(localStorage.getItem('cart')||'[]')
              cart.push({ id: p.id, title: p.title, price: p.price })
              localStorage.setItem('cart', JSON.stringify(cart))
              alert('Added to cart')
            }}>Add to cart</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Places(){
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [hierarchy, setHierarchy] = useState([])
  const [tab, setTab] = useState('posts')

  useEffect(()=>{
    // build a simple list of unique Level 5 places
    const uniq = []
    for(const item of placesData){
      const name = item['Level 5'] || Object.values(item).slice(-1)[0]
      if(name && !uniq.includes(name)) uniq.push(name)
    }
    setHierarchy(uniq.slice(0,200))
  },[])

  const handleCreatePlace = async (name)=>{
    const userResp = await supabase.auth.getUser()
    const user = userResp.data?.user
    const owner = user?.id || null
    const payload = { name, owner, created_at: new Date().toISOString() }
    await supabase.from('places').insert([payload])
    alert('Place created')
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl mb-4">Places</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="font-semibold">Browse places</h3>
          <ul className="mt-2 space-y-1 max-h-96 overflow-auto">
            {hierarchy.map(p=> <li key={p}><button className="text-left w-full" onClick={()=>setSelectedPlace(p)}>{p}</button></li>)}
          </ul>
        </div>
        <div className="md:col-span-2">
          <div className="mb-4 flex gap-2">
            <button className={`px-3 py-1 ${tab==='posts'?'bg-blue-600 text-white':''}`} onClick={()=>setTab('posts')}>Posts</button>
            <button className={`px-3 py-1 ${tab==='sell'?'bg-blue-600 text-white':''}`} onClick={()=>setTab('sell')}>Sell & Buy</button>
          </div>
          {!selectedPlace && <p>Select a place to view content.</p>}
          {selectedPlace && (
            <div>
              <h2 className="text-xl mb-2">{selectedPlace}</h2>
              {tab==='posts' ? <PostsTab placeId={selectedPlace} /> : <SellTab placeId={selectedPlace} />}
            </div>
          )}
          <div className="mt-6">
            <h3 className="font-semibold">Create a place</h3>
            <CreatePlaceForm onCreate={handleCreatePlace} />
          </div>
        </div>
      </div>
    </div>
  )
}

function CreatePlaceForm({ onCreate }){
  const [name, setName] = useState('')
  return (
    <form onSubmit={e=>{e.preventDefault(); onCreate(name); setName('')}} className="mt-2">
      <input className="p-2 border w-full mb-2" placeholder="Place name (Level 5)" value={name} onChange={e=>setName(e.target.value)} />
      <button className="px-4 py-2 bg-indigo-600 text-white">Create place</button>
    </form>
  )
}
