'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault()
    setStatusMessage('Saving...')

    const { error } = await supabase.from('posts').insert([
      { title, content, is_published: isPublished, is_premium: isPremium }
    ])

    if (error) {
      setStatusMessage('Error saving post.')
      console.error(error)
    } else {
      setStatusMessage('Post created successfully!')
      // Clear the form
      setTitle('')
      setContent('')
      setIsPublished(false)
      setIsPremium(false)
    }
  }

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Content Management</h1>
      
      <form onSubmit={handleCreatePost} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-4">
        
        <div>
          <label className="block font-medium mb-1">Post Title</label>
          <input 
            required type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Content</label>
          <textarea 
            required rows={6} value={content} onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        {/* Visibility Controls */}
        <div className="flex gap-6 my-2 border-y py-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)}
              className="w-5 h-5"
            />
            Publish to public blog
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)}
              className="w-5 h-5"
            />
            Mark as Premium (Paid only)
          </label>
        </div>

        <button type="submit" className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Create Post
        </button>
        
        {statusMessage && <p className="text-center font-medium text-blue-600">{statusMessage}</p>}
      </form>
    </main>
  )
}