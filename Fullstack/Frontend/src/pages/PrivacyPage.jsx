import { useState } from 'react'
import {
  IoShieldCheckmarkOutline,
  IoLockClosedOutline,
  IoEyeOffOutline,
  IoTrashOutline,
  IoMailOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoShieldOutline,
} from 'react-icons/io5'

const sections = [
  {
    id: 'collect',
    title: 'Data yang Kami Kumpulkan',
    number: '01',
    items: [
      { subtitle: 'Data Akun', text: 'Nama, alamat email, dan password (terenkripsi) yang kamu berikan saat mendaftar.' },
      { subtitle: 'Data Kesehatan', text: 'Informasi yang kamu masukkan secara sukarela: tekanan darah, kolesterol, gula darah, BMI, jam tidur, level stres, dan aktivitas fisik.' },
      { subtitle: 'Data Penggunaan', text: 'Informasi tentang bagaimana kamu menggunakan aplikasi, seperti fitur yang diakses dan waktu penggunaan, untuk keperluan peningkatan layanan.' },
    ],
  },
  {
    id: 'use',
    title: 'Bagaimana Kami Menggunakan Data',
    number: '02',
    items: [
      { subtitle: 'Analisis Risiko Kesehatan', text: 'Data kesehatanmu digunakan oleh sistem AI kami untuk menganalisis risiko PTM dan memberikan rekomendasi yang dipersonalisasi.' },
      { subtitle: 'Peningkatan Layanan', text: 'Data penggunaan secara agregat (anonim) digunakan untuk meningkatkan performa dan fitur aplikasi.' },
      { subtitle: 'Komunikasi', text: 'Email kamu digunakan untuk notifikasi akun penting, pengingat kesehatan (jika diaktifkan), dan pembaruan layanan.' },
    ],
  },
  {
    id: 'security',
    title: 'Keamanan Data',
    number: '03',
    items: [
      { subtitle: 'Enkripsi', text: 'Semua data sensitif dienkripsi menggunakan standar industri (AES-256) baik saat penyimpanan maupun transmisi via HTTPS/TLS.' },
      { subtitle: 'Akses Terbatas', text: 'Hanya sistem dan staf teknis terotorisasi yang dapat mengakses data, dengan protokol keamanan ketat dan audit log.' },
      { subtitle: 'Tidak Dijual ke Pihak Ketiga', text: 'Kami tidak pernah menjual, menyewakan, atau memperdagangkan data pribadimu kepada pihak ketiga untuk kepentingan komersial.' },
    ],
  },
  {
    id: 'rights',
    title: 'Hak-hak Kamu',
    number: '04',
    items: [
      { subtitle: 'Akses & Koreksi', text: 'Kamu berhak mengakses dan memperbarui data pribadimu kapan saja melalui halaman Profile.' },
      { subtitle: 'Hapus Data', text: 'Kamu dapat meminta penghapusan seluruh data akunmu. Hubungi kami dan kami akan memproses dalam 30 hari kerja.' },
      { subtitle: 'Portabilitas Data', text: 'Kamu berhak meminta ekspor data kesehatanmu dalam format yang dapat dibaca (CSV/PDF).' },
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies & Pelacakan',
    number: '05',
    items: [
      { subtitle: 'Session Cookies', text: 'Kami menggunakan cookies untuk menjaga sesi login kamu tetap aktif. Cookies ini tidak menyimpan data kesehatan.' },
      { subtitle: 'Tidak Ada Iklan Tracking', text: 'Kami tidak menggunakan cookies pelacak iklan pihak ketiga (seperti Google Analytics untuk iklan atau Facebook Pixel).' },
    ],
  },
  {
    id: 'changes',
    title: 'Perubahan Kebijakan',
    number: '06',
    items: [
      { subtitle: 'Pemberitahuan', text: 'Jika ada perubahan signifikan pada kebijakan privasi ini, kami akan memberi tahu kamu melalui email dan notifikasi di aplikasi minimal 7 hari sebelum perubahan berlaku.' },
    ],
  },
]

function SectionCard({ number, title, items }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border rounded-2xl overflow-hidden transition-colors ${open ? 'border-[#3B82F6] bg-blue-50/30' : 'border-gray-200 bg-white'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left"
      >
        <span className="text-xs font-bold text-[#3B82F6] font-mono w-7 shrink-0">{number}</span>
        <span className={`flex-1 text-sm font-medium transition-colors ${open ? 'text-[#3B82F6]' : 'text-[#0F172A]'}`}>
          {title}
        </span>
        <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${open ? 'bg-[#3B82F6] text-white' : 'bg-gray-100 text-[#64748B]'}`}>
          {open ? <IoChevronUpOutline size={14} /> : <IoChevronDownOutline size={14} />}
        </span>
      </button>
      {open && (
        <div className="border-t border-blue-100 px-5 py-5 flex flex-col gap-4">
          {items.map(({ subtitle, text }) => (
            <div key={subtitle} className="pl-4 border-l-2 border-blue-200">
              <p className="font-medium text-sm text-[#0F172A] mb-0.5">{subtitle}</p>
              <p className="text-sm text-[#64748B] leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#E5E7EB] p-3 sm:p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#10B981] flex items-center justify-center">
              <IoShieldOutline size={20} className="text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">Kebijakan Privasi</h1>
          </div>
          <p className="text-sm sm:text-base text-[#64748B] mt-1">Terakhir diperbarui: 1 Juni 2026</p>
        </div>

        {/* Intro Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-6 mb-5 flex gap-3 sm:gap-4 items-start">
          <div className="p-2.5 bg-blue-100 rounded-xl shrink-0">
            <IoShieldCheckmarkOutline size={22} className="text-[#3B82F6]" />
          </div>
          <div>
            <p className="font-semibold text-[#0F172A] mb-1">Privasi kamu adalah prioritas kami</p>
            <p className="text-sm text-[#64748B] leading-relaxed">
              PERISAI berkomitmen untuk melindungi data pribadi dan kesehatan kamu. Kebijakan ini menjelaskan
              secara transparan data apa yang kami kumpulkan, bagaimana kami menggunakannya, dan hak-hak kamu sebagai pengguna.
            </p>
          </div>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {[
            { icon: IoLockClosedOutline, title: 'Terenkripsi', desc: 'Semua data dienkripsi AES-256' },
            { icon: IoEyeOffOutline, title: 'Tidak Dijual', desc: 'Tidak ada penjualan ke pihak ketiga' },
            { icon: IoTrashOutline, title: 'Bisa Dihapus', desc: 'Kamu bisa hapus data kapan saja' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg shrink-0">
                <Icon size={20} className="text-[#10B981]" />
              </div>
              <div>
                <p className="font-semibold text-[#0F172A] text-sm">{title}</p>
                <p className="text-xs text-[#64748B]">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Policy Sections */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 mb-5">
          <h2 className="text-base sm:text-lg font-semibold text-[#0F172A] mb-4">Isi Kebijakan</h2>
          <div className="flex flex-col gap-2">
            {sections.map((sec) => (
              <SectionCard key={sec.id} {...sec} />
            ))}
          </div>
        </div>

        {/* Kontak */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-semibold text-[#0F172A]">Ada pertanyaan soal privasi?</p>
            <p className="text-sm text-[#64748B] mt-0.5">Tim kami siap memproses permintaan data kamu dalam 30 hari kerja.</p>
          </div>
          <a
            href="mailto:privacy@perisai.app"
            className="flex items-center gap-2 bg-[#0F172A] hover:bg-slate-800 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap w-fit"
          >
            <IoMailOutline size={16} />
            privacy@perisai.app
          </a>
        </div>

      </div>
    </div>
  )
}

export default PrivacyPage