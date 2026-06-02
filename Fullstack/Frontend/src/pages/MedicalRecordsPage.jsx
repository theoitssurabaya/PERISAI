import { useState, useEffect } from 'react'
import {
    IoSearchOutline,
    IoEllipsisVertical,
} from 'react-icons/io5'
import {
    MdOutlineMonitorHeart,
} from 'react-icons/md'
import api from '../services/api'

// Helper: hitung BMI status
function getBMIStatus(bmi) {
    if (!bmi) return '-'
    if (bmi < 18.5) return 'Underweight'
    if (bmi < 25) return 'Normal'
    if (bmi < 30) return 'Overweight'
    return 'Obese'
}

// Helper: format tanggal
function formatDate(dateStr) {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function MedicalRecordsPage() {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                setLoading(true)
                const res = await api.get('/api/health-records')
                setHistory(res.data.data || [])
            } catch (err) {
                setError('Failed to load health records.')
            } finally {
                setLoading(false)
            }
        }
        fetchRecords()
    }, [])

    // Ambil data terbaru per metrik dari history
    const latest = history[0] || null

    const records = [
        {
            title: 'Blood Pressure',
            value: latest ? `${latest.systolic ?? '-'}/${latest.diastolic ?? '-'}` : '-',
            unit: 'mmHg',
            subtitle: 'Sys / Dia',
            status: latest?.systolic
                ? (latest.systolic < 130 && latest.diastolic < 85 ? 'Normal' : 'High')
                : '-',
            date: latest ? `Last ${formatDate(latest.date)}` : 'No data',
            color: 'blue',
        },
        {
            title: 'Cholesterol',
            value: latest?.cholesterol ?? '-',
            unit: 'mg/dL',
            subtitle: 'Cholesterol',
            status: latest?.cholesterol
                ? (latest.cholesterol < 200 ? 'Normal' : 'High')
                : '-',
            date: latest ? `Last ${formatDate(latest.date)}` : 'No data',
            color: 'orange',
        },
        {
            title: 'Blood Sugar',
            value: latest?.blood_sugar ?? '-',
            unit: 'mg/dL',
            subtitle: 'Blood Sugar',
            status: latest?.blood_sugar
                ? (latest.blood_sugar < 100 ? 'Normal' : latest.blood_sugar < 126 ? 'Prediabetes' : 'High')
                : '-',
            date: latest ? `Last ${formatDate(latest.date)}` : 'No data',
            color: 'red',
        },
        {
            title: 'BMI',
            value: latest?.bmi ?? '-',
            unit: '',
            subtitle: 'BMI',
            status: latest?.bmi ? getBMIStatus(latest.bmi) : '-',
            date: latest ? `Last ${formatDate(latest.date)}` : 'No data',
            color: 'blue',
        },
    ]

    // Filter history berdasarkan search
    const filteredHistory = history.filter(item => {
        if (!search) return true
        const q = search.toLowerCase()
        return (
            formatDate(item.date).toLowerCase().includes(q) ||
            String(item.systolic ?? '').includes(q) ||
            String(item.cholesterol ?? '').includes(q) ||
            String(item.blood_sugar ?? '').includes(q) ||
            String(item.bmi ?? '').includes(q) ||
            (item.stress_level ?? '').toLowerCase().includes(q)
        )
    })

    return (
        <div className="min-h-screen bg-[#E5E7EB] p-6">

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#0F172A]">
                        Medical Records
                    </h1>
                    <p className="text-[#64748B] mt-1">
                        Monitor your health history and PTM risk indicators
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl border border-gray-300 px-4 py-3 flex items-center gap-3 mb-6 max-w-md">
                <IoSearchOutline size={18} className="text-[#64748B]" />
                <input
                    type="text"
                    placeholder="Search records"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="bg-transparent outline-none w-full text-sm text-[#0F172A] placeholder-[#64748B]"
                />
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm">
                    {error}
                </div>
            )}

            {/* Health Cards */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 animate-pulse">
                            <div className="h-6 bg-gray-100 rounded w-1/2 mb-4" />
                            <div className="h-10 bg-gray-100 rounded w-1/3 mb-2" />
                            <div className="h-4 bg-gray-100 rounded w-1/4" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {records.map((item, index) => (
                        <div key={index} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                            {/* Top */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className={`
                                        p-3 rounded-xl
                                        ${item.color === 'blue' && 'bg-blue-100'}
                                        ${item.color === 'orange' && 'bg-orange-100'}
                                        ${item.color === 'red' && 'bg-red-100'}
                                    `}>
                                        <MdOutlineMonitorHeart
                                            size={24}
                                            className={`
                                                ${item.color === 'blue' && 'text-[#3B82F6]'}
                                                ${item.color === 'orange' && 'text-orange-500'}
                                                ${item.color === 'red' && 'text-red-500'}
                                            `}
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-[#0F172A]">
                                            {item.title}
                                        </h2>
                                        <p className="text-sm text-[#64748B] mt-1">
                                            {item.date}
                                        </p>
                                    </div>
                                </div>
                                <button className="text-[#64748B] hover:text-[#0F172A] transition-colors">
                                    <IoEllipsisVertical size={18} />
                                </button>
                            </div>

                            {/* Value */}
                            <div className="flex items-end gap-2">
                                <h3 className="text-4xl font-bold text-[#0F172A]">
                                    {item.value}
                                </h3>
                                <span className="text-[#64748B] mb-1">{item.unit}</span>
                            </div>
                            <p className="text-sm text-[#64748B] mt-2">{item.subtitle}</p>

                            {/* Bottom */}
                            <div className="flex items-center justify-between mt-6">
                                <span className={`
                                    px-4 py-1.5 rounded-full text-xs font-medium border
                                    ${item.status === 'Normal'
                                        ? 'bg-green-50 text-[#10B981] border-green-200'
                                        : item.status === '-'
                                        ? 'bg-gray-50 text-gray-400 border-gray-200'
                                        : 'bg-orange-50 text-orange-500 border-orange-200'
                                    }
                                `}>
                                    {item.status}
                                </span>
                                <button className="text-[#3B82F6] text-sm font-medium hover:text-blue-600 transition-colors">
                                    View History →
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            )}

            {/* History Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-[#0F172A]">
                            Recent Health Data
                        </h2>
                        <p className="text-sm text-[#64748B] mt-1">
                            Minimum 3-day history for AI risk analysis
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
                        ))}
                    </div>
                ) : filteredHistory.length === 0 ? (
                    <div className="text-center py-12 text-[#64748B] text-sm">
                        {search ? 'No records match your search.' : 'No health records yet.'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    {['Date', 'Blood Pressure', 'Cholesterol', 'Blood Sugar', 'BMI', 'Sleep', 'Stress', 'Activity', 'Status'].map(h => (
                                        <th key={h} className="text-left py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider pr-4">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHistory.map((item, index) => {
                                    const bmiStatus = getBMIStatus(item.bmi)
                                    const rowStatus = item.systolic >= 130 || item.cholesterol >= 200 || item.blood_sugar >= 100
                                        ? bmiStatus !== 'Normal' ? bmiStatus : 'Elevated'
                                        : 'Normal'

                                    return (
                                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 text-sm text-[#0F172A] pr-4 whitespace-nowrap">
                                                {formatDate(item.date)}
                                            </td>
                                            <td className="py-4 text-sm text-[#0F172A] pr-4">
                                                {item.systolic && item.diastolic ? `${item.systolic}/${item.diastolic}` : '-'}
                                            </td>
                                            <td className="py-4 text-sm text-[#0F172A] pr-4">
                                                {item.cholesterol ?? '-'}
                                            </td>
                                            <td className="py-4 text-sm text-[#0F172A] pr-4">
                                                {item.blood_sugar ?? '-'}
                                            </td>
                                            <td className="py-4 text-sm text-[#0F172A] pr-4">
                                                {item.bmi ?? '-'}
                                            </td>
                                            <td className="py-4 text-sm text-[#0F172A] pr-4">
                                                {item.sleep_hours != null ? `${item.sleep_hours} hrs` : '-'}
                                            </td>
                                            <td className="py-4 text-sm text-[#0F172A] pr-4">
                                                {item.stress_level ?? '-'}
                                            </td>
                                            <td className="py-4 text-sm text-[#0F172A] pr-4">
                                                {item.activity_minutes != null ? `${item.activity_minutes} mins` : '-'}
                                            </td>
                                            <td className="py-4">
                                                <span className={`
                                                    px-3 py-1 rounded-full text-xs font-medium border
                                                    ${rowStatus === 'Normal'
                                                        ? 'bg-green-50 text-[#10B981] border-green-200'
                                                        : 'bg-orange-50 text-orange-500 border-orange-200'
                                                    }
                                                `}>
                                                    {rowStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    )
}

export default MedicalRecordsPage
