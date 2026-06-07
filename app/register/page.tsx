'use client'

import { useState } from 'react'
import { hasSupabaseConfig, supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('Creating your secure account...')

    try {
      if (!hasSupabaseConfig) {
        throw new Error('Supabase is not configured. Add Supabase environment variables in Vercel.')
      }

      // 1. Send data to Supabase Auth
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName, // Store the name in Supabase metadata
          }
        }
      })

      if (error) throw error

      setMessage('Registration successful! Logging you in...')
      
      // 2. Automatically log them in after registration
      await supabase.auth.signInWithPassword({ email, password })
      
      // 3. Redirect to the secure dashboard
      router.push('/dashboard')

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unable to create your account.'
      setMessage(`Error: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl interactive-card">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create an Account
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Join the platform to write and publish articles.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          
          <div>
            <label className="block font-semibold text-slate-700 mb-2">Full Name</label>
            <input 
              type="text" 
              required 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-shadow" 
              placeholder="Yasith Samarakoon"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-shadow" 
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-2">Password</label>
            <input 
              type="password" 
              required 
              minLength={6}
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-shadow" 
              placeholder="Minimum 6 characters"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-700 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition-colors shadow-md disabled:opacity-70 mt-4"
          >
            {loading ? 'Processing...' : 'Register Securely'}
          </button>

          {message && (
            <p className={`text-center font-bold mt-2 ${message.includes('Error') ? 'text-red-600' : 'text-blue-600'}`}>
              {message}
            </p>
          )}
        </form>

        {/* Navigation back to Login (if you have a separate login page) */}
        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-slate-600 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
