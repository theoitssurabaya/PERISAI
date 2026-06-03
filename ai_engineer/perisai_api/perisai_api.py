from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
import tensorflow as tf
import joblib
import numpy as np
import requests
import os

# ==========================================
# 1. SETUP GEMINI API (MENGGUNAKAN REST API)
# ==========================================
import google.generativeai as genai
# JANGAN LUPA MASUKKAN API KEY KAMU DI SINI
load_dotenv()
GOOGLE_API_KEY = "AIzaSyDPYKsXCm5YPXbQxVv4nNKZfVlHHr49tOk"

app = FastAPI(
    title="PERISAI AI & Chatbot API",
    description="REST API untuk Prediksi PTM (Deep Learning) dan Asisten Kesehatan (Gemini AI)"
)

# ==========================================
# 2. MEMBANGUN ARSITEKTUR (PENGGANTI .KERAS)
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
# 3. LOAD WEIGHTS & SCALER DARI STRUKTUR ASLI GITHUB
# ==========================================
print("Merakit arsitektur dan mengambil file dari struktur asli repo...")

# Posisi kita: ai_engineer/perisai_api/
# Path ke weights: ai_engineer/best_model_weights.weights.h5 (Mundur 1 folder)
WEIGHTS_PATH = "../best_model_weights.weights.h5"
# Path ke scaler: data/scaler.pkl (Mundur 2 folder, masuk ke data)
SCALER_PATH = "../../data/scaler.pkl"

model = build_perisai_model()
model.load_weights(WEIGHTS_PATH)
scaler = joblib.load(SCALER_PATH) 

print("Model PERISAI siap melayani request!")

# ==========================================
# 4. API CONTRACT & ENDPOINTS
# ==========================================
class GeneralChatRequest(BaseModel):
    message: str

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

@app.post("/api/v1/diagnose_and_chat", tags=["Diagnosis & Advice"])
def diagnose_and_chat(data: PatientData):
    # --- 1. JALUR NINJA SCALER (7 Fitur Saja!) ---
    # Scaler minta 7: ['BMI', 'MentHlth', 'PhysHlth', 'GenHlth', 'Age', 'Education', 'Income']
    scaler_input = np.array([[
        data.BMI,
        0.0,            # MentHlth Dummy
        0.0,            # PhysHlth Dummy
        data.GenHlth,
        data.Age,
        5.0,            # Education Dummy
        5.0             # Income Dummy
    ]])
    
    # Scale 7 data tersebut
    scaled_vals = scaler.transform(scaler_input)[0]

    # --- 2. GABUNG KEMBALI JADI 14 FITUR UNTUK MODEL ---
    final_input = np.array([[
        scaled_vals[4],         # Age (Sudah di-scale)
        data.Sex,
        scaled_vals[0],         # BMI (Sudah di-scale)
        data.Smoker,
        data.PhysActivity,
        data.Fruits,
        data.Veggies,
        data.HvyAlcoholConsump,
        data.DiffWalk,
        data.Stroke,
        data.HeartDiseaseorAttack,
        data.CholCheck,
        scaled_vals[3],         # GenHlth (Sudah di-scale)
        data.SleepHours
    ]], dtype='float32')

    # --- 3. PREDIKSI MODEL ML ---
    predictions = model.predict(final_input)[0]
    
    prob_diabetes = round(float(predictions[0]) * 100, 2)
    prob_hipertensi = round(float(predictions[1]) * 100, 2)
    prob_kolesterol = round(float(predictions[2]) * 100, 2)

    prompt = f"Sebagai Dokter AI PERISAI, beri 1 paragraf nasihat gaya hidup untuk pasien dengan risiko Diabetes {prob_diabetes}%, Hipertensi {prob_hipertensi}%, Kolesterol {prob_kolesterol}%, BMI {data.BMI}, tidur {data.SleepHours} jam. Fokus pada penyakit berisiko tertinggi."
    
    # --- 4. CHATBOT GEMINI DENGAN MODEL 1.5 FLASH ---
    try:
        # PENTING: URL ini sudah diganti ke gemini-1.5-flash yang kuotanya aman!
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GOOGLE_API_KEY}"
        payload = {"contents": [{"parts": [{"text": prompt}]}]}
        resp = requests.post(url, json=payload).json()
        
        if "error" in resp:
            error_msg = resp["error"].get("message", "Unknown API Error")
            chatbot_message = f"AI Sedang Offline. (Error: {error_msg})"
        else:
            chatbot_message = resp["candidates"][0]["content"]["parts"][0]["text"].strip()
            
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