'use client'

import { useState } from 'react'

export default function Subscribe() {
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [message, setMessage] = useState('')

    // The function that talks to your new API route
    const handleCheckout = async (planId: 'standard' | 'elite') => {
        try {
            setLoadingId(planId)
            setMessage('')

            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId }),
            })

            const data = (await response.json()) as { url?: string; error?: string }

            // Redirect the user to the Stripe Checkout page
            if (data.url) {
                window.location.href = data.url
            } else {
                setMessage(data.error ?? 'Checkout is not available right now.')
            }
        } catch {
            setMessage('Checkout is not available right now.')
        } finally {
            setLoadingId(null)
        }
    }

    return (
        <main className="min-h-screen bg-white py-20 px-4 font-sans">
            <div className="max-w-5xl mx-auto">

                <div className="text-center mb-16">
                    <h1 className="text-5xl font-normal text-slate-800 mb-4">Be a Contributor</h1>
                    <p className="text-slate-500 text-lg">Let&apos;s be a part of this amazing journey</p>
                    {message && (
                        <p className="mx-auto mt-5 max-w-xl rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-semibold text-yellow-900">
                            {message}
                        </p>
                    )}
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">

                    {/* Basic Plan (Rs 0) */}
                    <div className="bg-[#323232] text-white rounded-3xl p-8 flex flex-col h-[450px]">
                        <h2 className="text-4xl mb-8">Rs 0</h2>
                        <ul className="space-y-4 text-sm text-gray-300 flex-grow">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div> Read public Blogs
                            </li>
                        </ul>
                        <button className="w-full py-3 rounded-xl border border-gray-500 text-gray-300 hover:bg-gray-700 transition-colors">
                            Current plan
                        </button>
                    </div>

                    {/* Standard Plan (Rs 50) */}
                    <div className="bg-[#A3A3A3] text-slate-900 rounded-3xl p-8 flex flex-col h-[450px]">
                        <h2 className="text-4xl mb-8">Rs 50</h2>
                        <ul className="space-y-4 text-sm text-slate-800 flex-grow">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-slate-600 rounded-full"></div> Read public Blogs
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-slate-600 rounded-full"></div> Read Premium Blogs
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-slate-600 rounded-full"></div> Community club access
                            </li>
                        </ul>
                        <button
                            onClick={() => handleCheckout('standard')}
                            disabled={loadingId === 'standard'}
                            className="w-full py-3 rounded-xl border border-slate-600 text-slate-900 hover:bg-slate-300 transition-colors disabled:opacity-50"
                        >
                            {loadingId === 'standard' ? 'Opening...' : 'Buy Now'}
                        </button>
                    </div>

                    {/* Elite Plan (Rs 100) */}
                    <div className="bg-[#EAB308] text-slate-900 rounded-3xl p-8 flex flex-col h-[450px]">
                        <h2 className="text-4xl mb-8">Rs 100</h2>
                        <ul className="space-y-4 text-sm text-slate-900 flex-grow font-medium">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div> Read public Blogs
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div> Read Premium Blogs
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div> Community club access
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div> Join monthly online Discussion
                            </li>
                        </ul>
                        <button
                            onClick={() => handleCheckout('elite')}
                            disabled={loadingId === 'elite'}
                            className="w-full py-3 rounded-xl border border-slate-600 text-slate-900 hover:bg-slate-300 transition-colors disabled:opacity-50"
                        >
                            {loadingId === 'elite' ? 'Opening...' : 'Buy Now'}
                        </button>
                    </div>

                </div>
            </div>
        </main>
    )
}
