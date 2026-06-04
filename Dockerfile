# Gunakan image Python standar versi ringan
FROM python:3.12-slim

# Atur direktori kerja di dalam container
WORKDIR /app

# Salin requirements.txt terlebih dahulu agar Docker bisa melakukan caching
COPY requirements.txt .

# Instal seluruh dependensi (termasuk TensorFlow dan FastAPI)
# Menggunakan --no-cache-dir agar tidak memakan memori berlebih
RUN pip install --no-cache-dir -r requirements.txt

# Salin seluruh sisa file proyek Anda ke dalam container
COPY . .

# Hugging Face Spaces MENGHARUSKAN aplikasi berjalan di port 7860
ENV PORT=7860

# Buka port 7860
EXPOSE 7860

# Jalankan server FastAPI Anda secara otomatis saat container menyala
CMD ["uvicorn", "ai_engineer.perisai_api.perisai_api:app", "--host", "0.0.0.0", "--port", "7860"]
