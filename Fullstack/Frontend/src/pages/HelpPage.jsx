import { useState } from 'react'
import { IoChevronDownOutline, IoChevronUpOutline, IoChatbubblesOutline, IoDocumentTextOutline, IoHelpCircleOutline, IoMailOutline, IoAlertCircleOutline } from 'react-icons/io5'
import { RiBarChartLine } from 'react-icons/ri'
import { MdOutlineMonitorHeart } from 'react-icons/md'

const features = [
  {
    icon: IoChatbubblesOutline,
    title: 'AI Chat',
    desc: 'Tanya seputar kesehatan kapan saja. AI kami menjawab berdasarkan data personal Anda.',
    accent: 'bg-blue-50 text-[#3B82F6]',
    border: 'border-blue-100',
  },
  {
    icon: RiBarChartLine,
    title: 'Risk Profile',
    desc: 'Hitung risiko penyakit dan dapatkan rekomendasi tindakan preventif yang dipersonalisasi.',
    accent: 'bg-emerald-50 text-[#10B981]',
    border: 'border-emerald-100',
  },
  {
    icon: MdOutlineMonitorHeart,
    title: 'Habit Log',
    desc: 'Catat aktivitas, nutrisi, dan tidur harian. Pantau tren kesehatan Anda dari waktu ke waktu.',
    accent: 'bg-orange-50 text-orange-500',
    border: 'border-orange-100',
  },
  {
    icon: IoDocumentTextOutline,
    title: 'Rekam Medis',
    desc: 'Simpan diagnosis, resep, dan hasil lab di satu tempat yang aman dan terenkripsi.',
    accent: 'bg-purple-50 text-purple-500',
    border: 'border-purple-100',
  },
]

const steps = [
  { title: 'Buat Akun', desc: 'Daftar dengan email untuk mulai menggunakan aplikasi.' },
  { title: 'Lengkapi Profil Kesehatan', desc: 'Isi usia, jenis kelamin, BMI, riwayat penyakit, dan kebiasaan hidup. Ini hanya perlu dilakukan sekali.' },
  { title: 'Catat Kebiasaan Harian', desc: 'Setiap hari, isi log kebiasaan — tidur, olahraga, merokok, alkohol. Data ini digunakan untuk model prediksi.' },
  { title: 'Jalankan Prediksi', desc: 'Buka Dashboard dan klik Prediksi. AI akan menganalisis data kamu dan menampilkan skor risiko PTM.' },
  { title: 'Tinjau Rekam Medis', desc: 'Cek halaman Rekam Medis untuk melacak riwayat prediksi dan melihat perkembangan risikomu dari waktu ke waktu.' },
]

const faqs = [
  {
    q: 'Bagaimana cara prediksi risiko PTM bekerja?',
    a: 'Aplikasi ini menggunakan model machine learning yang dilatih dengan data kesehatan untuk memprediksi risiko Penyakit Tidak Menular — khususnya diabetes, hipertensi, dan kolesterol tinggi. Model menggabungkan profil kesehatan dan log kebiasaan harian kamu untuk menghitung persentase risiko setiap kondisi.',
  },
  {
    q: 'Kenapa harus mengisi log kebiasaan harian?',
    a: 'Log harian mencatat faktor jangka pendek seperti jam tidur, aktivitas fisik, merokok, dan konsumsi alkohol. Model ML membutuhkan minimal satu entri log harian untuk hari ini sebelum bisa menghasilkan prediksi.',
  },
  {
    q: 'Apa arti persentase risiko?',
    a: 'Persentase mencerminkan estimasi probabilitas dari model bahwa kamu memiliki atau akan mengembangkan kondisi tersebut. Di bawah 30% berarti risiko rendah, 30–60% sedang, dan di atas 60% berarti risiko tinggi. Ini bukan diagnosis medis.',
  },
  {
    q: 'Apakah saya bisa memperbarui profil kesehatan?',
    a: 'Ya. Buka pengaturan profil untuk memperbarui informasi kesehatan kamu. Menjaga profil tetap terkini memastikan prediksi tetap akurat.',
  },
  {
    q: 'Apakah data kesehatan saya aman?',
    a: 'Ya. Data disimpan dengan aman menggunakan password terenkripsi dan akses yang diautentikasi via JWT. Hanya kamu yang bisa mengakses data milikmu. Lihat halaman Kebijakan Privasi untuk detail lengkapnya.',
  },
  {
    q: 'Kenapa prediksi saya tidak muncul?',
    a: 'Ada dua hal yang harus dilengkapi sebelum menjalankan prediksi: (1) profil kesehatan harus sudah diisi, dan (2) harus ada log kebiasaan harian untuk hari ini. Pastikan keduanya sudah selesai sebelum menekan tombol Prediksi.',
  },
  {
    q: 'Apa fungsi fitur AI Chat?',
    a: 'AI Chat memungkinkan kamu mengajukan pertanyaan seputar kesehatan dan mendapatkan informasi umum tentang kondisi PTM. Fitur ini bukan pengganti saran medis profesional.',
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border rounded-2xl overflow-hidden transition-colors ${open ? 'border-[#3B82F6] bg-blue-50/30' : 'border-gray-200 bg-white'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className={`text-sm font-medium pr-4 transition-colors ${open ? 'text-[#3B82F6]' : 'text-[#0F172A]'}`}>
          {q}
        </span>
        <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${open ? 'bg-[#3B82F6] text-white' : 'bg-gray-100 text-[#64748B]'}`}>
          {open ? <IoChevronUpOutline size={14} /> : <IoChevronDownOutline size={14} />}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-[#64748B] leading-relaxed border-t border-blue-100 pt-4">
          {a}
        </div>
      )}
    </div>
  )
}

function HelpPage() {
  return (
    <div className="min-h-screen bg-[#E5E7EB] p-3 sm:p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#3B82F6] flex items-center justify-center">
              <IoHelpCircleOutline size={20} className="text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">Pusat Bantuan</h1>
          </div>
          <p className="text-sm sm:text-base text-[#64748B] mt-1">Temukan jawaban dan panduan penggunaan aplikasi di sini.</p>
        </div>

        {/* Fitur Utama */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-[#0F172A]">Fitur Utama</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map(({ icon: Icon, title, desc, accent, border }) => (
              <div key={title} className={`flex gap-3 p-4 rounded-xl border ${border} hover:shadow-sm transition-shadow`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-[#0F172A] text-sm mb-1">{title}</p>
                  <p className="text-xs text-[#64748B] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cara Memulai */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 mb-5">
          <h2 className="text-base sm:text-lg font-semibold text-[#0F172A] mb-5">Cara Memulai</h2>
          <div className="flex flex-col gap-0">
            {steps.map(({ title, desc }, i) => (
              <div key={title} className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#3B82F6] text-white text-sm font-bold flex items-center justify-center shrink-0 z-10">
                    {i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 bg-blue-200 my-1" style={{ minHeight: 24 }} />
                  )}
                </div>
                <div className="pb-5">
                  <p className="font-semibold text-[#0F172A] text-sm leading-tight">{title}</p>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 mb-5">
          <h2 className="text-base sm:text-lg font-semibold text-[#0F172A] mb-4">Pertanyaan yang Sering Diajukan</h2>
          <div className="flex flex-col gap-2">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} {...faq} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 sm:p-5 flex gap-3 sm:gap-4 mb-5">
          <IoAlertCircleOutline size={22} className="text-orange-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-orange-700 mb-1">Disclaimer Medis</h3>
            <p className="text-sm text-orange-600 leading-relaxed">
              Aplikasi ini hanya untuk tujuan informasi dan edukasi. Prediksi dan konten yang disediakan
              bukan merupakan saran, diagnosis, atau pengobatan medis. Selalu konsultasikan kekhawatiran
              kesehatan kepada tenaga medis profesional.
            </p>
          </div>
        </div>

        {/* Kontak */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-[#0F172A]">Kontak</h2>
            <p className="text-sm text-[#64748B] mt-1">Hubungi kami jika ada pertanyaan lebih lanjut</p>
          </div>
          <a
            href="mailto:support@perisai.app"
            className="flex items-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap w-fit"
          >
            <IoMailOutline size={16} />
            support@perisai.app
          </a>
        </div>

      </div>
    </div>
  )
}

export default HelpPage