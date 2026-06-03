from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
import tensorflow as tf
import joblib
import numpy as np
import pandas as pd
import requests
import os
from sklearn.preprocessing import StandardScaler
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
# 3. LOAD MODEL & FIT SCALER PADA DATASET
# ==========================================
print("Merakit arsitektur dan mengambil file dari struktur asli repo...")

# Posisi kita: ai_engineer/perisai_api/
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEIGHTS_PATH = os.path.join(BASE_DIR, "../best_model_weights.weights.h5")
DATA_PATH = os.path.join(BASE_DIR, "../../data/ml_dataset_final_clean.csv")

model = build_perisai_model()
model.load_weights(WEIGHTS_PATH)

print("Fitting scaler dengan 14 fitur dari dataset CSV...")
df = pd.read_csv(DATA_PATH)
FEATURES = ['Age', 'Sex', 'BMI', 'Smoker', 'PhysActivity', 'Fruits', 
            'Veggies', 'HvyAlcoholConsump', 'DiffWalk', 'Stroke', 
            'HeartDiseaseorAttack', 'CholCheck', 'GenHlth', 'SleepHours']
TARGETS = ['Diabetes', 'HighBP', 'HighChol']

X_train = df[FEATURES].values.astype('float32')
scaler = StandardScaler()
scaler.fit(X_train)

print("Model PERISAI siap melayani request!")

def apply_temperature_scaling(prob, temperature=2.5):
    prob = np.clip(prob, 1e-7, 1 - 1e-7)
    logit = np.log(prob / (1 - prob))
    scaled_logit = logit / temperature
    return 1 / (1 + np.exp(-scaled_logit))

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

@app.post("/api/v1/predict", tags=["Prediction"])
def predict(data: PatientData):
    input_data = [
        data.Age, data.Sex, data.BMI, data.Smoker, data.PhysActivity, 
        data.Fruits, data.Veggies, data.HvyAlcoholConsump, data.DiffWalk, 
        data.Stroke, data.HeartDiseaseorAttack, data.CholCheck, 
        data.GenHlth, data.SleepHours
    ]
    raw_input_array = np.array([input_data], dtype='float32')
    
    # Scale input
    scaled_input = scaler.transform(raw_input_array)
    
    # Predict
    predictions = model.predict(scaled_input)[0]
    
    result = {}
    for name, prob in zip(TARGETS, predictions):
        smoothed_prob = apply_temperature_scaling(prob, temperature=2.5)
        result[name] = float(smoothed_prob)
        
    return {
        "success": True,
        "predictions": result
    }

@app.post("/api/v1/diagnose_and_chat", tags=["Diagnosis & Advice"])
def diagnose_and_chat(data: PatientData):
    # --- 1. JALUR SCALER 14 FITUR ---
    input_data = [
        data.Age, data.Sex, data.BMI, data.Smoker, data.PhysActivity, 
        data.Fruits, data.Veggies, data.HvyAlcoholConsump, data.DiffWalk, 
        data.Stroke, data.HeartDiseaseorAttack, data.CholCheck, 
        data.GenHlth, data.SleepHours
    ]
    raw_input_array = np.array([input_data], dtype='float32')
    
    # Scale input
    scaled_input = scaler.transform(raw_input_array)

    # --- 2. PREDIKSI MODEL ML ---
    predictions = model.predict(scaled_input)[0]
    
    prob_diabetes = round(float(apply_temperature_scaling(predictions[0], 2.5)) * 100, 2)
    prob_hipertensi = round(float(apply_temperature_scaling(predictions[1], 2.5)) * 100, 2)
    prob_kolesterol = round(float(apply_temperature_scaling(predictions[2], 2.5)) * 100, 2)

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