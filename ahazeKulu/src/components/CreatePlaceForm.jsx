import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function CreatePlaceForm({ onCreate, onCancel }) {
  const [name, setName] = useState('');
  const [parent, setParent] = useState(''); // This can be enhanced to select a parent
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setMessage({ type: 'error', content: 'Place name cannot be empty.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const { data: { user } } = await supabase.auth.getUser();
    
    // For now, we'll just create a top-level place.
    // A real implementation would involve selecting a parent from the tree.
    const placePath = name.trim();

    const { error } = await supabase.from('places').insert([
      { name: placePath, owner_id: user?.id, parent_id: null }, // Simplified schema
    ]);

    setLoading(false);

    if (error) {
      setMessage({ type: 'error', content: `Error: ${error.message}` });
    } else {
      setMessage({ type: 'success', content: `Place '${placePath}' created successfully!` });
      setName('');
      if (onCreate) {
        // Give feedback and then call parent handler
        setTimeout(() => {
            onCreate(placePath)
        }, 1500)
      }
    }
  };

  return (
    <form onSubmit={handleCreate} className="space-y-4">
      <h3 className="text-2xl font-bold text-center">Create a New Place</h3>
      <p className="text-sm text-gray-500 text-center">
        This will create a new top-level place. Hierarchical creation can be added later.
      </p>
      
      <div>
        <label htmlFor="place-name" className="block text-sm font-medium text-gray-700">
          Place Name
        </label>
        <input
          id="place-name"
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="e.g., Addis Ababa"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          {loading ? 'Creating...' : 'Create Place'}
        </button>
        {onCancel && (
            <button
                type="button"
                onClick={onCancel}
                className="mt-2 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Cancel
            </button>
        )}
      </div>
      
      {message && (
        <p className={`text-center text-sm ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
          {message.content}
        </p>
      )}
    </form>
  );
}
