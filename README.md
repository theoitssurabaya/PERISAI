 # PERISAI (Prediksi Risiko Penyakit Tidak Menular)

PERISAI adalah sebuah sistem *Fullstack Web Application* berbasis *Artificial Intelligence* (AI) yang dirancang untuk menganalisis gaya hidup dan rekam medis pasien guna memprediksi risiko 3 Penyakit Tidak Menular (PTM) utama: **Diabetes, Hipertensi (HighBP), dan Kolesterol Tinggi (HighChol)**.

Sistem ini digerakkan oleh model *Deep Learning* kustom (TensorFlow/Keras) yang dilatih menggunakan arsitektur *Functional API*, *Custom Layers*, dan *Custom Loss Function* (BCE + 10x MAE) untuk menghasilkan tingkat probabilitas yang sangat presisi berdasarkan data nyata (BRFSS Dataset). Dilengkapi dengan asisten *Generative AI* untuk konsultasi medis interaktif.

---

## 🏗️ Arsitektur Proyek & Deployment

Proyek ini telah berstatus *Production-Ready* dan di-*deploy* menggunakan arsitektur *Microservices* modern yang terdistribusi secara terdesentralisasi di tiga platform *Cloud* berbeda untuk menjamin skalabilitas dan isolasi beban kerja (*workload*).

### 1. Frontend UI (Vercel)
- **Tech Stack**: React, Vite, dan TailwindCSS.
- **Peran**: Menyediakan antarmuka visual (Dashboard, Formulir Prediksi AI, Jurnal Kebiasaan Harian, Chatbot Interaktif).
- **Live URL**: [https://perisai-ptm.vercel.app/](https://perisai-ptm.vercel.app/)

### 2. Backend API (Railway)
- **Tech Stack**: Node.js, Express, dan PostgreSQL.
- **Peran**: Mengurus manajemen *User* (Autentikasi JWT), penyimpanan *Habit Log*, dan bertindak sebagai *API Gateway* yang menjembatani Frontend dengan AI Microservice. Secara otonom menghitung *Historical Moving Average* (Rata-rata 7 Hari terakhir) sebelum mengirimkan data ke AI.
- **Live URL**: `https://perisai.up.railway.app`

### 3. AI Microservice (Hugging Face Spaces)
- **Tech Stack**: Python, FastAPI, TensorFlow, Google Gemini API, Docker.
- **Peran**: Server berkinerja tinggi yang dikhususkan secara eksklusif untuk menjalankan inferensi model *Deep Learning* (`perisai_model_production.keras`) dan memproses respons *Generative AI* secara *real-time*. Diisolasi menggunakan Docker *Container*.
- **Live URL**: [https://huggingface.co/spaces/hilmyinaja/perisai-ai-api](https://huggingface.co/spaces/hilmyinaja/perisai-ai-api)

---

## 📂 Struktur Repositori Terpadu (Monorepo)
- `/ai_engineer`: Jantung Ilmu Data. Berisi *Jupyter Notebook* untuk pelatihan model, visualisasi *Class Imbalance*, *logs* TensorBoard, dan *source code* API FastAPI.
- `/Fullstack/Frontend`: Kode sumber untuk antarmuka pengguna web.
- `/Fullstack/Backend`: Kode sumber untuk logika server Node.js dan manajemen *database*.
- `/data`: Tempat penyimpanan dataset mentah dan bersih (*BRFSS CDC*).

---

## 🚀 Cara Menjalankan Proyek (Local Development)

Anda perlu menjalankan ketiga servis secara bersamaan di terminal yang berbeda jika ingin menjalankan aplikasi ini secara lokal.

### Prasyarat:
- Python 3.10+
- Node.js 18+
- PostgreSQL Server

### Langkah 0: Kloning Repositori
Buka terminal dan unduh kode sumber dari GitHub:
    ```bash
    git clone https://github.com/hilmyinaja/Data-Analysis-Penyakit-Tidak-Menular.git
    cd Data-Analysis-Penyakit-Tidak-Menular
    ```

### Langkah 1: Persiapan Database & Backend (Node.js)
1. Buka terminal dan masuk ke direktori Backend:
    ```bash
    cd Fullstack/Backend
    ```
2. Instal pustaka yang dibutuhkan:
    ```bash
    npm install
    ```
3. Buat file `.env` di dalam folder `Backend` yang berisi URL PostgreSQL Anda, contoh:
    ```env
    DATABASE_URL=postgres://postgres:password_anda@localhost:5432/perisai_db
    PORT=5000
    JWT_SECRET=rahasia_super_aman_123
    ML_SERVICE_URL=http://127.0.0.1:8001/api/v1
    AI_SERVICE_URL=http://127.0.0.1:8001/api/v1
    AI_CHAT_URL=http://127.0.0.1:8001
    ```
4. Lakukan *Migrate* tabel ke *database*:
    ```bash
    npm run migrate
    ```
5. Jalankan server Backend:
    ```bash
    npm run dev
    ```

### Langkah 2: Menyiapkan Lingkungan Python
1. Buka terminal di **akar (root) folder** proyek.
2. Buat dan aktifkan *virtual environment*:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
3. Instal semua dependensi:
    ```bash
    pip install -r requirements.txt
    ```

### Langkah 3: Menjalankan AI Microservice (FastAPI)
1. Buka terminal **baru** (pastikan venv aktif) dan masuk ke direktori AI API:
    ```bash
    cd ai_engineer/perisai_api
    ```
2. Buat file `.env` di folder tersebut dan isi dengan Google API Key Anda:
    ```env
    GEMINI_API_KEY=KUNCI_RAHASIA_ANDA
    ```
3. Jalankan server *FastAPI*:
    ```bash
    uvicorn perisai_api:app --port 8001 --reload
    ```

### Langkah 4: Menjalankan Frontend (React UI)
1. Buka terminal **baru** dan masuk ke direktori Frontend:
    ```bash
    cd Fullstack/Frontend
    ```
2. Instal dependensi:
    ```bash
    npm install
    ```
3. Buat file `.env` berisi alamat Backend Node.js:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```
4. Nyalakan antarmuka web:
    ```bash
    npm run dev
    ```
5. Buka tautan lokal yang muncul (biasanya `http://localhost:5173`) di *browser* Anda.

---
*Proyek ini merupakan demonstrasi level industri dari perpaduan Ilmu Data (Data Science), Rekayasa Machine Learning (ML Engineering), dan Rekayasa Perangkat Lunak Web Modern (Fullstack Development).*
