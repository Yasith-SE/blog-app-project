'use client'

import { supabase } from './lib/supabase'
import { useState, useEffect } from 'react'

type Post = {
    id: string
    title: string
    content: string
    is_premium: boolean
}

export default function Home() {
    const [posts, setPosts] = useState<Post[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [fetchMessage, setFetchMessage] = useState('')

    // This runs every time the user types in the search bar
    useEffect(() => {
        async function fetchPosts() {
            let query = supabase
                .from('posts')
                .select('id, title, content, is_premium')
                .eq('is_published', true)
                .order('created_at', { ascending: false })

            // If there is text in the search bar, filter the database
            if (searchTerm) {
                query = query.ilike('title', `%${searchTerm}%`)
            }

            const { data, error } = await query
            if (error) {
                setFetchMessage('Unable to load posts right now.')
                setPosts([])
                return
            }

            setFetchMessage('')
            if (data) setPosts(data)
        }

        void fetchPosts()
    }, [searchTerm])

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
            <section className="mx-auto w-full max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-950">Public Blog Posts</h1>
                </div>

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search posts by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-8 w-full rounded-lg border border-slate-300 bg-white p-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="mb-12 rounded-3xl bg-gateway-gradient p-6 shadow-secure sm:p-8">
                    {fetchMessage ? (
                        <p className="rounded-xl border border-white/15 bg-white/10 p-6 font-semibold text-white">
                            {fetchMessage}
                        </p>
                    ) : posts.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2">
                            {posts.map((post) => (
                                <article key={post.id} className="interactive-card flex min-h-56 flex-col rounded-2xl bg-white p-7 text-slate-900">
                                    <h2 className="mb-3 text-2xl font-extrabold leading-tight text-slate-950 break-words">
                                        {post.title}
                                    </h2>
                                    <p className="flex-1 whitespace-pre-wrap break-words text-base leading-7 text-slate-700">
                                        {post.content}
                                    </p>
                                    {post.is_premium && (
                                        <span className="mt-5 inline-flex w-fit rounded bg-yellow-100 px-2 py-1 text-xs font-bold text-yellow-800">
                                            Premium Content
                                        </span>
                                    )}
                                </article>
                            ))}
                        </div>
                    ) : (
                        <p className="rounded-xl border border-white/15 bg-white/10 p-6 font-semibold text-white">
                            No posts found.
                        </p>
                    )}
                </div>
            </section>
        </main>
    )
}
