import { useState, useEffect } from 'react'
import { s } from '../styles/common'
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts'
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'
import api from '../services/api'
import { useAuth } from '../context/useAuth'

function HabitLogPage() {
    const { isLoggedIn } = useAuth()
    const [logData, setLogData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [currentDate, setCurrentDate] = useState(new Date())
    const { user } = useAuth()

    useEffect(() => {
        if (!isLoggedIn) {
            Promise.resolve().then(() => setLoading(false))
            return
        }
        const dateStr = currentDate.toISOString().split('T')[0]
        api.get(`/api/habit-log?date=${dateStr}`)
            .then(res => {
                setLogData(res.data.data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [isLoggedIn, currentDate])

    const meals = logData?.meals ?? '-'
    const selectedFoods = logData?.food_types ?? []
    const exercised = logData?.exercised ?? false
    const intensity = logData?.exercise_intensity ?? '-'
    const steps = logData?.daily_steps ?? 0
    const sleepHours = logData?.sleep_hours ?? 0
    const stressLevel = logData?.stress_level ?? null


    const foodOptions = ['Sayuran Segar', 'Protein Rendah Lemak', 'Cemilan Manis', 'Makanan Cepat Saji', 'Biji-Bijian Utuh']
    const intensityOptions = ['Rendah', 'Sedang', 'Tinggi']
    const isToday = new Date().toDateString() === currentDate.toDateString()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const minDate = new Date(today)
    minDate.setDate(minDate.getDate() - 6)

    const isMinDate = currentDate <= minDate

    const sleepData = [
        { day: 'Mon', hours: sleepHours },
        { day: 'Tue', hours: sleepHours },
        { day: 'Wed', hours: sleepHours },
        { day: 'Thu', hours: sleepHours },
        { day: 'Fri', hours: sleepHours },
    ]

    const goToPrev = () => {
        if (isMinDate) return
        const prev = new Date(currentDate)
        prev.setDate(prev.getDate() - 1)
        setCurrentDate(prev)
    }

    const goToNext = () => {
        if (isToday) return
        const next = new Date(currentDate)
        next.setDate(next.getDate() + 1)
        setCurrentDate(next)
    }

    const formatDate = (date) => {
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    if (loading) return <div className="p-6 text-[#64748B]">Loading...</div>

    return (
        <div className={s.pageWrapper}>
            <h1 className={s.pageTitle}>Halo, {user?.name || 'Pengguna'}!</h1>
            <p className={s.pageSubtitle}>Bagaimana perasaanmu hari ini? Ayo cepat catat kebiasaanmu untuk menjaga perisaimu tetap kuat.</p>

            {/* Date Navigator */}
            <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-200 px-4 py-3 mt-4 mb-2 max-w-sm">
                <button
                    onClick={goToPrev}
                    disabled={isMinDate}
                    className="text-[#64748B] hover:text-[#0F172A] transition-colors"
                >
                    <IoChevronBackOutline size={20} />
                </button>

                <span className="text-sm font-medium text-[#0F172A]">
                    {isToday ? `Hari ini, ${formatDate(currentDate)}` : formatDate(currentDate)}
                </span>

                <button
                    onClick={goToNext}
                    disabled={isToday}
                    className={`transition-colors ${isToday ? 'text-gray-300 cursor-not-allowed' : 'text-[#64748B] hover:text-[#0F172A]'}`}
                >
                    <IoChevronForwardOutline size={20} />
                </button>
            </div>

            {!logData && (
                <div className="mt-4 mb-2 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700">
                    Belum ada data untuk hari ini. Isi check-in harian kamu dulu ya!
                </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-6">

                {/* Daily Nutrition */}
                <div className={s.card}>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl">🍽️</span>
                        <h2 className={s.sectionTitle}>Nutrisi Harian</h2>
                    </div>

                    <p className="text-sm text-[#64748B] mb-3">Berapa banyak makanan yang kamu makan hari ini?</p>
                    <div className="flex items-center gap-4 bg-gray-100 rounded-full px-4 py-2 w-fit mb-4">
                        <span className="font-semibold text-[#0F172A] w-4 text-center">{meals}</span>
                    </div>

                    <p className="text-sm text-[#64748B] mb-3">Makanan apa saja yang kamu makan?</p>
                    <div className="flex flex-wrap gap-2">
                        {foodOptions.map(food => (
                            <span
                                key={food}
                                className={`text-sm px-4 py-1.5 rounded-full border
                                    ${selectedFoods.includes(food)
                                        ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                                        : 'bg-white text-[#0F172A] border-gray-300'
                                    }`}
                            >
                                {food}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Physical Activity */}
                <div className={s.card}>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl">🏃</span>
                        <h2 className={s.sectionTitle}>Aktivitas Fisik</h2>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-[#0F172A]">Apakah kamu berolahraga?</span>
                        <span className={`text-sm px-4 py-1 rounded-full border
                            ${exercised
                                ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                                : 'bg-white text-[#0F172A] border-gray-300'
                            }`}>
                            {exercised ? 'Ya' : 'Tidak'}
                        </span>
                    </div>

                    <p className="text-sm text-[#0F172A] mb-2">Intensitas</p>
                    <div className="flex gap-2 mb-4">
                        {intensityOptions.map(opt => (
                            <span
                                key={opt}
                                className={`flex-1 text-sm py-1.5 rounded-full border text-center
                                    ${intensity === opt
                                        ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                                        : 'bg-white text-[#0F172A] border-gray-300'
                                    }`}
                            >
                                {opt}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#0F172A]">Langkah Harian</span>
                        <span className="text-sm text-[#64748B]">{steps.toLocaleString()}/10K</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-[#3B82F6] h-2 rounded-full transition-all"
                            style={{ width: `${(steps / 10000) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Sleep Quality */}
                <div className={s.card}>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🌙</span>
                        <h2 className={s.sectionTitle}>Kualitas Tidur</h2>
                    </div>
                    <p className="text-3xl font-bold text-[#0F172A] text-center mt-2">{sleepHours}</p>
                    <p className="text-sm text-[#64748B] text-center mb-4">Jam Tidur</p>

                    <ResponsiveContainer width="100%" height={100}>
                        <BarChart data={sleepData} barSize={32}>
                            <XAxis dataKey="day" hide />
                            <Bar
                                dataKey="hours"
                                fill="#3B82F6"
                                radius={[4, 4, 0, 0]}
                                opacity={0.6}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Stress Level */}
                <div className={s.card}>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl">🧠</span>
                        <h2 className={s.sectionTitle}>Tingkat Stres</h2>
                    </div>

                    <p className="text-sm text-[#64748B] mb-6">Bagaimana perasaanmu hari ini?</p>

                    <div className="flex justify-between gap-2 mb-2">
                        {[1, 2, 3, 4, 5].map(level => (
                            <div
                                key={level}
                                className={`w-12 h-12 rounded-full border-2 font-semibold text-sm flex items-center justify-center
                                    ${stressLevel === level
                                        ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                                        : 'bg-gray-100 text-[#0F172A] border-transparent'
                                    }`}
                            >
                                {level}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-[#64748B] px-1">
                        <span>Tenang</span>
                        <span>Stres</span>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default HabitLogPage