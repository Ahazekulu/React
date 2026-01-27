import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from '../components/Nav'

export default function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Nav />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
