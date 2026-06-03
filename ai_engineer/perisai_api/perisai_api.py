from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
import tensorflow as tf
import joblib
import numpy as np
import requests
import os
from typing import Any # Mengizinkan input jenis apa pun

# Import SDK resmi Gemini
import google.generativeai as genai 

# ==========================================
# 1. SETUP GEMINI API
# ==========================================
load_dotenv()
# Ambil API key (Jika .env bermasalah, silakan ganti os.getenv dengan string kuncimu langsung)
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("🚨 API Key kosong! Pastikan file .env sudah dibuat di folder ini.")

# Konfigurasi SDK Gemini
genai.configure(api_key=GOOGLE_API_KEY)
chat_model = genai.GenerativeModel('gemini-2.5-flash') # Menggunakan versi 2.5 sesuai hasil sidak cek_model.py

app = FastAPI(
    title="PERISAI AI & Chatbot API",
    description="REST API untuk Prediksi PTM (Deep Learning) dan Asisten Kesehatan (Gemini AI)"
)

# ==========================================
# 2. MEMBANGUN ARSITEKTUR MODEL ML
# ==========================================
class AdvancedDenseLayer(tf.keras.layers.Layer):
    def __init__(self, units, activation=None, **kwargs):
        super(AdvancedDenseLayer, self).__init__(**kwargs)
        self.units = units
        self.activation = tf.keras.activations.get(activation)

    def build(self, input_shape):
        self.w = self.add_weight(shape=(input_shape[-1], self.units), initializer="he_normal", trainable=True, name="kernel")
        self.b = self.add_weight(shape=(self.units,), initializer="zeros", trainable=True, name="bias")

    def call(self, inputs):
        z = tf.matmul(inputs, self.w) + self.b
        if self.activation is not None:
            return self.activation(z)
        return z

def build_perisai_model():
    inputs = tf.keras.Input(shape=(14,), name="health_params")
    x = AdvancedDenseLayer(256, activation="swish")(inputs)
    x = tf.keras.layers.Dense(256, activation="swish")(x)
    x = tf.keras.layers.Dense(128, activation="swish")(x)
    outputs = tf.keras.layers.Dense(3, activation="sigmoid", name="predictions")(x)
    return tf.keras.Model(inputs=inputs, outputs=outputs)

# ==========================================
# 3. LOAD WEIGHTS & SCALER
# ==========================================
print("Merakit arsitektur dan mengambil file dari struktur asli repo...")

WEIGHTS_PATH = "../best_model_weights.weights.h5"
SCALER_PATH = "../../data/scaler.pkl"

model = build_perisai_model()
model.load_weights(WEIGHTS_PATH)
scaler = joblib.load(SCALER_PATH) 

print("Model PERISAI siap melayani request!")

# ==========================================
# 4. API CONTRACT MODELS
# ==========================================
class GeneralChatRequest(BaseModel):
    message: Any # Menggunakan Any agar kebal dari bentrok tipe data Frontend

class PatientData(BaseModel):
    Age: float
    Sex: int
    BMI: float
    Smoker: int
    PhysActivity: int
    Fruits: int
    Veggies: int
    HvyAlcoholConsump: int
    DiffWalk: int
    Stroke: int
    HeartDiseaseorAttack: int
    CholCheck: int
    GenHlth: float
    SleepHours: float

# ==========================================
# 5. ENDPOINTS
# ==========================================

@app.post("/api/v1/chat/general", tags=["Chatbot"])
def general_chat(req: GeneralChatRequest):
    # Bersihkan input, paksa ubah bentuk ke teks string murni
    text_message = str(req.message)
    prompt = f"Kamu adalah 'Dokter AI PERISAI', asisten kesehatan cerdas. Pengguna bertanya: '{text_message}'. Jawablah dengan ramah, singkat, dan edukatif."
    
    try:
        ai_response = chat_model.generate_content(prompt)
        return {"status": "success", "reply": ai_response.text.strip()}
    except Exception as e:
        return {"status": "error", "message": f"Gagal menghubungi AI: {str(e)}"}

@app.post("/api/v1/diagnose_and_chat", tags=["Diagnosis & Advice"])
def diagnose_and_chat(data: PatientData):
    # --- JALUR SCALER (7 Fitur) ---
    scaler_input = np.array([[
        data.BMI,
        0.0,            
        0.0,            
        data.GenHlth,
        data.Age,
        5.0,            
        5.0             
    ]])
    
    scaled_vals = scaler.transform(scaler_input)[0]

    # --- INPUT MODEL DEEP LEARNING (14 Fitur) ---
    final_input = np.array([[
        scaled_vals[4],         
        data.Sex,
        scaled_vals[0],         
        data.Smoker,
        data.PhysActivity,
        data.Fruits,
        data.Veggies,
        data.HvyAlcoholConsump,
        data.DiffWalk,
        data.Stroke,
        data.HeartDiseaseorAttack,
        data.CholCheck,
        scaled_vals[3],         
        data.SleepHours
    ]], dtype='float32')

    predictions = model.predict(final_input)[0]
    
    prob_diabetes = round(float(predictions[0]) * 100, 2)
    prob_hipertensi = round(float(predictions[1]) * 100, 2)
    prob_kolesterol = round(float(predictions[2]) * 100, 2)

    prompt = f"Sebagai Dokter AI PERISAI, beri 1 paragraf nasihat gaya hidup untuk pasien dengan risiko Diabetes {prob_diabetes}%, Hipertensi {prob_hipertensi}%, Kolesterol {prob_kolesterol}%, BMI {data.BMI}, tidur {data.SleepHours} jam. Fokus pada penyakit berisiko tertinggi."
    
    try:
        ai_response = chat_model.generate_content(prompt)
        chatbot_message = ai_response.text.strip()
    except Exception as e:
        chatbot_message = f"Sistem chatbot sedang sibuk, namun hasil analisamu aman. (Detail: {str(e)})"

    return {
        "status": "success",
        "predictions": {
            "diabetes_risk_percent": prob_diabetes,
            "hypertension_risk_percent": prob_hipertensi,
            "cholesterol_risk_percent": prob_kolesterol
        },
        "chatbot_advice": chatbot_message
    }