'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

export default function Dashboard() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false)
  const [hasShownPremiumPrompt, setHasShownPremiumPrompt] = useState(false)
  
  // New state variables for Auth and Subscriptions
  const [userIsSubscribed, setUserIsSubscribed] = useState(false)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  
  const router = useRouter()

  // SECURITY & SUBSCRIPTION CHECK: Runs when the page loads
  useEffect(() => {
    async function checkAuthAndProfile() {
      // 1. Check if they are logged in
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      } 
      
      // 2. Fetch their profile to see if they are a premium member
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_subscribed')
        .eq('id', user.id)
        .maybeSingle()

      if (profile && profile.is_subscribed) {
        setUserIsSubscribed(true)
      }
      
      setIsLoadingAuth(false)
    }
    checkAuthAndProfile()
  }, [router])

  // Calculate word count in real-time
  const wordCount = countWords(content)
  const wordLimitExceeded = !userIsSubscribed && wordCount > 60
  const wordCountHint = userIsSubscribed
    ? '(Premium enabled)'
    : wordLimitExceeded
      ? '(Premium Required)'
      : '(Free Tier: up to 60)'

  function handleContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const nextContent = e.target.value
    const nextWordCount = countWords(nextContent)

    setContent(nextContent)

    if (!userIsSubscribed && nextWordCount >= 60 && !hasShownPremiumPrompt) {
      setShowPremiumPrompt(true)
      setHasShownPremiumPrompt(true)
    }

    if (nextWordCount < 60 && hasShownPremiumPrompt) {
      setHasShownPremiumPrompt(false)
    }
  }

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault()
    
    // --- VALIDATION LOGIC ---
    if (wordLimitExceeded) {
      setShowPremiumPrompt(true)
      setStatusMessage('Error: To publish a post with more than 60 words, you must get the Premium plan.')
      return // Stop the function from saving to the database
    }

    setStatusMessage('Saving to database...')

    const { error } = await supabase.from('posts').insert([
      { title, content, is_published: isPublished, is_premium: isPremium }
    ])

    if (error) {
      setStatusMessage('Error saving post.')
    } else {
      setStatusMessage('Post created successfully!')
      setTitle('')
      setContent('')
      setIsPublished(false)
      setIsPremium(false)
      setHasShownPremiumPrompt(false)
      
      setTimeout(() => setStatusMessage(''), 3000)
    }
  }

  // Show a loading screen while checking their secure database profile
  if (isLoadingAuth) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Verifying access...</div>
  }

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      {showPremiumPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-secure border border-slate-200">
            <h2 className="text-2xl font-extrabold text-slate-900">Get Premium</h2>
            <p className="mt-3 text-sm font-medium text-slate-600">
              Free posts can include up to 60 words. Upgrade to Premium to write and publish longer articles.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowPremiumPrompt(false)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={() => router.push('/subscribe')}
                className="flex-1 rounded-lg bg-yellow-500 px-4 py-2 font-bold text-slate-900 hover:bg-yellow-400 transition-colors"
              >
                Get Premium
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Content Management</h1>
        <button 
          onClick={async () => {
            await supabase.auth.signOut()
            router.push('/login')
          }}
          className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          Sign Out
        </button>
      </div>
      
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
            <span className={`text-sm font-medium ${wordLimitExceeded ? 'text-red-600' : 'text-slate-500'}`}>
              Words: {wordCount} {wordCountHint}
            </span>
          </div>
          <textarea 
            required rows={8} value={content} onChange={handleContentChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-shadow ${wordLimitExceeded ? 'border-red-400 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'}`} 
            placeholder="Write your article here..."
          />
        </div>

        {/* Visibility Controls with Conditional Premium Button */}
        <div className="flex flex-col sm:flex-row gap-6 my-2 bg-slate-50 p-4 rounded-xl border border-slate-200 justify-between items-center">
          <label className="flex items-center gap-3 cursor-pointer font-medium text-slate-700">
            <input 
              type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            Publish to public blog
          </label>
          
          {userIsSubscribed ? (
            // IF SUBSCRIBED: Show the checkbox
            <label className="flex items-center gap-3 cursor-pointer font-medium text-slate-700">
              <input 
                type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              Mark as Premium (Paid only)
            </label>
          ) : (
            // IF NOT SUBSCRIBED: Show the upgrade button
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500 hidden sm:block">Write longer posts?</span>
              <button 
                type="button"
                onClick={() => router.push('/subscribe')}
                className="bg-yellow-500 text-slate-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-sm text-sm"
              >
                Get Premium
              </button>
            </div>
          )}
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
