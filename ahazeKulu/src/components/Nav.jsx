import React from 'react'
import { Link } from 'react-router-dom'

export default function Nav(){
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-4xl mx-auto flex gap-4">
        <Link to="/places" className="font-semibold">Places</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign up</Link>
      </div>
    </nav>
  )
}
