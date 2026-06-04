import { useState } from 'react'
import { IoCloseOutline } from 'react-icons/io5'
import { MdOutlineMonitorHeart } from 'react-icons/md'
import api from '../../services/api'

const stressOptions = ['Rendah', 'Sedang', 'Tinggi', 'Sangat Tinggi']

function InputField({ label, unit, value, onChange, placeholder, min, max, step = 1 }) {
    return (
        <div className="bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-[#0F172A]">{label}</p>
                    {unit && <p className="text-xs text-[#64748B] mt-0.5">{unit}</p>}
                </div>
                <input
                    type="number"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder || '-'}
                    min={min}
                    max={max}
                    step={step}
                    className="w-28 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-[#0F172A] text-right outline-none focus:border-[#3B82F6] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
            </div>
        </div>
    )
}

function AddHealthRecordModal({ onClose, onSuccess }) {
    const today = new Date().toISOString().split('T')[0]

    const [form, setForm] = useState({
        date: today,
        systolic: '',
        diastolic: '',
        cholesterol: '',
        blood_sugar: '',
        sleep_hours: '',
        activity_minutes: '',
        stress_level: '',
        notes: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

    const handleSubmit = async () => {
        const hasData = form.systolic || form.diastolic || form.cholesterol ||
            form.blood_sugar || form.sleep_hours || form.activity_minutes
        if (!hasData) {
            setError('Isi minimal satu data kesehatan ya.')
            return
        }
        try {
            setLoading(true)
            setError(null)
            await api.post('/api/health-records', {
                date: form.date,
                systolic: form.systolic || null,
                diastolic: form.diastolic || null,
                cholesterol: form.cholesterol || null,
                blood_sugar: form.blood_sugar || null,
                sleep_hours: form.sleep_hours || null,
                activity_minutes: form.activity_minutes || null,
                stress_level: form.stress_level || null,
                notes: form.notes || null,
            })
            onSuccess()
            onClose()
        } catch (err) {
            setError(err?.response?.data?.message || 'Gagal menyimpan data. Coba lagi.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-0 sm:px-4">
            <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">

                {/* Header */}
                <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-xl">
                            <MdOutlineMonitorHeart size={20} className="text-[#3B82F6]" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-[#0F172A]">Tambah Data Kesehatan</h2>
                            <p className="text-xs text-[#64748B]">Catat data kesehatanmu hari ini</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#64748B] hover:text-[#0F172A] transition-colors p-1"
                    >
                        <IoCloseOutline size={22} />
                    </button>
                </div>

                <div className="px-6 py-4 space-y-5">

                    {/* Tanggal */}
                    <div>
                        <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">Tanggal</p>
                        <div className="bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3">
                            <input
                                type="date"
                                value={form.date}
                                max={today}
                                onChange={e => set('date', e.target.value)}
                                className="w-full bg-transparent outline-none text-sm text-[#0F172A]"
                            />
                        </div>
                    </div>

                    {/* Tekanan Darah */}
                    <div>
                        <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">Tekanan Darah</p>
                        <div className="space-y-2">
                            <InputField
                                label="Sistolik"
                                unit="mmHg · tekanan saat jantung memompa"
                                value={form.systolic}
                                onChange={v => set('systolic', v)}
                                placeholder="Contoh:120"
                                min={50} max={250}
                            />
                            <InputField
                                label="Diastolik"
                                unit="mmHg · tekanan saat jantung istirahat"
                                value={form.diastolic}
                                onChange={v => set('diastolic', v)}
                                placeholder="Contoh: 80"
                                min={30} max={150}
                            />
                        </div>
                    </div>

                    {/* Hasil Lab */}
                    <div>
                        <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">Hasil Lab</p>
                        <div className="space-y-2">
                            <InputField
                                label="Kolesterol"
                                unit="mg/dL"
                                value={form.cholesterol}
                                onChange={v => set('cholesterol', v)}
                                placeholder="Contoh: 180"
                                min={0} max={600} step={0.1}
                            />
                            <InputField
                                label="Gula Darah"
                                unit="mg/dL"
                                value={form.blood_sugar}
                                onChange={v => set('blood_sugar', v)}
                                placeholder="Contoh: 90"
                                min={0} max={600} step={0.1}
                            />
                        </div>
                    </div>

                    {/* Aktivitas & Tidur */}
                    <div>
                        <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">Aktivitas & Tidur</p>
                        <div className="space-y-2">
                            <InputField
                                label="Jam Tidur"
                                unit="jam"
                                value={form.sleep_hours}
                                onChange={v => set('sleep_hours', v)}
                                placeholder="Contoh: 7"
                                min={0} max={24} step={0.5}
                            />
                            <InputField
                                label="Aktivitas Fisik"
                                unit="menit"
                                value={form.activity_minutes}
                                onChange={v => set('activity_minutes', v)}
                                placeholder="Contoh: 30"
                                min={0} max={1440}
                            />
                        </div>
                    </div>

                    {/* Tingkat Stres */}
                    <div>
                        <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">Tingkat Stres</p>
                        <div className="grid grid-cols-4 gap-2">
                            {stressOptions.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => set('stress_level', form.stress_level === opt ? '' : opt)}
                                    className={`py-2 text-xs font-medium rounded-xl border transition-colors ${
                                        form.stress_level === opt
                                            ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                                            : 'bg-[#F8FAFC] text-[#64748B] border-gray-200 hover:border-[#3B82F6] hover:text-[#3B82F6]'
                                    }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Catatan */}
                    <div>
                        <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">Catatan (opsional)</p>
                        <div className="bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3">
                            <textarea
                                value={form.notes}
                                onChange={e => set('notes', e.target.value)}
                                placeholder="Catatan tambahan, misal: habis periksa ke dokter..."
                                rows={3}
                                className="w-full bg-transparent outline-none text-sm text-[#0F172A] placeholder-[#94A3B8] resize-none"
                            />
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-[#3B82F6] hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors text-sm"
                    >
                        {loading ? 'Menyimpan...' : 'Simpan Data'}
                    </button>

                    <div className="h-2" />
                </div>
            </div>
        </div>
    )
}

export default AddHealthRecordModal