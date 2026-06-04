---
title: PERISAI - Prediksi Risiko PTM
emoji: 🛡️
colorFrom: blue
colorTo: indigo
sdk: docker
pinned: false
---
 # PERISAI (Prediksi Risiko Penyakit Tidak Menular)

PERISAI adalah sebuah sistem *Fullstack Web Application* berbasis *Artificial Intelligence* (AI) yang dirancang untuk menganalisis gaya hidup dan rekam medis pasien guna memprediksi risiko 3 Penyakit Tidak Menular (PTM) utama: **Diabetes, Hipertensi (HighBP), dan Kolesterol Tinggi (HighChol)**.

Sistem ini digerakkan oleh model *Deep Learning* kustom (TensorFlow/Keras) yang dilatih menggunakan arsitektur *Functional API*, *Custom Layers*, dan *Custom Loss Function* (BCE + 10x MAE) untuk menghasilkan tingkat probabilitas yang sangat presisi berdasarkan data nyata (BRFSS Dataset).

---

## 🏗️ Arsitektur Proyek
Proyek ini mengadopsi arsitektur *Microservices* modern yang terbagi menjadi beberapa komponen utama:

1. **AI / Data Science (`/ai_engineer` & `/data`)**
    - Tempat riset data, analisis *Bayes Error*, pembersihan dataset, hingga pelatihan model AI (berbasis *Jupyter Notebook*).
    - Menghasilkan file *production* Keras: `perisai_model_production.keras`.

2. **Frontend UI (`/Fullstack/Frontend`)**
    - Dibangun dengan **React, Vite, dan TailwindCSS**.
    - Menyediakan antarmuka visual (Dashboard, Formulir Prediksi 14 Parameter AI, Jurnal Kebiasaan Harian, dll).

3. **Backend API (`/Fullstack/Backend`)**
    - Dibangun dengan **Node.js, Express, dan PostgreSQL**.
    - Mengurus manajemen *User* (Autentikasi JWT), penyimpanan *Habit Log*, dan bertindak sebagai jembatan *API Gateway* ke *Microservice* AI.

4. **AI Microservice (`/Fullstack/ML_Service`)**
    - Dibangun dengan **Python dan Flask**.
    - Bertugas secara eksklusif untuk memuat model `.keras` beserta *Custom Objects*-nya, melakukan kalkulasi penskalaan *StandardScaler*, dan memberikan respons prediksi inferensi secara *real-time*.

---

## 🚀 Cara Menjalankan Proyek (How to Run)

Anda perlu menjalankan ketiga servis (AI, Backend, dan Frontend) secara bersamaan di terminal yang berbeda.

### Prasyarat:
- Python 3.12+
- Node.js 18+
- PostgreSQL Server

### Langkah 1: Persiapan Database & Backend (Node.js)
1. Buka terminal dan masuk ke direktori Backend:
    ```bash
    cd Fullstack/Backend
    ```
2. Instal *library* yang dibutuhkan:
    ```bash
    npm install
    ```
3. Buat file `.env` di dalam folder `Backend` yang berisi URL PostgreSQL Anda, contoh:
    ```env
    DATABASE_URL=postgres://postgres:password_anda@localhost:5432/perisai_db
    PORT=5000
    JWT_SECRET=rahasia_super_aman_123
    AI_SERVICE_URL=http://127.0.0.1:5001
    ```
4. Lakukan *Migrate* tabel ke *database*:
    ```bash
    npm run migrate
    ```
5. Jalankan server Backend:
    ```bash
    npm run dev
    ```

### Langkah 2: Menyiapkan Virtual Environment & Dependencies Python
Sebelum menjalankan server ML (Flask) dan Chatbot (FastAPI), Anda harus menginstal seluruh kebutuhan pustaka Python dari akar proyek:
1. Buka terminal di **root folder** proyek.
2. Buat dan aktifkan virtual environment (Opsional tapi disarankan):
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
3. Instal semua dependensi:
    ```bash
    pip install -r requirements.txt
    ```

### Langkah 3: Menjalankan AI Microservice Terpadu (FastAPI - Prediksi PTM & Generative AI)
1. Buka terminal **baru** (pastikan venv aktif) dan masuk ke direktori AI API:
    ```bash
    cd ai_engineer/perisai_api
    ```
2. Buat file `.env` di folder tersebut dan isi dengan Google API Key Anda:
    ```env
    GOOGLE_API_KEY=KUNCI_RAHASIA_ANDA
    ```
3. Jalankan server *FastAPI* (yang kini juga menangani prediksi Model):
    ```bash
    uvicorn perisai_api:app --port 8001
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
3. Buat file `.env` (jika belum ada) berisi alamat Backend Node.js:
    ```env
    VITE_API_URL=http://localhost:5000
    ```
4. Nyalakan antarmuka web:
    ```bash
    npm run dev
    ```
5. **Selesai!** Buka tautan lokal yang muncul (biasanya `http://localhost:5173`) di *browser* Anda untuk menggunakan PERISAI.

---

## 🎯 Pencapaian Kriteria Evaluasi (Checklist)
Proyek ini secara ketat dirancang untuk memenuhi kriteria evaluasi model *Deep Learning* tingkat lanjut:

- [x] **1. TensorFlow Functional API / Subclassing**: Model dibangun menggunakan TensorFlow Keras `Functional API` dengan banyak *dense layer* bercabang (lihat `ai_engineer/1_model_training_and_evaluation.ipynb`).
- [x] **2. Komponen Kustom (Custom Objects)**: Mengimplementasikan **tiga** komponen kustom sekaligus:
    - **Custom Layer**: `AdvancedDenseLayer` dengan inisialisasi bobot *He-Normal*.
    - **Custom Loss Function**: Kombinasi hibrida asimetris `BCE + (10 * MAE)`.
    - **Custom Callback**: Callback dinamis terintegrasi di dalam proses iterasi.
- [x] **3. Ekspor Model Siap Produksi**: Model diekspor ke dalam format asli `.keras` (`perisai_model_production.keras`) dan diekstrak bobotnya (`.weights.h5`).
- [x] **4. Kode Inference Mandiri**: Skrip pemuatan (*load*) model dan inferensi data real-time langsung dibangun ke dalam arsitektur REST (lihat `app.py`).
- [x] **5. REST API Mandiri (FastAPI)**: Keseluruhan fusi prediksi klasifikasi *Machine Learning* dan asisten Chatbot *Generative AI* disatukan ke dalam satu Microservice AI **FastAPI** (`ai_engineer/perisai_api/perisai_api.py` di Port 8001).
- [x] **6. Custom Training Loop (tf.GradientTape)**: Proses *training* **tidak menggunakan `model.fit()`**, melainkan murni ditulis dari nol secara matematis menggunakan *GradientTape*, pengumpulan *Loss*, perhitungan *Gradients*, hingga pembaruan ke *Optimizer*.
- [x] **7. API Generative AI**: Terintegrasi secara *seamless* dengan **Google Gemini 2.0 Flash API** sebagai asisten Dokter AI dan pemberi nasihat medis dinamis.
- [x] **8. TensorBoard Logs**: Pengumpulan metrik *epoch*, akurasi, dan error telah dicatat *(logged)* selama proses Custom Training Loop menggunakan `tf.summary` dan disertakan di dalam *repository* (folder `ai_engineer/logs`).
- [x] **9. Performa Tinggi & Dokumentasi**: Melalui eksperimen tuning berlapis, model menunjukkan ROC-AUC dan presisi yang sangat kuat pada dataset imbalans BRFSS.

---
*Proyek ini merupakan demonstrasi dari fusi Ilmu Data, Teknik Machine Learning, dan Rekayasa Perangkat Lunak Web Modern.*
