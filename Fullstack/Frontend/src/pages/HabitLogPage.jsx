import { useState, useEffect } from 'react'
import { s } from '../styles/common'
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts'
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'
import api from '../services/api'
import { useAuth } from '../context/useAuth'

function HabitLogPage() {
    const { isLoggedIn, user } = useAuth()
    const [logData, setLogData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [currentDate, setCurrentDate] = useState(new Date())

    useEffect(() => {
        if (!isLoggedIn) {
            setLoading(false)
            return
        }
        
        setLoading(true)
        // Memastikan format YYYY-MM-DD menggunakan waktu lokal, bukan UTC agar tanggal tidak bergeser
        const offset = currentDate.getTimezoneOffset()
        const localDate = new Date(currentDate.getTime() - (offset * 60 * 1000))
        const dateStr = localDate.toISOString().split('T')[0]

        api.get(`/api/habit-log?date=${dateStr}`)
            .then(res => {
                setLogData(res.data.data)
                setLoading(false)
            })
            .catch(() => {
                setLogData(null)
                setLoading(false)
            })
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

    // Batasan navigasi 6 hari ke belakang dengan logika aman (bebas mutasi langsung)
    const todayTimestamp = new Date().setHours(0, 0, 0, 0)
    const minDateLimit = new Date(todayTimestamp - 6 * 24 * 60 * 60 * 1000)
    const isMinDate = currentDate <= minDateLimit

    // Mendapatkan nama hari lokal singkat (e.g., 'Sen', 'Sel', 'Rab')
    const currentDayName = currentDate.toLocaleDateString('id-ID', { weekday: 'short' })

    // Memetakan grafik tidur agar data jam tidur hanya muncul proporsional di hari yang dipilih
    const daysOfWeek = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
    const sleepData = daysOfWeek.map(day => ({
        day,
        hours: day === currentDayName ? sleepHours : 0,
        isActive: day === currentDayName
    }))

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

    if (loading) return <div className="p-6 text-[#64748B] font-medium animate-pulse">Memuat data log harian...</div>

    return (
        <div className={s.pageWrapper}>
            <h1 className={s.pageTitle}>Halo, {user?.name || 'Pengguna'}!</h1>
            <p className={s.pageSubtitle}>Bagaimana perasaanmu hari ini? Ayo cepat catat kebiasaanmu untuk menjaga perisaimu tetap kuat.</p>

            {/* Navigator Tanggal */}
            <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-200 px-4 py-3 mt-4 mb-2 max-w-full sm:max-w-sm shadow-sm">
                <button
                    onClick={goToPrev}
                    disabled={isMinDate}
                    className={`transition-colors ${isMinDate ? 'text-gray-300 cursor-not-allowed' : 'text-[#64748B] hover:text-[#0F172A]'}`}
                >
                    <IoChevronBackOutline size={20} />
                </button>

                <span className="text-sm font-semibold text-[#0F172A] select-none">
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

            {/* Alert Data Kosong */}
            {!logData && (
                <div className="mt-4 mb-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 font-medium">
                    Belum ada data untuk tanggal ini. Silakan isi check-in harian kamu terlebih dahulu!
                </div>
            )}

            {/* Grid Konten */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

                {/* Nutrisi Harian */}
                <div className={s.card}>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl">🍽️</span>
                        <h2 className={s.sectionTitle}>Nutrisi Harian</h2>
                    </div>

                    <p className="text-sm text-[#64748B] mb-3">Berapa banyak makanan yang kamu makan hari ini?</p>
                    <div className="flex items-center gap-4 bg-gray-100 rounded-full px-4 py-1.5 w-fit mb-4">
                        <span className="font-bold text-[#0F172A] text-sm">{meals} Kali Makan</span>
                    </div>

                    <p className="text-sm text-[#64748B] mb-3">Makanan apa saja yang kamu makan?</p>
                    <div className="flex flex-wrap gap-2">
                        {foodOptions.map(food => {
                            const isSelected = selectedFoods.includes(food);
                            return (
                                <span
                                    key={food}
                                    className={`text-xs sm:text-sm px-3.5 py-1.5 rounded-full border transition-all font-medium
                                        ${isSelected
                                            ? 'bg-[#3B82F6] text-white border-[#3B82F6] shadow-sm'
                                            : 'bg-white text-[#475569] border-gray-200'
                                        }`}
                                >
                                    {food}
                                </span>
                            );
                        })}
                    </div>
                </div>

                {/* Aktivitas Fisik */}
                <div className={s.card}>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl">🏃</span>
                        <h2 className={s.sectionTitle}>Aktivitas Fisik</h2>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-[#0F172A]">Apakah kamu berolahraga?</span>
                        <span className={`text-sm px-4 py-1 rounded-full border font-semibold
                            ${exercised
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                : 'bg-gray-50 text-gray-500 border-gray-200'
                            }`}>
                            {exercised ? 'Ya' : 'Tidak'}
                        </span>
                    </div>

                    <p className="text-sm font-medium text-[#0F172A] mb-2">Intensitas Latihan</p>
                    <div className="flex gap-2 mb-4">
                        {intensityOptions.map(opt => (
                            <span
                                key={opt}
                                className={`flex-1 text-sm py-1.5 rounded-xl border text-center font-medium transition-all
                                    ${intensity === opt
                                        ? 'bg-[#3B82F6] text-white border-[#3B82F6] shadow-sm'
                                        : 'bg-gray-50 text-gray-400 border-gray-200'
                                    }`}
                            >
                                {opt}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#0F172A]">Langkah Harian</span>
                        <span className="text-sm font-bold text-[#3B82F6]">{steps.toLocaleString()} <span className="text-gray-400 font-normal">/ 10.000</span></span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                            className="bg-[#3B82F6] h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((steps / 10000) * 100, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Kualitas Tidur */}
                <div className={s.card}>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🌙</span>
                        <h2 className={s.sectionTitle}>Kualitas Tidur</h2>
                    </div>
                    <div className="text-center my-3">
                        <p className="text-4xl font-extrabold text-[#0F172A]">{sleepHours}</p>
                        <p className="text-xs text-[#64748B] font-medium mt-0.5">Jam Tidur</p>
                    </div>

                    <div className="w-full h-[100px] min-h-[100px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sleepData} barSize={24} margin={{ top: 10, bottom: 5 }}>
                                <XAxis dataKey="day" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Bar
                                    dataKey="hours"
                                    radius={[4, 4, 0, 0]}
                                    // Bar warna biru solid khusus hari yang dipilih, abu-abu transparan untuk hari lain
                                    fill="#3B82F6"
                                    shape={(props) => {
                                        const { x, y, width, height, payload } = props;
                                        return (
                                            <rect
                                                x={x}
                                                y={y}
                                                width={width}
                                                height={height}
                                                rx={4}
                                                ry={4}
                                                fill={payload.isActive ? '#3B82F6' : '#E2E8F0'}
                                            />
                                        );
                                    }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Tingkat Stres */}
                <div className={s.card}>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl">🧠</span>
                        <h2 className={s.sectionTitle}>Tingkat Stres</h2>
                    </div>

                    <p className="text-sm text-[#64748B] mb-5">Bagaimana kondisi psikologis Anda hari ini?</p>

                    <div className="flex justify-between gap-1.5 mb-3">
                        {[1, 2, 3, 4, 5].map(level => (
                            <div
                                key={level}
                                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 font-bold text-sm flex items-center justify-center transition-all select-none
                                    ${stressLevel === level
                                        ? 'bg-[#3B82F6] text-white border-[#3B82F6] scale-105 shadow-md'
                                        : 'bg-gray-50 text-gray-400 border-transparent'
                                    }`}
                            >
                                {level}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-[#64748B] px-1">
                        <span className="text-emerald-600">Tenang (1)</span>
                        <span className="text-red-500">Stres Berat (5)</span>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default HabitLogPage