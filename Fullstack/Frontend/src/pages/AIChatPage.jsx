import { useState } from 'react'
import { IoAddOutline } from 'react-icons/io5'
import { LuSendHorizontal } from 'react-icons/lu'
import { useAuth } from '../context/useAuth'
import DailyCheckInModal from '../components/ui/DailyCheckInModal'
import api from '../services/api'

function AIChatPage() {
    const [message, setMessage] = useState('')
    const { isLoggedIn } = useAuth()
    const [checkedIn, setCheckedIn] = useState(() => {
        const today = new Date().toDateString()
        return localStorage.getItem('lastCheckin') === today
    })

    const showModal = isLoggedIn && !checkedIn

    const handleSend = () => {
        if (!message.trim()) return
        console.log('Sending:', message)
        setMessage('')
    }

    const handleSubmit = async (data) => {
        try {
            await api.post('/api/habit-log', data)
            const today = new Date().toDateString()
            localStorage.setItem('lastCheckin', today)
            localStorage.setItem('checkinData', JSON.stringify(data))
            setCheckedIn(true)
        } catch (err) {
            console.error('Gagal simpan habit log:', err)
            // tetap simpan ke localStorage sebagai fallback
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

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] relative">

            {showModal && (
                <DailyCheckInModal
                    onClose={() => setCheckedIn(true)}
                    onSubmit={handleSubmit}
                />
            )}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-end">
                {/* Suggestion chips, muncul kalau belum ada chat */}
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => setMessage(s)}
                            className="text-sm px-4 py-2 rounded-full border border-gray-300 bg-white text-[#64748B] hover:border-[#3B82F6] hover:text-[#3B82F6] transition-colors"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-6 flex justify-center">
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tanyakan sesuatu tentang kesehatanmu..."
                        rows={2}
                        className="w-full resize-none outline-none text-[#0F172A] placeholder-[#64748B] text-sm"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSend()
                            }
                        }}
                    />
                    <div className="flex items-center justify-between mt-2">
                        <button className="text-[#64748B] hover:text-[#0F172A] transition-colors">
                            <IoAddOutline size={24} />
                        </button>
                        <button
                            onClick={handleSend}
                            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-[#0F172A] text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                        >
                            Kirim Pesan
                            <LuSendHorizontal size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AIChatPage