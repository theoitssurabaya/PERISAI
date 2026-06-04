import { useState, useEffect, useRef } from 'react'
import {
    IoSearchOutline,
    IoCloseOutline,
} from 'react-icons/io5'
import {
    MdOutlineMonitorHeart,
} from 'react-icons/md'
import api from '../services/api'
import AddHealthRecordModal from '../components/ui/AddHealthRecordModal'

function getBMIStatus(bmi) {
    if (!bmi) return '-'
    if (bmi < 18.5) return 'Underweight'
    if (bmi < 25) return 'Normal'
    if (bmi < 30) return 'Overweight'
    return 'Obese'
}

function formatDate(dateStr) {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getRiskLabel(val) {
    if (val == null) return '-'
    const v = parseFloat(val)
    if (v < 30) return 'Low'
    if (v < 60) return 'Sedang'
    return 'Tinggi'
}

function getRiskColor(val) {
    if (val == null) return 'text-[#64748B]'
    const v = parseFloat(val)
    if (v < 30) return 'text-[#10B981]'
    if (v < 60) return 'text-orange-500'
    return 'text-red-500'
}

const METRIC_MAP = {
    'Tekanan Darah': 'bp',
    'Kolesterol': 'cholesterol',
    'Gula Darah': 'blood_sugar',
    'BMI': 'bmi',
}

function MedicalRecordsPage() {
    const [tableData, setTableData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState('')
    const [activeMetric, setActiveMetric] = useState(null)
    const [profileBMI, setProfileBMI] = useState(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [latestHealth, setLatestHealth] = useState(null)
    const tableRef = useRef(null)

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true)

                const [healthRes, predRes, profileRes] = await Promise.all([
                    api.get('/api/health-records'),
                    api.get('/api/prediction/history'),
                    api.get('/api/profile'),
                ])

                const healthRecords = healthRes.data.data || []
                const predictions = predRes.data.data || []
                const profile = profileRes.data.data || null

                const bmi = profile?.bmi ? parseFloat(profile.bmi).toFixed(1) : null
                setProfileBMI(bmi)
                setLatestHealth(healthRecords[0] || null)

                // Merge predictions + health records by date
                const healthByDate = {}
                healthRecords.forEach(r => {
                    const key = r.date?.split('T')[0]
                    if (key) healthByDate[key] = r
                })

                // Anchor: predictions (karena ini yang jadi main data)
                // Kalau ada health record di tanggal yang sama, gabung
                const merged = predictions.map(pred => {
                    const key = pred.predicted_at?.split('T')[0]
                    const health = healthByDate[key] || {}
                    return {
                        date: key,
                        diabetes_risk: pred.diabetes_risk != null ? (pred.diabetes_risk * 100).toFixed(1) : null,
                        hypertension_risk: pred.hypertension_risk != null ? (pred.hypertension_risk * 100).toFixed(1) : null,
                        cholesterol_risk: pred.cholesterol_risk != null ? (pred.cholesterol_risk * 100).toFixed(1) : null,
                        systolic: health.systolic,
                        diastolic: health.diastolic,
                        cholesterol: health.cholesterol,
                        blood_sugar: health.blood_sugar,
                        bmi,
                    }
                })

                setTableData(merged)
            } catch (err) {
                setError('Gagal memuat data kesehatan.')
            } finally {
                setLoading(false)
            }
        }
        fetchAll()
    }, [])

    const handleViewHistory = (metricTitle) => {
        const metric = METRIC_MAP[metricTitle]
        setActiveMetric(metric)
        setSearch('')
        setTimeout(() => {
            tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 50)
    }

    const clearMetricFilter = () => setActiveMetric(null)

    const latest = latestHealth

    const records = [
        {
            title: 'Tekanan Darah',
            value: latest ? `${latest.systolic ?? '-'}/${latest.diastolic ?? '-'}` : '-',
            unit: 'mmHg',
            subtitle: 'Sis / Dia',
            status: latest?.systolic
                ? (latest.systolic < 130 && latest.diastolic < 85 ? 'Normal' : 'Tinggi')
                : '-',
            date: latest ? `Terakhir ${formatDate(latest.date)}` : 'Tidak ada data',
            color: 'blue',
        },
        {
            title: 'Kolesterol',
            value: latest?.cholesterol ?? '-',
            unit: 'mg/dL',
            subtitle: 'Kolesterol',
            status: latest?.cholesterol
                ? (latest.cholesterol < 200 ? 'Normal' : 'Tinggi')
                : '-',
            date: latest ? `Terakhir ${formatDate(latest.date)}` : 'Tidak ada data',
            color: 'orange',
        },
        {
            title: 'Gula Darah',
            value: latest?.blood_sugar ?? '-',
            unit: 'mg/dL',
            subtitle: 'Gula Darah',
            status: latest?.blood_sugar
                ? (latest.blood_sugar < 100 ? 'Normal' : latest.blood_sugar < 126 ? 'Prediabetes' : 'Tinggi')
                : '-',
            date: latest ? `Terakhir ${formatDate(latest.date)}` : 'Tidak ada data',
            color: 'red',
        },
        {
            title: 'BMI',
            value: profileBMI ?? '-',
            unit: '',
            subtitle: 'Dari profil',
            status: profileBMI ? getBMIStatus(parseFloat(profileBMI)) : '-',
            date: 'Dari profil kamu',
            color: 'blue',
        },
    ]

    const filteredData = tableData.filter(item => {
        if (!search) return true
        const q = search.toLowerCase()
        return (
            formatDate(item.date).toLowerCase().includes(q) ||
            String(item.diabetes_risk ?? '').includes(q) ||
            String(item.hypertension_risk ?? '').includes(q) ||
            String(item.cholesterol_risk ?? '').includes(q) ||
            String(item.systolic ?? '').includes(q) ||
            String(item.cholesterol ?? '').includes(q)
        )
    })

    const allColumns = [
        { key: 'date',             label: 'Tanggal',             metric: null },
        { key: 'diabetes_risk',    label: 'Risiko Diabetes',    metric: null },
        { key: 'hypertension_risk',label: 'Risiko Hipertensi',  metric: null },
        { key: 'cholesterol_risk', label: 'Risiko Kolesterol',  metric: null },
        { key: 'bp',               label: 'Tekanan Darah',   metric: 'bp' },
        { key: 'cholesterol',      label: 'Kolesterol',      metric: 'cholesterol' },
        { key: 'blood_sugar',      label: 'Gula Darah',      metric: 'blood_sugar' },
        { key: 'bmi',              label: 'BMI',              metric: 'bmi' },
        { key: 'status',           label: 'Status',           metric: null },
    ]

    const activeMetricLabel = records.find(r => METRIC_MAP[r.title] === activeMetric)?.title

    return (
        <div className="min-h-screen bg-[#E5E7EB] p-3 sm:p-6">

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
                        Rekam Medis
                    </h1>
                    <p className="text-[#64748B] mt-1 text-sm sm:text-base">
                        Pantau riwayat kesehatan dan indikator risiko PTM kamu
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white font-medium px-5 py-2.5 rounded-xl transition-colors text-sm self-start lg:self-auto"
                >
                    + Tambah Data Kesehatan
                </button>
            </div>

            {showAddModal && (
                <AddHealthRecordModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        setShowAddModal(false)
                        window.location.reload()
                    }}
                />
            )}

            {/* Search */}
            <div className="bg-white rounded-xl border border-gray-300 px-4 py-3 flex items-center gap-3 mb-6 max-w-md">
                <IoSearchOutline size={18} className="text-[#64748B]" />
                <input
                    type="text"
                    placeholder="Cari rekaman"
                    value={search}
                    onChange={e => {
                        setSearch(e.target.value)
                        if (activeMetric) setActiveMetric(null)
                    }}
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
                    {records.map((item, index) => {
                        const isActive = activeMetric === METRIC_MAP[item.title]
                        return (
                            <div
                                key={index}
                                className={`bg-white rounded-2xl border shadow-sm p-6 transition-all duration-200 ${
                                    isActive ? 'border-[#3B82F6] ring-2 ring-blue-100' : 'border-gray-200'
                                }`}
                            >
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

                                </div>

                                <div className="flex items-end gap-2">
                                    <h3 className="text-4xl font-bold text-[#0F172A]">
                                        {item.value}
                                    </h3>
                                    <span className="text-[#64748B] mb-1">{item.unit}</span>
                                </div>
                                <p className="text-sm text-[#64748B] mt-2">{item.subtitle}</p>

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
                                    {item.title !== 'BMI' && (
                                        <button
                                            onClick={() => isActive ? clearMetricFilter() : handleViewHistory(item.title)}
                                            className={`text-sm font-medium transition-colors ${
                                                isActive
                                                    ? 'text-[#3B82F6] underline'
                                                    : 'text-[#3B82F6] hover:text-blue-700'
                                            }`}
                                        >
                                            {isActive ? 'Hapus Filter ×' : 'Lihat Riwayat →'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Riwayat Table */}
            <div ref={tableRef} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-[#0F172A]">
                            {activeMetricLabel ? `${activeMetricLabel} Riwayat` : 'Data Kesehatan Terkini'}
                        </h2>
                        <p className="text-sm text-[#64748B] mt-1">
                            {activeMetricLabel
                                ? `Menampilkan semua ${activeMetricLabel} records`
                                : 'Riwayat prediksi risiko AI + data kesehatan'}
                        </p>
                    </div>
                    {activeMetric && (
                        <button
                            onClick={clearMetricFilter}
                            className="flex items-center gap-1 text-xs text-[#64748B] hover:text-[#0F172A] bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            <IoCloseOutline size={14} />
                            Tampilkan Semua
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
                        ))}
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="text-center py-12 text-[#64748B] text-sm">
                        {search ? 'Tidak ada data yang cocok dengan pencarian.' : 'Belum ada riwayat prediksi. Jalankan analisis risiko AI dulu!'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    {allColumns
                                        .filter(col => !activeMetric || col.metric === null || col.metric === activeMetric)
                                        .map(col => (
                                            <th
                                                key={col.key}
                                                className={`text-left py-4 text-xs font-semibold uppercase tracking-wider pr-4 ${
                                                    col.metric === activeMetric
                                                        ? 'text-[#3B82F6]'
                                                        : 'text-[#64748B]'
                                                }`}
                                            >
                                                {col.label}
                                            </th>
                                        ))
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item, index) => {
                                    const overallRisk = Math.max(
                                        parseFloat(item.diabetes_risk ?? 0),
                                        parseFloat(item.hypertension_risk ?? 0),
                                        parseFloat(item.cholesterol_risk ?? 0),
                                    )
                                    const rowStatus = overallRisk >= 60 ? 'Risiko Tinggi'
                                        : overallRisk >= 30 ? 'Sedang'
                                        : 'Normal'

                                    const cells = {
                                        date: (
                                            <td key="date" className="py-4 text-sm text-[#0F172A] pr-4 whitespace-nowrap">
                                                {formatDate(item.date)}
                                            </td>
                                        ),
                                        diabetes_risk: (
                                            <td key="diabetes_risk" className={`py-4 text-sm pr-4 font-medium ${getRiskColor(item.diabetes_risk)}`}>
                                                {item.diabetes_risk != null ? `${item.diabetes_risk}%` : '-'}
                                            </td>
                                        ),
                                        hypertension_risk: (
                                            <td key="hypertension_risk" className={`py-4 text-sm pr-4 font-medium ${getRiskColor(item.hypertension_risk)}`}>
                                                {item.hypertension_risk != null ? `${item.hypertension_risk}%` : '-'}
                                            </td>
                                        ),
                                        cholesterol_risk: (
                                            <td key="cholesterol_risk" className={`py-4 text-sm pr-4 font-medium ${getRiskColor(item.cholesterol_risk)}`}>
                                                {item.cholesterol_risk != null ? `${item.cholesterol_risk}%` : '-'}
                                            </td>
                                        ),
                                        bp: (
                                            <td key="bp" className={`py-4 text-sm pr-4 ${activeMetric === 'bp' ? 'text-[#3B82F6] font-semibold' : 'text-[#0F172A]'}`}>
                                                {item.systolic && item.diastolic ? `${item.systolic}/${item.diastolic}` : '-'}
                                            </td>
                                        ),
                                        cholesterol: (
                                            <td key="cholesterol" className={`py-4 text-sm pr-4 ${activeMetric === 'cholesterol' ? 'text-[#3B82F6] font-semibold' : 'text-[#0F172A]'}`}>
                                                {item.cholesterol ?? '-'}
                                            </td>
                                        ),
                                        blood_sugar: (
                                            <td key="blood_sugar" className={`py-4 text-sm pr-4 ${activeMetric === 'blood_sugar' ? 'text-[#3B82F6] font-semibold' : 'text-[#0F172A]'}`}>
                                                {item.blood_sugar ?? '-'}
                                            </td>
                                        ),
                                        bmi: (
                                            <td key="bmi" className={`py-4 text-sm pr-4 ${activeMetric === 'bmi' ? 'text-[#3B82F6] font-semibold' : 'text-[#0F172A]'}`}>
                                                {item.bmi ?? '-'}
                                            </td>
                                        ),
                                        status: (
                                            <td key="status" className="py-4">
                                                <span className={`
                                                    px-3 py-1 rounded-full text-xs font-medium border
                                                    ${rowStatus === 'Normal'
                                                        ? 'bg-green-50 text-[#10B981] border-green-200'
                                                        : rowStatus === 'Sedang'
                                                        ? 'bg-orange-50 text-orange-500 border-orange-200'
                                                        : 'bg-red-50 text-red-500 border-red-200'
                                                    }
                                                `}>
                                                    {rowStatus}
                                                </span>
                                            </td>
                                        ),
                                    }

                                    return (
                                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            {allColumns
                                                .filter(col => !activeMetric || col.metric === null || col.metric === activeMetric)
                                                .map(col => cells[col.key])
                                            }
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