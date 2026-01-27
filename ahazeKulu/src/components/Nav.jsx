import React from 'react'
import { Link } from 'react-router-dom'

export default function Nav(){
  return (
    <nav className="bg-slate-900 text-white p-4 shadow">
      <div className="max-w-6xl mx-auto flex gap-6 items-center">
        <Link to="/places" className="font-semibold text-lg">Places</Link>
        <div className="flex-1" />
        <Link to="/cart" className="mr-4">Cart</Link>
        <Link to="/login" className="mr-2">Login</Link>
        <Link to="/signup">Sign up</Link>
      </div>
    </nav>
  )
}
