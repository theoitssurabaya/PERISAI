import { useState, useEffect } from 'react'
import {
    IoHeartOutline,
    IoWarningOutline,
    IoClipboardOutline,
    IoWaterOutline,
    IoRefreshOutline
} from 'react-icons/io5'
import api from '../services/api'

function RiskProfilePage() {
    const [loading, setLoading] = useState(false)
    const [predictions, setPredictions] = useState(null)
    const [error, setError] = useState('')

    const fetchPrediction = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await api.post('/api/prediction/run')
            setPredictions(res.data.data)
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal mengambil data prediksi')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const run = async () => {
            await fetchPrediction()
        }
        run()
    }, [])

    const riskFactors = predictions ? [
        {
            title: 'Risiko Diabetes',
            percent: predictions.diabetes,
            status: predictions.diabetes > 50 ? 'Tinggi' : predictions.diabetes > 30 ? 'Sedang' : 'Rendah',
            color: predictions.diabetes > 50 ? 'red' : predictions.diabetes > 30 ? 'orange' : 'green',
            icon: <IoWaterOutline size={20} />,
        },
        {
            title: 'Risiko Hipertensi',
            percent: predictions.hipertensi,
            status: predictions.hipertensi > 50 ? 'Tinggi' : predictions.hipertensi > 30 ? 'Sedang' : 'Rendah',
            color: predictions.hipertensi > 50 ? 'red' : predictions.hipertensi > 30 ? 'orange' : 'green',
            icon: <IoHeartOutline size={20} />,
        },
        {
            title: 'Risiko Kolesterol Tinggi',
            percent: predictions.kolesterol,
            status: predictions.kolesterol > 50 ? 'Tinggi' : predictions.kolesterol > 30 ? 'Sedang' : 'Rendah',
            color: predictions.kolesterol > 50 ? 'red' : predictions.kolesterol > 30 ? 'orange' : 'green',
            icon: <IoWarningOutline size={20} />,
        }
    ] : []

    const avgRisk = predictions
        ? Math.round((parseFloat(predictions.diabetes) + parseFloat(predictions.hipertensi) + parseFloat(predictions.kolesterol)) / 3)
        : 0

    // Penentuan warna yang lebih aman tanpa fungsi split string
    const textColorClass = avgRisk > 50 ? 'text-red-500' : avgRisk > 30 ? 'text-orange-500' : 'text-[#10B981]'
    const strokeColorClass = avgRisk > 50 ? 'text-red-500' : avgRisk > 30 ? 'text-orange-500' : 'text-[#10B981]'

    const overallStatus = avgRisk > 50 ? 'Risiko Tinggi' : avgRisk > 30 ? 'Risiko Sedang' : 'Risiko Rendah'

    // Variabel kalkulasi untuk lingkaran SVG (Radius = 76, Keliling = 2 * pi * r)
    const radius = 76
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (avgRisk / 100) * circumference

    return (
        <div className="min-h-screen bg-[#E5E7EB] p-4 sm:p-6">
            {/* Bagian Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
                        Profil Risiko Kesehatan AI
                    </h1>
                    <p className="text-[#64748B] mt-1 text-sm sm:text-base">
                        Analisis risiko penyakit tidak menular berdasarkan profil kesehatan dan gaya hidup Anda
                    </p>
                </div>
                <button
                    onClick={fetchPrediction}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-4 py-2.5 rounded-xl shadow-sm hover:bg-gray-50 transition-colors w-full sm:w-auto"
                >
                    <IoRefreshOutline size={18} className={loading ? 'animate-spin' : ''} />
                    {loading ? 'Menganalisis...' : 'Perbarui Prediksi'}
                </button>
            </div>

            {/* Pesan Kesalahan */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex flex-wrap gap-1">
                    <span>{error}</span>
                    {error.includes('profil') && (
                        <a href="/profile" className="underline font-medium hover:text-red-700">Lengkapi profil →</a>
                    )}
                    {error.includes('harian') && (
                        <a href="/chat" className="underline font-medium hover:text-red-700">Isi data harian →</a>
                    )}
                </div>
            )}

            {/* Status Memuat Data */}
            {loading && (
                <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <div className="text-[#64748B] text-sm font-medium">Menganalisis data dengan PERISAI AI...</div>
                </div>
            )}

            {/* Konten Utama Prediksi */}
            {predictions && !loading && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Kartu Risiko Keseluruhan */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-[#0F172A] mb-6">Risiko Keseluruhan</h2>
                                <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8">
                                    {/* Lingkaran Progress SVG Proproporsional */}
                                    <div className="relative w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                                        <svg viewBox="0 0 192 192" className="absolute inset-0 w-full h-full transform -rotate-90">
                                            <circle cx="96" cy="96" r={radius} stroke="currentColor" strokeWidth="14" fill="transparent" className="text-gray-100" />
                                            <circle 
                                                cx="96" 
                                                cy="96" 
                                                r={radius} 
                                                stroke="currentColor" 
                                                strokeWidth="14" 
                                                fill="transparent" 
                                                strokeDasharray={circumference} 
                                                strokeDashoffset={strokeDashoffset} 
                                                className={`${strokeColorClass} transition-all duration-1000 ease-out`} 
                                                strokeLinecap="round" 
                                            />
                                        </svg>
                                        <div className="text-center relative z-10">
                                            <h3 className="text-4xl sm:text-5xl font-bold text-[#0F172A]">{avgRisk}%</h3>
                                            <p className={`font-medium text-sm mt-1 ${textColorClass}`}>{overallStatus}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 text-center sm:text-left">
                                        <p className="text-[#64748B] text-sm sm:text-base leading-relaxed">
                                            Risiko penyakit tidak menular (PTM) rata-rata Anda berada pada kategori{' '}
                                            <span className={`font-semibold ${textColorClass}`}>{overallStatus}</span>{' '}
                                            berdasarkan akumulasi data profil kesehatan dan kebiasaan harian Anda.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-4 mt-6">
                                <p className="text-xs sm:text-sm text-[#3B82F6] font-medium">
                                    Didukung oleh Arsitektur PERISAI TensorFlow dengan kalkulasi fungsi kerugian khusus (*custom loss constraint*).
                                </p>
                            </div>
                        </div>

                        {/* Kartu Risiko Spesifik */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-[#0F172A] mb-6">Probabilitas Penyakit Spesifik</h2>
                            <div className="space-y-6">
                                {riskFactors.map((item, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className={`p-2 rounded-lg shrink-0 ${item.color === 'orange' ? 'bg-orange-100 text-orange-500' : item.color === 'red' ? 'bg-red-100 text-red-500' : 'bg-green-100 text-[#10B981]'}`}>
                                                    {item.icon}
                                                </div>
                                                <p className="text-sm font-medium text-[#0F172A] truncate">{item.title}</p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${item.color === 'orange' ? 'bg-orange-50 text-orange-500 border-orange-200' : item.color === 'red' ? 'bg-red-50 text-red-500 border-red-200' : 'bg-green-50 text-[#10B981] border-green-200'}`}>
                                                    {item.status}
                                                </span>
                                                <span className="text-sm text-[#0F172A] font-bold min-w-[35px] text-right">{item.percent}%</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                                            <div
                                                className={`h-2.5 rounded-full transition-all duration-500 ${item.color === 'orange' ? 'bg-orange-400' : item.color === 'red' ? 'bg-red-500' : 'bg-[#10B981]'}`}
                                                style={{ width: `${item.percent}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Catatan Disclaimer Medis */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                            <div className="bg-white p-3 rounded-xl shadow-sm text-[#3B82F6] shrink-0">
                                <IoClipboardOutline size={26} />
                            </div>
                            <div className="text-center sm:text-left">
                                <h2 className="text-base sm:text-lg font-semibold text-[#0F172A]">Sanggahan Medis AI (*Disclaimer*)</h2>
                                <p className="text-xs sm:text-sm text-[#64748B] mt-1 leading-relaxed">
                                    Prediksi ini dihasilkan secara otomatis oleh model Pembelajaran Mendalam (*Deep Learning*) eksperimental dan murni bertujuan sebagai edukasi awal. Hasil ini **tidak boleh** dijadikan acuan pengganti diagnosis, pemeriksaan, atau saran medis dari dokter profesional.
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default RiskProfilePage