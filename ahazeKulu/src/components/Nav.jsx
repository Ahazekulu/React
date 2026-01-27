import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Nav() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    supabase.auth.getUser().then(res => { if (mounted) setUser(res.data?.user || null) })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/places" className="flex items-center gap-3 text-2xl font-bold text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect width="20" height="14" x="2" y="5" rx="2" strokeWidth="1.5"/><path d="M7 9h10" strokeWidth="1.5"/></svg>
            <span>ahazeKulu</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/cart" className="btn btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 6h15l-1.5 9h-12z" strokeWidth="1.5"/></svg>
              <span>Cart</span>
            </Link>
            {!user ? (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-800">Login</Link>
                <Link to="/signup" className="btn btn-primary">
                  Sign up
                </Link>
              </>
            ) : (
              <button
                onClick={logout}
                className="btn btn-primary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 16l4-4m0 0l-4-4m4 4H7" strokeWidth="1.5"/></svg>
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
