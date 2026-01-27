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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Column: Places Navigation */}
        <div className="md:col-span-1">
          <div className="sticky top-8 space-y-4">
            <PlacesTree
              key={treeKey} // Use the key to force re-mount on change
              selectedPlace={selectedPlace}
              onSelect={handleSelectPlace}
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Create New Place
            </button>
          </div>
        </div>

        {/* Right Column: Content Display */}
        <div className="md:col-span-3">
          <div className="bg-white p-6 rounded-lg shadow-md min-h-[600px]">
            {!selectedPlace ? (
              <div className="text-center text-gray-500 flex flex-col justify-center h-full">
                <h2 className="text-2xl font-bold mb-2">Welcome to ahazeKulu</h2>
                <p>Select a place from the list on the left to see what's happening.</p>
              </div>
            ) : (
              <div>
                <h2 className="text-3xl font-bold mb-4">{selectedPlace.split('/').pop()}</h2>
                <Tabs tabs={tabs} />
              </div>
            )}
          </div>
        </div>
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
