import React, { useState } from 'react'
import PlacesTree from '../components/PlacesTree'
import Tabs from '../components/Tabs'
import PostsTab from '../components/PostsTab'
import ForSaleTab from '../components/ForSaleTab'
import Modal from '../components/Modal'
import CreatePlaceForm from '../components/CreatePlaceForm'

export default function Places() {
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  
  // This is a dummy key that we can change to force a re-render of the tree
  const [treeKey, setTreeKey] = useState(1); 

  const handleSelectPlace = (placeId) => {
    setSelectedPlace(placeId)
  }

  const handlePlaceCreated = (newPlace) => {
    setIsModalOpen(false);
    // In a real app, you'd want to refetch the data.
    // For now, we'll just increment the key to force the tree to re-mount and re-process the JSON.
    setTreeKey(prevKey => prevKey + 1); 
    alert(`Place "${newPlace}" created! The places list will refresh.`);
  }

  const tabs = selectedPlace ? [
    { name: 'Posts', content: <PostsTab placeId={selectedPlace} /> },
    { name: 'For Sale', content: <ForSaleTab placeId={selectedPlace} /> },
  ] : []

  return (
    <>
      <div className="flex gap-6">
        {/* Sidebar: Places Navigation */}
        <aside className="w-80 sticky top-8 h-[80vh] overflow-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1111.292 3.707l3.853 3.853a1 1 0 01-1.414 1.414l-3.853-3.853A6 6 0 012 8z" clipRule="evenodd" /></svg>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search places" className="flex-1 p-2 border border-gray-200 rounded" />
            </div>
            <PlacesTree
              key={treeKey}
              selectedPlace={selectedPlace}
              onSelect={handleSelectPlace}
              filter={search}
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded"
            >
              Create New Place
            </button>
          </div>
        </aside>

        {/* Main content */}
        <section className="flex-1">
          <div className="bg-white p-6 rounded-lg shadow-md min-h-[600px]">
            {!selectedPlace ? (
              <div className="text-center text-gray-500 flex flex-col justify-center h-full">
                <h2 className="text-2xl font-bold mb-2">Welcome to ahazeKulu</h2>
                <p>Select a place from the list on the left to see what's happening.</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-bold">{selectedPlace.split('/').pop()}</h2>
                  <div className="text-sm text-gray-500">{selectedPlace}</div>
                </div>
                <Tabs tabs={tabs} />
              </div>
            )}
          </div>
        </section>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CreatePlaceForm 
          onCancel={() => setIsModalOpen(false)}
          onCreate={handlePlaceCreated}
        />
      </Modal>
    </>
  )
}
