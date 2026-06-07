'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('Authenticating...')

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      
      setMessage('Login successful!')
      router.push('/dashboard')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unable to sign in.'
      setMessage(`Error: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl interactive-card">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Sign in to your author dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block font-semibold text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-shadow" 
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-2">Password</label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-shadow" 
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-blue-700 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition-colors shadow-md disabled:opacity-70 mt-4"
          >
            {loading ? 'Processing...' : 'Sign In'}
          </button>

          {message && (
             <p className={`text-center font-bold mt-2 ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </p>
          )}
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-slate-600 font-medium">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-600 font-bold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
