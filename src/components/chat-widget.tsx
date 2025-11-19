'use client';

import { useChat } from 'ai/react';
import { MessageCircle, Send, X } from 'lucide-react';
import { useState } from 'react';

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-black dark:bg-white text-white dark:text-black shadow-lg hover:scale-110 transition-transform duration-300"
                    aria-label="Open chat"
                >
                    <MessageCircle className="w-6 h-6" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] bg-white dark:bg-black border-2 border-neutral-200 dark:border-neutral-800 rounded-lg shadow-2xl flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-neutral-50 dark:bg-neutral-900">
                        <div>
                            <h3 className="font-serif text-lg font-medium">Chat with Ankur</h3>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">Ask me anything</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded transition-colors"
                            aria-label="Close chat"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 && (
                            <div className="text-neutral-500 dark:text-neutral-400 text-sm space-y-2">
                                <p className="font-medium">👋 Hi! I'm Ankur.</p>
                                <p>Ask me about:</p>
                                <ul className="list-disc list-inside space-y-1 text-xs">
                                    <li>My experience in platform engineering</li>
                                    <li>Building and scaling products</li>
                                    <li>Team building and leadership</li>
                                    <li>My technical philosophy</li>
                                </ul>
                            </div>
                        )}
                        {messages.map((m: { id: string; role: string; content: string }) => (
                            <div
                                key={m.id}
                                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3 rounded-lg ${m.role === 'user'
                                        ? 'bg-black dark:bg-white text-white dark:text-black'
                                        : 'bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800'
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                        <div className="flex gap-2">
                            <input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Type your question..."
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                                aria-label="Send message"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
