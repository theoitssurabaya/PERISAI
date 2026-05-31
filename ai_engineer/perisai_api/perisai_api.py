from fastapi import FastAPI
from pydantic import BaseModel
import tensorflow as tf
import joblib
import numpy as np
import google.generativeai as genai
import os

# ==========================================
# 1. SETUP GEMINI API
# ==========================================
# JANGAN LUPA MASUKKAN API KEY KAMU DI SINI
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)
chat_model = genai.GenerativeModel('gemini-2.5-flash')

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

@app.post("/api/v1/chat/general", tags=["Chatbot"])
def general_chat(req: GeneralChatRequest):
    prompt = f"Kamu adalah 'Dokter AI PERISAI', asisten kesehatan cerdas. Pengguna anonim bertanya: '{req.message}'. Jawablah dengan ramah, singkat, dan edukatif."
    try:
        response = chat_model.generate_content(prompt)
        return {"status": "success", "reply": response.text.strip()}
    except Exception as e:
        return {"status": "error", "message": f"Gagal menghubungi AI: {str(e)}"}

@app.post("/api/v1/diagnose_and_chat", tags=["Diagnosis & Advice"])
def diagnose_and_chat(data: PatientData):
    input_features = np.array([[
        data.Age, data.Sex, data.BMI, data.Smoker, data.PhysActivity, 
        data.Fruits, data.Veggies, data.HvyAlcoholConsump, data.DiffWalk, 
        data.Stroke, data.HeartDiseaseorAttack, data.CholCheck, 
        data.GenHlth, data.SleepHours
    ]], dtype='float32')

    scaled_input = scaler.transform(input_features)
    predictions = model.predict(scaled_input)[0]
    
    prob_diabetes = round(float(predictions[0]) * 100, 2)
    prob_hipertensi = round(float(predictions[1]) * 100, 2)
    prob_kolesterol = round(float(predictions[2]) * 100, 2)

    prompt = f"Sebagai Dokter AI PERISAI, beri 1 paragraf nasihat gaya hidup untuk pasien dengan risiko Diabetes {prob_diabetes}%, Hipertensi {prob_hipertensi}%, Kolesterol {prob_kolesterol}%, BMI {data.BMI}, tidur {data.SleepHours} jam. Fokus pada penyakit berisiko tertinggi."
    
    try:
        ai_response = chat_model.generate_content(prompt)
        chatbot_message = ai_response.text.strip()
    except Exception:
        chatbot_message = "Sistem chatbot sedang sibuk, namun hasil analisamu aman."

    return {
        "status": "success",
        "predictions": {
            "diabetes_risk_percent": prob_diabetes,
            "hypertension_risk_percent": prob_hipertensi,
            "cholesterol_risk_percent": prob_kolesterol
        },
        "chatbot_advice": chatbot_message
    }