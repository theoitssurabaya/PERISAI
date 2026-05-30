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
            setError(err.response?.data?.message || 'Gagal mengambil prediksi')
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
            title: 'Resiko Diabetes',
            percent: predictions.diabetes,
            status: predictions.diabetes > 50 ? 'High' : predictions.diabetes > 30 ? 'Medium' : 'Low',
            color: predictions.diabetes > 50 ? 'red' : predictions.diabetes > 30 ? 'orange' : 'green',
            icon: <IoWaterOutline size={20} />,
        },
        {
            title: 'Resiko Hipertensi',
            percent: predictions.hipertensi,
            status: predictions.hipertensi > 50 ? 'High' : predictions.hipertensi > 30 ? 'Medium' : 'Low',
            color: predictions.hipertensi > 50 ? 'red' : predictions.hipertensi > 30 ? 'orange' : 'green',
            icon: <IoHeartOutline size={20} />,
        },
        {
            title: 'Resiko Kolesterol Tinggi',
            percent: predictions.kolesterol,
            status: predictions.kolesterol > 50 ? 'High' : predictions.kolesterol > 30 ? 'Medium' : 'Low',
            color: predictions.kolesterol > 50 ? 'red' : predictions.kolesterol > 30 ? 'orange' : 'green',
            icon: <IoWarningOutline size={20} />,
        }
    ] : []

    const avgRisk = predictions
        ? ((parseFloat(predictions.diabetes) + parseFloat(predictions.hipertensi) + parseFloat(predictions.kolesterol)) / 3).toFixed(0)
        : 0

    const overallColor = avgRisk > 50
        ? 'border-red-400 text-red-500'
        : avgRisk > 30
            ? 'border-orange-400 text-orange-500'
            : 'border-green-400 text-[#10B981]'

    const overallStatus = avgRisk > 50 ? 'Resiko Tinggi' : avgRisk > 30 ? 'Resiko Sedang' : 'Resiko Rendah'

    return (
        <div className="min-h-screen bg-[#E5E7EB] p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#0F172A]">AI Risk Profile</h1>
                    <p className="text-[#64748B] mt-1">Analisis risiko penyakit tidak menular berdasarkan profil kesehatan Anda</p>
                </div>
                <button
                    onClick={fetchPrediction}
                    disabled={loading}
                    className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
                >
                    <IoRefreshOutline size={18} />
                    {loading ? 'Menganalisis...' : 'Refresh Prediksi'}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
                    {error}
                    {error.includes('profil') && (
                        <a href="/profile" className="ml-2 underline font-medium">Lengkapi profil →</a>
                    )}
                    {error.includes('harian') && (
                        <a href="/chat" className="ml-2 underline font-medium">Isi data harian →</a>
                    )}
                </div>
            )}

            {loading && (
                <div className="flex items-center justify-center h-64">
                    <div className="text-[#64748B]">Menganalisis data dengan PERISAI AI...</div>
                </div>
            )}

            {predictions && !loading && (
                <>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                        {/* Overall Risk */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-[#0F172A] mb-6">Risiko Keseluruhan</h2>
                            <div className="flex flex-col md:flex-row md:items-center gap-8">
                                <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                                    <div className="absolute inset-0 rounded-full border-[14px] border-gray-200"></div>
                                    <div className={`absolute inset-0 rounded-full border-[14px] ${overallColor.split(' ')[0]} border-t-transparent border-l-transparent rotate-[135deg]`}></div>
                                    <div className="text-center">
                                        <h3 className="text-5xl font-bold text-[#0F172A]">{avgRisk}%</h3>
                                        <p className={`font-medium mt-2 ${overallColor.split(' ')[1]}`}>{overallStatus}</p>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[#64748B] leading-relaxed">
                                        Risiko penyakit tidak menular (PTM) rata-rata Anda adalah{' '}
                                        <span className={`font-medium ${overallColor.split(' ')[1]}`}>{overallStatus}</span>{' '}
                                        berdasarkan profil kesehatan dan kebiasaan harian Anda.
                                    </p>
                                    <div className="bg-blue-50 rounded-xl p-4 mt-6">
                                        <p className="text-sm text-[#64748B]">Diberdayakan oleh Arsitektur PERISAI TensorFlow dengan kendala kehilangan khusus.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Specific Risks */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-[#0F172A] mb-6">Probabilitas Penyakit Spesifik</h2>
                            <div className="space-y-6">
                                {riskFactors.map((item, index) => (
                                    <div key={index}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${item.color === 'orange' ? 'bg-orange-100 text-orange-500' : item.color === 'red' ? 'bg-red-100 text-red-500' : 'bg-green-100 text-[#10B981]'}`}>
                                                    {item.icon}
                                                </div>
                                                <p className="text-sm font-medium text-[#0F172A]">{item.title}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${item.color === 'orange' ? 'bg-orange-50 text-orange-500 border-orange-200' : item.color === 'red' ? 'bg-red-50 text-red-500 border-red-200' : 'bg-green-50 text-[#10B981] border-green-200'}`}>
                                                    {item.status}
                                                </span>
                                                <span className="text-sm text-[#64748B] font-bold">{item.percent}%</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${item.color === 'orange' ? 'bg-orange-400' : item.color === 'red' ? 'bg-red-500' : 'bg-[#10B981]'}`}
                                                style={{ width: `${item.percent}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-100 shadow-sm p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-white p-4 rounded-2xl">
                                <IoClipboardOutline size={28} className="text-[#3B82F6]" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-[#0F172A]">Disclaimer Medis AI</h2>
                                <p className="text-sm text-[#64748B] mt-1">Prediksi ini dihasilkan oleh model Pembelajaran Dalam eksperimental dan tidak boleh menggantikan diagnosis medis profesional.</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default RiskProfilePage