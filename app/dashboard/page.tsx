'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  // Calculate word count in real-time
  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault()
    
    // --- NEW VALIDATION LOGIC ---
    if (wordCount > 60 && !isPremium) {
      setStatusMessage('Error: To publish a post with more than 60 words, you must get the Premium plan and mark it as Premium.')
      return // Stop the function from saving to the database
    }
    // ----------------------------

    setStatusMessage('Saving to database...')

    const { error } = await supabase.from('posts').insert([
      { title, content, is_published: isPublished, is_premium: isPremium }
    ])

    if (error) {
      setStatusMessage('Error saving post.')
      console.error(error)
    } else {
      setStatusMessage('Post created successfully!')
      setTitle('')
      setContent('')
      setIsPublished(false)
      setIsPremium(false)
      
      setTimeout(() => setStatusMessage(''), 3000)
    }
  }

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8 text-slate-900">Content Management</h1>
      
      <form onSubmit={handleCreatePost} className="bg-white p-8 rounded-2xl interactive-card flex flex-col gap-6">
        
        <div>
          <label className="block font-semibold text-slate-700 mb-2">Post Title</label>
          <input 
            required type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-shadow" 
            placeholder="Enter an engaging title..."
          />
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="block font-semibold text-slate-700">Content Body</label>
            {/* Real-time word counter */}
            <span className={`text-sm font-medium ${wordCount > 60 && !isPremium ? 'text-red-600' : 'text-slate-500'}`}>
              Words: {wordCount} {wordCount > 60 && !isPremium ? '(Premium Required)' : '(Free Tier: up to 60)'}
            </span>
          </div>
          <textarea 
            required rows={8} value={content} onChange={(e) => setContent(e.target.value)}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-shadow ${wordCount > 60 && !isPremium ? 'border-red-400 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'}`} 
            placeholder="Write your article here..."
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 my-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <label className="flex items-center gap-3 cursor-pointer font-medium text-slate-700">
            <input 
              type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            Publish to public blog
          </label>
          <label className="flex items-center gap-3 cursor-pointer font-medium text-slate-700">
            <input 
              type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            Mark as Premium (Paid only)
          </label>
        </div>

        <button type="submit" className="bg-blue-700 text-white font-bold text-lg py-4 rounded-xl hover:bg-blue-800 transition-colors shadow-md">
          Publish Article
        </button>
        
        {statusMessage && (
          <p className={`text-center font-bold ${statusMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
            {statusMessage}
          </p>
        )}
      </form>
    </main>
  )
}