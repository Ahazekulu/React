import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function Cart(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(()=>{ setItems(JSON.parse(localStorage.getItem('cart')||'[]')) },[])

  const remove = (idx)=>{ const n = items.slice(); n.splice(idx,1); setItems(n); localStorage.setItem('cart', JSON.stringify(n)) }

  const checkout = async ()=>{
    setLoading(true)
    const userResp = await supabase.auth.getUser()
    const user = userResp.data?.user
    if(!user) return alert('Please log in to checkout')
    const total = items.reduce((s,i)=> s + (parseFloat(i.price)||0), 0)
    const { data: order } = await supabase.from('orders').insert([{ user_id: user.id, total }]).select().single()
    if(order){
      const orderItems = items.map(it=> ({ order_id: order.id, product_id: it.id, quantity: 1, price: it.price }))
      await supabase.from('order_items').insert(orderItems)
      localStorage.removeItem('cart')
      setItems([])
      alert('Order placed')
    }
    setLoading(false)
  }

  const total = items.reduce((s,i)=> s + (parseFloat(i.price)||0), 0)
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl mb-4">Cart</h1>
      {items.length===0 && <p>Your cart is empty.</p>}
      {items.map((it,idx)=> (
        <div key={idx} className="p-3 mb-2 rounded bg-slate-800 flex justify-between">
          <div>{it.title}</div>
          <div className="flex gap-2 items-center"><div>{it.price}</div><button onClick={()=>remove(idx)}>Remove</button></div>
        </div>
      ))}
      {items.length>0 && (
        <div className="mt-4">
          <div className="font-semibold">Total: {total}</div>
          <button className="mt-2" onClick={checkout} disabled={loading}>{loading? 'Processing...' : 'Checkout'}</button>
        </div>
      )}
    </div>
  )
}
