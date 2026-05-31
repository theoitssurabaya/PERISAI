import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { s } from '../styles/common'
import api from '../services/api'

function ProfilePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    age: '',
    sex: 1,
    weight: '',
    height: '',
    fruits: 0,
    veggies: 0,
    diff_walk: 0,
    stroke: 0,
    heart_disease: 0,
    chol_check: 1,
    gen_hlth: 3,
  })

  useEffect(() => {
    api.get('/api/profile')
      .then(res => {
        if (res.data.data) {
          const p = res.data.data
          setForm({
            age: p.age ?? '',
            sex: p.sex ?? 1,
            weight: p.weight ?? '',
            height: p.height ?? '',
            fruits: p.fruits ?? 0,
            veggies: p.veggies ?? 0,
            diff_walk: p.diff_walk ?? 0,
            stroke: p.stroke ?? 0,
            heart_disease: p.heart_disease ?? 0,
            chol_check: p.chol_check ?? 1,
            gen_hlth: p.gen_hlth ?? 3,
          })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await api.post('/api/profile', form)
      setSuccess('Profil berhasil disimpan!')
      setTimeout(() => navigate('/chat'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan profil')
    } finally {
      setSaving(false)
    }
  }

  const bmi = form.weight && form.height
    ? (form.weight / ((form.height / 100) ** 2)).toFixed(1)
    : '-'

  if (loading) return <div className="p-6 text-[#64748B]">Loading...</div>

  return (
    <div className={s.pageWrapper}>
      <h1 className={s.pageTitle}>Profil Kesehatan</h1>
      <p className={s.pageSubtitle}>Lengkapi data ini untuk mendapatkan prediksi risiko yang akurat.</p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-2xl flex flex-col gap-4">

        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl">{success}</div>}

        {/* Data Dasar */}
        <div className={s.card}>
          <h2 className={`${s.sectionTitle} mb-4`}>Data Dasar</h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Usia */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#3B82F6]">Usia</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="Contoh: 25"
                className="border border-gray-300 rounded-xl px-4 py-3 outline-none text-sm focus:border-[#3B82F6] transition-colors"
              />
            </div>

            {/* Jenis Kelamin */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#3B82F6]">Jenis Kelamin</label>
              <div className="flex gap-2 mt-1">
                {[{ label: 'Laki-laki', value: 1 }, { label: 'Perempuan', value: 0 }].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleChange('sex', opt.value)}
                    className={`flex-1 text-sm py-3 rounded-xl border transition-colors
                      ${form.sex === opt.value
                        ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                        : 'bg-white text-[#0F172A] border-gray-300 hover:border-[#3B82F6]'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Berat */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#3B82F6]">Berat Badan (kg)</label>
              <input
                type="number"
                value={form.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
                placeholder="Contoh: 65"
                className="border border-gray-300 rounded-xl px-4 py-3 outline-none text-sm focus:border-[#3B82F6] transition-colors"
              />
            </div>

            {/* Tinggi */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#3B82F6]">Tinggi Badan (cm)</label>
              <input
                type="number"
                value={form.height}
                onChange={(e) => handleChange('height', e.target.value)}
                placeholder="Contoh: 170"
                className="border border-gray-300 rounded-xl px-4 py-3 outline-none text-sm focus:border-[#3B82F6] transition-colors"
              />
            </div>
          </div>

          {/* BMI Preview */}
          {bmi !== '-' && (
            <div className="mt-4 px-4 py-3 bg-blue-50 rounded-xl text-sm text-[#3B82F6]">
              BMI kamu: <span className="font-bold">{bmi}</span>
            </div>
          )}
        </div>

        {/* Kebiasaan */}
        <div className={s.card}>
          <h2 className={`${s.sectionTitle} mb-4`}>Kebiasaan Makan</h2>

          <div className="flex flex-col gap-3">
            {[
              { key: 'fruits', label: 'Apakah kamu rutin makan buah?' },
              { key: 'veggies', label: 'Apakah kamu rutin makan sayur?' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-[#0F172A]">{label}</span>
                <div className="flex gap-2">
                  {[{ label: 'Ya', value: 1 }, { label: 'Tidak', value: 0 }].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleChange(key, opt.value)}
                      className={`text-sm px-4 py-1 rounded-full border transition-colors
                        ${form[key] === opt.value
                          ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                          : 'bg-white text-[#0F172A] border-gray-300'
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Riwayat Kesehatan */}
        <div className={s.card}>
          <h2 className={`${s.sectionTitle} mb-4`}>Riwayat Kesehatan</h2>

          <div className="flex flex-col gap-3">
            {[
              { key: 'diff_walk', label: 'Apakah kamu kesulitan berjalan/naik tangga?' },
              { key: 'stroke', label: 'Apakah kamu pernah stroke?' },
              { key: 'heart_disease', label: 'Apakah kamu pernah penyakit jantung?' },
              { key: 'chol_check', label: 'Apakah kamu pernah cek kolesterol?' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-[#0F172A]">{label}</span>
                <div className="flex gap-2">
                  {[{ label: 'Ya', value: 1 }, { label: 'Tidak', value: 0 }].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleChange(key, opt.value)}
                      className={`text-sm px-4 py-1 rounded-full border transition-colors
                        ${form[key] === opt.value
                          ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                          : 'bg-white text-[#0F172A] border-gray-300'
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Kesehatan Umum */}
          <div className="mt-4">
            <p className="text-sm text-[#0F172A] mb-2">Bagaimana kondisi kesehatan kamu secara umum?</p>
            <div className="flex gap-2">
              {[
                { label: 'Sangat Baik', value: 1 },
                { label: 'Baik', value: 2 },
                { label: 'Cukup', value: 3 },
                { label: 'Buruk', value: 4 },
                { label: 'Sangat Buruk', value: 5 },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChange('gen_hlth', opt.value)}
                  className={`flex-1 text-xs py-2 rounded-xl border transition-colors
                    ${form.gen_hlth === opt.value
                      ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                      : 'bg-white text-[#0F172A] border-gray-300 hover:border-[#3B82F6]'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`${s.btnPrimary} w-full text-center`}
        >
          {saving ? 'Menyimpan...' : 'Simpan Profil'}
        </button>

      </form>
    </div>
  )
}

export default ProfilePage