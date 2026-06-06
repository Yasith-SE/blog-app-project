'use client'

import { supabase } from './lib/supabase'
import { useState, useEffect } from 'react'

export default function Home() {
    const [posts, setPosts] = useState<any[]>([])
    const [searchTerm, setSearchTerm] = useState('')

    // This runs every time the user types in the search bar
    useEffect(() => {
        fetchPosts()
    }, [searchTerm])

    async function fetchPosts() {
        let query = supabase
            .from('posts')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false })

        // If there is text in the search bar, filter the database
        if (searchTerm) {
            query = query.ilike('title', `%${searchTerm}%`)
        }

        const { data, error } = await query
        if (error) console.error(error)
        if (data) setPosts(data)
    }

    return (
        <main className="min-h-screen p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Public Blog Posts</h1>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search posts by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 mb-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="bg-gateway-gradient rounded-3xl p-12 mb-12 text-white shadow-secure flex flex-col md:flex-row items-center justify-between">
                {posts.map((post) => (
                    <article key={post.id} className="bg-white p-8 rounded-2xl interactive-card">
                        <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                        <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                        {post.is_premium && (
                            <span className="inline-block mt-4 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">
                                Premium Content
                            </span>
                        )}
                    </article>
                ))}
                {posts.length === 0 && <p className="text-gray-500">No posts found.</p>}
            </div>
        </main>
    )
}