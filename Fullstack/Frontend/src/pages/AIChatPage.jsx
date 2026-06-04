import { useState, useRef, useEffect } from 'react'
import { LuSendHorizontal } from 'react-icons/lu'
import { useAuth } from '../context/useAuth'
import DailyCheckInModal from '../components/ui/DailyCheckInModal'
import api from '../services/api'
import ReactMarkdown from 'react-markdown'

function AIChatPage() {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const { isLoggedIn } = useAuth()
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef(null)
    const textareaRef = useRef(null)
    const [checkedIn, setCheckedIn] = useState(() => {
        const today = new Date().toDateString()
        return localStorage.getItem('lastCheckin') === today
    })

    const showModal = isLoggedIn && !checkedIn

    // Auto-scroll ke bawah saat ada pesan baru
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading])

    // Auto-resize textarea
    const handleTextareaChange = (e) => {
        setMessage(e.target.value)
        const ta = textareaRef.current
        if (ta) {
            ta.style.height = 'auto'
            ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'
        }
    }

    const handleSend = async () => {
        if (!message.trim() || loading) return

        const userMsg = { role: 'user', text: message }
        setMessages(prev => [...prev, userMsg])
        setMessage('')
        if (textareaRef.current) textareaRef.current.style.height = 'auto'
        setLoading(true)

        try {
            const res = await api.post('/api/chat', { message: userMsg.text })
            setMessages(prev => [...prev, { role: 'ai', text: res.data.reply }])
        } catch {
            setMessages(prev => [...prev, { role: 'ai', text: 'Maaf, terjadi kesalahan. Coba lagi ya!' }])
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (data) => {
        try {
            const res = await api.post('/api/habit-log', data)
            console.log('Response:', res.data)
            const today = new Date().toDateString()
            localStorage.setItem('lastCheckin', today)
            localStorage.setItem('checkinData', JSON.stringify(data))
            setCheckedIn(true)
        } catch (err) {
            console.error('Error simpan habit log:', err.response?.data || err.message)
            const today = new Date().toDateString()
            localStorage.setItem('lastCheckin', today)
            localStorage.setItem('checkinData', JSON.stringify(data))
            setCheckedIn(true)
        }
    }

    const suggestions = [
        'Apa itu penyakit tidak menular?',
        'Bagaimana cara mencegah diabetes?',
        'Apa risiko hipertensi?',
        'Tips hidup sehat sehari-hari',
        'Apa arti skor risiko saya?',
    ]

    const hasMessages = messages.length > 0

    return (
        <div className="flex flex-col h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] relative">

            {showModal && (
                <DailyCheckInModal
                    onClose={() => setCheckedIn(true)}
                    onSubmit={handleSubmit}
                />
            )}

            {/* Chat area */}
            <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6 flex flex-col gap-3">

                {/* Suggestion chips — hanya tampil kalau belum ada chat */}
                {!hasMessages && (
                    <div className="flex flex-wrap gap-2 justify-center mt-auto pt-16 sm:pt-32 pb-2">
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setMessage(s)
                                    textareaRef.current?.focus()
                                }}
                                className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-300 bg-white text-[#64748B] hover:border-[#3B82F6] hover:text-[#3B82F6] transition-colors"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}

                {/* Chat messages */}
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] sm:max-w-[70%] px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-sm leading-relaxed
                                ${msg.role === 'user'
                                    ? 'bg-[#3B82F6] text-white rounded-br-sm'
                                    : 'bg-white text-[#0F172A] border border-gray-200 rounded-bl-sm'
                                }`}
                        >
                            {msg.role === 'ai'
                                ? <ReactMarkdown className="space-y-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:leading-relaxed">{msg.text}</ReactMarkdown>
                                : msg.text}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-[#64748B]">
                            Sedang mengetik...
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Input area */}
            <div className="px-3 pb-3 sm:px-6 sm:pb-6 flex justify-center">
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-200 px-3 py-3 sm:px-4 sm:py-4">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleTextareaChange}
                        placeholder="Tanyakan sesuatu tentang kesehatanmu..."
                        rows={1}
                        className="w-full resize-none outline-none text-[#0F172A] placeholder-[#64748B] text-sm leading-relaxed"
                        style={{ maxHeight: '120px' }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSend()
                            }
                        }}
                    />
                    <div className="flex items-center justify-end mt-2">
                        <button
                            onClick={handleSend}
                            disabled={loading || !message.trim()}
                            className="flex items-center gap-1.5 sm:gap-2 bg-[#3B82F6] disabled:bg-gray-100 disabled:text-[#94A3B8] hover:bg-blue-600 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-colors"
                        >
                            Kirim
                            <LuSendHorizontal size={14} className="sm:w-4 sm:h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AIChatPage